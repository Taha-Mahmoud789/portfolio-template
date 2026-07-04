/**
 * Analytics Module
 *
 * Clean, optional, removable analytics system.
 * No analytics logic lives inside components.
 *
 * Architecture:
 *   types.ts       — strict event type definitions
 *   tracker.ts     — core trackEvent() function
 *   provider.tsx   — AnalyticsProvider (initializes, tracks routes)
 *   performance.ts — Core Web Vitals monitoring
 *   providers/     — provider implementations (GA, Plausible, Vercel, Sentry, Console)
 *
 * Usage:
 *   import { trackEvent } from "@/infrastructure/analytics";
 *   import { useAnalytics } from "@/hooks/use-analytics";
 *
 *   // Direct tracking
 *   trackEvent("project_opened", { projectId: "aurora" });
 *
 *   // React hook
 *   const { track } = useAnalytics("ProjectCard");
 *   track("project_opened", { projectId: "aurora", referrer: "home" });
 *
 * Environment Variables:
 *   VITE_ANALYTICS_ENABLED=true
 *   VITE_ANALYTICS_DEBUG=true
 *   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *   VITE_PLAUSIBLE_DOMAIN=yourdomain.com
 *   VITE_VERCEL_ANALYTICS=true
 *   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
 *   VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
 */

// Core
export { trackEvent, trackPageView, trackError, flushAnalytics, destroyAnalytics } from "./tracker";
export { getAnalyticsConfig, getProviders } from "./tracker";

// Provider
export { AnalyticsProvider } from "./provider";

// Performance
export { initPerformanceMonitoring, resetPerformanceMetrics } from "./performance";

// Types
export type { EventName, AnalyticsEventMap, AnalyticsConfig } from "./types";
