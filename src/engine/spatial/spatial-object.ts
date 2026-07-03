/**
 * Spatial Object System — Spatial Object
 *
 * Core object class wrapping a Three.js Object3D.
 * Exposes only high-level API — never exposes internals.
 */

import { Object3D, Box3, Vector3 } from "three";
import type {
  SpatialObjectConfig,
  SpatialObjectState,
  SpatialObjectType,
  ObjectStatus,
  SpatialPosition,
  SpatialRotation,
  SpatialScale,
  MutableSpatialPosition,
  MutableSpatialRotation,
  MutableSpatialScale,
} from "./types";
import { ObjectLifecycle } from "./object-lifecycle";
import {
  DEFAULT_POSITION,
  DEFAULT_ROTATION,
  DEFAULT_SCALE,
  INITIALIZE_SEQUENCE,
} from "./constants";
import { disposeObjectResources, countTriangles } from "./object-utilities";

// ============================================================================
// Spatial Object
// ============================================================================

export class SpatialObject {
  readonly id: string;
  readonly type: SpatialObjectType;
  readonly object3d: Object3D;

  private lifecycle: ObjectLifecycle;
  private layer: number;
  private priority: number;
  private metadata: Map<string, unknown>;
  private visible: boolean;

  // Cached computations
  private cachedBoundingBox: Box3 | null;
  private cachedWorldPosition: SpatialPosition | null;
  private cachedTriangleCount: number;
  private worldPositionDirty: boolean;

  // Scratch objects — zero-allocation hot path
  private static _scratchVec = new Vector3();
  private static _scratchPos: MutableSpatialPosition = { x: 0, y: 0, z: 0 };
  private static _scratchRot: MutableSpatialRotation = { x: 0, y: 0, z: 0 };
  private static _scratchScale: MutableSpatialScale = { x: 0, y: 0, z: 0 };

  constructor(config: SpatialObjectConfig, object3d?: Object3D) {
    this.id =
      config.id ??
      `obj-${config.type}-${String(Date.now())}-${Math.random().toString(36).slice(2, 6)}`;
    this.type = config.type;
    this.object3d = object3d ?? config.object3d ?? new Object3D();
    this.lifecycle = new ObjectLifecycle();
    this.layer = config.layer ?? 0;
    this.priority = config.priority ?? 0;
    this.metadata = new Map();
    this.visible = config.visible ?? true;
    this.cachedBoundingBox = null;
    this.cachedWorldPosition = null;
    this.cachedTriangleCount = -1;
    this.worldPositionDirty = true;

    if (config.metadata) {
      for (const [key, value] of Object.entries(config.metadata)) {
        this.metadata.set(key, value);
      }
    }

    // Apply spatial config to Object3D
    this.applyConfig(config);
  }

  // --------------------------------------------------------------------------
  // Spatial Queries
  // --------------------------------------------------------------------------

  getPosition(): SpatialPosition {
    const p = this.object3d.position;
    SpatialObject._scratchPos.x = p.x;
    SpatialObject._scratchPos.y = p.y;
    SpatialObject._scratchPos.z = p.z;
    return SpatialObject._scratchPos;
  }

  getWorldPosition(): SpatialPosition {
    if (!this.worldPositionDirty && this.cachedWorldPosition) {
      return this.cachedWorldPosition;
    }
    this.object3d.updateWorldMatrix(true, false);
    this.object3d.getWorldPosition(SpatialObject._scratchVec);
    this.cachedWorldPosition = {
      x: SpatialObject._scratchVec.x,
      y: SpatialObject._scratchVec.y,
      z: SpatialObject._scratchVec.z,
    };
    this.worldPositionDirty = false;
    return this.cachedWorldPosition;
  }

  getRotation(): SpatialRotation {
    const r = this.object3d.rotation;
    SpatialObject._scratchRot.x = r.x;
    SpatialObject._scratchRot.y = r.y;
    SpatialObject._scratchRot.z = r.z;
    return SpatialObject._scratchRot;
  }

  getScale(): SpatialScale {
    const s = this.object3d.scale;
    SpatialObject._scratchScale.x = s.x;
    SpatialObject._scratchScale.y = s.y;
    SpatialObject._scratchScale.z = s.z;
    return SpatialObject._scratchScale;
  }

  getBoundingBox(): Box3 {
    this.cachedBoundingBox ??= new Box3().setFromObject(this.object3d);
    return this.cachedBoundingBox;
  }

  getTriangleCount(): number {
    if (this.cachedTriangleCount < 0) {
      this.cachedTriangleCount = countTriangles(this.object3d);
    }
    return this.cachedTriangleCount;
  }

  invalidateBounds(): void {
    this.cachedBoundingBox = null;
    this.cachedWorldPosition = null;
    this.worldPositionDirty = true;
  }

  invalidateTriangleCount(): void {
    this.cachedTriangleCount = -1;
  }

  markPositionDirty(): void {
    this.worldPositionDirty = true;
    this.cachedBoundingBox = null;
  }

