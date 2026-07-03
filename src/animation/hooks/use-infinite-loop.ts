/**
 * useInfiniteLoop Hook
 *
 * Creates infinite looping animations.
 */

import { useRef, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseInfiniteLoopOptions, UseInfiniteLoopReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { gsap } from "gsap";

export function useInfiniteLoop(options: UseInfiniteLoopOptions = {}): UseInfiniteLoopReturn {
  const {
    type = "rotate",
    duration = ANIMATION_DURATIONS.cinematic,
    ease = ANIMATION_EASINGS.linear,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const getAnimationConfig = useCallback(() => {
    const dur = duration * durationMultiplier;

    switch (type) {
      case "rotate":
        return { rotate: 360, duration: dur, ease, repeat: -1 };
      case "bounce":
        return { y: [-10, 10, -10], duration: dur, ease: ANIMATION_EASINGS.easeInOut, repeat: -1 };
      case "pulse":
        return {
          scale: [1, 1.05, 1],
          duration: dur,
          ease: ANIMATION_EASINGS.easeInOut,
          repeat: -1,
        };
      case "float":
        return {
          y: [-5, 5, -5],
          x: [-2, 2, -2],
          duration: dur,
          ease: ANIMATION_EASINGS.easeInOut,
          repeat: -1,
        };
      default:
        return { rotate: 360, duration: dur, ease, repeat: -1 };
    }
  }, [type, duration, durationMultiplier, ease]);

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.resume();
    }
  }, []);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    animationRef.current = gsap.to(ref.current, getAnimationConfig() as gsap.TweenVars);

    return () => {
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [enabled, getAnimationConfig]);

  return {
    ref,
    pause,
    resume,
  };
}
