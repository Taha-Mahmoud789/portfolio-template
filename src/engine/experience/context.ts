/**
 * Experience Context
 *
 * Two contexts: one for stable actions (never rerenders), one for reactive state.
 * Deliberately excludes high-frequency pointer data to prevent rerender cascade.
 * Components needing pointer data should use useExperienceStore selectors directly.
 */

import { createContext, useContext, useMemo } from "react";
import type { ExperienceState, ExperienceActions } from "./types";

// ============================================================================
// Actions Context (stable — never changes)
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

const defaultActions: ExperienceActions = {
  setInteractionState: noop,
  setCursorState: noop,
  setActiveScene: noop,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  on: () => () => {},
  emit: noop,
};

export const ExperienceActionsContext = createContext<ExperienceActions>(defaultActions);

// ============================================================================
// State Context (reactive — changes on interaction/scene changes)
// ============================================================================

const defaultState: ExperienceState = {
  interactionState: "idle",
  cursorState: "default",
  isInitialized: false,
  reducedMotion: false,
  lifecyclePhase: "idle",
  activeSceneId: null,
  isVisible: true,
};

export const ExperienceStateContext = createContext<ExperienceState>(defaultState);

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access experience actions. Stable reference — safe for any component.
 */
export function useExperienceActions(): ExperienceActions {
  return useContext(ExperienceActionsContext);
}

/**
 * Access experience state. Rerenders on state changes.
 * Prefer specific selector hooks over this one.
 */
export function useExperienceState(): ExperienceState {
  return useContext(ExperienceStateContext);
}

/**
 * Access the full experience context (state + actions).
 * Prefer the split hooks for performance.
 */
export function useExperienceContext(): ExperienceState & ExperienceActions {
  const state = useContext(ExperienceStateContext);
  const actions = useContext(ExperienceActionsContext);
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}

/**
 * Optional hook — returns null outside ExperienceProvider.
 */
export function useOptionalExperienceContext(): (ExperienceState & ExperienceActions) | null {
  const state = useContext(ExperienceStateContext);
  const actions = useContext(ExperienceActionsContext);
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}
