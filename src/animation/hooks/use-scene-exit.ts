/**
 * useSceneExit Hook
 *
 * Creates scene exit animations.
 */

import { useRef, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import { gsap } from "gsap";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

export interface UseSceneExitOptions {
  type?: "fade" | "slide" | "scale" | "cinematic";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  ease?: string;
}

export interface UseSceneExitReturn {
  ref: React.RefObject<HTMLElement | null>;
  play: () => Promise<void>;
}

export function useSceneExit(options: UseSceneExitOptions = {}): UseSceneExitReturn {
  const {
    type = "fade",
    direction = "up",
    duration = ANIMATION_DURATIONS.normal,
    ease = ANIMATION_EASINGS.easeIn,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    return () => ctxRef.current?.revert();
  }, []);

  const play = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!ref.current || !enabled) {
        resolve();
        return;
      }

      const dur = duration * durationMultiplier;
      const el = ref.current;

      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        switch (type) {
          case "fade":
            gsap.to(el, { opacity: 0, duration: dur, ease, onComplete: resolve });
            break;
          case "slide": {
            const axis = direction === "up" || direction === "down" ? "y" : "x";
            const sign = direction === "up" || direction === "left" ? -1 : 1;
            gsap.to(el, {
              [axis]: sign * -50,
              opacity: 0,
              duration: dur,
              ease,
              onComplete: resolve,
            });
            break;
          }
          case "scale":
            gsap.to(el, { scale: 0.8, opacity: 0, duration: dur, ease, onComplete: resolve });
            break;
          case "cinematic":
            gsap.to(el, {
              scale: 1.1,
              opacity: 0,
              filter: "blur(10px)",
              duration: dur,
              ease,
              onComplete: resolve,
            });
            break;
          default:
            resolve();
        }
      }, ref);
    });
  }, [enabled, type, direction, duration, durationMultiplier, ease]);

  return {
    ref,
    play,
  };
}
