/**
 * Google Analytics Provider
 *
 * Loads gtag.js lazily only when enabled via environment variables.
 * No tracking keys are hardcoded. All configuration comes from .env.
 *
 * Environment variables:
 *   VITE_ANALYTICS_ENABLED=true
 *   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 */

import type { AnalyticsProvider } from "../types";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGtag(measurementId: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.gtag) {
      resolve();
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });

    // Load the script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Don't block on failure
    document.head.appendChild(script);
  });
}

export function createGAProvider(measurementId: string): AnalyticsProvider {
  let loaded = false;

  const ensureLoaded = () => {
    if (!loaded) {
      loaded = true;
      void loadGtag(measurementId);
    }
  };

  return {
    name: "google-analytics",

    page(path: string) {
      ensureLoaded();
      window.gtag?.("event", "page_view", { page_path: path });
    },

    event(name: string, properties?: Record<string, unknown>) {
      ensureLoaded();
      window.gtag?.("event", name, properties);
    },

    error(error: Error, context?: Record<string, unknown>) {
      ensureLoaded();
      window.gtag?.("event", "exception", {
        description: error.message,
        fatal: false,
        ...context,
      });
    },

    flush() {
      // GA handles its own batching
    },

    destroy() {
      // GA script stays loaded (lightweight, no cleanup needed)
    },
  };
}
