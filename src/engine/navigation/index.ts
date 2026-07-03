/**
 * Navigation Engine
 *
 * Main entry point. Export all public APIs, types, and utilities.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  RouteId,
  RouteGroup,
  RouteMetadata,
  RouteSEO,
  NavigationRoute,
  TransitionType,
  TransitionConfig,
  ScrollBehavior,
  ScrollRestorationConfig,
  NavigationGuard,
  GuardContext,
  GuardResult,
  BreadcrumbItem,
  BreadcrumbConfig,
  NavigationEngineState,
  NavigationEngineActions,
  NavigateOptions,
  NavigationState,
  NavigationActions,
  NavigationContextValue,
  NavigationRegistryConfig,
  UseNavigationRouteOptions,
  UseNavigationTransitionOptions,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  NAVIGATION_REGISTRY_DEFAULTS,
  NAVIGATION_STORAGE_KEY,
  SCROLL_POSITIONS_KEY,
  SCROLL_RESTORATION_DEFAULTS,
  TRANSITION_DEFAULTS,
  TRANSITION_DURATIONS,
  FOCUS_MANAGEMENT,
  KEYBOARD_NAV,
  PREFETCH,
  ROUTE_SEGMENTS,
  WORLD_ROUTE_PREFIX,
  A11Y,
} from "./constants";

// ============================================================================
// Core
// ============================================================================
export { NavigationRegistry, createNavigationRegistry } from "./registry";

export {
  useNavigationStore,
  selectActiveTransition,
  selectIsTransitioning,
  selectScrollPositions,
} from "./store";

export {
  NavigationActionsContext,
  NavigationStateContext,
  useNavigationActions,
  useNavigationState,
  useNavigationContext,
  useOptionalNavigationContext,
} from "./context";

export { NavigationProvider } from "./provider";

// ============================================================================
// Hooks
// ============================================================================
export {
  useNavigation,
  useNav,
  useCurrentPath,
  usePreviousPath,
  useIsNavigating,
  useNavigationDirection,
  useRoute,
  useAllRoutes,
  useVisibleRoutes,
  useRoutesByGroup,
  useCurrentRoute,
  useNavigateTo,
  useGoBack,
  useGoForward,
  useReplaceRoute,
  useNavigationTransition,
  useBreadcrumbs,
  useBreadcrumbsForPath,
  useScrollActions,
  usePrefetch,
  useNavigationAnnouncer,
  useIsActive,
  useActiveClassName,
} from "./hooks";

// ============================================================================
// Animated Routes
// ============================================================================
export { AnimatedRoutes, AnimatedPage } from "./animated-routes";

// ============================================================================
// Scroll Restoration
// ============================================================================
export {
  scrollPositionManager,
  useScrollRestoration,
  scrollToTop,
  scrollToElement,
} from "./scroll";

// ============================================================================
// Breadcrumbs
// ============================================================================
export { Breadcrumbs, BreadcrumbItemComponent } from "./breadcrumbs";

// ============================================================================
// Accessibility
// ============================================================================
export {
  SkipLink,
  NavigationAnnouncer,
  useFocusTrap,
  useKeyboardNavigation,
  getNavAriaProps,
  getCurrentPageAriaProps,
  getActiveItemAriaProps,
} from "./accessibility";

// ============================================================================
// Route Errors
// ============================================================================
export { RouteErrorBoundary, NotFoundPage, RouteErrorDisplay } from "./route-errors";

// ============================================================================
// Guards
// ============================================================================
export {
  runGuards,
  createAuthGuard,
  createPermissionGuard,
  createFeatureFlagGuard,
  createConfirmationGuard,
  buildGuardContext,
} from "./guards";

// ============================================================================
// Utilities
// ============================================================================
export {
  normalizePath,
  joinPaths,
  getParentPath,
  getLastSegment,
  matchRoutePattern,
  extractParams,
  getTransitionConfig,
  isSlideTransition,
  getSlideDirection,
  generateBreadcrumbs,
  formatSegmentLabel,
  breadcrumbsToString,
  parseQuery,
  buildQuery,
  getHash,
  isExternalUrl,
  isBrowser,
} from "./utilities";
