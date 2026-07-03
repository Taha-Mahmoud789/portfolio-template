/**
 * World Cache
 *
 * Caches loaded world components to avoid re-loading.
 * Supports LRU, LFU, and FIFO eviction policies.
 */

import type { ComponentType } from "react";
import type { WorldId, WorldCacheEntry, WorldCacheConfig } from "./types";
import { WORLD_CACHE_DEFAULTS } from "./constants";

export class WorldCache {
  private cache = new Map<WorldId, WorldCacheEntry>();
  private config: WorldCacheConfig;

  constructor(config?: Partial<WorldCacheConfig>) {
    this.config = { ...WORLD_CACHE_DEFAULTS, ...config };
  }

  set(worldId: WorldId, component: ComponentType, module: unknown, memoryEstimate = 0): void {
    if (this.cache.size >= this.config.maxSize && !this.cache.has(worldId)) {
      this.evict();
    }

    this.cache.set(worldId, {
      worldId,
      component,
      module,
      cachedAt: Date.now(),
      accessCount: 0,
      lastAccessedAt: Date.now(),
      memoryEstimate,
    });
  }

  get(worldId: WorldId): WorldCacheEntry | undefined {
    const entry = this.cache.get(worldId);
    if (!entry) return undefined;

    if (this.isExpired(entry)) {
      this.cache.delete(worldId);
      return undefined;
    }

    entry.accessCount++;
    entry.lastAccessedAt = Date.now();
    return entry;
  }

  has(worldId: WorldId): boolean {
    const entry = this.cache.get(worldId);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.cache.delete(worldId);
      return false;
    }

    return true;
  }

  delete(worldId: WorldId): boolean {
    return this.cache.delete(worldId);
  }

  clear(): void {
    this.cache.clear();
  }

  getIds(): WorldId[] {
    return Array.from(this.cache.keys());
  }

  getEntries(): WorldCacheEntry[] {
    return Array.from(this.cache.values());
  }

  get size(): number {
    return this.cache.size;
  }

  get totalMemoryEstimate(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += entry.memoryEstimate;
    }
    return total;
  }

  private isExpired(entry: WorldCacheEntry): boolean {
    if (this.config.maxAge <= 0) return false;
    return Date.now() - entry.cachedAt > this.config.maxAge;
  }

  private evict(): WorldId | undefined {
    if (this.cache.size === 0) return undefined;

    let targetId: WorldId | undefined;

    switch (this.config.evictionPolicy) {
      case "lru": {
        let oldest = Infinity;
        for (const [id, entry] of this.cache) {
          if (entry.lastAccessedAt < oldest) {
            oldest = entry.lastAccessedAt;
            targetId = id;
          }
        }
        break;
      }
      case "lfu": {
        let leastUsed = Infinity;
        for (const [id, entry] of this.cache) {
          if (entry.accessCount < leastUsed) {
            leastUsed = entry.accessCount;
            targetId = id;
          }
        }
        break;
      }
      case "fifo": {
        let oldestEntry = Infinity;
        for (const [id, entry] of this.cache) {
          if (entry.cachedAt < oldestEntry) {
            oldestEntry = entry.cachedAt;
            targetId = id;
          }
        }
        break;
      }
    }

    if (targetId) {
      this.cache.delete(targetId);
    }

    return targetId;
  }
}
