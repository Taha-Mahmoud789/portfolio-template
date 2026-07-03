/**
 * World Store
 *
 * Zustand store for global world engine state.
 */

import { create } from "zustand";
import type { WorldId, WorldDefinition, WorldInstanceState, WorldStore } from "./types";

const createInstanceState = (worldId: WorldId): WorldInstanceState => ({
  worldId,
  phase: "unregistered",
  isLoaded: false,
  isMounted: false,
  isActive: false,
  isSuspended: false,
  hasError: false,
  error: null,
  loadedAt: null,
  activatedAt: null,
  suspendedAt: null,
  memoryUsage: 0,
});

export const useWorldStore = create<WorldStore>((set, get) => ({
  currentWorldId: null,
  previousWorldId: null,
  loadingWorldId: null,
  transitioning: false,
  transitionType: "crossfade",
  worldInstances: new Map(),
  registeredWorlds: new Map(),
  readyWorlds: new Set(),
  cachedWorlds: new Set(),
  totalMemoryUsage: 0,
  isInitialized: false,

  initialize: () => set({ isInitialized: true }),

  destroy: () =>
    set({
      currentWorldId: null,
      previousWorldId: null,
      loadingWorldId: null,
      transitioning: false,
      worldInstances: new Map(),
      registeredWorlds: new Map(),
      readyWorlds: new Set(),
      cachedWorlds: new Set(),
      totalMemoryUsage: 0,
      isInitialized: false,
    }),

  register: (definition: WorldDefinition) =>
    set((state) => {
      const registeredWorlds = new Map(state.registeredWorlds);
      registeredWorlds.set(definition.id, definition);

      const worldInstances = new Map(state.worldInstances);
      if (!worldInstances.has(definition.id)) {
        worldInstances.set(definition.id, createInstanceState(definition.id));
      }

      return { registeredWorlds, worldInstances };
    }),

  registerAll: (definitions: WorldDefinition[]) =>
    set((state) => {
      const registeredWorlds = new Map(state.registeredWorlds);
      const worldInstances = new Map(state.worldInstances);

      for (const def of definitions) {
        registeredWorlds.set(def.id, def);
        if (!worldInstances.has(def.id)) {
          worldInstances.set(def.id, createInstanceState(def.id));
        }
      }

      return { registeredWorlds, worldInstances };
    }),

  unregister: (worldId: WorldId) =>
    set((state) => {
      const registeredWorlds = new Map(state.registeredWorlds);
      registeredWorlds.delete(worldId);

      const worldInstances = new Map(state.worldInstances);
      worldInstances.delete(worldId);

      const readyWorlds = new Set(state.readyWorlds);
      readyWorlds.delete(worldId);

      const cachedWorlds = new Set(state.cachedWorlds);
      cachedWorlds.delete(worldId);

      return { registeredWorlds, worldInstances, readyWorlds, cachedWorlds };
    }),

  preload: async () => {
    /* noop - handled by WorldManager */
  },
  preloadAll: async () => {
    /* noop - handled by WorldManager */
  },

  load: (worldId: WorldId) => {
    void worldId;
    // Handled by WorldManager
    return Promise.resolve(null as never);
  },
  unload: async () => {
    /* noop - handled by WorldManager */
  },

  mount: (worldId: WorldId) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId) ?? createInstanceState(worldId);
      worldInstances.set(worldId, { ...instance, isMounted: true, phase: "mounted" });
      return { worldInstances };
    }),

  unmount: (worldId: WorldId) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId);
      if (instance) {
        worldInstances.set(worldId, {
          ...instance,
          isMounted: false,
          isActive: false,
          phase: "inactive",
        });
      }
      return { worldInstances };
    }),

  activate: (worldId: WorldId) => {
    const state = get();
    if (state.transitioning) return Promise.resolve();

    set({ transitioning: true, loadingWorldId: worldId });

    const previousWorldId = state.currentWorldId;

    set((s) => {
      const worldInstances = new Map(s.worldInstances);

      if (previousWorldId) {
        const prev = worldInstances.get(previousWorldId);
        if (prev) {
          worldInstances.set(previousWorldId, {
            ...prev,
            isActive: false,
            isSuspended: true,
            phase: "suspended",
            suspendedAt: Date.now(),
          });
        }
      }

      const current = worldInstances.get(worldId) ?? createInstanceState(worldId);
      worldInstances.set(worldId, {
        ...current,
        isActive: true,
        isMounted: true,
        phase: "active",
        activatedAt: Date.now(),
      });

      return {
        worldInstances,
        currentWorldId: worldId,
        previousWorldId,
        readyWorlds: new Set([...s.readyWorlds, worldId]),
      };
    });

    set({ transitioning: false, loadingWorldId: null });
    return Promise.resolve();
  },

  deactivate: (worldId: WorldId) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId);
      if (instance) {
        worldInstances.set(worldId, {
          ...instance,
          isActive: false,
          phase: "inactive",
        });
      }

      return {
        worldInstances,
        currentWorldId: state.currentWorldId === worldId ? null : state.currentWorldId,
      };
    }),

  suspend: (worldId: WorldId) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId);
      if (instance) {
        worldInstances.set(worldId, {
          ...instance,
          isSuspended: true,
          phase: "suspended",
          suspendedAt: Date.now(),
        });
      }
      return { worldInstances };
    }),

  resume: (worldId: WorldId) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId);
      if (instance) {
        worldInstances.set(worldId, {
          ...instance,
          isSuspended: false,
          phase: "mounted",
        });
      }
      return { worldInstances };
    }),

  transition: async (worldId: WorldId) => {
    await get().activate(worldId);
  },

  cancelTransition: () => set({ transitioning: false, loadingWorldId: null }),

  getWorld: (worldId: WorldId) => get().registeredWorlds.get(worldId),
  getWorlds: () => Array.from(get().registeredWorlds.values()),
  getWorldState: (worldId: WorldId) => get().worldInstances.get(worldId),
  isWorldReady: (worldId: WorldId) => get().readyWorlds.has(worldId),
  isWorldCached: (worldId: WorldId) => get().cachedWorlds.has(worldId),

  setError: (worldId: WorldId, error: Error) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId) ?? createInstanceState(worldId);
      worldInstances.set(worldId, {
        ...instance,
        hasError: true,
        error,
        phase: "error",
      });
      return { worldInstances };
    }),

  clearError: (worldId: WorldId) =>
    set((state) => {
      const worldInstances = new Map(state.worldInstances);
      const instance = worldInstances.get(worldId);
      if (instance) {
        worldInstances.set(worldId, {
          ...instance,
          hasError: false,
          error: null,
          phase: "registered",
        });
      }
      return { worldInstances };
    }),
}));

// Selectors
export const selectCurrentWorldId = (s: WorldStore) => s.currentWorldId;
export const selectPreviousWorldId = (s: WorldStore) => s.previousWorldId;
export const selectLoadingWorldId = (s: WorldStore) => s.loadingWorldId;
export const selectTransitioning = (s: WorldStore) => s.transitioning;
export const selectWorldInstances = (s: WorldStore) => s.worldInstances;
export const selectRegisteredWorlds = (s: WorldStore) => s.registeredWorlds;
export const selectReadyWorlds = (s: WorldStore) => s.readyWorlds;
export const selectCachedWorlds = (s: WorldStore) => s.cachedWorlds;
export const selectWorldInstance = (worldId: WorldId) => (s: WorldStore) =>
  s.worldInstances.get(worldId);
