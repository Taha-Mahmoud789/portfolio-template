/**
 * World Manager
 *
 * Orchestrator that coordinates all World Engine subsystems:
 * registry, loader, cache, lifecycle, events, memory, transitions, and assets.
 */

import type { ComponentType } from "react";
import type {
  WorldDefinition,
  WorldId,
  WorldManagerConfig,
  WorldModuleLoader,
  WorldAssets,
} from "./types";
import { WORLD_MANAGER_DEFAULTS } from "./constants";
import { WorldRegistry } from "./registry";
import { WorldEventBus } from "./events";
import { WorldCache } from "./cache";
import { WorldLoader } from "./loader";
import { WorldLifecycle } from "./lifecycle";
import { WorldTransitionManager } from "./transitions";
import { WorldMemoryManager } from "./memory";
import { WorldAssetManager } from "./assets";
import { useWorldStore } from "./store";

export class WorldManager {
  readonly registry: WorldRegistry;
  readonly events: WorldEventBus;
  readonly cache: WorldCache;
  readonly loader: WorldLoader;
  readonly lifecycle: WorldLifecycle;
  readonly transitions: WorldTransitionManager;
  readonly memory: WorldMemoryManager;
  readonly assets: WorldAssetManager;
  private config: WorldManagerConfig;
  private moduleLoaders = new Map<WorldId, WorldModuleLoader>();
  private worldAssets = new Map<WorldId, WorldAssets>();
  private isInitialized = false;

  constructor(config?: Partial<WorldManagerConfig>) {
    this.config = { ...WORLD_MANAGER_DEFAULTS, ...config };
    this.registry = new WorldRegistry(this.config.registry);
    this.events = new WorldEventBus();
    this.cache = new WorldCache(this.config.cache);
    this.loader = new WorldLoader(this.config.loader);
    this.lifecycle = new WorldLifecycle();
    this.transitions = new WorldTransitionManager();
    this.memory = new WorldMemoryManager(this.config.memory);
    this.assets = new WorldAssetManager(this.config.assetManager);
  }

  initialize(): void {
    if (this.isInitialized) return;

    this.memory.start();
    this.isInitialized = true;

    if (this.config.debug) {
      this.events.on("world:error", (event) => {
        console.error(`[WorldEngine] Error in world "${event.worldId}":`, event.error);
      });
    }
  }

  destroy(): void {
    this.memory.stop();
    this.events.removeAllListeners();
    this.cache.clear();
    this.loader.clear();
    this.lifecycle.clear();
    this.assets.disposeAll();
    this.isInitialized = false;
  }

  register(definition: WorldDefinition, loader?: WorldModuleLoader, assets?: WorldAssets): void {
    this.registry.register(definition);
    this.lifecycle.setPhase(definition.id, "registered");

    if (loader) {
      this.moduleLoaders.set(definition.id, loader);
    }
    if (assets) {
      this.worldAssets.set(definition.id, assets);
    }

    const store = useWorldStore.getState();
    store.register(definition);

    this.events.emit("world:registered", definition.id);
  }

  registerAll(
    definitions: WorldDefinition[],
    loaders?: Map<WorldId, WorldModuleLoader>,
    assets?: Map<WorldId, WorldAssets>,
  ): void {
    for (const def of definitions) {
      this.register(def, loaders?.get(def.id), assets?.get(def.id));
    }
  }

  unregister(worldId: WorldId): void {
    this.registry.remove(worldId);
    this.lifecycle.remove(worldId);
    this.cache.delete(worldId);
    this.moduleLoaders.delete(worldId);
    this.worldAssets.delete(worldId);
    this.memory.unregister(worldId);

    const store = useWorldStore.getState();
    store.unregister(worldId);

    this.events.emit("world:unregistered", worldId);
  }

  async preload(worldId: WorldId): Promise<void> {
    const definition = this.registry.get(worldId);
    if (!definition) throw new Error(`World "${worldId}" not registered`);

    const loader = this.moduleLoaders.get(worldId);
    if (!loader) throw new Error(`No loader for world "${worldId}"`);

    this.lifecycle.transition(worldId, "preloading");
    this.events.emit("world:preloading", worldId);

    try {
      await this.loader.preload(worldId, loader);
      this.lifecycle.transition(worldId, "preloaded");
      this.events.emit("world:preloaded", worldId);
    } catch (error) {
      this.lifecycle.transition(worldId, "error");
      this.events.emit("world:error", worldId, undefined, error as Error);
      throw error;
    }
  }

