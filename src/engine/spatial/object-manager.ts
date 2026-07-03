/**
 * Spatial Object System — Manager
 *
 * Orchestrator for the entire spatial object system.
 * Objects communicate only through this manager.
 * Owns the registry, lifecycle, events, factory, cache, and loader.
 *
 * Features:
 * - Dirty-flag state: only recomputes when objects change
 * - Priority-based update ordering
 * - Batch add/remove operations
 * - Cached triangle counts (no per-frame traverse)
 *
 * Lifecycle:
 * 1. objectManager.initialize(scene) — binds to scene
 * 2. objectManager.addObject(config) → id — registers, loads, initializes, mounts
 * 3. objectManager.update(delta) — updates all active objects (priority order)
 * 4. objectManager.removeObject(id) — destroys, disposes, removes
 * 5. objectManager.dispose() — tears down everything
 */

import { type Scene } from "three";
import type {
  SpatialObjectConfig,
  SpatialObjectType,
  ObjectManagerState,
  ObjectManagerConfig,
  ObjectRegistryQuery,
} from "./types";
import { OBJECT_MANAGER_DEFAULTS, EMPTY_TYPE_COUNTS } from "./constants";
import { ObjectRegistry } from "./object-registry";
import { ObjectEvents, EVENT_PRIORITY, type EventPriority } from "./object-events";
import { ObjectFactory } from "./object-factory";
import { ObjectCache } from "./object-cache";
import { ObjectLoader } from "./object-loader";
import { type SpatialObject } from "./spatial-object";

// ============================================================================
// Object Manager
// ============================================================================

export class ObjectManager {
  private config: ObjectManagerConfig;
  private scene: Scene | null;
  private registry: ObjectRegistry;
  private events: ObjectEvents;
  private factory: ObjectFactory;
  private cache: ObjectCache;
  private loader: ObjectLoader;
  private state: ObjectManagerState;
  private stateDirty: boolean;

  constructor(config?: Partial<ObjectManagerConfig>) {
    this.config = { ...OBJECT_MANAGER_DEFAULTS, ...config };
    this.scene = null;
    this.registry = new ObjectRegistry();
    this.events = new ObjectEvents();
    this.cache = new ObjectCache(this.config.maxObjects);
    this.factory = new ObjectFactory(this.cache);
    this.loader = new ObjectLoader();
    this.stateDirty = true;
    this.state = {
      objectCount: 0,
      objectsByType: { ...EMPTY_TYPE_COUNTS },
      activeCount: 0,
      suspendedCount: 0,
      totalTriangles: 0,
    };
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  initialize(scene: Scene): void {
    this.scene = scene;
  }

  update(delta: number): void {
    // Priority-based update: higher priority objects update first
    this.registry.forEachByPriority((obj) => {
      const status = obj.getStatus();
      if (status === "mounted" || status === "updating") {
        obj.update(delta);
      }
    });

    // Only recompute state if something changed
    if (this.stateDirty) {
      this.recomputeState();
    }
  }

  dispose(): void {
    this.registry.forEach((obj) => {
      obj.dispose();
    });
    this.registry.clear();
    this.cache.clear();
    this.events.dispose();
    this.loader.dispose();
    this.scene = null;
    this.stateDirty = true;
    this.recomputeState();
  }

  // --------------------------------------------------------------------------
  // Object Lifecycle
  // --------------------------------------------------------------------------

  addObject(config: SpatialObjectConfig): string {
    if (this.registry.size >= this.config.maxObjects) {
      throw new Error(`Max objects reached: ${String(this.config.maxObjects)}`);
    }

    const object = this.factory.create(config);
    this.registry.add(object);

    // Mount to scene
    this.scene?.add(object.object3d);

    // Initialize lifecycle (single batch transition)
    object.initialize();

    // Emit events
    const now = performance.now();
    this.events.emit("object:loaded", object.id, object.type, now);
    this.events.emit("object:mounted", object.id, object.type, now);

    this.markDirty();
    return object.id;
  }

  addObjects(configs: readonly SpatialObjectConfig[]): string[] {
    const ids: string[] = [];
    const now = performance.now();

    for (const config of configs) {
      if (this.registry.size >= this.config.maxObjects) {
        throw new Error(`Max objects reached: ${String(this.config.maxObjects)}`);
      }

      const object = this.factory.create(config);
      this.registry.add(object);
      this.scene?.add(object.object3d);
      object.initialize();

      this.events.emit("object:loaded", object.id, object.type, now);
      this.events.emit("object:mounted", object.id, object.type, now);

      ids.push(object.id);
    }

    this.markDirty();
    return ids;
  }

  removeObject(id: string): void {
    const object = this.registry.get(id);
    if (!object) return;

    // Emit destroyed event
    this.events.emit("object:destroyed", object.id, object.type);

    // Destroy then dispose with proper lifecycle flow
    object.destroy();
    object.dispose();

    // Remove from registry
    this.registry.remove(id);

    // Recycle to cache if auto-dispose is off
    if (!this.config.autoDispose) {
      this.factory.recycleToCache(object);
    }

    this.markDirty();
  }

  removeObjectBatch(ids: readonly string[]): void {
    const now = performance.now();

    for (const id of ids) {
      const object = this.registry.get(id);
      if (!object) continue;

      this.events.emit("object:destroyed", object.id, object.type, now);
      object.destroy();
      object.dispose();
      this.registry.remove(id);

      if (!this.config.autoDispose) {
        this.factory.recycleToCache(object);
      }
    }

    this.markDirty();
  }

  getObject(id: string): SpatialObject | undefined {
    return this.registry.get(id);
  }

  query(q: ObjectRegistryQuery): SpatialObject[] {
    return this.registry.query(q);
  }

  getAllObjects(): SpatialObject[] {
    return this.registry.getAll();
  }

  // --------------------------------------------------------------------------
  // Events
  // --------------------------------------------------------------------------

  on(
    type: Parameters<typeof this.events.on>[0],
    handler: Parameters<typeof this.events.on>[1],
    priority: EventPriority = EVENT_PRIORITY.NORMAL,
  ): () => void {
    return this.events.on(type, handler, priority);
  }

  off(
    type: Parameters<typeof this.events.off>[0],
    handler: Parameters<typeof this.events.off>[1],
  ): void {
    this.events.off(type, handler);
  }

  // --------------------------------------------------------------------------
  // Cache
  // --------------------------------------------------------------------------

  getCachedCount(): number {
    return this.cache.getTotalCount();
  }

  clearCache(): void {
    this.cache.clear();
  }

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  getState(): ObjectManagerState {
    if (this.stateDirty) {
      this.recomputeState();
    }
    return this.state;
  }

  // --------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------

  private markDirty(): void {
    this.stateDirty = true;
  }

  private recomputeState(): void {
    const objectsByType: Record<SpatialObjectType, number> = { ...EMPTY_TYPE_COUNTS };
    let count = 0;
    let activeCount = 0;
    let suspendedCount = 0;
    let totalTriangles = 0;

    this.registry.forEach((obj) => {
      count++;
      objectsByType[obj.type]++;
      const status = obj.getStatus();
      if (status === "mounted" || status === "updating") {
        activeCount++;
      }
      if (status === "suspended") {
        suspendedCount++;
      }
      // Use cached triangle count — no traverse
      totalTriangles += obj.getTriangleCount();
    });

    this.state = {
      objectCount: count,
      objectsByType,
      activeCount,
      suspendedCount,
      totalTriangles,
    };
    this.stateDirty = false;
  }
}
