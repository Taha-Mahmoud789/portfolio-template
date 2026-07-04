/**
 * Analytics Provider Component
 *
 * Initializes analytics on mount, cleans up on unmount.
 * Tracks route changes automatically.
 * Wraps nothing — purely a side-effect component.
 *
 * Place at the top of the provider tree in App.tsx.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import {
  trackPageView,
  trackError,
  flushAnalytics,
  destroyAnalytics,
  setProviders,
  setAnalyticsConfig,
} from "./tracker";
import { initPerformanceMonitoring } from "./performance";
import { createConsoleProvider } from "./providers/console-provider";
import { createGAProvider } from "./providers/ga-provider";
import { createPlausibleProvider } from "./providers/plausible-provider";
import { createSentryProvider } from "./providers/sentry-provider";
import { createVercelProvider } from "./providers/vercel-provider";
import type { AnalyticsProvider as IAnalyticsProvider } from "./types";

// ============================================================================
// Route Change Tracker
// ============================================================================

function RouteTracker() {
  const location = useLocation();
  const initialPath = useRef(location.pathname);

  useEffect(() => {
    // Track initial page view
    trackPageView(initialPath.current);
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

// ============================================================================
// Error Listener
// ============================================================================

function useGlobalErrorTracking() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: "window.onerror",
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const reason: unknown = event.reason;
      const error = reason instanceof Error ? reason : new Error(String(reason));
      trackError(error, { source: "unhandledrejection" });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);
}

// ============================================================================
// Analytics Provider
// ============================================================================

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const enabled = import.meta.env.VITE_ANALYTICS_ENABLED === "true";
    const debug = import.meta.env.VITE_ANALYTICS_DEBUG === "true";

    setAnalyticsConfig({
      enabled,
      providers: [],
      debug,
    });

    if (!enabled) {
      if (debug) {
        console.log("[Analytics] Disabled — set VITE_ANALYTICS_ENABLED=true to enable");
      }
      // Still init console provider in dev for debugging
      if (import.meta.env.DEV) {
        setProviders([createConsoleProvider()]);
        setAnalyticsConfig({ enabled: true, providers: ["console"], debug: true });
      }
      return;
    }

    // Build provider chain from environment variables
    const activeProviders: IAnalyticsProvider[] = [];

    // Google Analytics
    const gaId: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
    if (gaId) {
      activeProviders.push(createGAProvider(gaId));
    }

    // Plausible
    const plausibleDomain: string | undefined = import.meta.env.VITE_PLAUSIBLE_DOMAIN as
      string | undefined;
    if (plausibleDomain) {
      const plausibleUrl: string =
        (import.meta.env.VITE_PLAUSIBLE_URL as string) || "https://plausible.io/js/script.js";
      activeProviders.push(createPlausibleProvider(plausibleDomain, plausibleUrl));
    }

    // Vercel Analytics
    if (import.meta.env.VITE_VERCEL_ANALYTICS === "true") {
      activeProviders.push(createVercelProvider());
    }

    // Sentry (error monitoring)
    const sentryDsn: string | undefined = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (sentryDsn) {
      const tracesSampleRate = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "0.1");
      activeProviders.push(createSentryProvider(sentryDsn, tracesSampleRate));
    }

    // Console provider in development
    if (import.meta.env.DEV) {
      activeProviders.push(createConsoleProvider());
    }

    setProviders(activeProviders);

    setAnalyticsConfig({
      enabled: true,
      providers: activeProviders.map((p) => p.name),
      debug,
    });

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Flush on page unload
    const handleBeforeUnload = () => flushAnalytics();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      destroyAnalytics();
    };
  }, []);

  useGlobalErrorTracking();

  return (
    <>
      <RouteTracker />
      {children}
    </>
  );
}
