/**
 * Navigation Engine Types
 *
 * Type definitions for the Navigation Engine.
 * React Router owns URL state. This engine owns transitions, scroll, and metadata.
 */

import type { ComponentType, ReactNode } from "react";

// ============================================================================
// Route Identity
// ============================================================================

export type RouteId = string;

export type RouteGroup = "main" | "worlds" | "auth" | "admin" | "settings" | "static";

// ============================================================================
// Route Metadata
// ============================================================================

export interface RouteMetadata {
  id: RouteId;
  label: string;
  description?: string;
  group?: RouteGroup;
  icon?: string;
  requiresAuth?: boolean;
  permissions?: string[];
  hidden?: boolean;
  external?: boolean;
  externalUrl?: string;
  seo?: RouteSEO;
  breadcrumb?: BreadcrumbConfig;
  transition?: TransitionType;
  scrollBehavior?: ScrollBehavior;
  preserveScroll?: boolean;
  className?: string;
  locales?: string[];
  featureFlag?: string;
  preload?: RouteId[];
}

export interface RouteSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

// ============================================================================
// Route Definition
// ============================================================================

export interface NavigationRoute {
  metadata: RouteMetadata;
  path: string;
  component: () => Promise<{ default: ComponentType }>;
  children?: NavigationRoute[];
  layout?: ComponentType<{ children: ReactNode }>;
  guards?: NavigationGuard[];
  index?: boolean;
}

// ============================================================================
// Navigation Transitions
// ============================================================================

export type TransitionType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "portal"
  | "crossfade"
  | "none";

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  direction?: "up" | "down" | "left" | "right";
  ease?: string;
}

// ============================================================================
// Scroll Behavior
// ============================================================================

export type ScrollBehavior = "auto" | "smooth" | "instant" | "none";

export interface ScrollRestorationConfig {
  restore: boolean;
  scrollToTop: boolean;
  storageKey: string;
  maxPositions: number;
  restoreDelay: number;
}

// ============================================================================
// Navigation Guards
// ============================================================================

export type GuardResult = boolean | { redirect: string };

export interface NavigationGuard {
  id: string;
  priority?: number;
  guard: (context: GuardContext) => GuardResult | Promise<GuardResult>;
}

export interface GuardContext {
  to: string;
  from: string;
  params: Record<string, string>;
  query: Record<string, string>;
  isAuthenticated: boolean;
  permissions: string[];
}

// ============================================================================
// Breadcrumb
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  path: string;
  current?: boolean;
  icon?: string;
}

export interface BreadcrumbConfig {
  show?: boolean;
  label?: string;
  prepend?: BreadcrumbItem[];
  append?: BreadcrumbItem[];
}

// ============================================================================
// Navigation Store (minimal - only what React Router doesn't own)
// ============================================================================

export interface NavigationEngineState {
  /** Active transition type for the next navigation */
  activeTransition: TransitionType;
  /** Saved scroll positions keyed by path */
  scrollPositions: Record<string, number>;
  /** Whether a page transition animation is playing */
  isTransitioning: boolean;
}

export interface NavigationEngineActions {
  setTransition: (type: TransitionType) => void;
  saveScrollPosition: (path: string, position: number) => void;
  getScrollPosition: (path: string) => number;
  setIsTransitioning: (value: boolean) => void;
}

export interface NavigateOptions {
  transition?: TransitionType;
  replace?: boolean;
  scrollBehavior?: ScrollBehavior;
  state?: Record<string, unknown>;
}

// ============================================================================
// Navigation Context
// ============================================================================

/** Read-only state derived from React Router + engine state */
export interface NavigationState {
  currentPath: string;
  previousPath: string | null;
  isTransitioning: boolean;
  activeTransition: TransitionType;
  direction: "forward" | "backward" | "none";
  breadcrumbs: BreadcrumbItem[];
}

/** Navigation actions - stable references, never cause rerenders */
export interface NavigationActions {
  navigate: (path: string, options?: NavigateOptions) => void;
  goBack: (fallback?: string) => void;
  goForward: () => void;
  replace: (path: string) => void;
  prefetch: (routeId: RouteId) => void;
}

export interface NavigationContextValue extends NavigationState, NavigationActions {}

// ============================================================================
// Navigation Registry
// ============================================================================

export interface NavigationRegistryConfig {
  defaultRoute: RouteId;
  notFoundRoute: RouteId;
  defaultTransition: TransitionType;
  defaultScrollBehavior: ScrollBehavior;
  maxHistoryLength: number;
}

// ============================================================================
// Hook Options
// ============================================================================

export interface UseNavigationRouteOptions {
  routeId?: RouteId;
  prefetch?: boolean;
}

export interface UseNavigationTransitionOptions {
  defaultTransition?: TransitionType;
  respectReducedMotion?: boolean;
}
