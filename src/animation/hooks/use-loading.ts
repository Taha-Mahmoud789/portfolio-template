/**
 * useLoadingSequence Hook
 *
 * Creates loading sequence animations.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseLoadingSequenceOptions, UseLoadingSequenceReturn } from "../types/hooks";
import { ANIMATION_DURATIONS } from "../constants";

export function useLoadingSequence(
  options: UseLoadingSequenceOptions = {},
): UseLoadingSequenceReturn {
  const { duration = ANIMATION_DURATIONS.cinematic, steps = 100, onComplete } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!enabled) return;

    const totalDuration = duration * durationMultiplier * 1000;
    const stepDuration = totalDuration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);

      if (currentStep < steps) {
        animationRef.current = requestAnimationFrame(() => {
          setTimeout(animate, stepDuration);
        });
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animate();
  }, [enabled, duration, durationMultiplier, steps, onComplete]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setProgress(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    progress,
    isComplete,
    start,
    reset,
  };
}
