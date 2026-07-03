/**
 * Base World State Store
 *
 * Zustand store for Base World state management.
 * Phase is the single source of truth — all boolean flags derive from it.
 */

import { create } from "zustand";
import type { BaseWorldPhase, BaseWorldStore } from "../types";
import { VALID_BASE_WORLD_TRANSITIONS } from "../constants";

// ============================================================================
// Derive state from phase
// ============================================================================

function deriveFromPhase(phase: BaseWorldPhase) {
  return {
    isMounted: phase !== "idle",
    isReady: phase === "ready" || phase === "active" || phase === "suspended",
    isActive: phase === "active",
    isTransitioning: phase === "transitioning-in" || phase === "transitioning-out",
    hasError: phase === "error",
  };
}

// ============================================================================
// Initial derived state
// ============================================================================

const INITIAL_STATE = {
  phase: "idle" as BaseWorldPhase,
  error: null as Error | null,
  theme: "apple" as const,
  worldId: null,
  ...deriveFromPhase("idle"),
};

// ============================================================================
// Store
// ============================================================================

export const useBaseWorldStore = create<BaseWorldStore>()((set, get) => ({
  ...INITIAL_STATE,

  setPhase: (phase: BaseWorldPhase) => {
    const current = get().phase;
    const allowed = VALID_BASE_WORLD_TRANSITIONS[current];
    if (!allowed.includes(phase)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[BaseWorld] Invalid transition: ${current} → ${phase}`);
      }
      return;
    }
    set({ phase, ...deriveFromPhase(phase) });
  },

  setError: (error: Error | null) =>
    set({
      error,
      ...deriveFromPhase(error !== null ? "error" : get().phase),
      ...(error !== null ? { phase: "error" } : {}),
    }),

  setTheme: (theme) => set({ theme }),
  setWorldId: (worldId) => set({ worldId }),

  reset: () =>
    set({
      ...INITIAL_STATE,
      theme: get().theme,
      worldId: get().worldId,
    }),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectBaseWorldPhase = (s: BaseWorldStore) => s.phase;
export const selectBaseWorldMounted = (s: BaseWorldStore) => s.isMounted;
export const selectBaseWorldReady = (s: BaseWorldStore) => s.isReady;
export const selectBaseWorldActive = (s: BaseWorldStore) => s.isActive;
export const selectBaseWorldTransitioning = (s: BaseWorldStore) => s.isTransitioning;
export const selectBaseWorldError = (s: BaseWorldStore) => s.error;
export const selectBaseWorldTheme = (s: BaseWorldStore) => s.theme;
export const selectBaseWorldId = (s: BaseWorldStore) => s.worldId;
