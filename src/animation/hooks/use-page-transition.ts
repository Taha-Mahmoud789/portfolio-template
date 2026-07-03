/**
 * usePageTransition Hook
 *
 * Creates page transition animations.
 */

import { useAnimationConfig } from "./use-animation-config";
import type { UsePageTransitionOptions, UsePageTransitionReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import type { Variants, TargetAndTransition } from "framer-motion";

export function usePageTransition(options: UsePageTransitionOptions = {}): UsePageTransitionReturn {
  const { type = "fade", direction = "up", duration = ANIMATION_DURATIONS.normal } = options;

  const { durationMultiplier } = useAnimationConfig();

  const variants: Variants = {
    initial: getInitialState(type, direction),
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration * durationMultiplier,
        ease: ANIMATION_EASINGS.easeOut,
      },
    },
    exit: getExitState(type, direction, duration * durationMultiplier),
  };

  return {
    variants,
  };
}

function getInitialState(type: string, direction: string): TargetAndTransition {
  switch (type) {
    case "slide":
      return {
        y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
        opacity: 0,
      };
    case "scale":
      return { scale: 0.95, opacity: 0 };
    case "rotate":
      return { rotate: -5, opacity: 0 };
    case "portal":
      return { scale: 0, opacity: 0, filter: "blur(10px)" };
    default:
      return { opacity: 0 };
  }
}

function getExitState(type: string, direction: string, duration: number): TargetAndTransition {
  const transition = { duration: duration * 0.5, ease: ANIMATION_EASINGS.easeIn };

  switch (type) {
    case "slide":
      return {
        y: direction === "up" ? -20 : direction === "down" ? 20 : 0,
        x: direction === "left" ? -20 : direction === "right" ? 20 : 0,
        opacity: 0,
        transition,
      };
    case "scale":
      return { scale: 1.05, opacity: 0, transition };
    case "rotate":
      return { rotate: 5, opacity: 0, transition };
    case "portal":
      return { scale: 0, opacity: 0, filter: "blur(10px)", transition };
    default:
      return { opacity: 0, transition };
  }
}
