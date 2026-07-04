/**
 * Console Analytics Provider
 *
 * Development-only provider that logs events to the console.
 * Used when no production analytics provider is configured.
 * Zero external dependencies.
 */

import type { AnalyticsProvider } from "../types";

export function createConsoleProvider(): AnalyticsProvider {
  return {
    name: "console",

    page(path: string) {
      if (import.meta.env.DEV) {
        console.log(`[Analytics] page_view: ${path}`);
      }
    },

    event(name: string, properties?: Record<string, unknown>) {
      if (import.meta.env.DEV) {
        console.log(`[Analytics] event: ${name}`, properties ?? "");
      }
    },

    error(error: Error, context?: Record<string, unknown>) {
      if (import.meta.env.DEV) {
        console.error(`[Analytics] error: ${error.message}`, context ?? "");
      }
    },

    flush() {
      // No-op for console provider
    },

    destroy() {
      // No-op for console provider
    },
  };
}
