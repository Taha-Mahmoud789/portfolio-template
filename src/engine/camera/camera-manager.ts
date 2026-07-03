/**
 * Cinematic Camera System — Camera Manager
 *
 * Top-level orchestrator that coordinates all camera subsystems.
 * Camera modules never communicate directly — everything goes through CameraManager.
 * Never exposes internals.
 *
 * Fixes applied:
 * - Bound tick in constructor (no per-render allocation)
 * - Seeded lastFrameTime in start() (no first-frame delta spike)
 * - Removed dead render() method
 * - Cleaned up state machine auto-transitions
 * - Pre-allocated effect offset vector
 */

import { Vector3, type Object3D, type PerspectiveCamera } from "three";
import type {
  CinematicCameraConfig,
  CinematicCameraState,
  CinematicCameraRef,
  CameraMode,
  CameraSequence,
  TransitionConfig,
  FocusTarget,
  CameraEffectsConfig,
  ShakeConfig,
} from "./types";
import { CAMERA_DEFAULTS, mergeCameraConfig } from "./config";
import { CameraStateMachine } from "./camera-state-machine";
import { CameraRig } from "./camera-rig";
import { CameraController } from "./camera-controller";
import { CameraEffects } from "./camera-effects";
import { CameraTimeline } from "./camera-timeline";
import { CameraTransitionManager } from "./camera-transition-manager";

// ============================================================================
// Follow Target
// ============================================================================

interface FollowEntry {
  id: string;
  object: Object3D;
  offset: Vector3;
}

// ============================================================================
// Camera Manager
// ============================================================================

export class CameraManager implements CinematicCameraRef {
  readonly rig: CameraRig;
  readonly controller: CameraController;
  readonly stateMachine: CameraStateMachine;
  readonly effects: CameraEffects;
  readonly timeline: CameraTimeline;
  readonly transitions: CameraTransitionManager;

  private config: CinematicCameraConfig;
  private state: CinematicCameraState;
  private followTargets: Map<string, FollowEntry>;
  private activeFollowTarget: string | null;
  private isInitialized: boolean;
  private isRunning: boolean;
  private animationFrameId: number | null;
  private lastFrameTime: number;
  private _effectOffset: Vector3;

  // Bound once in constructor — no per-render allocation
  private readonly tick: () => void;

  constructor(config?: Partial<CinematicCameraConfig>) {
    this.config = mergeCameraConfig(CAMERA_DEFAULTS, config ?? {});

    this.rig = new CameraRig({
      fov: this.config.fov,
      near: this.config.near,
      far: this.config.far,
      position: this.config.position,
      lookAt: this.config.lookAt,
      constraints: this.config.constraints,
    });

    this.controller = new CameraController(this.config.movement);
    this.stateMachine = new CameraStateMachine("idle");
    this.effects = new CameraEffects(this.config.effects);
    this.timeline = new CameraTimeline();
    this.transitions = new CameraTransitionManager();

    this.followTargets = new Map();
    this.activeFollowTarget = null;
    this.isInitialized = false;
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    this._effectOffset = new Vector3();

    // Bind tick once — avoids arrow function re-creation
    this.tick = this._tick.bind(this);

    this.state = this.buildState();
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    if (this.isInitialized) return;

    this.rig.initialize();
    this.controller.initialize(
      new Vector3(...this.config.position),
      new Vector3(...this.config.lookAt),
    );
    this.effects.initialize();
    this.timeline.initialize();
    this.transitions.initialize();

    this.isInitialized = true;
    this.state = this.buildState();
  }

  start(): void {
    if (this.isRunning) return;
    // Seed with current time to avoid first-frame delta spike
    this.lastFrameTime = performance.now();
    this.isRunning = true;
    this.state = { ...this.state, isRunning: true };
    this.tick();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isRunning = false;
    this.state = { ...this.state, isRunning: false };
  }

