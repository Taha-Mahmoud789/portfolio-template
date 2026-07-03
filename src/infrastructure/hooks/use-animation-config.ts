/**
 * useAnimationConfig
 *
 * Derives animation configuration from existing stores.
 * Replaces the AnimationProvider — no Context needed for derived values.
 *
 * Reads from:
 * - useAppSettingsStore (animationQuality) — infrastructure store
 * - useThemeStore (reducedMotion) — existing app store
 *
 * This is the correct dependency direction: infrastructure hooks read
 * from app stores, not the other way around.
 */

import { useMemo } from "react";
import { useAppSettingsStore } from "../store/app-store";

interface AnimationConfig {
  quality: "low" | "medium" | "high";
  enabled: boolean;
  threeDEnabled: boolean;
  durationMultiplier: number;
}

/**
 * Detects prefers-reduced-motion from the OS.
 * Returns false during SSR.
 */
function getReducedMotionPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns derived animation configuration.
 * Pure computation, no Context overhead.
 *
 * @example
 * ```tsx
 * const { enabled, durationMultiplier } = useAnimationConfig();
 * ```
 */
export function useAnimationConfig(): AnimationConfig {
  const quality = useAppSettingsStore((s) => s.animationQuality);
  // Read reduced motion from OS preference directly.
  // The existing theme-store also tracks this, but for animation decisions
  // we want the raw OS signal, not a potentially stale store value.
  const reducedMotion = useMemo(getReducedMotionPreference, []);

  return useMemo(() => {
    const enabled = quality !== "low" && !reducedMotion;
    const durationMultiplier = quality === "low" ? 2 : quality === "medium" ? 1.5 : 1;

    return {
      quality,
      enabled,
      threeDEnabled: enabled && quality === "high",
      durationMultiplier,
    };
  }, [quality, reducedMotion]);
}