  getDistance(cameraPosition: Vector3): number {
    const wp = this.getWorldPosition();
    const dx = wp.x - cameraPosition.x;
    const dy = wp.y - cameraPosition.y;
    const dz = wp.z - cameraPosition.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  getSquaredDistance(cameraPosition: Vector3): number {
    const wp = this.getWorldPosition();
    const dx = wp.x - cameraPosition.x;
    const dy = wp.y - cameraPosition.y;
    const dz = wp.z - cameraPosition.z;
    return dx * dx + dy * dy + dz * dz;
  }

  // --------------------------------------------------------------------------
  // Visibility
  // --------------------------------------------------------------------------

  isVisible(): boolean {
    return this.visible;
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.object3d.visible = visible;
  }

  getLayer(): number {
    return this.layer;
  }

  setLayer(layer: number): void {
    this.layer = layer;
    this.object3d.layers.set(layer);
  }

  getPriority(): number {
    return this.priority;
  }

  setPriority(priority: number): void {
    this.priority = priority;
  }

  // --------------------------------------------------------------------------
  // Metadata
  // --------------------------------------------------------------------------

  getMetadata(key: string): unknown {
    return this.metadata.get(key);
  }

  setMetadata(key: string, value: unknown): void {
    this.metadata.set(key, value);
    this.invalidateBounds();
  }

  // --------------------------------------------------------------------------
  // Status
  // --------------------------------------------------------------------------

  getStatus(): ObjectStatus {
    return this.lifecycle.getStatus();
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(): void {
    this.lifecycle.transitionSequence(INITIALIZE_SEQUENCE);
  }

  update(_delta: number): void {
    if (!this.lifecycle.isActive()) return;
    if (this.lifecycle.getStatus() !== "updating") {
      this.lifecycle.transition("updating");
    }
  }

  suspend(): void {
    if (this.lifecycle.getStatus() === "mounted") {
      this.lifecycle.transition("updating");
    }
    this.lifecycle.transition("suspending");
    this.lifecycle.transition("suspended");
  }

  resume(): void {
    this.lifecycle.transition("resuming");
    this.lifecycle.transition("updating");
  }

  destroy(): void {
    this.lifecycle.transition("destroying");
    this.lifecycle.transition("destroyed");
  }

  dispose(): void {
    this.object3d.visible = false;
    this.object3d.parent?.remove(this.object3d);
    disposeObjectResources(this.object3d);
    // Enter disposing from destroyed, then dispose
    if (this.lifecycle.getStatus() === "destroyed") {
      this.lifecycle.transition("disposing");
    }
    this.lifecycle.forceTransition("disposed");
    this.metadata.clear();
    this.cachedBoundingBox = null;
    this.cachedWorldPosition = null;
    this.worldPositionDirty = true;
    this.cachedTriangleCount = -1;
  }

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  getState(): SpatialObjectState {
    return {
      id: this.id,
      type: this.type,
      status: this.getStatus(),
      visible: this.visible,
      layer: this.layer,
      priority: this.priority,
      distance: 0,
      worldPosition: this.getWorldPosition(),
    };
  }

  // --------------------------------------------------------------------------
  // Reset (for cache recycling)
  // --------------------------------------------------------------------------

  resetTransform(): void {
    this.object3d.position.set(DEFAULT_POSITION.x, DEFAULT_POSITION.y, DEFAULT_POSITION.z);
    this.object3d.rotation.set(DEFAULT_ROTATION.x, DEFAULT_ROTATION.y, DEFAULT_ROTATION.z);
    this.object3d.scale.set(DEFAULT_SCALE.x, DEFAULT_SCALE.y, DEFAULT_SCALE.z);
    this.object3d.visible = true;
    this.object3d.layers.set(0);
    this.invalidateBounds();
    this.invalidateTriangleCount();
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private applyConfig(config: SpatialObjectConfig): void {
    if (config.position) {
      if (config.position.x !== undefined) this.object3d.position.x = config.position.x;
      if (config.position.y !== undefined) this.object3d.position.y = config.position.y;
      if (config.position.z !== undefined) this.object3d.position.z = config.position.z;
    } else {
      this.object3d.position.set(DEFAULT_POSITION.x, DEFAULT_POSITION.y, DEFAULT_POSITION.z);
    }

    if (config.rotation) {
      if (config.rotation.x !== undefined) this.object3d.rotation.x = config.rotation.x;
      if (config.rotation.y !== undefined) this.object3d.rotation.y = config.rotation.y;
      if (config.rotation.z !== undefined) this.object3d.rotation.z = config.rotation.z;
    } else {
      this.object3d.rotation.set(DEFAULT_ROTATION.x, DEFAULT_ROTATION.y, DEFAULT_ROTATION.z);
    }

    if (config.scale) {
      if (config.scale.x !== undefined) this.object3d.scale.x = config.scale.x;
      if (config.scale.y !== undefined) this.object3d.scale.y = config.scale.y;
      if (config.scale.z !== undefined) this.object3d.scale.z = config.scale.z;
    } else {
      this.object3d.scale.set(DEFAULT_SCALE.x, DEFAULT_SCALE.y, DEFAULT_SCALE.z);
    }

    this.object3d.visible = this.visible;
    this.object3d.layers.set(this.layer);
  }
}
