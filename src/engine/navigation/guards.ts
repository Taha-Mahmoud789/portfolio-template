/**
 * Navigation Guards
 *
 * Infrastructure for route guards.
 * Guards can prevent navigation, redirect, or modify navigation behavior.
 */

import type { NavigationGuard, GuardContext, GuardResult } from "./types";

// ============================================================================
// Guard Runner
// ============================================================================

/**
 * Run a set of navigation guards in priority order.
 * Returns the first guard result that blocks navigation.
 */
export async function runGuards(
  guards: NavigationGuard[],
  context: GuardContext
): Promise<GuardResult> {
  // Sort by priority (lower = runs first)
  const sorted = [...guards].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  for (const guard of sorted) {
    try {
      const result = await guard.guard(context);

      // If result is false or has a redirect, block navigation
      if (result === false || (typeof result === "object" && "redirect" in result)) {
        return result;
      }
    } catch (error) {
      console.error(`Guard "${guard.id}" threw an error:`, error);
      // Block navigation on guard error
      return false;
    }
  }

  // All guards passed
  return true;
}

// ============================================================================
// Common Guards
// ============================================================================

/**
 * Create an authentication guard.
 */
export function createAuthGuard(
  isAuthenticated: () => boolean,
  redirectPath = "/login"
): NavigationGuard {
  return {
    id: "auth-guard",
    priority: 0,
    guard: () => {
      if (!isAuthenticated()) {
        return { redirect: redirectPath };
      }
      return true;
    },
  };
}

/**
 * Create a permission guard.
 */
export function createPermissionGuard(
  getUserPermissions: () => string[],
  requiredPermissions: string[]
): NavigationGuard {
  return {
    id: "permission-guard",
    priority: 1,
    guard: () => {
      const userPermissions = getUserPermissions();
      const hasPermission = requiredPermissions.every((p) =>
        userPermissions.includes(p)
      );

      if (!hasPermission) {
        return { redirect: "/unauthorized" };
      }
      return true;
    },
  };
}

/**
 * Create a feature flag guard.
 */
export function createFeatureFlagGuard(
  isFeatureEnabled: (flag: string) => boolean,
  flagName: string,
  redirectPath = "/"
): NavigationGuard {
  return {
    id: `feature-flag-${flagName}`,
    priority: 2,
    guard: () => {
      if (!isFeatureEnabled(flagName)) {
        return { redirect: redirectPath };
      }
      return true;
    },
  };
}

/**
 * Create a confirmation guard (for unsaved changes, etc.).
 */
export function createConfirmationGuard(
  message: string
): NavigationGuard {
  return {
    id: "confirmation-guard",
    priority: 0,
    guard: () => {
      const confirmed = window.confirm(message);
      return confirmed;
    },
  };
}

// ============================================================================
// Guard Context Builder
// ============================================================================

/**
 * Build a guard context from navigation state.
 */
export function buildGuardContext(options: {
  to: string;
  from: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  isAuthenticated?: boolean;
  permissions?: string[];
}): GuardContext {
  return {
    to: options.to,
    from: options.from,
    params: options.params ?? {},
    query: options.query ?? {},
    isAuthenticated: options.isAuthenticated ?? false,
    permissions: options.permissions ?? [],
  };
}
