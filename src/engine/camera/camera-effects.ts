/**
 * Cinematic Camera System — Camera Effects
 *
 * Additive offset system: shake, drift, bob, sway.
 * Each effect computes an offset that is added to the base position.
 * Effects compose cleanly via weight-based blending.
 *
 * Config is mutated in place — no per-frame allocations.
 */

import { Vector3 } from "three";
import type { CameraEffectsConfig, CameraEffectsState, ShakeConfig } from "./types";
import { DEFAULT_EFFECTS } from "./config";

// ============================================================================
// Camera Effects
// ============================================================================

export class CameraEffects {
  private config: CameraEffectsConfig;
  private weights: { shake: number; drift: number; bob: number; sway: number };
  private shakeState: { intensity: number; time: number; x: number; y: number };
  private driftOffset: Vector3;
  private bobOffset: Vector3;
  private swayOffset: Vector3;
  private time: number;

  constructor(config?: Partial<CameraEffectsConfig>) {
    this.config = {
      shake: { ...DEFAULT_EFFECTS.shake, ...config?.shake },
      drift: { ...DEFAULT_EFFECTS.drift, ...config?.drift },
      bob: { ...DEFAULT_EFFECTS.bob, ...config?.bob },
      sway: { ...DEFAULT_EFFECTS.sway, ...config?.sway },
    };

    this.weights = { shake: 1, drift: 1, bob: 1, sway: 1 };
    this.shakeState = { intensity: 0, time: 0, x: 0, y: 0 };
    this.driftOffset = new Vector3();
    this.bobOffset = new Vector3();
    this.swayOffset = new Vector3();
    this.time = 0;
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.time = 0;
    this.shakeState = { intensity: 0, time: 0, x: 0, y: 0 };
    this.driftOffset.set(0, 0, 0);
    this.bobOffset.set(0, 0, 0);
    this.swayOffset.set(0, 0, 0);
  }

  update(delta: number): void {
    this.time += delta;
    this.updateShake(delta);
    this.updateDrift();
    this.updateBob();
    this.updateSway();
  }

  dispose(): void {
    this.shakeState = { intensity: 0, time: 0, x: 0, y: 0 };
    this.driftOffset.set(0, 0, 0);
    this.bobOffset.set(0, 0, 0);
    this.swayOffset.set(0, 0, 0);
  }

  // --------------------------------------------------------------------------
  // Shake
  // --------------------------------------------------------------------------

  triggerShake(config?: Partial<ShakeConfig>): void {
    if (config) {
      Object.assign(this.config.shake, config);
    }
    this.shakeState.intensity = this.config.shake.intensity;
    this.shakeState.time = 0;
  }

  private updateShake(delta: number): void {
    if (this.shakeState.intensity <= 0.001 || !this.config.shake.enabled) {
      this.shakeState.x = 0;
      this.shakeState.y = 0;
      return;
    }

    const shakeConfig = this.config.shake;
    this.shakeState.time += delta * shakeConfig.frequency;

    this.shakeState.x = Math.sin(this.shakeState.time) * this.shakeState.intensity;
    this.shakeState.y = Math.cos(this.shakeState.time * 0.7) * this.shakeState.intensity;

    this.shakeState.intensity *= Math.exp(-shakeConfig.decay * delta);
    if (this.shakeState.intensity < 0.001) {
      this.shakeState.intensity = 0;
    }
  }

  // --------------------------------------------------------------------------
  // Drift
  // --------------------------------------------------------------------------

  private updateDrift(): void {
    const driftConfig = this.config.drift;
    if (!driftConfig.enabled || this.weights.drift <= 0) {
      this.driftOffset.set(0, 0, 0);
      return;
    }

    const t = this.time * driftConfig.frequency;
    const amp = driftConfig.amplitude * this.weights.drift;
    const dir = driftConfig.direction;

    this.driftOffset.set(
      Math.sin(t * 1.1) * amp * dir[0],
      Math.sin(t * 0.7 + 1) * amp * dir[1],
      Math.sin(t * 0.5 + 2) * amp * dir[2],
    );
  }

