/**
 * useScrollReveal Hook
 *
 * Creates scroll-triggered reveal animations.
 */

import { useRef, useEffect, useState } from "react";
import { useAnimationConfig } from "./use-animation-config";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

export interface UseScrollRevealOptions {
  type?: "fade" | "slide" | "scale" | "reveal";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  ease?: string;
  delay?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  once?: boolean;
}

export interface UseScrollRevealReturn {
  ref: React.RefObject<HTMLElement | null>;
  progress: number;
  isActive: boolean;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}): UseScrollRevealReturn {
  const {
    type = "fade",
    direction = "up",
    duration = ANIMATION_DURATIONS.normal,
    ease = ANIMATION_EASINGS.easeOut,
    delay = 0,
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
    once = true,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    const el = ref.current;
    const dur = duration * durationMultiplier;

    const fromVars = getFromVars(type, direction);
    const toVars = getToVars(type, direction);

    gsap.set(el, fromVars);

    const scrubTrigger = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      once,
      onEnter: () => setIsActive(true),
      onLeave: () => setIsActive(false),
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    triggersRef.current.push(scrubTrigger);

    if (!scrub) {
      const revealTrigger = ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => {
          gsap.to(el, { ...toVars, duration: dur, delay, ease });
        },
      });
      triggersRef.current.push(revealTrigger);
    }

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [enabled, type, direction, duration, durationMultiplier, delay, start, end, scrub, once, ease]);

  return {
    ref,
    progress,
    isActive,
  };
}

function getFromVars(type: string, direction: string): Record<string, unknown> {
  switch (type) {
    case "slide": {
      const axis = direction === "up" || direction === "down" ? "y" : "x";
      const sign = direction === "up" || direction === "left" ? -1 : 1;
      return { [axis]: sign * 50, opacity: 0 };
    }
    case "scale":
      return { scale: 0.8, opacity: 0 };
    case "reveal":
      return { clipPath: "inset(100% 0 0 0)", opacity: 0 };
    default:
      return { opacity: 0 };
  }
}

function getToVars(type: string, direction: string): Record<string, unknown> {
  switch (type) {
    case "slide": {
      const axis = direction === "up" || direction === "down" ? "y" : "x";
      return { [axis]: 0, opacity: 1 };
    }
    case "scale":
      return { scale: 1, opacity: 1 };
    case "reveal":
      return { clipPath: "inset(0 0 0 0)", opacity: 1 };
    default:
      return { opacity: 1 };
  }
}
