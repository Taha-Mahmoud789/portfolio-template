/**
 * useAnalytics Hook
 *
 * Provides typed event tracking for React components.
 * Automatically includes component context in events.
 *
 * Usage:
 *   const { track } = useAnalytics("ComponentName");
 *   track("project_opened", { projectId: "aurora", referrer: "home" });
 */

import { useCallback, useRef } from "react";
import { trackEvent, trackError, getAnalyticsConfig } from "@/infrastructure/analytics/tracker";
import type { EventName } from "@/infrastructure/analytics/types";

interface UseAnalyticsReturn {
  track(name: EventName, properties?: Record<string, unknown>): void;
  trackComponentError(error: Error, componentName: string): void;
  isEnabled: boolean;
}

export function useAnalytics(componentName?: string): UseAnalyticsReturn {
  const componentNameRef = useRef(componentName);
  componentNameRef.current = componentName;

  const track = useCallback((name: EventName, properties?: Record<string, unknown>) => {
    trackEvent(name, {
      ...properties,
      ...(componentNameRef.current ? { component: componentNameRef.current } : {}),
    });
  }, []);

  const trackComponentError = useCallback((error: Error, context?: string) => {
    trackError(error, {
      component: componentNameRef.current ?? "unknown",
      context: context ?? "render",
    });
  }, []);

  const config = getAnalyticsConfig();

  return {
    track,
    trackComponentError,
    isEnabled: config.enabled,
  };
}