  // --------------------------------------------------------------------------
  // Bob
  // --------------------------------------------------------------------------

  private updateBob(): void {
    const bobConfig = this.config.bob;
    if (!bobConfig.enabled || this.weights.bob <= 0) {
      this.bobOffset.set(0, 0, 0);
      return;
    }

    const t = this.time * bobConfig.frequency + bobConfig.phase;
    const amp = bobConfig.amplitude * this.weights.bob;

    this.bobOffset.set(0, Math.sin(t) * amp, 0);
  }

  // --------------------------------------------------------------------------
  // Sway
  // --------------------------------------------------------------------------

  private updateSway(): void {
    const swayConfig = this.config.sway;
    if (!swayConfig.enabled || this.weights.sway <= 0) {
      this.swayOffset.set(0, 0, 0);
      return;
    }

    const t = this.time * swayConfig.frequency;
    const amp = swayConfig.amplitude * this.weights.sway;

    this.swayOffset.set(Math.sin(t) * amp, Math.sin(t * 0.5 + 0.5) * amp * 0.5, 0);
  }

  // --------------------------------------------------------------------------
  // Getters
  // --------------------------------------------------------------------------

  getState(): CameraEffectsState {
    return {
      shakeIntensity: this.shakeState.intensity,
      driftOffset: [this.driftOffset.x, this.driftOffset.y, this.driftOffset.z],
      bobOffset: [this.bobOffset.x, this.bobOffset.y, this.bobOffset.z],
      swayOffset: [this.swayOffset.x, this.swayOffset.y, this.swayOffset.z],
    };
  }

  /**
   * Get the combined offset vector. Adds all effect offsets in-place.
   * Call this once per frame and add to the base position.
   */
  getCombinedOffset(out: Vector3): Vector3 {
    out.set(0, 0, 0);

    if (this.shakeState.intensity > 0) {
      out.x += this.shakeState.x;
      out.y += this.shakeState.y;
    }

    out.x += this.driftOffset.x;
    out.y += this.driftOffset.y;
    out.z += this.driftOffset.z;

    out.x += this.bobOffset.x;
    out.y += this.bobOffset.y;
    out.z += this.bobOffset.z;

    out.x += this.swayOffset.x;
    out.y += this.swayOffset.y;
    out.z += this.swayOffset.z;

    return out;
  }

  // --------------------------------------------------------------------------
  // Configuration (mutates in place — no allocations)
  // --------------------------------------------------------------------------

  setWeight(effect: "shake" | "drift" | "bob" | "sway", weight: number): void {
    this.weights[effect] = Math.max(0, Math.min(1, weight));
  }

  getWeight(effect: "shake" | "drift" | "bob" | "sway"): number {
    return this.weights[effect];
  }

  /**
   * Update individual effect config fields in place.
   * No object spreading — field-by-field assignment.
   */
  setShakeConfig(config: Partial<ShakeConfig>): void {
    Object.assign(this.config.shake, config);
  }

  setDriftConfig(
    config: Partial<{
      enabled: boolean;
      amplitude: number;
      frequency: number;
      direction: readonly [number, number, number];
    }>,
  ): void {
    Object.assign(this.config.drift, config);
  }

  setBobConfig(
    config: Partial<{ enabled: boolean; amplitude: number; frequency: number; phase: number }>,
  ): void {
    Object.assign(this.config.bob, config);
  }

  setSwayConfig(
    config: Partial<{ enabled: boolean; amplitude: number; frequency: number; damping: number }>,
  ): void {
    Object.assign(this.config.sway, config);
  }

  getConfig(): CameraEffectsConfig {
    return this.config;
  }

  reset(): void {
    this.shakeState = { intensity: 0, time: 0, x: 0, y: 0 };
    this.driftOffset.set(0, 0, 0);
    this.bobOffset.set(0, 0, 0);
    this.swayOffset.set(0, 0, 0);
    this.time = 0;
  }
}
