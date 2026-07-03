/**
 * Navigation Engine Constants
 *
 * Default values, configuration, and magic numbers for the Navigation Engine.
 */

import type {
  NavigationRegistryConfig,
  TransitionType,
  ScrollRestorationConfig,
  TransitionConfig,
} from "./types";

// ============================================================================
// Registry Defaults
// ============================================================================

export const NAVIGATION_REGISTRY_DEFAULTS: NavigationRegistryConfig = {
  defaultRoute: "home",
  notFoundRoute: "not-found",
  defaultTransition: "fade",
  defaultScrollBehavior: "instant",
  maxHistoryLength: 50,
};

// ============================================================================
// Storage Keys
// ============================================================================

export const NAVIGATION_STORAGE_KEY = "fm-navigation";
export const SCROLL_POSITIONS_KEY = "fm-scroll-positions";

// ============================================================================
// Scroll Restoration Defaults
// ============================================================================

export const SCROLL_RESTORATION_DEFAULTS: ScrollRestorationConfig = {
  restore: true,
  scrollToTop: true,
  storageKey: SCROLL_POSITIONS_KEY,
  maxPositions: 30,
  restoreDelay: 50,
};

// ============================================================================
// Transition Defaults
// ============================================================================

export const TRANSITION_DEFAULTS: Record<TransitionType, TransitionConfig> = {
  fade: { type: "fade", duration: 0.3, ease: "easeOut" },
  "slide-up": { type: "slide-up", duration: 0.35, direction: "up", ease: "easeOut" },
  "slide-down": { type: "slide-down", duration: 0.35, direction: "down", ease: "easeOut" },
  "slide-left": { type: "slide-left", duration: 0.35, direction: "left", ease: "easeOut" },
  "slide-right": { type: "slide-right", duration: 0.35, direction: "right", ease: "easeOut" },
  zoom: { type: "zoom", duration: 0.3, ease: "easeOut" },
  portal: { type: "portal", duration: 0.4, ease: "easeOut" },
  crossfade: { type: "crossfade", duration: 0.4, ease: "easeInOut" },
  none: { type: "none", duration: 0, ease: "linear" },
};

export const TRANSITION_DURATIONS = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// ============================================================================
// Focus Management
// ============================================================================

export const FOCUS_MANAGEMENT = {
  focusDelay: 100,
  mainContentSelector: "#main-content",
  skipLinkSelector: "#skip-link",
} as const;

// ============================================================================
// Keyboard Navigation
// ============================================================================

export const KEYBOARD_NAV = {
  backKey: "Alt+ArrowLeft",
  forwardKey: "Alt+ArrowRight",
  skipLinkKey: "Alt+s",
} as const;

// ============================================================================
// Performance
// ============================================================================

export const PREFETCH = {
  hoverDelay: 200,
  enabled: true,
  maxConcurrent: 3,
} as const;

// ============================================================================
// Route Patterns
// ============================================================================

export const ROUTE_SEGMENTS = {
  DYNAMIC: ":",
  CATCH_ALL: "*",
  INDEX: "",
} as const;

export const WORLD_ROUTE_PREFIX = "/worlds";

// ============================================================================
// Accessibility
// ============================================================================

export const A11Y = {
  NAV_ROLE: "navigation",
  MAIN_NAV_LABEL: "Main navigation",
  BREADCRUMB_NAV_LABEL: "Breadcrumb",
  LIVE_REGION_ID: "navigation-announcer",
  ANNOUNCE_TEMPLATE: "Navigated to {title}",
} as const;
