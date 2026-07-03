/**
 * Navigation Context
 *
 * Two contexts: one for stable actions (never rerenders), one for reactive state.
 * This prevents the rerender cascade where every navigation rerenders every consumer.
 */

import { createContext, useContext } from "react";
import type { NavigationState, NavigationActions } from "./types";

// ============================================================================
// Actions Context (stable - never changes)
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

const defaultActions: NavigationActions = {
  navigate: noop,
  goBack: noop,
  goForward: noop,
  replace: noop,
  prefetch: noop,
};

export const NavigationActionsContext = createContext<NavigationActions>(defaultActions);

// ============================================================================
// State Context (reactive - changes on navigation)
// ============================================================================

const defaultState: NavigationState = {
  currentPath: "/",
  previousPath: null,
  isTransitioning: false,
  activeTransition: "fade",
  direction: "none",
  breadcrumbs: [],
};

export const NavigationStateContext = createContext<NavigationState>(defaultState);

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access navigation actions. Stable reference - safe for any component.
 */
export function useNavigationActions(): NavigationActions {
  return useContext(NavigationActionsContext);
}

/**
 * Access navigation state. Rerenders on route change.
 * Prefer specific selector hooks over this one.
 */
export function useNavigationState(): NavigationState {
  return useContext(NavigationStateContext);
}

/**
 * Access the full navigation context (state + actions).
 * Prefer the split hooks for performance.
 */
export function useNavigationContext(): NavigationState & NavigationActions {
  return { ...useContext(NavigationStateContext), ...useContext(NavigationActionsContext) };
}

/**
 * Optional hook - returns null outside NavigationProvider.
 */
export function useOptionalNavigationContext(): (NavigationState & NavigationActions) | null {
  const state = useContext(NavigationStateContext);
  const actions = useContext(NavigationActionsContext);
  return { ...state, ...actions };
}
