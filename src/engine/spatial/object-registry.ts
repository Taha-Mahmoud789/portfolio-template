/**
 * Spatial Object System — Registry
 *
 * Indexed collection of spatial objects.
 * Supports query by type, layer, status, visibility, distance.
 * Single-pass query with limit support.
 * Objects communicate only through ObjectManager — registry is the lookup layer.
 */

import type { SpatialObjectType, ObjectRegistryQuery } from "./types";
import type { SpatialObject } from "./spatial-object";

// ============================================================================
// Object Registry
// ============================================================================

export class ObjectRegistry {
  private objects: Map<string, SpatialObject>;
  private byType: Map<SpatialObjectType, Set<string>>;
  private byLayer: Map<number, Set<string>>;

  constructor() {
    this.objects = new Map();
    this.byType = new Map();
    this.byLayer = new Map();
  }

  // --------------------------------------------------------------------------
  // Add / Remove
  // --------------------------------------------------------------------------

  add(object: SpatialObject): void {
    this.objects.set(object.id, object);

    // Index by type
    let typeSet = this.byType.get(object.type);
    if (!typeSet) {
      typeSet = new Set();
      this.byType.set(object.type, typeSet);
    }
    typeSet.add(object.id);

    // Index by layer
    const layer = object.getLayer();
    let layerSet = this.byLayer.get(layer);
    if (!layerSet) {
      layerSet = new Set();
      this.byLayer.set(layer, layerSet);
    }
    layerSet.add(object.id);
  }

  remove(id: string): SpatialObject | undefined {
    const object = this.objects.get(id);
    if (!object) return undefined;

    this.objects.delete(id);

    // Remove from type index
    this.byType.get(object.type)?.delete(id);

    // Remove from layer index
    this.byLayer.get(object.getLayer())?.delete(id);

    return object;
  }

  // --------------------------------------------------------------------------
  // Lookup
  // --------------------------------------------------------------------------

  get(id: string): SpatialObject | undefined {
    return this.objects.get(id);
  }

  has(id: string): boolean {
    return this.objects.has(id);
  }

  get size(): number {
    return this.objects.size;
  }

  getAll(): SpatialObject[] {
    return Array.from(this.objects.values());
  }

  forEach(callback: (obj: SpatialObject) => void): void {
    for (const obj of this.objects.values()) {
      callback(obj);
    }
  }

  /**
   * Iterate in priority order (highest priority first).
   * Collects all objects, sorts by priority descending, then iterates.
   */
  forEachByPriority(callback: (obj: SpatialObject) => void): void {
    const all = Array.from(this.objects.values());
    all.sort((a, b) => b.getPriority() - a.getPriority());
    for (const obj of all) {
      callback(obj);
    }
  }

  getByType(type: SpatialObjectType): SpatialObject[] {
    const ids = this.byType.get(type);
    if (!ids) return [];
    const result: SpatialObject[] = [];
    for (const id of ids) {
      const obj = this.objects.get(id);
      if (obj) result.push(obj);
    }
    return result;
  }

  getByLayer(layer: number): SpatialObject[] {
    const ids = this.byLayer.get(layer);
    if (!ids) return [];
    const result: SpatialObject[] = [];
    for (const id of ids) {
      const obj = this.objects.get(id);
      if (obj) result.push(obj);
    }
    return result;
  }

  // --------------------------------------------------------------------------
  // Query (single-pass with limit)
  // --------------------------------------------------------------------------

  query(q: ObjectRegistryQuery): SpatialObject[] {
    const results: SpatialObject[] = [];
    const limit = q.limit ?? Infinity;

    // Fast path: type-filtered
    if (q.type) {
      const ids = this.byType.get(q.type);
      if (!ids) return [];

      for (const id of ids) {
        if (results.length >= limit) break;
        const obj = this.objects.get(id);
        if (!obj) continue;
        if (this.matchesQuery(obj, q)) {
          results.push(obj);
        }
      }
      return results;
    }

    // Slow path: scan all
    for (const obj of this.objects.values()) {
      if (results.length >= limit) break;
      if (this.matchesQuery(obj, q)) {
        results.push(obj);
      }
    }

    return results;
  }

  // --------------------------------------------------------------------------
  // Layer Management
  // --------------------------------------------------------------------------

  updateLayerIndex(id: string, oldLayer: number, newLayer: number): void {
    this.byLayer.get(oldLayer)?.delete(id);
    let newSet = this.byLayer.get(newLayer);
    if (!newSet) {
      newSet = new Set();
      this.byLayer.set(newLayer, newSet);
    }
    newSet.add(id);
  }

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------

  clear(): void {
    this.objects.clear();
    this.byType.clear();
    this.byLayer.clear();
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private matchesQuery(obj: SpatialObject, q: ObjectRegistryQuery): boolean {
    if (q.layer !== undefined && obj.getLayer() !== q.layer) return false;
    if (q.status !== undefined && obj.getStatus() !== q.status) return false;
    if (q.visible !== undefined && obj.isVisible() !== q.visible) return false;
    if (q.maxDistance !== undefined && q.cameraPosition) {
      if (obj.getSquaredDistance(q.cameraPosition) > q.maxDistance * q.maxDistance) return false;
    }
    return true;
  }
}
