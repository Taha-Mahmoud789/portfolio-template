/**
 * useReveal Hook
 *
 * Animates an element's reveal with configurable direction and distance.
 *
 * @example
 * ```tsx
 * const { ref, framerProps } = useReveal({ direction: "up", distance: 50 });
 *
 * <div ref={ref} {...framerProps}>
 *   Content
 * </div>
 * ```
 */

import { useRef } from "react";
import { useInView, type Transition } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAnimationConfig } from "./use-animation-config";
import type { UseRevealOptions, UseRevealReturn } from "../types/hooks";
import { DEFAULT_DISTANCES } from "../constants/defaults";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/**
 * Hook for reveal animations.
 *
 * @param options - Configuration options
 * @returns Object with ref, state, play, reset, and framerProps
 */
export function useReveal(options: UseRevealOptions = {}): UseRevealReturn {
  const {
    duration = ANIMATION_DURATIONS.normal,
    delay = 0,
    ease = ANIMATION_EASINGS.easeOut,
    direction = "up",
    distance = DEFAULT_DISTANCES.medium,
    triggerOnMount = true,
    scrollTrigger = false,
    viewportPosition = "center",
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: viewportPosition === "top" ? 0.1 : viewportPosition === "bottom" ? 0.9 : 0.5,
  });

  const axis = direction === "up" || direction === "down" ? "y" : "x";
  const sign = direction === "up" || direction === "left" ? -1 : 1;

  const shouldAnimate = enabled && (triggerOnMount || (scrollTrigger && isInView));

  const variants = {
    hidden: {
      [axis]: sign * distance,
      opacity: 0,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      transition: {
        duration: duration * durationMultiplier,
        delay,
        ease,
      } as Transition,
    },
  } as const;

  return {
    ref,
    state: shouldAnimate ? "running" : "idle",
    framerProps: {
      variants: variants as unknown as Variants,
      initial: "hidden",
      animate: shouldAnimate ? "visible" : "hidden",
      exit: "hidden",
      transition: {
        duration: duration * durationMultiplier,
        delay,
        ease,
      },
    },
  };
}
