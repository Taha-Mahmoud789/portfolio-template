/**
 * useSceneEntrance Hook
 *
 * Creates scene entrance animations.
 */

import { useRef, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import { gsap } from "gsap";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

export interface UseSceneEntranceOptions {
  type?: "fade" | "slide" | "scale" | "cinematic";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  ease?: string;
  delay?: number;
}

export interface UseSceneEntranceReturn {
  ref: React.RefObject<HTMLElement | null>;
  play: () => void;
  reset: () => void;
}

export function useSceneEntrance(options: UseSceneEntranceOptions = {}): UseSceneEntranceReturn {
  const {
    type = "fade",
    direction = "up",
    duration = ANIMATION_DURATIONS.normal,
    ease = ANIMATION_EASINGS.easeOut,
    delay = 0,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    return () => ctxRef.current?.revert();
  }, []);

  const play = useCallback(() => {
    if (!ref.current || !enabled) return;

    const dur = duration * durationMultiplier;
    const el = ref.current;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      switch (type) {
        case "fade":
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur, delay, ease });
          break;
        case "slide": {
          const axis = direction === "up" || direction === "down" ? "y" : "x";
          const sign = direction === "up" || direction === "left" ? -1 : 1;
          gsap.fromTo(
            el,
            { [axis]: sign * 50, opacity: 0 },
            { [axis]: 0, opacity: 1, duration: dur, delay, ease },
          );
          break;
        }
        case "scale":
          gsap.fromTo(
            el,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: dur, delay, ease },
          );
          break;
        case "cinematic":
          gsap.fromTo(
            el,
            { scale: 1.1, opacity: 0, filter: "blur(10px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: dur, delay, ease },
          );
          break;
      }
    }, ref);
  }, [enabled, type, direction, duration, durationMultiplier, delay, ease]);

  const reset = useCallback(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.set(ref.current, { opacity: 0 });
    }, ref);
  }, [enabled]);

  return {
    ref,
    play,
    reset,
  };
}
