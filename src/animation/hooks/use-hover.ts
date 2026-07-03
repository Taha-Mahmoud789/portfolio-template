/**
 * useHoverEffect Hook
 *
 * Creates hover effect animations.
 */

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseHoverOptions, UseHoverReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { gsap } from "gsap";

export function useHover(options: UseHoverOptions = {}): UseHoverReturn {
  const { type = "scale", intensity = 1, duration = ANIMATION_DURATIONS.fast } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const getHoverConfig = useCallback(() => {
    const dur = duration * durationMultiplier;

    switch (type) {
      case "scale":
        return {
          scale: 1 + 0.05 * intensity,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
      case "rotate":
        return {
          rotate: 3 * intensity,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
      case "glow":
        return {
          boxShadow: `0 0 ${String(20 * intensity)}px rgba(59, 130, 246, 0.5)`,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
      case "lift":
        return {
          y: -5 * intensity,
          boxShadow: `0 ${String(10 * intensity)}px ${String(20 * intensity)}px rgba(0,0,0,0.1)`,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
      case "tilt":
        return {
          rotateX: 5 * intensity,
          rotateY: 5 * intensity,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
      default:
        return {
          scale: 1 + 0.05 * intensity,
          duration: dur,
          ease: ANIMATION_EASINGS.easeOut,
        };
    }
  }, [type, intensity, duration, durationMultiplier]);

  const getExitConfig = useCallback(() => {
    switch (type) {
      case "scale":
        return { scale: 1 };
      case "rotate":
        return { rotate: 0 };
      case "glow":
        return { boxShadow: "0 0 0 rgba(59, 130, 246, 0)" };
      case "lift":
        return { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" };
      case "tilt":
        return { rotateX: 0, rotateY: 0 };
      default:
        return { scale: 1 };
    }
  }, [type]);

  const handleMouseEnter = useCallback(() => {
    if (!ref.current || !enabled) return;
    setIsHovered(true);
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(ref.current, getHoverConfig());
  }, [enabled, getHoverConfig]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current || !enabled) return;
    setIsHovered(false);
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(ref.current, {
      ...getExitConfig(),
      duration: ANIMATION_DURATIONS.fast * durationMultiplier,
      ease: ANIMATION_EASINGS.easeOut,
    });
  }, [enabled, getExitConfig, durationMultiplier]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      tweenRef.current?.kill();
    };
  }, [enabled, handleMouseEnter, handleMouseLeave]);

  const whileHover = useMemo(() => getHoverConfig(), [getHoverConfig]);

  return {
    ref,
    isHovered,
    whileHover,
  };
}

/** @deprecated Use useHover instead */
export const useHoverEffect = useHover;
