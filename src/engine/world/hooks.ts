/**
 * World Hooks
 *
 * Public React hooks for consuming the World Engine.
 */

import { useCallback, useMemo, useState } from "react";
import { useWorldStore, selectCurrentWorldId, selectTransitioning } from "./store";
import {
  useWorldActions,
  useWorldState,
  useOptionalWorldActions,
  useOptionalWorldState,
} from "./context";
import type {
  WorldId,
  WorldLifecyclePhase,
  WorldEventType,
  WorldEventCallback,
  WorldEventUnsubscribe,
  UseWorldReturn,
  UseWorldLoaderReturn,
  UseWorldTransitionReturn,
} from "./types";

// ============================================================================
// useWorld — get current world and its state
// ============================================================================

export function useWorld(worldId?: WorldId): UseWorldReturn {
  const selectTargetId = useCallback(
    (s: ReturnType<typeof useWorldStore.getState>) => worldId ?? s.currentWorldId,
    [worldId],
  );
  const targetId = useWorldStore(selectTargetId);
  const registeredWorlds = useWorldStore((s) => s.registeredWorlds);
  const worldInstances = useWorldStore((s) => s.worldInstances);

  const world = targetId ? registeredWorlds.get(targetId) : undefined;
  const state = targetId ? worldInstances.get(targetId) : undefined;

  return useMemo(
    () => ({
      world,
      state,
      isLoading: state?.phase === "loading" || state?.phase === "preloading",
      isLoaded: state?.isLoaded ?? false,
      isActive: state?.isActive ?? false,
      isSuspended: state?.isSuspended ?? false,
      hasError: state?.hasError ?? false,
      error: state?.error ?? null,
    }),
    [world, state],
  );
}

// ============================================================================
// useCurrentWorld — shorthand for the active world
// ============================================================================

export function useCurrentWorld(): UseWorldReturn {
  return useWorld();
}

// ============================================================================
// useWorldLoader — load, preload, unload a world
// ============================================================================

export function useWorldLoader(worldId: WorldId): UseWorldLoaderReturn {
  const actions = useWorldActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const worldInstances = useWorldStore((s) => s.worldInstances);
  const instance = worldInstances.get(worldId);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const component = await actions.load(worldId);
      return component;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [actions, worldId]);

  const preload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await actions.preload(worldId);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [actions, worldId]);

  const unload = useCallback(async () => {
    await actions.unload(worldId);
  }, [actions, worldId]);

  return useMemo(
    () => ({
      load,
      preload,
      unload,
      isLoaded: instance?.isLoaded ?? false,
      isLoading,
      error,
    }),
    [load, preload, unload, instance?.isLoaded, isLoading, error],
  );
}

// ============================================================================
// useWorldTransition — transition between worlds
// ============================================================================

export function useWorldTransition(): UseWorldTransitionReturn {
  const actions = useWorldActions();
  const transitioning = useWorldStore(selectTransitioning);
  const currentWorldId = useWorldStore(selectCurrentWorldId);

  const transition = useCallback(
    async (worldId: WorldId) => {
      await actions.transition(worldId);
    },
    [actions],
  );

  const cancel = useCallback(() => {
    actions.cancelTransition();
  }, [actions]);

  return useMemo(
    () => ({
      transition,
      cancel,
      isTransitioning: transitioning,
      progress: transitioning ? 0.5 : 0,
      fromWorldId: currentWorldId,
      toWorldId: null,
    }),
    [transition, cancel, transitioning, currentWorldId],
  );
}

// ============================================================================
// useWorldEvents — subscribe to world events
// ============================================================================

export function useWorldEvents() {
  const subscribe = useCallback(
    (_type: WorldEventType, _callback: WorldEventCallback): WorldEventUnsubscribe => {
      // Events will be wired up when WorldManager is integrated
      return () => {
        // Cleanup handler
      };
    },
    [],
  );

  return useMemo(
    () => ({
      subscribe,
      on: subscribe,
    }),
    [subscribe],
  );
}

// ============================================================================
// useWorldPhase — get the lifecycle phase of a world
// ============================================================================

export function useWorldPhase(worldId: WorldId): WorldLifecyclePhase {
  const worldInstances = useWorldStore((s) => s.worldInstances);
  const instance = worldInstances.get(worldId);
  return instance?.phase ?? "unregistered";
}

// ============================================================================
// useIsWorldReady — check if a world is ready
// ============================================================================

export function useIsWorldReady(worldId: WorldId): boolean {
  return useWorldStore((s) => s.readyWorlds.has(worldId));
}

// ============================================================================
// useIsWorldCached — check if a world is cached
// ============================================================================

export function useIsWorldCached(worldId: WorldId): boolean {
  return useWorldStore((s) => s.cachedWorlds.has(worldId));
}

// ============================================================================
// useWorldSwitcher — open/close world switcher
// ============================================================================

export function useWorldSwitcher() {
  const actions = useWorldActions();
  const currentWorldId = useWorldStore(selectCurrentWorldId);
  const transitioning = useWorldStore(selectTransitioning);

  const switchToWorld = useCallback(
    async (worldId: WorldId) => {
      if (transitioning) return;
      await actions.transition(worldId);
    },
    [actions, transitioning],
  );

  return useMemo(
    () => ({
      currentWorldId,
      switchToWorld,
      isTransitioning: transitioning,
    }),
    [currentWorldId, switchToWorld, transitioning],
  );
}

// ============================================================================
// Re-export context hooks
// ============================================================================

export { useWorldActions, useWorldState, useOptionalWorldActions, useOptionalWorldState };
