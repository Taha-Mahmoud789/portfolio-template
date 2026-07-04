/**
 * Plausible Analytics Provider
 *
 * Privacy-first analytics. Loads plausible.js lazily.
 * No cookies, no personal data, GDPR compliant by default.
 *
 * Environment variables:
 *   VITE_ANALYTICS_ENABLED=true
 *   VITE_PLAUSIBLE_DOMAIN=yourdomain.com
 *   VITE_PLAUSIBLE_URL=https://plausible.io/js/script.js
 */

import type { AnalyticsProvider } from "../types";

function loadPlausible(domain: string, scriptUrl: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[data-domain="${domain}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.src = scriptUrl;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

export function createPlausibleProvider(domain: string, scriptUrl: string): AnalyticsProvider {
  let loaded = false;

  const ensureLoaded = () => {
    if (!loaded) {
      loaded = true;
      void loadPlausible(domain, scriptUrl);
    }
  };

  return {
    name: "plausible",

    page(path: string) {
      ensureLoaded();
      // Plausible auto-tracks pageviews via the script
      // For SPA navigation, use custom event
      window.plausible?.("pageview", { url: path });
    },

    event(name: string, properties?: Record<string, unknown>) {
      ensureLoaded();
      window.plausible?.(name, { props: properties });
    },

    error(error: Error, context?: Record<string, unknown>) {
      ensureLoaded();
      window.plausible?.("error", {
        props: { message: error.message, ...context },
      });
    },

    flush() {
      // Plausible handles its own batching
    },

    destroy() {
      // Plausible script stays loaded
    },
  };
}

// Plausible global type
declare global {
  interface Window {
    plausible?: (name: string, options?: { url?: string; props?: Record<string, unknown> }) => void;
  }
}
