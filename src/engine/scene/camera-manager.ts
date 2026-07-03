/**
 * Camera Manager
 *
 * Owns the camera, camera presets, camera transitions, camera shake,
 * and future cinematic cameras.
 */

import { PerspectiveCamera, Vector3 } from "three";
import type {
  Manager,
  CameraManagerConfig,
  CameraManagerState,
  CameraPreset,
  CameraShakeConfig,
  CameraConfig,
} from "./types";
import { CAMERA_DEFAULTS, CAMERA_PRESETS } from "./constants";

// ============================================================================
// CameraManager
// ============================================================================

export class CameraManager implements Manager {
  private config: CameraManagerConfig;
  private camera: PerspectiveCamera;
  private state: CameraManagerState;
  private shakeIntensity = 0;
  private shakeFrequency = 0;
  private shakeDecay = 0;
  private shakeTime = 0;
  private dampingPosition = new Vector3();
  private targetPosition = new Vector3();
  private targetLookAt = new Vector3();
  private isDamping = false;

  constructor(config?: Partial<CameraManagerConfig>) {
    this.config = { ...CAMERA_DEFAULTS, ...config };

    const preset = CAMERA_PRESETS[this.config.preset];
    const merged = { ...preset, ...this.config.config };

    this.camera = new PerspectiveCamera(merged.fov, 1, merged.near, merged.far);
    this.camera.position.set(...merged.position);
    this.camera.lookAt(new Vector3(...merged.lookAt));
    this.camera.updateProjectionMatrix();

    this.dampingPosition.copy(this.camera.position);
    this.targetPosition.copy(this.camera.position);
    this.targetLookAt.set(...merged.lookAt);

    this.state = {
      currentPreset: this.config.preset,
      position: [...merged.position] as [number, number, number],
      isShaking: false,
      isTransitioning: false,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.camera.updateProjectionMatrix();
  }

  update(delta: number): void {
    if (this.config.enableDamping && this.isDamping) {
      this.dampingPosition.lerp(this.targetPosition, this.config.dampingFactor);
      this.camera.position.copy(this.dampingPosition);
    }

    if (this.shakeIntensity > 0) {
      this.shakeTime += delta * this.shakeFrequency;
      const shakeX = Math.sin(this.shakeTime) * this.shakeIntensity;
      const shakeY = Math.cos(this.shakeTime * 0.7) * this.shakeIntensity;
      this.camera.position.x += shakeX;
      this.camera.position.y += shakeY;
      this.shakeIntensity *= Math.exp(-this.shakeDecay * delta);
      if (this.shakeIntensity < 0.001) {
        this.shakeIntensity = 0;
        this.state = { ...this.state, isShaking: false };
      }
    }

    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.camera.clear();
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  getState(): CameraManagerState {
    return this.state;
  }

  setPreset(preset: CameraPreset, duration?: number): void {
    const presetConfig = CAMERA_PRESETS[preset];

    if (duration && duration > 0) {
      this.transitionTo(presetConfig, { duration, easing: "easeInOut" });
    } else {
      this.applyConfig(presetConfig);
    }

    this.state = { ...this.state, currentPreset: preset };
  }

  setPosition(x: number, y: number, z: number): void {
    this.targetPosition.set(x, y, z);
    if (!this.config.enableDamping) {
      this.camera.position.set(x, y, z);
      this.dampingPosition.set(x, y, z);
    }
    this.isDamping = true;
    this.state = { ...this.state, position: [x, y, z] };
  }

  lookAt(x: number, y: number, z: number): void {
    this.targetLookAt.set(x, y, z);
    this.camera.lookAt(x, y, z);
  }

  shake(config?: Partial<CameraShakeConfig>): void {
    if (!this.config.enableShake) return;
    this.shakeIntensity = config?.intensity ?? 0.5;
    this.shakeFrequency = config?.frequency ?? 30;
    this.shakeDecay = config?.decay ?? 3;
    this.shakeTime = 0;
    this.state = { ...this.state, isShaking: true };
  }

  setFov(fov: number): void {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  setNearFar(near: number, far: number): void {
    this.camera.near = near;
    this.camera.far = far;
    this.camera.updateProjectionMatrix();
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private applyConfig(config: CameraConfig): void {
    this.camera.fov = config.fov;
    this.camera.near = config.near;
    this.camera.far = config.far;
    this.camera.position.set(...config.position);
    this.camera.lookAt(new Vector3(...config.lookAt));
    this.camera.updateProjectionMatrix();

    this.targetPosition.set(...config.position);
    this.dampingPosition.set(...config.position);
    this.targetLookAt.set(...config.lookAt);

    this.state = { ...this.state, position: [...config.position] as [number, number, number] };
  }

  private transitionTo(target: CameraConfig, _config: { duration: number; easing: string }): void {
    this.state = { ...this.state, isTransitioning: true };
    this.applyConfig(target);
    this.isDamping = true;
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createCameraManager(config?: Partial<CameraManagerConfig>): CameraManager {
  return new CameraManager(config);
}
