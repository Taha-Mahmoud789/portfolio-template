/**
 * World Context
 *
 * Split contexts for world engine state and actions.
 * Actions context is stable (never rerenders).
 * State context is reactive (rerenders on world changes).
 */

import { createContext, useContext } from "react";
import type {
  WorldId,
  WorldDefinition,
  WorldInstanceState,
  WorldLifecyclePhase,
  WorldTransitionState,
} from "./types";

// ============================================================================
// Actions Context (stable — never rerenders)
// ============================================================================

export interface WorldActionsContextValue {
  register: (definition: WorldDefinition) => void;
  registerAll: (definitions: WorldDefinition[]) => void;
  unregister: (worldId: WorldId) => void;
  preload: (worldId: WorldId) => Promise<void>;
  load: (worldId: WorldId) => Promise<React.ComponentType>;
  unload: (worldId: WorldId) => Promise<void>;
  activate: (worldId: WorldId) => Promise<void>;
  deactivate: (worldId: WorldId) => void;
  suspend: (worldId: WorldId) => void;
  resume: (worldId: WorldId) => void;
  transition: (worldId: WorldId) => Promise<void>;
  cancelTransition: () => void;
}

export const WorldActionsContext = createContext<WorldActionsContextValue | null>(null);

// ============================================================================
// State Context (reactive — rerenders on world changes)
// ============================================================================

export interface WorldStateContextValue {
  currentWorldId: WorldId | null;
  previousWorldId: WorldId | null;
  loadingWorldId: WorldId | null;
  transitioning: boolean;
  currentWorld: WorldDefinition | undefined;
  currentInstanceState: WorldInstanceState | undefined;
  currentPhase: WorldLifecyclePhase;
  isCurrentWorldReady: boolean;
  transitionState: WorldTransitionState;
}

export const WorldStateContext = createContext<WorldStateContextValue | null>(null);

// ============================================================================
// Hooks
// ============================================================================

export function useWorldActions(): WorldActionsContextValue {
  const context = useContext(WorldActionsContext);
  if (!context) {
    throw new Error("useWorldActions must be used within a WorldProvider");
  }
  return context;
}

export function useWorldState(): WorldStateContextValue {
  const context = useContext(WorldStateContext);
  if (!context) {
    throw new Error("useWorldState must be used within a WorldProvider");
  }
  return context;
}

export function useOptionalWorldActions(): WorldActionsContextValue | null {
  return useContext(WorldActionsContext);
}

export function useOptionalWorldState(): WorldStateContextValue | null {
  return useContext(WorldStateContext);
}
