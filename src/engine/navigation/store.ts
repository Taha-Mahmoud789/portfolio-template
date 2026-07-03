/**
 * Navigation Engine Store
 *
 * Zustand store for engine-level state only.
 * React Router owns URL state (currentPath, history, direction).
 * This store owns: transition config, scroll positions, transition flag.
 */

import { create } from "zustand";
import type { NavigationEngineState, NavigationEngineActions, TransitionType } from "./types";

// ============================================================================
// Store
// ============================================================================

interface NavigationEngineStore extends NavigationEngineState, NavigationEngineActions {}

export const useNavigationStore = create<NavigationEngineStore>()((set, get) => ({
  activeTransition: "fade",
  scrollPositions: {},
  isTransitioning: false,

  setTransition: (type: TransitionType) => set({ activeTransition: type }),

  setIsTransitioning: (value: boolean) => set({ isTransitioning: value }),

  saveScrollPosition: (path: string, position: number) => {
    const state = get();
    set({
      scrollPositions: {
        ...state.scrollPositions,
        [path]: position,
      },
    });
  },

  getScrollPosition: (path: string) => {
    return get().scrollPositions[path] ?? 0;
  },
}));

// ============================================================================
// Selectors (stable references for Zustand)
// ============================================================================

export const selectActiveTransition = (state: NavigationEngineStore) => state.activeTransition;

export const selectIsTransitioning = (state: NavigationEngineStore) => state.isTransitioning;

export const selectScrollPositions = (state: NavigationEngineStore) => state.scrollPositions;
