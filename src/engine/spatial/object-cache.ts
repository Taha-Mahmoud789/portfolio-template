/**
 * Spatial Object System — Cache
 *
 * LRU object pool for reuse. Prevents repeated allocation of geometries and materials.
 * Global size cap across all types. Objects are keyed by SpatialObjectType.
 */

import { type Object3D, type BufferGeometry, type Material } from "three";
import type { SpatialObjectType, CacheEntry } from "./types";

// ============================================================================
// Object Cache
// ============================================================================

export class ObjectCache {
  private cache: Map<SpatialObjectType, CacheEntry[]>;
  private globalMaxSize: number;
  private globalCount: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.globalMaxSize = maxSize;
    this.globalCount = 0;
  }

  // --------------------------------------------------------------------------
  // Store / Retrieve
  // --------------------------------------------------------------------------

  store(type: SpatialObjectType, object3d: Object3D, triangleCount: number = 0): void {
    let entries = this.cache.get(type);
    if (!entries) {
      entries = [];
      this.cache.set(type, entries);
    }

    // Evict least recently used globally if at capacity
    if (this.globalCount >= this.globalMaxSize) {
      this.evictLRUGlobal();
    }

    entries.push({
      object3d,
      type,
      lastUsed: performance.now(),
      triangleCount,
    });
    this.globalCount++;
  }

  acquire(type: SpatialObjectType): Object3D | null {
    const entries = this.cache.get(type);
    if (!entries || entries.length === 0) return null;

    // LIFO for speed — most recently stored is most likely still warm in GPU cache
    const entry = entries.pop();
    if (!entry) return null;

    this.globalCount--;
    entry.lastUsed = performance.now();

    // Reset Object3D state for clean reuse
    this.resetObject3D(entry.object3d);

    return entry.object3d;
  }

  has(type: SpatialObjectType): boolean {
    const entries = this.cache.get(type);
    return (entries?.length ?? 0) > 0;
  }

  getCount(type: SpatialObjectType): number {
    return this.cache.get(type)?.length ?? 0;
  }

  getTotalCount(): number {
    return this.globalCount;
  }

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------

  evict(type: SpatialObjectType): void {
    const entries = this.cache.get(type);
    if (!entries) return;
    this.globalCount -= entries.length;
    for (const entry of entries) {
      this.disposeEntry(entry);
    }
    this.cache.delete(type);
  }

  clear(): void {
    for (const entries of this.cache.values()) {
      for (const entry of entries) {
        this.disposeEntry(entry);
      }
    }
    this.cache.clear();
    this.globalCount = 0;
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private evictLRUGlobal(): void {
    // Find the oldest entry across all types
    let oldestType: SpatialObjectType | null = null;
    let oldestIdx = -1;
    let oldestTime = Infinity;

    for (const [type, entries] of this.cache) {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry && entry.lastUsed < oldestTime) {
          oldestTime = entry.lastUsed;
          oldestType = type;
          oldestIdx = i;
        }
      }
    }

    if (oldestType !== null && oldestIdx >= 0) {
      const entries = this.cache.get(oldestType);
      if (entries) {
        const removed = entries.splice(oldestIdx, 1)[0];
        if (removed) {
          this.disposeEntry(removed);
          this.globalCount--;
        }
      }
    }
  }

  private resetObject3D(object3d: Object3D): void {
    object3d.position.set(0, 0, 0);
    object3d.rotation.set(0, 0, 0);
    object3d.scale.set(1, 1, 1);
    object3d.visible = true;
    object3d.layers.set(0);
    object3d.updateMatrix();
    object3d.updateMatrixWorld(true);
  }

  private disposeEntry(entry: CacheEntry): void {
    entry.object3d.traverse((child) => {
      const node = child as Object3D & {
        geometry?: BufferGeometry;
        material?: Material | Material[];
      };
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        for (const m of mats) m.dispose();
      }
    });
  }
}
