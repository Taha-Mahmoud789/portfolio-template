/**
 * Navigation API Hooks
 *
 * React hooks for the Navigation Engine.
 * Uses split contexts: actions (stable) and state (reactive).
 * Avoids rerender cascades by letting consumers select what they need.
 */

import { useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigationStore, selectActiveTransition, selectIsTransitioning } from "./store";
import { useNavigationActions, useNavigationState, useNavigationContext } from "./context";
import { NavigationRegistry } from "./registry";
import type { NavigationRoute, TransitionType, BreadcrumbItem } from "./types";
import { PREFETCH } from "./constants";

// ============================================================================
// Core Hooks
// ============================================================================

/**
 * Full navigation context (state + actions).
 * Prefer specific hooks for performance.
 */
export function useNavigation() {
  return useNavigationContext();
}

/**
 * Navigation actions only. Stable reference - never causes rerenders.
 */
export function useNav() {
  return useNavigationActions();
}

/**
 * Current path. Rerenders on navigation.
 */
export function useCurrentPath(): string {
  return useNavigationState().currentPath;
}

/**
 * Previous path. Rerenders on navigation.
 */
export function usePreviousPath(): string | null {
  return useNavigationState().previousPath;
}

/**
 * Whether a transition animation is playing.
 */
export function useIsNavigating(): boolean {
  return useNavigationStore(selectIsTransitioning);
}

/**
 * Navigation direction derived from React Router's navigation type.
 */
export function useNavigationDirection(): "forward" | "backward" | "none" {
  return useNavigationState().direction;
}

// ============================================================================
// Route Hooks
// ============================================================================

/**
 * Get a route by ID from the registry.
 */
export function useRoute(routeId: string): NavigationRoute | undefined {
  return useMemo(() => NavigationRegistry.get(routeId), [routeId]);
}

/**
 * Get all registered routes.
 */
export function useAllRoutes(): NavigationRoute[] {
  return useMemo(() => NavigationRegistry.getAll(), []);
}

/**
 * Get visible (non-hidden) routes.
 */
export function useVisibleRoutes(): NavigationRoute[] {
  return useMemo(() => NavigationRegistry.getVisible(), []);
}

/**
 * Get routes by group.
 */
export function useRoutesByGroup(group: string): NavigationRoute[] {
  return useMemo(() => NavigationRegistry.getByGroup(group), [group]);
}

/**
 * Get the current route metadata from registry.
 */
export function useCurrentRoute(): NavigationRoute | undefined {
  const currentPath = useCurrentPath();
  return useMemo(() => NavigationRegistry.matchPath(currentPath), [currentPath]);
}

// ============================================================================
// Navigation Action Hooks (stable)
// ============================================================================

/**
 * Navigate to a path with optional transition.
 */
export function useNavigateTo() {
  const { navigate } = useNavigationActions();
  return useCallback(
    (path: string, options?: { transition?: TransitionType; replace?: boolean }) => {
      navigate(path, { transition: options?.transition, replace: options?.replace });
    },
    [navigate],
  );
}

/**
 * Go back in history.
 */
export function useGoBack() {
  const { goBack } = useNavigationActions();
  return useCallback(
    (fallback?: string) => {
      goBack(fallback);
    },
    [goBack],
  );
}

/**
 * Go forward in history.
 */
export function useGoForward() {
  const { goForward } = useNavigationActions();
  return useCallback(() => {
    goForward();
  }, [goForward]);
}

/**
 * Replace the current route.
 */
export function useReplaceRoute() {
  const { replace } = useNavigationActions();
  return useCallback(
    (path: string) => {
      replace(path);
    },
    [replace],
  );
}

// ============================================================================
// Transition Hooks
// ============================================================================

/**
 * Control page transition type.
 */
export function useNavigationTransition() {
  const setTransition = useNavigationStore((s) => s.setTransition);
  const activeTransition = useNavigationStore(selectActiveTransition);
  return useMemo(
    () => ({ currentTransition: activeTransition, setTransition }),
    [activeTransition, setTransition],
  );
}

// ============================================================================
// Breadcrumb Hooks
// ============================================================================

/**
 * Get breadcrumbs for the current route.
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  return useNavigationState().breadcrumbs;
}

/**
 * Get breadcrumbs for a specific path.
 */
export function useBreadcrumbsForPath(path: string): BreadcrumbItem[] {
  return useMemo(() => {
    return NavigationRegistry.getBreadcrumbs(path).map((item) => ({
      label: item.label,
      path: item.path,
      current: item.current,
    }));
  }, [path]);
}

// ============================================================================
// Scroll Hooks
// ============================================================================

/**
 * Manage scroll position for the current route.
 */
export function useScrollActions() {
  const currentPath = useCurrentPath();
  const saveScrollPosition = useNavigationStore((s) => s.saveScrollPosition);
  const getScrollPosition = useNavigationStore((s) => s.getScrollPosition);

  const save = useCallback(
    (position: number) => {
      saveScrollPosition(currentPath, position);
    },
    [currentPath, saveScrollPosition],
  );

  const restore = useCallback(() => {
    return getScrollPosition(currentPath);
  }, [currentPath, getScrollPosition]);

  return useMemo(() => ({ save, restore }), [save, restore]);
}

// ============================================================================
// Prefetch Hooks
// ============================================================================

/**
 * Prefetch a route on hover/focus with debounce.
 * Returns event handlers to spread on the triggering element.
 */
export function usePrefetch(routeId: string) {
  const { prefetch } = useNavigationActions();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPrefetch = useCallback(() => {
    if (!PREFETCH.enabled) return;
    timeoutRef.current = setTimeout(() => {
      prefetch(routeId);
    }, PREFETCH.hoverDelay);
  }, [routeId, prefetch]);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useMemo(
    () => ({
      onMouseEnter: startPrefetch,
      onMouseLeave: cancelPrefetch,
      onFocus: startPrefetch,
      onBlur: cancelPrefetch,
    }),
    [startPrefetch, cancelPrefetch],
  );
}

// ============================================================================
// Accessibility Hooks
// ============================================================================

/**
 * Announce route changes to screen readers.
 * Creates a single live region on mount.
 */
export function useNavigationAnnouncer() {
  const currentPath = useCurrentPath();
  const isTransitioning = useIsNavigating();
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let el = document.getElementById("navigation-announcer");
    if (!el) {
      el = document.createElement("div");
      el.id = "navigation-announcer";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      el.className = "sr-only";
      document.body.appendChild(el);
    }
    announcerRef.current = el as HTMLDivElement;

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isTransitioning && announcerRef.current) {
      const route = NavigationRegistry.matchPath(currentPath);
      const title = route?.metadata.label ?? document.title;
      announcerRef.current.textContent = `Navigated to ${title}`;
    }
  }, [currentPath, isTransitioning]);
}

// ============================================================================
// Active Link Hooks
// ============================================================================

/**
 * Check if a path matches the current route.
 */
export function useIsActive(path: string, exact = false): boolean {
  const currentPath = useCurrentPath();
  return useMemo(() => {
    if (exact) return currentPath === path;
    return currentPath === path || currentPath.startsWith(`${path}/`);
  }, [currentPath, path, exact]);
}

/**
 * Get the active class name for a navigation link.
 */
export function useActiveClassName(
  path: string,
  activeClassName = "active",
  exact = false,
): string {
  const isActive = useIsActive(path, exact);
  return isActive ? activeClassName : "";
}
