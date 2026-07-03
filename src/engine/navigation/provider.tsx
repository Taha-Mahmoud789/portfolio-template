/**
 * Navigation Provider
 *
 * Derives all URL state from React Router. No dual source of truth.
 * Provides two contexts: actions (stable) and state (reactive).
 */

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";
import { NavigationActionsContext, NavigationStateContext } from "./context";
import { useNavigationStore, selectActiveTransition, selectIsTransitioning } from "./store";
import { NavigationRegistry } from "./registry";
import type {
  NavigationActions,
  NavigationState,
  NavigationRoute,
  TransitionType,
  NavigateOptions,
  BreadcrumbItem,
} from "./types";
import { NAVIGATION_REGISTRY_DEFAULTS, FOCUS_MANAGEMENT } from "./constants";

// ============================================================================
// Provider Props
// ============================================================================

interface NavigationProviderProps {
  children: ReactNode;
  initialRoutes?: NavigationRoute[];
  defaultTransition?: TransitionType;
}

// ============================================================================
// Provider Component
// ============================================================================

export function NavigationProvider({
  children,
  initialRoutes = [],
  defaultTransition = NAVIGATION_REGISTRY_DEFAULTS.defaultTransition,
}: NavigationProviderProps) {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const navigationType = useNavigationType();
  const isInitialized = useRef(false);
  const previousPathRef = useRef<string | null>(null);

  // Register initial routes once
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    if (initialRoutes.length > 0) {
      NavigationRegistry.registerAll(initialRoutes);
    }
  }, [initialRoutes]);

  // Engine store
  const activeTransition = useNavigationStore(selectActiveTransition);
  const isTransitioning = useNavigationStore(selectIsTransitioning);
  const setTransition = useNavigationStore((s) => s.setTransition);
  const setIsTransitioning = useNavigationStore((s) => s.setIsTransitioning);

  // Derive direction from React Router's navigation type
  const direction: NavigationState["direction"] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (navigationType === "POP") return "backward";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (navigationType === "PUSH" || navigationType === "REPLACE") return "forward";
    return "none";
  }, [navigationType]);

  // Derive previous path
  const previousPath = previousPathRef.current;
  useEffect(() => {
    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  // Derive breadcrumbs from registry
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    return NavigationRegistry.getBreadcrumbs(location.pathname).map((item) => ({
      label: item.label,
      path: item.path,
      current: item.current,
    }));
  }, [location.pathname]);

  // -- Actions (stable references) --

  const navigate = useCallback(
    (path: string, options?: NavigateOptions) => {
      const transition = options?.transition ?? defaultTransition;
      setTransition(transition);
      setIsTransitioning(true);

      if (options?.replace) {
        void routerNavigate(path, { replace: true, state: options.state });
      } else {
        void routerNavigate(path, { state: options?.state });
      }

      // Focus management after navigation
      setTimeout(() => {
        const mainContent = document.querySelector(FOCUS_MANAGEMENT.mainContentSelector);
        if (mainContent) {
          (mainContent as HTMLElement).focus();
        }
      }, FOCUS_MANAGEMENT.focusDelay);

      // End transition after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [defaultTransition, setTransition, setIsTransitioning, routerNavigate],
  );

  const goBack = useCallback(
    (fallback?: string) => {
      if (window.history.length > 1) {
        void routerNavigate(-1);
      } else if (fallback) {
        navigate(fallback);
      }
    },
    [routerNavigate, navigate],
  );

  const goForward = useCallback(() => {
    void routerNavigate(1);
  }, [routerNavigate]);

  const replace = useCallback(
    (path: string) => {
      void routerNavigate(path, { replace: true });
    },
    [routerNavigate],
  );

  const prefetch = useCallback((routeId: string) => {
    const route = NavigationRegistry.get(routeId);
    if (route) {
      void route.component();
    }
  }, []);

  // -- Actions value (stable - useMemo with no deps that change) --

  const actionsValue = useMemo<NavigationActions>(
    () => ({ navigate, goBack, goForward, replace, prefetch }),
    [navigate, goBack, goForward, replace, prefetch],
  );

  // -- State value (reactive - recomputes on navigation) --

  const stateValue = useMemo<NavigationState>(
    () => ({
      currentPath: location.pathname,
      previousPath,
      isTransitioning,
      activeTransition,
      direction,
      breadcrumbs,
    }),
    [location.pathname, previousPath, isTransitioning, activeTransition, direction, breadcrumbs],
  );

  return (
    <NavigationActionsContext.Provider value={actionsValue}>
      <NavigationStateContext.Provider value={stateValue}>
        {children}
      </NavigationStateContext.Provider>
    </NavigationActionsContext.Provider>
  );
}
