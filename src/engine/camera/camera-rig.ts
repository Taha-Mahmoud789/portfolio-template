/**
 * Cinematic Camera System — Camera Rig
 *
 * Manages the transform hierarchy: camera, target, pivot, offsets.
 * Pre-allocates all temporary vectors for zero-allocation hot path.
 */

import { Object3D, PerspectiveCamera, Vector3 } from "three";
import type { CameraConstraints } from "./types";
import { DEFAULT_CONSTRAINTS } from "./config";
import { clamp } from "./math";

// ============================================================================
// Camera Rig
// ============================================================================

export class CameraRig {
  readonly camera: PerspectiveCamera;
  readonly pivot: Object3D;
  readonly target: Object3D;
  readonly offset: Object3D;

  private constraints: CameraConstraints;
  private _basePosition: Vector3;
  private _baseLookAt: Vector3;
  private _currentLookAt: Vector3;
  private _constraintDir: Vector3;

  constructor(config?: {
    fov?: number;
    near?: number;
    far?: number;
    position?: readonly [number, number, number];
    lookAt?: readonly [number, number, number];
    constraints?: Partial<CameraConstraints>;
  }) {
    this.constraints = { ...DEFAULT_CONSTRAINTS, ...config?.constraints };

    this.camera = new PerspectiveCamera(
      config?.fov ?? 60,
      1,
      config?.near ?? 0.1,
      config?.far ?? 1000,
    );

    this.pivot = new Object3D();
    this.target = new Object3D();
    this.offset = new Object3D();

    this.pivot.add(this.target);
    this.target.add(this.offset);
    this.offset.add(this.camera);

    const pos = config?.position ?? [0, 2, 8];
    const look = config?.lookAt ?? [0, 0, 0];

    this.camera.position.set(pos[0], pos[1], pos[2]);
    this.target.position.set(look[0], look[1], look[2]);

    this._basePosition = new Vector3(pos[0], pos[1], pos[2]);
    this._baseLookAt = new Vector3(look[0], look[1], look[2]);
    this._currentLookAt = new Vector3(look[0], look[1], look[2]);
    this._constraintDir = new Vector3();

    this.updateProjectionMatrix();
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.updateProjectionMatrix();
  }

  update(_delta: number): void {
    this.camera.lookAt(this._currentLookAt);
  }

  dispose(): void {
    this.camera.clear();
    this.pivot.clear();
    this.target.clear();
    this.offset.clear();
  }

  // --------------------------------------------------------------------------
  // Base Transforms
  // --------------------------------------------------------------------------

  getBasePosition(): Vector3 {
    return this._basePosition;
  }

  setBasePosition(x: number, y: number, z: number): void {
    this._basePosition.set(x, y, z);
    this.applyConstraints();
  }

  getBaseLookAt(): Vector3 {
    return this._baseLookAt;
  }

  setBaseLookAt(x: number, y: number, z: number): void {
    this._baseLookAt.set(x, y, z);
  }

  getCurrentLookAt(): Vector3 {
    return this._currentLookAt;
  }

  setCurrentLookAt(x: number, y: number, z: number): void {
    this._currentLookAt.set(x, y, z);
  }

  // --------------------------------------------------------------------------
  // Camera Properties
  // --------------------------------------------------------------------------

  getFov(): number {
    return this.camera.fov;
  }

  setFov(fov: number): void {
    this.camera.fov = clamp(fov, this.constraints.minFov, this.constraints.maxFov);
    this.updateProjectionMatrix();
  }

  getAspect(): number {
    return this.camera.aspect;
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.updateProjectionMatrix();
  }

  getDistance(): number {
    return this.camera.position.distanceTo(this._currentLookAt);
  }

  // --------------------------------------------------------------------------
  // Constraints (zero-allocation)
  // --------------------------------------------------------------------------

  getConstraints(): CameraConstraints {
    return this.constraints;
  }

  setConstraints(constraints: Partial<CameraConstraints>): void {
    this.constraints = { ...this.constraints, ...constraints };
    this.applyConstraints();
  }

  private applyConstraints(): void {
    const pos = this.camera.position;
    const dist = pos.distanceTo(this._currentLookAt);

    if (dist < this.constraints.minDistance) {
      this._constraintDir.subVectors(pos, this._currentLookAt).normalize();
      pos
        .copy(this._currentLookAt)
        .addScaledVector(this._constraintDir, this.constraints.minDistance);
    } else if (dist > this.constraints.maxDistance) {
      this._constraintDir.subVectors(pos, this._currentLookAt).normalize();
      pos
        .copy(this._currentLookAt)
        .addScaledVector(this._constraintDir, this.constraints.maxDistance);
    }
  }

  // --------------------------------------------------------------------------
  // Projection
  // --------------------------------------------------------------------------

  updateProjectionMatrix(): void {
    this.camera.updateProjectionMatrix();
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.updateProjectionMatrix();
  }
}
