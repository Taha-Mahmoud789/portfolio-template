/**
 * Scene Context
 *
 * React context for the Scene Architecture.
 * Provides the SceneManager and reactive state to the component tree.
 */

import { createContext, useContext } from "react";
import type { SceneManagerState, PerformanceManagerState } from "./types";
import type { SceneManager } from "./scene-manager";

// ============================================================================
// Context Value
// ============================================================================

export interface SceneContextValue {
  readonly manager: SceneManager;
  readonly state: SceneManagerState;
  readonly performance: PerformanceManagerState;
}

// ============================================================================
// Context
// ============================================================================

export const SceneContext = createContext<SceneContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export function useSceneContext(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error("useSceneContext must be used within a <SceneProvider>");
  }
  return ctx;
}

export function useOptionalSceneContext(): SceneContextValue | null {
  return useContext(SceneContext);
}
