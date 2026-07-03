/**
 * useAnimationConfig Hook
 *
 * Provides animation configuration based on device capabilities and user preferences.
 */

import { useMemo } from "react";
import { useAppSettingsStore } from "@/infrastructure/store/app-store";
import { useThemeStore } from "@/store/theme-store";
import { DEFAULT_ANIMATION_CONFIG } from "../constants/defaults";
import type { AnimationConfig } from "../types/config";

/**
 * Hook to get animation configuration based on device and user preferences.
 *
 * @example
 * ```tsx
 * const { enabled, durationMultiplier, engine } = useAnimationConfig();
 * ```
 */
export function useAnimationConfig(): AnimationConfig & {
  enabled: boolean;
  durationMultiplier: number;
} {
  const quality = useAppSettingsStore((s) => s.animationQuality);
  const reducedMotion = useThemeStore((s) => s.reducedMotion);

  return useMemo(() => {
    const enabled = quality !== "low" && !reducedMotion;
    const durationMultiplier = quality === "low" ? 2 : quality === "medium" ? 1.5 : 1;

    return {
      ...DEFAULT_ANIMATION_CONFIG,
      engine: quality === "low" ? "css" : "framer",
      enabled,
      durationMultiplier,
      reducedMotion: reducedMotion ? "full" : "partial",
    };
  }, [quality, reducedMotion]);
}
