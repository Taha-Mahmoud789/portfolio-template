/**
 * Cinematic Camera System — Transition Manager
 *
 * Manages camera transitions between modes/presets.
 * Supports fade, zoom, orbit, dolly, portal, and custom curves.
 */

import { Vector3 } from "three";
import type { TransitionConfig, TransitionState, EasingName } from "./types";
import { getEasing, lerp } from "./math";

// ============================================================================
// Transition Snapshot
// ============================================================================

export interface TransitionSnapshot {
  position: Vector3;
  lookAt: Vector3;
  fov: number;
}

// ============================================================================
// Camera Transition Manager
// ============================================================================

export class CameraTransitionManager {
  private state: TransitionState;
  private from: TransitionSnapshot;
  private to: TransitionSnapshot;
  private current: TransitionSnapshot;
  private config: TransitionConfig;
  private onComplete: (() => void) | null;

  constructor() {
    this.state = {
      isTransitioning: false,
      type: "fade",
      progress: 0,
      duration: 0,
    };
    this.from = {
      position: new Vector3(),
      lookAt: new Vector3(),
      fov: 60,
    };
    this.to = {
      position: new Vector3(),
      lookAt: new Vector3(),
      fov: 60,
    };
    this.current = {
      position: new Vector3(),
      lookAt: new Vector3(),
      fov: 60,
    };
    this.config = { type: "fade", duration: 1, easing: "easeInOut" };
    this.onComplete = null;
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    // No-op
  }

  update(delta: number): TransitionSnapshot | null {
    if (!this.state.isTransitioning) return null;

    this.state = {
      ...this.state,
      progress: this.state.progress + delta / this.state.duration,
    };

    if (this.state.progress >= 1) {
      this.state = { ...this.state, progress: 1, isTransitioning: false };
      this.current.position.copy(this.to.position);
      this.current.lookAt.copy(this.to.lookAt);
      this.current.fov = this.to.fov;
      this.onComplete?.();
      return this.current;
    }

    const easing = getEasing(this.config.easing);
    const t = easing(this.state.progress);

    this.current.position.lerpVectors(this.from.position, this.to.position, t);
    this.current.lookAt.lerpVectors(this.from.lookAt, this.to.lookAt, t);
    this.current.fov = lerp(this.from.fov, this.to.fov, t);

    return this.current;
  }

  dispose(): void {
    this.onComplete = null;
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  start(
    config: TransitionConfig,
    fromPosition: Vector3,
    fromLookAt: Vector3,
    fromFov: number,
    toPosition: readonly [number, number, number],
    toLookAt: readonly [number, number, number],
    toFov: number,
    onComplete?: () => void,
  ): void {
    this.config = config;
    this.from.position.copy(fromPosition);
    this.from.lookAt.copy(fromLookAt);
    this.from.fov = fromFov;
    this.to.position.set(toPosition[0], toPosition[1], toPosition[2]);
    this.to.lookAt.set(toLookAt[0], toLookAt[1], toLookAt[2]);
    this.to.fov = toFov;
    this.current.position.copy(fromPosition);
    this.current.lookAt.copy(fromLookAt);
    this.current.fov = fromFov;
    this.onComplete = onComplete ?? null;
    this.state = {
      isTransitioning: true,
      type: config.type,
      progress: 0,
      duration: config.duration,
    };
  }

  cancel(): void {
    this.state = {
      ...this.state,
      isTransitioning: false,
      progress: 0,
    };
    this.onComplete = null;
  }

  getState(): TransitionState {
    return this.state;
  }

  getCurrent(): TransitionSnapshot {
    return this.current;
  }

  isTransitioning(): boolean {
    return this.state.isTransitioning;
  }

  getProgress(): number {
    return this.state.progress;
  }

  setEasing(easing: EasingName): void {
    this.config = { ...this.config, easing };
  }
}