  async load(worldId: WorldId): Promise<ComponentType> {
    const cached = this.cache.get(worldId);
    if (cached) {
      return cached.component;
    }

    const loader = this.moduleLoaders.get(worldId);
    if (!loader) throw new Error(`No loader for world "${worldId}"`);

    this.lifecycle.transition(worldId, "loading");
    this.events.emit("world:loading", worldId);

    try {
      const result = await this.loader.load(worldId, loader);
      this.cache.set(worldId, result.component, result.module);
      this.lifecycle.transition(worldId, "loaded");
      this.events.emit("world:loaded", worldId);

      const store = useWorldStore.getState();
      store.mount(worldId);

      return result.component;
    } catch (error) {
      this.lifecycle.transition(worldId, "error");
      this.events.emit("world:error", worldId, undefined, error as Error);
      throw error;
    }
  }

  unload(worldId: WorldId): void {
    this.lifecycle.transition(worldId, "unloading");
    this.events.emit("world:unloading", worldId);

    this.cache.delete(worldId);
    this.loader.invalidate(worldId);
    this.memory.unregister(worldId);

    const store = useWorldStore.getState();
    store.unmount(worldId);

    this.lifecycle.transition(worldId, "unloaded");
    this.events.emit("world:unloaded", worldId);
  }

  async activate(worldId: WorldId): Promise<void> {
    const currentId = useWorldStore.getState().currentWorldId;

    if (currentId === worldId) return;

    const fromWorldId = currentId;

    this.lifecycle.transition(worldId, "activating");
    this.events.emit("world:activating", worldId);

    try {
      await this.transitions.transition(
        fromWorldId,
        worldId,
        undefined,
        () => {
          if (fromWorldId) {
            this.lifecycle.transition(fromWorldId, "suspending");
            this.events.emit("world:suspending", fromWorldId);
          }
        },
        async () => {
          const store = useWorldStore.getState();
          await store.activate(worldId);
        },
      );

      this.lifecycle.transition(worldId, "active");
      this.events.emit("world:active", worldId);

      if (fromWorldId) {
        this.lifecycle.transition(fromWorldId, "suspended");
        this.events.emit("world:suspended", fromWorldId);
      }
    } catch (error) {
      this.lifecycle.transition(worldId, "error");
      this.events.emit("world:error", worldId, undefined, error as Error);
      throw error;
    }
  }

  deactivate(worldId: WorldId): void {
    this.lifecycle.transition(worldId, "deactivating");
    this.events.emit("world:deactivating", worldId);

    const store = useWorldStore.getState();
    store.deactivate(worldId);

    this.lifecycle.transition(worldId, "inactive");
    this.events.emit("world:inactive", worldId);
  }

  suspend(worldId: WorldId): void {
    this.lifecycle.transition(worldId, "suspending");
    this.events.emit("world:suspending", worldId);

    const store = useWorldStore.getState();
    store.suspend(worldId);

    this.lifecycle.transition(worldId, "suspended");
    this.events.emit("world:suspended", worldId);
  }

  resume(worldId: WorldId): void {
    this.lifecycle.transition(worldId, "resuming");
    this.events.emit("world:resuming", worldId);

    const store = useWorldStore.getState();
    store.resume(worldId);

    this.lifecycle.transition(worldId, "active");
    this.events.emit("world:active", worldId);
  }

  async destroyWorld(worldId: WorldId): Promise<void> {
    this.lifecycle.transition(worldId, "destroying");
    this.events.emit("world:destroying", worldId);

    await this.memory.destroyWorld(worldId);
    this.cache.delete(worldId);
    this.loader.invalidate(worldId);
    this.assets.dispose(worldId);

    const store = useWorldStore.getState();
    store.unregister(worldId);

    this.lifecycle.transition(worldId, "destroyed");
    this.events.emit("world:destroyed", worldId);
  }

  getWorld(worldId: WorldId): WorldDefinition | undefined {
    return this.registry.get(worldId);
  }

  getWorlds(): WorldDefinition[] {
    return this.registry.getAll();
  }

  getPhase(worldId: WorldId) {
    return this.lifecycle.getPhase(worldId);
  }

  isReady(worldId: WorldId): boolean {
    return useWorldStore.getState().isWorldReady(worldId);
  }
}
