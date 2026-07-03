/**
 * Navigation Utilities
 *
 * Pure utility functions for navigation operations.
 * No React dependencies - can be used anywhere.
 */

import type { TransitionType, TransitionConfig, BreadcrumbItem, RouteMetadata } from "./types";
import { TRANSITION_DEFAULTS } from "./constants";

// ============================================================================
// Path Utilities
// ============================================================================

/**
 * Normalize a path by removing trailing slashes and ensuring leading slash.
 */
export function normalizePath(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

/**
 * Join path segments, handling slashes properly.
 */
export function joinPaths(...segments: string[]): string {
  return segments
    .map((segment, i) => {
      if (i === 0) return segment.replace(/\/+$/, "");
      if (i === segments.length - 1) return segment.replace(/^\/+/, "");
      return segment.replace(/^\/+|\/+$/g, "");
    })
    .filter(Boolean)
    .join("/");
}

/**
 * Get the parent path of a given path.
 */
export function getParentPath(path: string): string | null {
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash <= 0) return null;
  return normalized.slice(0, lastSlash) || "/";
}

/**
 * Get the last segment of a path.
 */
export function getLastSegment(path: string): string {
  const segments = path.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

/**
 * Check if a path matches a pattern (supports :param and *).
 */
export function matchRoutePattern(pattern: string, path: string): boolean {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, i) => {
    if (part.startsWith(":")) return true;
    if (part === "*") return true;
    return part === pathParts[i];
  });
}

/**
 * Extract params from a path given a pattern.
 */
export function extractParams(pattern: string, path: string): Record<string, string> {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  patternParts.forEach((part, i) => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      const paramValue = pathParts[i];
      if (paramName && paramValue) {
        params[paramName] = paramValue;
      }
    }
  });

  return params;
}

// ============================================================================
// Transition Utilities
// ============================================================================

/**
 * Get the transition configuration for a given type.
 */
export function getTransitionConfig(type: TransitionType): TransitionConfig {
  return TRANSITION_DEFAULTS[type];
}

/**
 * Check if a transition type is a slide variant.
 */
export function isSlideTransition(type: TransitionType): boolean {
  return type.startsWith("slide");
}

/**
 * Get the direction from a slide transition type.
 */
export function getSlideDirection(
  type: TransitionType,
): "up" | "down" | "left" | "right" | undefined {
  if (type === "slide-up") return "up";
  if (type === "slide-down") return "down";
  if (type === "slide-left") return "left";
  if (type === "slide-right") return "right";
  return undefined;
}

// ============================================================================
// Breadcrumb Utilities
// ============================================================================

/**
 * Generate breadcrumbs from a path using route metadata.
 */
export function generateBreadcrumbs(
  path: string,
  metadataMap: Map<string, RouteMetadata>,
): BreadcrumbItem[] {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let builtPath = "";

  for (const segment of segments) {
    builtPath += `/${segment}`;
    const metadata = metadataMap.get(builtPath);
    breadcrumbs.push({
      label: metadata?.label ?? formatSegmentLabel(segment),
      path: builtPath,
    });
  }

  if (breadcrumbs.length > 0) {
    const last = breadcrumbs[breadcrumbs.length - 1];
    if (last) {
      last.current = true;
    }
  }

  return breadcrumbs;
}

/**
 * Format a path segment into a human-readable label.
 */
export function formatSegmentLabel(segment: string): string {
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Join breadcrumb items into a display string.
 */
export function breadcrumbsToString(items: BreadcrumbItem[], separator = "/"): string {
  return items.map((item) => item.label).join(` ${separator} `);
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Parse a query string into an object.
 */
export function parseQuery(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Build a query string from an object.
 */
export function buildQuery(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }
  const str = searchParams.toString();
  return str ? `?${str}` : "";
}

/**
 * Get the current URL hash.
 */
export function getHash(): string {
  return window.location.hash.slice(1);
}

/**
 * Check if a URL is external.
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}

/**
 * Check if the current environment is a browser.
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}
