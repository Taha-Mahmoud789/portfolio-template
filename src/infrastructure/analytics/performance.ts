/**
 * Performance Monitoring
 *
 * Tracks Core Web Vitals (LCP, CLS, INP, FCP, TTFB) using
 * the web-vitals library pattern without adding a dependency.
 * Uses PerformanceObserver API directly.
 *
 * All metrics are sent through the analytics event system.
 * No external dependencies required.
 */

import { trackEvent } from "./tracker";

// ============================================================================
// Types
// ============================================================================

interface MetricData {
  name: "LCP" | "CLS" | "INP" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
}

// ============================================================================
// Thresholds (based on web-vitals defaults)
// ============================================================================

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

function getRating(name: MetricData["name"], value: number): MetricData["rating"] {
  const t = THRESHOLDS[name];
  if (!t) return "good";
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
}

// ============================================================================
// Metric Observers
// ============================================================================

const reportedMetrics = new Map<string, number>();

function reportMetric(metric: MetricData) {
  // Deduplicate — only report each metric once per page load
  const key = metric.name;
  const previous = reportedMetrics.get(key);
  if (previous !== undefined && metric.value === previous) return;
  reportedMetrics.set(key, metric.value);

  trackEvent("web_vital", {
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating,
    delta: Math.round(metric.delta),
  });
}

// ============================================================================
// LCP — Largest Contentful Paint
// ============================================================================

function observeLCP() {
  if (!("PerformanceObserver" in window)) return;

  let lastEntry: PerformanceEntry | null = null;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last && last !== lastEntry) {
        lastEntry = last;
        const value = last.startTime;
        reportMetric({
          name: "LCP",
          value,
          rating: getRating("LCP", value),
          delta: value,
        });
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // Observer type not supported
  }
}

// ============================================================================
// CLS — Cumulative Layout Shift
// ============================================================================

function observeCLS() {
  if (!("PerformanceObserver" in window)) return;

  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: PerformanceEntry[] = [];

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
          const value = (entry as PerformanceEntry & { value?: number }).value ?? 0;

          if (sessionValue + value < clsValue) {
            sessionValue += value;
            sessionEntries.push(entry);
          } else {
            sessionValue = value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            reportMetric({
              name: "CLS",
              value: clsValue,
              rating: getRating("CLS", clsValue),
              delta: value,
            });
          }
        }
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });
  } catch {
    // Observer type not supported
  }
}

// ============================================================================
// INP — Interaction to Next Paint
// ============================================================================

function observeINP() {
  if (!("PerformanceObserver" in window)) return;

  const interactions: number[] = [];

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const duration = entry.duration;
        interactions.push(duration);

        // Report p98 (approximation)
        interactions.sort((a, b) => b - a);
        const p98Index = Math.floor(interactions.length * 0.02);
        const p98 = interactions[p98Index] ?? duration;

        reportMetric({
          name: "INP",
          value: p98,
          rating: getRating("INP", p98),
          delta: duration,
        });
      }
    });
    observer.observe({ type: "event", buffered: true });
  } catch {
    // Observer type not supported
  }
}

// ============================================================================
// FCP — First Contentful Paint
// ============================================================================

function observeFCP() {
  if (!("PerformanceObserver" in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          const value = entry.startTime;
          reportMetric({
            name: "FCP",
            value,
            rating: getRating("FCP", value),
            delta: value,
          });
        }
      }
    });
    observer.observe({ type: "paint", buffered: true });
  } catch {
    // Observer type not supported
  }
}

// ============================================================================
// TTFB — Time to First Byte
// ============================================================================

function observeTTFB() {
  const navigation = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;

  if (navigation) {
    const value = navigation.responseStart - navigation.requestStart;
    if (value > 0) {
      reportMetric({
        name: "TTFB",
        value,
        rating: getRating("TTFB", value),
        delta: value,
      });
    }
  }
}

// ============================================================================
// Page Load Tracking
// ============================================================================

function trackPageLoad() {
  const navigation = performance.getEntriesByType("navigation")[0] as
    PerformanceNavigationTiming | undefined;

  if (navigation) {
    const loadTime = navigation.loadEventEnd - navigation.startTime;
    if (loadTime > 0) {
      trackEvent("page_load", {
        path: window.location.pathname,
        loadTime: Math.round(loadTime),
        navigationType: navigation.type,
      });
    }
  }
}

// ============================================================================
// Public API
// ============================================================================

let observersInitialized = false;

/**
 * Initialize all performance observers.
 * Safe to call multiple times — only initializes once.
 */
export function initPerformanceMonitoring(): void {
  if (observersInitialized) return;
  observersInitialized = true;

  observeLCP();
  observeCLS();
  observeINP();
  observeFCP();
  observeTTFB();

  // Track page load after a short delay to ensure navigation timing is available
  if (document.readyState === "complete") {
    trackPageLoad();
  } else {
    window.addEventListener(
      "load",
      () => {
        setTimeout(trackPageLoad, 0);
      },
      { once: true },
    );
  }
}

/**
 * Reset metric deduplication (for SPA route changes).
 */
export function resetPerformanceMetrics(): void {
  reportedMetrics.clear();
}
