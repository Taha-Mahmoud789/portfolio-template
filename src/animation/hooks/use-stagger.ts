/**
 * useStagger Hook
 *
 * Creates staggered animation effects for lists of elements.
 */

import { useRef, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseStaggerOptions, UseStaggerReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { gsap } from "gsap";

export function useStagger(options: UseStaggerOptions = {}): UseStaggerReturn {
  const {
    staggerDelay = 0.1,
    direction = "forward",
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const containerRef = useRef<HTMLElement | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    return () => ctxRef.current?.revert();
  }, []);

  const getStaggerProps = useCallback(
    (index: number) => {
      const delay = index * staggerDelay * durationMultiplier;

      return {
        variants: {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay,
              duration: ANIMATION_DURATIONS.normal * durationMultiplier,
              ease: ANIMATION_EASINGS.easeOut,
            },
          },
        },
        initial: "hidden",
        animate: enabled ? "visible" : "hidden",
      };
    },
    [enabled, staggerDelay, durationMultiplier],
  );

  const play = useCallback(() => {
    if (!containerRef.current || !enabled) return;

    const children = containerRef.current.children;
    const elements = Array.from(children) as HTMLElement[];

    const fromVars = direction === "reverse" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };
    const toVars = direction === "reverse" ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 };

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.fromTo(elements, fromVars, {
        ...toVars,
        duration: ANIMATION_DURATIONS.normal * durationMultiplier,
        stagger: staggerDelay,
        ease: ANIMATION_EASINGS.easeOut,
      });
    }, containerRef);
  }, [enabled, direction, staggerDelay, durationMultiplier]);

  const reset = useCallback(() => {
    if (!containerRef.current || !enabled) return;

    const children = containerRef.current.children;
    const elements = Array.from(children) as HTMLElement[];

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.set(elements, { opacity: 0, y: 20 });
    }, containerRef);
  }, [enabled]);

  return {
    containerRef,
    getStaggerProps,
    play,
    reset,
  };
}
