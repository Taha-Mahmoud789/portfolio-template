/**
 * World Memory Manager
 *
 * Tracks memory usage across world instances and triggers cleanup
 * when thresholds are exceeded. Handles disposal of GSAP timelines,
 * Three.js objects, event listeners, and textures.
 */

import type { WorldId, WorldMemoryConfig, WorldMemoryStats } from "./types";
import { WORLD_MEMORY_DEFAULTS } from "./constants";

type CleanupCallback = () => void | Promise<void>;

interface WorldMemoryEntry {
  worldId: WorldId;
  estimate: number;
  cleanupCallbacks: CleanupCallback[];
  lastAccessed: number;
}

export class WorldMemoryManager {
  private config: WorldMemoryConfig;
  private entries = new Map<WorldId, WorldMemoryEntry>();
  private gcCount = 0;
  private lastCleanup = 0;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config?: Partial<WorldMemoryConfig>) {
    this.config = { ...WORLD_MEMORY_DEFAULTS, ...config };
  }

  start(): void {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      void this.checkAndCleanup();
    }, this.config.cleanupInterval);
  }

  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  register(worldId: WorldId, estimate: number, cleanup?: CleanupCallback): void {
    const existing = this.entries.get(worldId);

    if (existing) {
      existing.estimate = estimate;
      existing.lastAccessed = Date.now();
      if (cleanup) {
        existing.cleanupCallbacks.push(cleanup);
      }
    } else {
      this.entries.set(worldId, {
        worldId,
        estimate,
        cleanupCallbacks: cleanup ? [cleanup] : [],
        lastAccessed: Date.now(),
      });
    }
  }

  unregister(worldId: WorldId): void {
    this.entries.delete(worldId);
  }

  addCleanupCallback(worldId: WorldId, callback: CleanupCallback): void {
    const entry = this.entries.get(worldId);
    if (entry) {
      entry.cleanupCallbacks.push(callback);
    }
  }

  touch(worldId: WorldId): void {
    const entry = this.entries.get(worldId);
    if (entry) {
      entry.lastAccessed = Date.now();
    }
  }

  getStats(): WorldMemoryStats {
    const worldUsages = new Map<WorldId, number>();
    let totalUsage = 0;

    for (const [worldId, entry] of this.entries) {
      worldUsages.set(worldId, entry.estimate);
      totalUsage += entry.estimate;
    }

    return {
      totalUsage,
      worldUsages,
      gcCount: this.gcCount,
      lastCleanup: this.lastCleanup,
    };
  }

  getTotalUsage(): number {
    let total = 0;
    for (const entry of this.entries.values()) {
      total += entry.estimate;
    }
    return total;
  }

  getUsageForWorld(worldId: WorldId): number {
    return this.entries.get(worldId)?.estimate ?? 0;
  }

  isWarning(): boolean {
    return this.getTotalUsage() >= this.config.warningThreshold;
  }

  isCritical(): boolean {
    return this.getTotalUsage() >= this.config.criticalThreshold;
  }

  async forceCleanup(): Promise<WorldId[]> {
    const cleanedUp: WorldId[] = [];

    const sorted = Array.from(this.entries.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed,
    );

    for (const [worldId, entry] of sorted) {
      if (this.getTotalUsage() < this.config.warningThreshold) break;

      await this.runCleanupCallbacks(entry);
      this.entries.delete(worldId);
      cleanedUp.push(worldId);
    }

    this.gcCount++;
    this.lastCleanup = Date.now();
    return cleanedUp;
  }

  async cleanupIdleWorlds(): Promise<WorldId[]> {
    const now = Date.now();
    const cleanedUp: WorldId[] = [];

    for (const [worldId, entry] of this.entries) {
      if (now - entry.lastAccessed > this.config.maxIdleTime) {
        await this.runCleanupCallbacks(entry);
        this.entries.delete(worldId);
        cleanedUp.push(worldId);
      }
    }

    if (cleanedUp.length > 0) {
      this.gcCount++;
      this.lastCleanup = Date.now();
    }

    return cleanedUp;
  }

  async destroyWorld(worldId: WorldId): Promise<void> {
    const entry = this.entries.get(worldId);
    if (entry) {
      await this.runCleanupCallbacks(entry);
      this.entries.delete(worldId);
    }
  }

  clear(): void {
    this.entries.clear();
  }

  private async runCleanupCallbacks(entry: WorldMemoryEntry): Promise<void> {
    for (const callback of entry.cleanupCallbacks) {
      try {
        await callback();
      } catch {
        // Cleanup errors should not break the system
      }
    }
  }

  private async checkAndCleanup(): Promise<void> {
    if (this.isCritical()) {
      await this.forceCleanup();
    } else if (this.isWarning()) {
      await this.cleanupIdleWorlds();
    }
  }
}
