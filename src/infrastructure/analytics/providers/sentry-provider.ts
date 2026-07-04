/**
 * Sentry Error Monitoring Provider
 *
 * Prepares Sentry integration structure.
 * No DSN is hardcoded. All configuration comes from environment variables.
 *
 * Environment variables:
 *   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
 *   VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
 *
 * To activate:
 *   1. Install @sentry/react
 *   2. Uncomment the init call below
 *   3. Set VITE_SENTRY_DSN in .env
 */

import type { AnalyticsProvider } from "../types";

export function createSentryProvider(dsn: string, _tracesSampleRate: number): AnalyticsProvider {
  let initialized = false;

  const ensureInitialized = () => {
    if (initialized || !dsn) return;
    initialized = true;

    // Uncomment when @sentry/react is installed:
    // import * as Sentry from "@sentry/react";
    // Sentry.init({
    //   dsn,
    //   tracesSampleRate,
    //   environment: import.meta.env.MODE,
    //   integrations: [
    //     Sentry.browserTracingIntegration(),
    //     Sentry.replayIntegration({ maskAllText: true }),
    //   ],
    //   replaysSessionSampleRate: 0,
    //   replaysOnErrorSampleRate: 1.0,
    // });

    if (import.meta.env.DEV) {
      console.log("[Sentry] Initialized (placeholder — install @sentry/react to activate)");
    }
  };

  return {
    name: "sentry",

    page(_path: string) {
      ensureInitialized();
      // Sentry performance monitoring handles route tracking
    },

    event(_name: string, _properties?: Record<string, unknown>) {
      ensureInitialized();
      // Sentry breadcrumbs for event context
    },

    error(error: Error, context?: Record<string, unknown>) {
      ensureInitialized();
      // Uncomment when @sentry/react is installed:
      // Sentry.withScope((scope) => {
      //   if (context) scope.setExtras(context);
      //   Sentry.captureException(error);
      // });

      if (import.meta.env.DEV) {
        console.error("[Sentry] Would capture:", error.message, context);
      }
    },

    flush() {
      ensureInitialized();
      // Uncomment: await Sentry.flush(2000);
    },

    destroy() {
      ensureInitialized();
      // Uncomment: Sentry.close();
    },
  };
}
