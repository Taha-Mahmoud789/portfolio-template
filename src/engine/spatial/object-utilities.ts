/**
 * Spatial Object System — Utilities
 *
 * Pure functions for spatial calculations.
 * No side effects, no mutations, no allocations in hot path.
 */

import { Vector3, Box3, type Object3D, type BufferGeometry } from "three";
import type { SpatialPosition, SpatialRotation, SpatialScale } from "./types";

// ============================================================================
// Pre-allocated Scratch Vectors
// ============================================================================

const _v1 = new Vector3();
const _box = new Box3();

// ============================================================================
// Distance
// ============================================================================

export function distanceBetween(a: SpatialPosition, b: SpatialPosition): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function distanceSquared(a: SpatialPosition, b: SpatialPosition): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

// ============================================================================
// Bounding Box
// ============================================================================

export function computeBoundingBox(object: Object3D): Box3 {
  return _box.setFromObject(object);
}

export function intersectsBox(a: Box3, b: Box3): boolean {
  return a.intersectsBox(b);
}

export function containsPoint(box: Box3, point: SpatialPosition): boolean {
  _v1.set(point.x, point.y, point.z);
  return box.containsPoint(_v1);
}

// ============================================================================
// Visibility
// ============================================================================

export function isInDistance(
  objectPosition: SpatialPosition,
  cameraPosition: Vector3,
  maxDistance: number,
): boolean {
  _v1.set(objectPosition.x, objectPosition.y, objectPosition.z);
  return cameraPosition.distanceToSquared(_v1) <= maxDistance * maxDistance;
}

// ============================================================================
// Conversion
// ============================================================================

export function spatialToVector3(pos: SpatialPosition): Vector3 {
  return new Vector3(pos.x, pos.y, pos.z);
}

export function vector3ToSpatial(v: Vector3): SpatialPosition {
  return { x: v.x, y: v.y, z: v.z };
}

export function applyToObject3D(
  object: Object3D,
  position?: Partial<SpatialPosition>,
  rotation?: Partial<SpatialRotation>,
  scale?: Partial<SpatialScale>,
): void {
  if (position) {
    if (position.x !== undefined) object.position.x = position.x;
    if (position.y !== undefined) object.position.y = position.y;
    if (position.z !== undefined) object.position.z = position.z;
  }
  if (rotation) {
    if (rotation.x !== undefined) object.rotation.x = rotation.x;
    if (rotation.y !== undefined) object.rotation.y = rotation.y;
    if (rotation.z !== undefined) object.rotation.z = rotation.z;
  }
  if (scale) {
    if (scale.x !== undefined) object.scale.x = scale.x;
    if (scale.y !== undefined) object.scale.y = scale.y;
    if (scale.z !== undefined) object.scale.z = scale.z;
  }
}

// ============================================================================
// GPU Resource Disposal
// ============================================================================

export function disposeObjectResources(object: Object3D): void {
  object.traverse((child) => {
    const node = child as Object3D & {
      geometry?: BufferGeometry;
      material?: { dispose: () => void } | { dispose: () => void }[];
    };

    if (node.geometry) {
      node.geometry.dispose();
    }

    if (node.material) {
      if (Array.isArray(node.material)) {
        for (const mat of node.material) {
          disposeMaterialTextures(mat);
          mat.dispose();
        }
      } else {
        disposeMaterialTextures(node.material);
        node.material.dispose();
      }
    }
  });
}

function disposeMaterialTextures(mat: { dispose: () => void; [key: string]: unknown }): void {
  for (const key of Object.keys(mat)) {
    const value = mat[key];
    if (
      value !== null &&
      typeof value === "object" &&
      "dispose" in value &&
      typeof value.dispose === "function"
    ) {
      (value as { dispose: () => void }).dispose();
    }
  }
}

// ============================================================================
// Triangle Count
// ============================================================================

export function countTriangles(object: Object3D): number {
  let count = 0;
  object.traverse((child) => {
    const node = child as Object3D & { geometry?: BufferGeometry };
    if (node.geometry) {
      const geo = node.geometry;
      if (geo.index) {
        count += geo.index.count / 3;
      } else if (geo.attributes.position) {
        count += geo.attributes.position.count / 3;
      }
    }
  });
  return count;
}
