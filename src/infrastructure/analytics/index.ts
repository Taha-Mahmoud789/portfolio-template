/**
 * Analytics Integration Structure
 *
 * No tracking keys are added. This module provides a clean interface
 * for future analytics integration (Google Analytics, Plausible, etc).
 *
 * Usage:
 *   import { analytics } from '@/infrastructure/analytics';
 *   analytics.page('/projects');
 *   analytics.event('project_click', { projectId: 'aurora' });
 */

// ============================================================================
// Types
// ============================================================================

interface AnalyticsConfig {
  enabled: boolean;
  measurementId?: string;
}

// ============================================================================
// Implementation
// ============================================================================

function createAnalytics() {
  const config: AnalyticsConfig = {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
    measurementId: String(import.meta.env.VITE_GA_MEASUREMENT_ID ?? ""),
  };

  function page(path: string) {
    if (!config.enabled) return;
    // Future: gtag('event', 'page_view', { page_path: path })
    void path;
  }

  function event(name: string, properties?: Record<string, string | number | boolean>) {
    if (!config.enabled) return;
    // Future: gtag('event', name, properties)
    void name;
    void properties;
  }

  function identify(userId: string) {
    if (!config.enabled) return;
    // Future: gtag('set', { user_id: userId })
    void userId;
  }

  return { page, event, identify, config };
}

// ============================================================================
// Export singleton
// ============================================================================

export const analytics = createAnalytics();
