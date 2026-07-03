/**
 * World SDK Hooks
 *
 * React hooks for working with the World SDK.
 * Higher-level abstractions over World Engine hooks.
 */

import { useCallback, useMemo, useEffect, useState } from "react";
import type { WorldId, WorldDefinition, WorldLifecyclePhase } from "@/engine/world/types";
import type { WorldSDKMeta } from "./types";
import { useWorldStore } from "@/engine/world/store";
import { useWorldActions } from "@/engine/world/context";
import { generateWorldSDKMeta } from "./metadata";

// ============================================================================
// useWorldSDK — get SDK-enhanced world info
// ============================================================================

export function useWorldSDK(worldId?: WorldId): {
  world: WorldDefinition | undefined;
  phase: WorldLifecyclePhase;
  meta: WorldSDKMeta | null;
  isActive: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error: Error | null;
} {
  const targetId = useWorldStore((s) => worldId ?? s.currentWorldId);
  const registeredWorlds = useWorldStore((s) => s.registeredWorlds);
  const worldInstances = useWorldStore((s) => s.worldInstances);

  const world = targetId ? registeredWorlds.get(targetId) : undefined;
  const state = targetId ? worldInstances.get(targetId) : undefined;

  const meta = useMemo(() => (world ? generateWorldSDKMeta(world) : null), [world]);

  return useMemo(
    () => ({
      world,
      phase: state?.phase ?? "unregistered",
      meta,
      isActive: state?.isActive ?? false,
      isLoading: state?.phase === "loading" || state?.phase === "preloading",
      isLoaded: state?.isLoaded ?? false,
      hasError: state?.hasError ?? false,
      error: state?.error ?? null,
    }),
    [world, state, meta],
  );
}

// ============================================================================
// useWorldLifecycle — lifecycle management for a specific world
// ============================================================================

export function useWorldLifecycle(worldId: WorldId) {
  const actions = useWorldActions();
  const worldInstances = useWorldStore((s) => s.worldInstances);
  const instance = worldInstances.get(worldId);

  const load = useCallback(async () => {
    await actions.load(worldId);
  }, [actions, worldId]);

  const preload = useCallback(async () => {
    await actions.preload(worldId);
  }, [actions, worldId]);

  const unload = useCallback(async () => {
    await actions.unload(worldId);
  }, [actions, worldId]);

  const activate = useCallback(async () => {
    await actions.activate(worldId);
  }, [actions, worldId]);

  const deactivate = useCallback(() => {
    actions.deactivate(worldId);
  }, [actions, worldId]);

  const suspend = useCallback(() => {
    actions.suspend(worldId);
  }, [actions, worldId]);

  const resume = useCallback(() => {
    actions.resume(worldId);
  }, [actions, worldId]);

  return useMemo(
    () => ({
      load,
      preload,
      unload,
      activate,
      deactivate,
      suspend,
      resume,
      phase: instance?.phase ?? "unregistered",
      isLoaded: instance?.isLoaded ?? false,
      isActive: instance?.isActive ?? false,
      isSuspended: instance?.isSuspended ?? false,
      hasError: instance?.hasError ?? false,
      error: instance?.error ?? null,
    }),
    [load, preload, unload, activate, deactivate, suspend, resume, instance],
  );
}

// ============================================================================
// useWorldAssets — track world asset loading progress
// ============================================================================

export function useWorldAssets(worldId: WorldId): {
  total: number;
  loaded: number;
  failed: number;
  progress: number;
} {
  const [state, setState] = useState({
    total: 0,
    loaded: 0,
    failed: 0,
    progress: 0,
  });

  const worldInstances = useWorldStore((s) => s.worldInstances);
  const instance = worldInstances.get(worldId);

  useEffect(() => {
    if (!instance?.isLoaded) {
      setState({ total: 0, loaded: 0, failed: 0, progress: 0 });
    }
  }, [instance?.isLoaded]);

  return state;
}

// ============================================================================
// useWorldGuard — guard component rendering based on world phase
// ============================================================================

export function useWorldGuard(worldId: WorldId, requiredPhase: WorldLifecyclePhase): boolean {
  const worldInstances = useWorldStore((s) => s.worldInstances);
  const instance = worldInstances.get(worldId);
  return instance?.phase === requiredPhase;
}

// ============================================================================
// useWorldMetadata — get SDK metadata for a world
// ============================================================================

export function useWorldMetadata(worldId: WorldId): WorldSDKMeta | null {
  const registeredWorlds = useWorldStore((s) => s.registeredWorlds);
  const world = registeredWorlds.get(worldId);

  return useMemo(() => (world ? generateWorldSDKMeta(world) : null), [world]);
}
