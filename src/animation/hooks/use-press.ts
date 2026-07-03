/**
 * usePressEffect Hook
 *
 * Creates press/tap effect animations.
 */

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UsePressOptions, UsePressReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { gsap } from "gsap";

export function usePress(options: UsePressOptions = {}): UsePressReturn {
  const { type = "scale", intensity = 1, duration = ANIMATION_DURATIONS.fast } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const getPressConfig = useCallback(() => {
    const dur = duration * durationMultiplier;

    switch (type) {
      case "scale":
        return { scale: 1 - 0.05 * intensity, duration: dur, ease: ANIMATION_EASINGS.easeOut };
      case "bounce":
        return { scale: [1, 0.9, 1.05, 1], duration: dur * 1.5, ease: ANIMATION_EASINGS.easeOut };
      case "rotate":
        return { rotate: -3 * intensity, duration: dur, ease: ANIMATION_EASINGS.easeOut };
      case "squeeze":
        return {
          scaleX: 1 + 0.02 * intensity,
          scaleY: 1 - 0.02 * intensity,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
      default:
        return { scale: 1 - 0.05 * intensity, duration: dur, ease: ANIMATION_EASINGS.easeOut };
    }
  }, [type, intensity, duration, durationMultiplier]);

  const handleMouseDown = useCallback(() => {
    if (!ref.current || !enabled) return;
    setIsPressed(true);
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(ref.current, getPressConfig() as gsap.TweenVars);
  }, [enabled, getPressConfig]);

  const handleMouseUp = useCallback(() => {
    if (!ref.current || !enabled) return;
    setIsPressed(false);
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(ref.current, {
      scale: 1,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      duration: ANIMATION_DURATIONS.fast * durationMultiplier,
      ease: ANIMATION_EASINGS.easeOut,
    });
  }, [enabled, durationMultiplier]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseleave", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseleave", handleMouseUp);
      tweenRef.current?.kill();
    };
  }, [enabled, handleMouseDown, handleMouseUp]);

  const whileTap = useMemo(() => getPressConfig(), [getPressConfig]);

  return {
    ref,
    isPressed,
    whileTap,
  };
}

/** @deprecated Use usePress instead */
export const usePressEffect = usePress;
