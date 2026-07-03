/**
 * Cinematic Camera System — Camera Controller
 *
 * Physics-based movement engine: spring motion, smooth damping, inertia,
 * acceleration, deceleration, weight, momentum, velocity.
 *
 * Sensitivity scales stiffness and damping proportionally to preserve
 * the damping ratio (oscillation character) while changing response speed.
 */

import { Vector3 } from "three";
import type { MovementConfig, CameraMode } from "./types";
import { DEFAULT_MOVEMENT } from "./config";
import { springStepVec3, clampMagnitudeVec3, clamp } from "./math";

// ============================================================================
// Camera Controller
// ============================================================================

export class CameraController {
  private config: MovementConfig;
  private position: Vector3;
  private velocity: Vector3;
  private targetPosition: Vector3;
  private targetLookAt: Vector3;
  private currentLookAt: Vector3;
  private lookAtVelocity: Vector3;
  private mode: CameraMode;
  private sensitivity: number;
  private _isActive: boolean;

  constructor(config?: Partial<MovementConfig>) {
    this.config = { ...DEFAULT_MOVEMENT, ...config };
    this.position = new Vector3();
    this.velocity = new Vector3();
    this.targetPosition = new Vector3();
    this.targetLookAt = new Vector3();
    this.currentLookAt = new Vector3();
    this.lookAtVelocity = new Vector3();
    this.mode = "idle";
    this.sensitivity = 1;
    this._isActive = true;
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(position: Vector3, lookAt: Vector3): void {
    this.position.copy(position);
    this.targetPosition.copy(position);
    this.currentLookAt.copy(lookAt);
    this.targetLookAt.copy(lookAt);
    this.velocity.set(0, 0, 0);
    this.lookAtVelocity.set(0, 0, 0);
  }

  update(delta: number): void {
    if (!this._isActive) return;

    const dt = Math.min(delta, 0.1);

    // Sensitivity scales stiffness² and damping to preserve damping ratio.
    // Higher sensitivity = faster response without changing oscillation character.
    const s = this.sensitivity;
    const effectiveStiffness = this.config.stiffness * s * s;
    const effectiveDamping = this.config.damping * s;

    // Update position via spring physics
    springStepVec3(
      this.position,
      this.targetPosition,
      this.velocity,
      effectiveStiffness,
      effectiveDamping,
      this.config.mass,
      dt,
    );

    // Clamp velocity
    clampMagnitudeVec3(this.velocity, this.config.maxSpeed);

    // Update lookAt via spring physics (slightly overdamped for stability)
    springStepVec3(
      this.currentLookAt,
      this.targetLookAt,
      this.lookAtVelocity,
      effectiveStiffness * 1.5,
      effectiveDamping * 1.2,
      this.config.mass,
      dt,
    );
  }

  dispose(): void {
    this.velocity.set(0, 0, 0);
    this.lookAtVelocity.set(0, 0, 0);
  }

  // --------------------------------------------------------------------------
  // Target Setting (with interpolation)
  // --------------------------------------------------------------------------

  setTargetPosition(x: number, y: number, z: number): void {
    this.targetPosition.set(x, y, z);
  }

  setTargetLookAt(x: number, y: number, z: number): void {
    this.targetLookAt.set(x, y, z);
  }

  setTarget(
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
  ): void {
    this.targetPosition.set(position[0], position[1], position[2]);
    this.targetLookAt.set(lookAt[0], lookAt[1], lookAt[2]);
  }

  // --------------------------------------------------------------------------
  // Immediate Set (preserves momentum)
  // --------------------------------------------------------------------------

  setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.targetPosition.set(x, y, z);
    // Preserve velocity for momentum continuity
  }

  setLookAt(x: number, y: number, z: number): void {
    this.currentLookAt.set(x, y, z);
    this.targetLookAt.set(x, y, z);
    // Preserve velocity for momentum continuity
  }

  /**
   * Teleport to a position, killing all velocity.
   * Use for hard cuts or initial placement.
   */
  teleportTo(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.targetPosition.set(x, y, z);
    this.velocity.set(0, 0, 0);
  }

  teleportLookAt(x: number, y: number, z: number): void {
    this.currentLookAt.set(x, y, z);
    this.targetLookAt.set(x, y, z);
    this.lookAtVelocity.set(0, 0, 0);
  }

  // --------------------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------------------

  getPosition(): Vector3 {
    return this.position;
  }

  getLookAt(): Vector3 {
    return this.currentLookAt;
  }

  getVelocity(): Vector3 {
    return this.velocity;
  }

  getTargetPosition(): Vector3 {
    return this.targetPosition;
  }

  getTargetLookAt(): Vector3 {
    return this.targetLookAt;
  }

  isSettled(threshold = 0.001): boolean {
    return (
      this.position.distanceToSquared(this.targetPosition) < threshold * threshold &&
      this.currentLookAt.distanceToSquared(this.targetLookAt) < threshold * threshold &&
      this.velocity.lengthSq() < threshold * threshold
    );
  }

  // --------------------------------------------------------------------------
  // Configuration
  // --------------------------------------------------------------------------

  setMode(mode: CameraMode): void {
    this.mode = mode;
  }

  getMode(): CameraMode {
    return this.mode;
  }

  setSensitivity(sensitivity: number): void {
    this.sensitivity = clamp(sensitivity, 0.1, 3);
  }

  getSensitivity(): number {
    return this.sensitivity;
  }

  setConfig(config: Partial<MovementConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): MovementConfig {
    return this.config;
  }

  setActive(active: boolean): void {
    this._isActive = active;
    if (!active) {
      this.velocity.set(0, 0, 0);
      this.lookAtVelocity.set(0, 0, 0);
    }
  }

  getIsActive(): boolean {
    return this._isActive;
  }

  // --------------------------------------------------------------------------
  // Inertia / Momentum
  // --------------------------------------------------------------------------

  applyImpulse(impulse: Vector3): void {
    this.velocity.add(impulse);
  }

  applyLookAtImpulse(impulse: Vector3): void {
    this.lookAtVelocity.add(impulse);
  }

  dampVelocity(factor: number): void {
    this.velocity.multiplyScalar(factor);
  }

  dampLookAtVelocity(factor: number): void {
    this.lookAtVelocity.multiplyScalar(factor);
  }

  stop(): void {
    this.velocity.set(0, 0, 0);
    this.lookAtVelocity.set(0, 0, 0);
    this.targetPosition.copy(this.position);
    this.targetLookAt.copy(this.currentLookAt);
  }

  // --------------------------------------------------------------------------
  // Preset Application
  // --------------------------------------------------------------------------

  applyPreset(
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
    movement?: Partial<MovementConfig>,
  ): void {
    this.setTargetPosition(position[0], position[1], position[2]);
    this.setTargetLookAt(lookAt[0], lookAt[1], lookAt[2]);
    if (movement) {
      this.setConfig(movement);
    }
  }

  snapToPreset(
    position: readonly [number, number, number],
    lookAt: readonly [number, number, number],
  ): void {
    this.teleportTo(position[0], position[1], position[2]);
    this.teleportLookAt(lookAt[0], lookAt[1], lookAt[2]);
  }
}
