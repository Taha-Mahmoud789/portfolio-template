/**
 * Spatial Object System — Factory
 *
 * Creates SpatialObject instances from config.
 * Validates config before creation.
 * Checks cache for reusable Object3D before allocating new.
 * Resets Object3D state when recycling from cache.
 */

import { SpatialObject } from "./spatial-object";
import { type ObjectCache } from "./object-cache";
import { validateObjectConfig, type ValidationResult } from "./object-validator";
import type { SpatialObjectConfig, SpatialObjectType } from "./types";

// ============================================================================
// Object Factory
// ============================================================================

export class ObjectFactory {
  private cache: ObjectCache;

  constructor(cache: ObjectCache) {
    this.cache = cache;
  }

  // --------------------------------------------------------------------------
  // Create
  // --------------------------------------------------------------------------

  create(config: SpatialObjectConfig): SpatialObject {
    const validation = validateObjectConfig(config);
    if (!validation.valid) {
      throw new Error(
        `Invalid object config for type "${config.type}": ${validation.errors.join(", ")}`,
      );
    }

    // Try cache first — acquire resets Object3D transforms
    const cached = this.cache.acquire(config.type);
    const object3d = cached ?? config.object3d;

    return new SpatialObject(config, object3d ?? undefined);
  }

  validate(config: SpatialObjectConfig): ValidationResult {
    return validateObjectConfig(config);
  }

  // --------------------------------------------------------------------------
  // Cache Integration
  // --------------------------------------------------------------------------

  recycleToCache(object: SpatialObject): void {
    this.cache.store(object.type, object.object3d, object.getTriangleCount());
  }

  hasCached(type: SpatialObjectType): boolean {
    return this.cache.has(type);
  }

  getCachedCount(type: SpatialObjectType): number {
    return this.cache.getCount(type);
  }
}
