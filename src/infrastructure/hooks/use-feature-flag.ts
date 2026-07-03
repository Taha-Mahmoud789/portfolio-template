import { useSyncExternalStore, useCallback } from "react";
import { isFeatureEnabled as checkFeature, onFeatureFlagChange } from "../config/feature-flags";

/**
 * Reactive feature flag check. Re-renders the component when the flag changes.
 *
 * @example
 * ```tsx
 * const showDebug = useFeatureFlag("debug-panel");
 * ```
 */
export function useFeatureFlag(flagKey: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      onFeatureFlagChange((key) => {
        if (key === flagKey) onStoreChange();
      }),
    [flagKey],
  );

  const getSnapshot = useCallback(() => checkFeature(flagKey), [flagKey]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
