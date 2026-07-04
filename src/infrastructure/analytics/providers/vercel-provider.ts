/**
 * Vercel Analytics Provider
 *
 * Loads @vercel/analytics lazily. Works with Vercel deployments.
 * No configuration needed beyond enabling — auto-detects deployment.
 *
 * Environment variables:
 *   VITE_ANALYTICS_ENABLED=true
 */

import type { AnalyticsProvider } from "../types";

export function createVercelProvider(): AnalyticsProvider {
  let loaded = false;

  const ensureLoaded = () => {
    if (loaded) return;
    loaded = true;

    // Uncomment when @vercel/analytics is installed:
    // import { inject } from "@vercel/analytics";
    // inject();

    if (import.meta.env.DEV) {
      console.log(
        "[Vercel Analytics] Initialized (placeholder — install @vercel/analytics to activate)",
      );
    }
  };

  return {
    name: "vercel",

    page(_path: string) {
      ensureLoaded();
      // Vercel analytics auto-tracks page views
    },

    event(name: string, properties?: Record<string, unknown>) {
      ensureLoaded();
      // Uncomment: import { track } from "@vercel/analytics";
      // track(name, properties as Record<string, string>);
      if (import.meta.env.DEV) {
        console.log(`[Vercel Analytics] event: ${name}`, properties);
      }
    },

    error(_error: Error, _context?: Record<string, unknown>) {
      ensureInitialized();
    },

    flush() {
      // Vercel handles its own batching
    },

    destroy() {
      // Vercel script stays loaded
    },
  };
}

function ensureInitialized() {
  // No-op placeholder
}
