/**
 * Navigation Registry
 *
 * Central registry for all navigation routes.
 * Manages route registration, lookup, and lazy loading.
 * Provides a subscription mechanism for React reactivity.
 */

import type {
  NavigationRoute,
  RouteId,
  RouteMetadata,
  NavigationRegistryConfig,
  TransitionType,
} from "./types";
import { NAVIGATION_REGISTRY_DEFAULTS, TRANSITION_DEFAULTS } from "./constants";

// ============================================================================
// Registry
// ============================================================================

class NavigationRegistryImpl {
  private registry = new Map<RouteId, NavigationRoute>();
  private config: NavigationRegistryConfig;
  private routeOrder: RouteId[] = [];
  private listeners = new Set<() => void>();

  constructor(config: Partial<NavigationRegistryConfig> = {}) {
    this.config = { ...NAVIGATION_REGISTRY_DEFAULTS, ...config };
  }

  register(route: NavigationRoute): void {
    const { id } = route.metadata;
    this.registry.set(id, route);
    if (!this.routeOrder.includes(id)) {
      this.routeOrder.push(id);
    }
    this.notify();
  }

  registerAll(routes: NavigationRoute[]): void {
    for (const route of routes) {
      this.register(route);
    }
  }

  get(routeId: RouteId): NavigationRoute | undefined {
    return this.registry.get(routeId);
  }

  getOrThrow(routeId: RouteId): NavigationRoute {
    const route = this.registry.get(routeId);
    if (!route) throw new Error(`Route "${routeId}" not found in navigation registry`);
    return route;
  }

  has(routeId: RouteId): boolean {
    return this.registry.has(routeId);
  }

  getMetadata(routeId: RouteId): RouteMetadata | undefined {
    return this.registry.get(routeId)?.metadata;
  }

  getIds(): RouteId[] {
    return [...this.routeOrder];
  }

  getAll(): NavigationRoute[] {
    return this.routeOrder
      .map((id) => this.registry.get(id))
      .filter((route): route is NavigationRoute => route !== undefined);
  }

  getByGroup(group: string): NavigationRoute[] {
    return this.getAll().filter((route) => route.metadata.group === group);
  }

  getVisible(): NavigationRoute[] {
    return this.getAll().filter((route) => !route.metadata.hidden);
  }

  getDefaultRoute(): NavigationRoute {
    return this.getOrThrow(this.config.defaultRoute);
  }

  getNotFoundRoute(): NavigationRoute {
    return this.getOrThrow(this.config.notFoundRoute);
  }

  getDefaultTransition(): TransitionType {
    return this.config.defaultTransition;
  }

  getTransitionConfig(type: TransitionType) {
    return TRANSITION_DEFAULTS[type];
  }

  getPath(routeId: RouteId): string | undefined {
    return this.registry.get(routeId)?.path;
  }

  /**
   * Find a route that matches a given path.
   * Tries exact match first, then prefix match (longest match wins).
   */
  matchPath(path: string): NavigationRoute | undefined {
    const routes = this.getAll();

    // Exact match first
    const exact = routes.find((route) => route.path === path);
    if (exact) return exact;

    // Prefix match - longest matching path wins
    const candidates = routes
      .filter((route) => !route.index && path.startsWith(route.path) && route.path !== "/")
      .sort((a, b) => b.path.length - a.path.length);

    return candidates[0];
  }

  /**
   * Get breadcrumbs for a given path.
   */
  getBreadcrumbs(path: string): { label: string; path: string; current?: boolean }[] {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs: { label: string; path: string; current?: boolean }[] = [];
    let builtPath = "";

    for (const segment of segments) {
      builtPath += `/${segment}`;
      const route = this.matchPath(builtPath);
      breadcrumbs.push({
        label: route?.metadata.label ?? segment,
        path: builtPath,
      });
    }

    if (breadcrumbs.length > 0) {
      const last = breadcrumbs[breadcrumbs.length - 1];
      if (last) last.current = true;
    }

    return breadcrumbs;
  }

  getOrder(): RouteId[] {
    return [...this.routeOrder];
  }

  updateConfig(config: Partial<NavigationRegistryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Subscribe to registry changes. Returns unsubscribe function.
   * Used by useSyncExternalStore for React reactivity.
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Get snapshot for useSyncExternalStore.
   */
  getSnapshot = (): RouteId[] => {
    return [...this.routeOrder];
  };

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  clear(): void {
    this.registry.clear();
    this.routeOrder = [];
    this.listeners.clear();
  }

  get size(): number {
    return this.registry.size;
  }
}

// Singleton
export const NavigationRegistry = new NavigationRegistryImpl();

export function createNavigationRegistry(
  config?: Partial<NavigationRegistryConfig>,
): NavigationRegistryImpl {
  return new NavigationRegistryImpl(config);
}