  dispose(): void {
    this.stop();
    this.rig.dispose();
    this.controller.dispose();
    this.effects.dispose();
    this.timeline.dispose();
    this.transitions.dispose();
    this.stateMachine.dispose();
    this.followTargets.clear();
    this.isInitialized = false;
    this.state = this.buildState();
  }

  // --------------------------------------------------------------------------
  // Update Loop
  // --------------------------------------------------------------------------

  private _tick(): void {
    this.animationFrameId = requestAnimationFrame(this.tick);

    const now = performance.now();
    const delta = Math.min((now - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = now;

    this.update(delta);
  }

  private update(delta: number): void {
    // 1. Update transition if active
    const transitionResult = this.transitions.update(delta);
    if (transitionResult) {
      this.controller.setPosition(
        transitionResult.position.x,
        transitionResult.position.y,
        transitionResult.position.z,
      );
      this.controller.setLookAt(
        transitionResult.lookAt.x,
        transitionResult.lookAt.y,
        transitionResult.lookAt.z,
      );
      this.rig.setFov(transitionResult.fov);
    }

    // 2. Update follow target (sets controller targets)
    this.updateFollowTarget();

    // 3. Update timeline if playing (sets controller targets)
    const timelineFrame = this.timeline.update(delta);
    if (timelineFrame) {
      this.controller.setTarget(
        [timelineFrame.position.x, timelineFrame.position.y, timelineFrame.position.z],
        [timelineFrame.lookAt.x, timelineFrame.lookAt.y, timelineFrame.lookAt.z],
      );
      this.rig.setFov(timelineFrame.fov);
    }

    // 4. Update controller (spring physics)
    this.controller.update(delta);

    // 5. Update effects
    this.effects.update(delta);

    // 6. Apply controller position to rig
    const pos = this.controller.getPosition();
    this.rig.setBasePosition(pos.x, pos.y, pos.z);

    const lookAt = this.controller.getLookAt();
    this.rig.setBaseLookAt(lookAt.x, lookAt.y, lookAt.z);
    this.rig.setCurrentLookAt(lookAt.x, lookAt.y, lookAt.z);

    // 7. Apply effect offsets (pre-allocated vector)
    this.effects.getCombinedOffset(this._effectOffset);
    this.rig.camera.position.add(this._effectOffset);

    // 8. Update rig (lookAt, projection)
    this.rig.update(delta);

    // 9. Update state snapshot
    this.state = this.buildState();

    // 10. Auto-transition: moving → idle when settled
    if (this.stateMachine.isMoving() && this.controller.isSettled()) {
      this.stateMachine.transitionTo("idle");
    }
  }

  // --------------------------------------------------------------------------
  // Follow Target (zero-allocation in hot path)
  // --------------------------------------------------------------------------

  private updateFollowTarget(): void {
    if (!this.activeFollowTarget) return;
    const entry = this.followTargets.get(this.activeFollowTarget);
    if (!entry) return;

    const targetPos = entry.object.position;
    this.controller.setTargetPosition(
      targetPos.x + entry.offset.x,
      targetPos.y + entry.offset.y,
      targetPos.z + entry.offset.z,
    );
    this.controller.setTargetLookAt(targetPos.x, targetPos.y, targetPos.z);
  }

  // --------------------------------------------------------------------------
  // State Builder
  // --------------------------------------------------------------------------

  private buildState(): CinematicCameraState {
    const pos = this.controller.getPosition();
    const lookAt = this.controller.getLookAt();
    return {
      mode: this.controller.getMode(),
      cameraState: this.stateMachine.getState(),
      position: [pos.x, pos.y, pos.z],
      lookAt: [lookAt.x, lookAt.y, lookAt.z],
      fov: this.rig.getFov(),
      distance: this.rig.getDistance(),
      isInitialized: this.isInitialized,
      isRunning: this.isRunning,
      timeline: this.timeline.getState(),
      transition: this.transitions.getState(),
      effects: this.effects.getState(),
    };
  }

  // --------------------------------------------------------------------------
  // Public API — CinematicCameraRef
  // --------------------------------------------------------------------------

  getCamera(): PerspectiveCamera {
    return this.rig.camera;
  }

  getPosition(): Vector3 {
    return this.controller.getPosition();
  }

  getLookAt(): Vector3 {
    return this.controller.getLookAt();
  }

  getState(): CinematicCameraState {
    return this.state;
  }

  setMode(mode: CameraMode): void {
    this.controller.setMode(mode);
    this.state = this.buildState();
  }

  setPosition(x: number, y: number, z: number): void {
    this.controller.setPosition(x, y, z);
  }

  setLookAt(x: number, y: number, z: number): void {
    this.controller.setLookAt(x, y, z);
  }

  setFov(fov: number): void {
    this.rig.setFov(fov);
  }

  setTarget(
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
  ): void {
    this.controller.setTarget(position, lookAt);
    if (this.stateMachine.isIdle()) {
      this.stateMachine.transitionTo("moving");
    }
  }

  focus(target: FocusTarget): void {
    if (this.stateMachine.canTransitionTo("focused")) {
      this.stateMachine.transitionTo("focused");
    }
    this.controller.setTarget(target.position, target.position);
    if (target.duration > 0) {
      this.transitions.start(
        { type: "zoom", duration: target.duration, easing: target.easing },
        this.controller.getPosition(),
        this.controller.getLookAt(),
        this.rig.getFov(),
        target.position,
        target.position,
        this.rig.getFov(),
      );
    }
  }

  playSequence(sequence: CameraSequence): void {
    this.timeline.play(sequence);
    if (this.stateMachine.canTransitionTo("moving")) {
      this.stateMachine.transitionTo("moving");
    }
  }

  pauseTimeline(): void {
    this.timeline.pause();
  }

  resumeTimeline(): void {
    this.timeline.resume();
  }

  stopTimeline(): void {
    this.timeline.stop();
    if (this.stateMachine.canTransitionTo("idle")) {
      this.stateMachine.transitionTo("idle");
    }
  }

  setTransition(config: TransitionConfig): void {
    void config;
  }

  setEffectWeight(effect: keyof CameraEffectsConfig, weight: number): void {
    this.effects.setWeight(effect, weight);
  }

  triggerShake(config?: Partial<ShakeConfig>): void {
    this.effects.triggerShake(config);
  }

  setReducedMotion(enabled: boolean): void {
    this.config = { ...this.config, reducedMotion: enabled };
    if (enabled) {
      this.effects.setWeight("shake", 0);
      this.effects.setWeight("drift", 0);
      this.effects.setWeight("bob", 0);
      this.effects.setWeight("sway", 0);
    }
  }

  setSensitivity(sensitivity: number): void {
    this.controller.setSensitivity(sensitivity);
    this.config = { ...this.config, sensitivity };
  }

  addObject(object: Object3D, followOffset?: readonly [number, number, number]): string {
    const id = `follow-${String(this.followTargets.size)}`;
    this.followTargets.set(id, {
      id,
      object,
      offset: new Vector3(followOffset?.[0] ?? 0, followOffset?.[1] ?? 3, followOffset?.[2] ?? 8),
    });
    return id;
  }

  removeObject(id: string): void {
    this.followTargets.delete(id);
    if (this.activeFollowTarget === id) {
      this.activeFollowTarget = null;
    }
  }

  setFollowTarget(id: string | null): void {
    this.activeFollowTarget = id;
    if (id && this.stateMachine.canTransitionTo("moving")) {
      this.stateMachine.transitionTo("moving");
    }
  }

  resize(width: number, height: number): void {
    this.rig.resize(width, height);
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createCinematicCamera(config?: Partial<CinematicCameraConfig>): CameraManager {
  return new CameraManager(config);
}
