/**
 * useNumberCounter Hook
 *
 * Animates a number counting up or down.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseNumberCounterOptions, UseNumberCounterReturn } from "../types/hooks";
import { ANIMATION_DURATIONS } from "../constants";
import { easings } from "../utils/gsap";

export function useNumberCounter(options: UseNumberCounterOptions = {}): UseNumberCounterReturn {
  const {
    from = 0,
    to = 100,
    duration = ANIMATION_DURATIONS.slower,
    decimals = 0,
    separator = false,
    triggerOnMount = true,
    scrollTrigger = false,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(from);
  const animationRef = useRef<number | null>(null);

  const formatNumber = useCallback(
    (num: number): number => {
      const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
      return rounded;
    },
    [decimals],
  );

  const start = useCallback(() => {
    if (!enabled) return;

    const startTime = performance.now();
    const totalDuration = duration * durationMultiplier * 1000;

    const easingFn = easings.easeOutCubic;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const easedProgress = easingFn(progress);

      const currentValue = from + (to - from) * easedProgress;
      setValue(formatNumber(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [enabled, from, to, duration, durationMultiplier, formatNumber]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setValue(from);
  }, [from]);

  useEffect(() => {
    if (triggerOnMount && !scrollTrigger) {
      start();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [triggerOnMount, scrollTrigger, start]);

  const displayValue = separator ? value.toLocaleString() : value.toFixed(decimals);

  return {
    ref,
    value: parseFloat(displayValue),
    start,
    reset,
  };
}
