/**
 * Analytics Event Types
 *
 * Strict type definitions for tracked events.
 * Only events actually placed in components are defined here.
 * Events are grouped by what they measure:
 *   - Navigation: user intent signals
 *   - Multiverse: funnel and engagement
 *   - Project: case study depth
 *   - Performance: Core Web Vitals
 *   - Error: reliability (via trackError, not typed events)
 */

// ============================================================================
// Navigation Events — User Intent
// ============================================================================

export interface NavigationEvents {
  /** User clicks a navigation link */
  nav_click: { destination: string; source: string };
  /** Hero section CTA clicked */
  hero_interact: { action: "scroll_cue" | "cta_click" | "name_hover" };
}

// ============================================================================
// Multiverse Events — Funnel & Engagement
// ============================================================================

export interface MultiverseEvents {
  /** Entered multiverse hub from portfolio */
  multiverse_entered: { referrer: string };
  /** Selected a world from the hub */
  multiverse_world_selected: { worldId: string; worldName: string };
  /** Exited multiverse back to portfolio */
  multiverse_exited: { destination: string; timeSpent: number };
}

// ============================================================================
// Project Events — Case Study Depth
// ============================================================================

export interface ProjectEvents {
  /** Case study page opened */
  project_opened: { projectId: string; referrer: string };
  /** Case study section viewed */
  project_section_view: { projectId: string; section: string };
}

// ============================================================================
// Performance Events — Core Web Vitals
// ============================================================================

export interface PerformanceEvents {
  /** Core Web Vital measured */
  web_vital: {
    name: "LCP" | "CLS" | "INP" | "FCP" | "TTFB";
    value: number;
    rating: "good" | "needs-improvement" | "poor";
    delta: number;
  };
  /** Page load performance */
  page_load: { path: string; loadTime: number; navigationType: string };
}

// ============================================================================
// Combined Event Map
// ============================================================================

export type AnalyticsEventMap = NavigationEvents &
  ProjectEvents &
  MultiverseEvents &
  PerformanceEvents;

export type EventName = keyof AnalyticsEventMap;

// ============================================================================
// Provider Types
// ============================================================================

export interface AnalyticsProvider {
  readonly name: string;
  page(path: string): void;
  event(name: string, properties?: Record<string, unknown>): void;
  error(error: Error, context?: Record<string, unknown>): void;
  flush(): void;
  destroy(): void;
}

export interface AnalyticsConfig {
  readonly enabled: boolean;
  readonly providers: readonly string[];
  readonly debug: boolean;
}
