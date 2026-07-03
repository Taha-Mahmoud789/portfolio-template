/**
 * World Loader
 *
 * Handles lazy loading of world components via React.lazy and dynamic imports.
 * Supports retry, timeout, and fallback components.
 */

import { lazy, type ComponentType } from "react";
import type { WorldId, WorldLoaderConfig, WorldLoaderResult, WorldModuleLoader } from "./types";
import { WORLD_LOADER_DEFAULTS } from "./constants";

const loadedModules = new Map<WorldId, { component: ComponentType; module: unknown }>();

export class WorldLoader {
  private config: WorldLoaderConfig;
  private loading = new Map<WorldId, Promise<WorldLoaderResult>>();

  constructor(config?: Partial<WorldLoaderConfig>) {
    this.config = { ...WORLD_LOADER_DEFAULTS, ...config };
  }

  async load(worldId: WorldId, loader: WorldModuleLoader): Promise<WorldLoaderResult> {
    const cached = loadedModules.get(worldId);
    if (cached) {
      return {
        component: cached.component,
        module: cached.module,
        loadTime: 0,
      };
    }

    const existing = this.loading.get(worldId);
    if (existing) {
      return existing;
    }

    const promise = this.loadWithRetry(worldId, loader);
    this.loading.set(worldId, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.loading.delete(worldId);
    }
  }

  preload(worldId: WorldId, loader: WorldModuleLoader): Promise<WorldLoaderResult> {
    return this.load(worldId, loader);
  }

  createLazyLoader(loader: WorldModuleLoader): React.LazyExoticComponent<ComponentType> {
    return lazy(async () => {
      const result = await loader();
      return { default: result.default };
    });
  }

  isLoaded(worldId: WorldId): boolean {
    return loadedModules.has(worldId);
  }

  isLoading(worldId: WorldId): boolean {
    return this.loading.has(worldId);
  }

  invalidate(worldId: WorldId): void {
    loadedModules.delete(worldId);
  }

  clear(): void {
    loadedModules.clear();
    this.loading.clear();
  }

  private async loadWithRetry(
    worldId: WorldId,
    loader: WorldModuleLoader,
  ): Promise<WorldLoaderResult> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.retryCount; attempt++) {
      try {
        const result = await this.loadWithTimeout(worldId, loader);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.config.retryCount) {
          await this.delay(this.config.retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError ?? new Error(`Failed to load world "${worldId}"`);
  }

  private async loadWithTimeout(
    worldId: WorldId,
    loader: WorldModuleLoader,
  ): Promise<WorldLoaderResult> {
    const startTime = performance.now();

    const result = await Promise.race([loader(), this.createTimeout(this.config.timeout, worldId)]);

    const loadTime = performance.now() - startTime;
    const module = result as { default: ComponentType };

    const entry = { component: module.default, module };
    loadedModules.set(worldId, entry);

    return {
      component: module.default,
      module,
      loadTime,
    };
  }

  private createTimeout(ms: number, worldId: WorldId): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Load timeout for world "${worldId}" after ${String(ms)}ms`));
      }, ms);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
