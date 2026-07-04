/**
 * Core Event Tracker
 *
 * The single entry point for all analytics tracking.
 * Routes events to all configured providers.
 * Enriches events with automatic context (timestamp, page, session).
 *
 * Usage:
 *   import { trackEvent } from "@/infrastructure/analytics";
 *   trackEvent("project_opened", { projectId: "aurora", referrer: "home" });
 */

import type { AnalyticsProvider, EventName, AnalyticsConfig } from "./types";

// ============================================================================
// Internal State
// ============================================================================

let providers: AnalyticsProvider[] = [];
let config: AnalyticsConfig = {
  enabled: false,
  providers: [],
  debug: false,
};

let sessionStart = Date.now();
let lastPagePath = "";

// ============================================================================
// Context Enrichment
// ============================================================================

function getContext() {
  return {
    timestamp: Date.now(),
    sessionDuration: Date.now() - sessionStart,
    page: window.location.pathname,
    referrer: document.referrer || "direct",
    viewport: `${String(window.innerWidth)}x${String(window.innerHeight)}`,
    devicePixelRatio: window.devicePixelRatio,
    language: navigator.language,
    userAgent: navigator.userAgent,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Track a typed analytics event.
 * Events are sent to all configured providers.
 * If no providers are configured, this is a no-op.
 */
export function trackEvent(name: EventName, properties?: Record<string, unknown>): void {
  if (!config.enabled || providers.length === 0) return;

  const enrichedProperties = {
    ...properties,
    ...getContext(),
  };

  if (config.debug) {
    console.log(`[Analytics] ${name}`, enrichedProperties);
  }

  for (const provider of providers) {
    try {
      provider.event(name, enrichedProperties);
    } catch (err) {
      if (config.debug) {
        console.error(`[Analytics] Provider "${provider.name}" failed:`, err);
      }
    }
  }
}

/**
 * Track a page view.
 * Automatically deduplicates if the same path is tracked twice.
 */
export function trackPageView(path: string): void {
  if (path === lastPagePath) return;
  lastPagePath = path;

  if (!config.enabled || providers.length === 0) return;

  for (const provider of providers) {
    try {
      provider.page(path);
    } catch (err) {
      if (config.debug) {
        console.error(`[Analytics] Provider "${provider.name}" page error:`, err);
      }
    }
  }
}

/**
 * Track an error.
 * Sends to error monitoring providers (Sentry, etc).
 */
export function trackError(error: Error, context?: Record<string, unknown>): void {
  if (!config.enabled || providers.length === 0) return;

  for (const provider of providers) {
    try {
      provider.error(error, context);
    } catch (err) {
      if (config.debug) {
        console.error(`[Analytics] Provider "${provider.name}" error reporting failed:`, err);
      }
    }
  }
}

/**
 * Flush all pending events.
 * Call before page unload.
 */
export function flushAnalytics(): void {
  for (const provider of providers) {
    try {
      provider.flush();
    } catch {
      // Silent fail on flush
    }
  }
}

/**
 * Destroy all providers. Call on app unmount.
 */
export function destroyAnalytics(): void {
  for (const provider of providers) {
    try {
      provider.destroy();
    } catch {
      // Silent fail on destroy
    }
  }
  providers = [];
  sessionStart = Date.now();
  lastPagePath = "";
}

// ============================================================================
// Configuration
// ============================================================================

export function getAnalyticsConfig(): AnalyticsConfig {
  return config;
}

export function getProviders(): readonly AnalyticsProvider[] {
  return providers;
}

export function setProviders(newProviders: AnalyticsProvider[]): void {
  providers = newProviders;
}

export function setAnalyticsConfig(newConfig: AnalyticsConfig): void {
  config = newConfig;
}
