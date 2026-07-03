/**
 * World Provider
 *
 * Provides world engine state and actions to the component tree.
 * Wires up the Zustand store with React context.
 */

import { useMemo, type ReactNode } from "react";
import {
  useWorldStore,
  selectCurrentWorldId,
  selectPreviousWorldId,
  selectTransitioning,
} from "./store";
import { WorldActionsContext, WorldStateContext } from "./context";
import type { WorldLifecyclePhase, WorldTransitionState } from "./types";

interface WorldProviderProps {
  children: ReactNode;
}

const defaultTransitionState: WorldTransitionState = {
  isTransitioning: false,
  fromWorldId: null,
  toWorldId: null,
  progress: 0,
  currentStage: "",
  type: "crossfade",
};

export function WorldProvider({ children }: WorldProviderProps) {
  const register = useWorldStore((s) => s.register);
  const registerAll = useWorldStore((s) => s.registerAll);
  const unregister = useWorldStore((s) => s.unregister);
  const preload = useWorldStore((s) => s.preload);
  const load = useWorldStore((s) => s.load);
  const unload = useWorldStore((s) => s.unload);
  const activate = useWorldStore((s) => s.activate);
  const deactivate = useWorldStore((s) => s.deactivate);
  const suspend = useWorldStore((s) => s.suspend);
  const resume = useWorldStore((s) => s.resume);
  const transition = useWorldStore((s) => s.transition);
  const cancelTransition = useWorldStore((s) => s.cancelTransition);

  const currentWorldId = useWorldStore(selectCurrentWorldId);
  const previousWorldId = useWorldStore(selectPreviousWorldId);
  const loadingWorldId = useWorldStore((s) => s.loadingWorldId);
  const transitioning = useWorldStore(selectTransitioning);
  const registeredWorlds = useWorldStore((s) => s.registeredWorlds);
  const worldInstances = useWorldStore((s) => s.worldInstances);
  const readyWorlds = useWorldStore((s) => s.readyWorlds);

  const actions = useMemo(
    () => ({
      register,
      registerAll,
      unregister,
      preload,
      load,
      unload,
      activate,
      deactivate,
      suspend,
      resume,
      transition,
      cancelTransition,
    }),
    [
      register,
      registerAll,
      unregister,
      preload,
      load,
      unload,
      activate,
      deactivate,
      suspend,
      resume,
      transition,
      cancelTransition,
    ],
  );

  const currentWorld = currentWorldId ? registeredWorlds.get(currentWorldId) : undefined;
  const currentInstanceState = currentWorldId ? worldInstances.get(currentWorldId) : undefined;
  const currentPhase: WorldLifecyclePhase = currentInstanceState?.phase ?? "unregistered";
  const isCurrentWorldReady = currentWorldId ? readyWorlds.has(currentWorldId) : false;

  const state = useMemo(
    () => ({
      currentWorldId,
      previousWorldId,
      loadingWorldId,
      transitioning,
      currentWorld,
      currentInstanceState,
      currentPhase,
      isCurrentWorldReady,
      transitionState: defaultTransitionState,
    }),
    [
      currentWorldId,
      previousWorldId,
      loadingWorldId,
      transitioning,
      currentWorld,
      currentInstanceState,
      currentPhase,
      isCurrentWorldReady,
    ],
  );

  return (
    <WorldActionsContext.Provider value={actions}>
      <WorldStateContext.Provider value={state}>{children}</WorldStateContext.Provider>
    </WorldActionsContext.Provider>
  );
}
