/**
 * useMaskReveal Hook
 *
 * Creates mask reveal animations using CSS mask properties.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseMaskRevealOptions, UseMaskRevealReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { gsap } from "gsap";

export function useMaskReveal(options: UseMaskRevealOptions = {}): UseMaskRevealReturn {
  const {
    direction = "left",
    duration = ANIMATION_DURATIONS.slower,
    ease = ANIMATION_EASINGS.easeOut,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [mask, setMask] = useState("linear-gradient(90deg, transparent 0%, black 0%)");
  const ctxRef = useRef<gsap.Context | null>(null);

  const gradients: Record<string, { from: string; to: string }> = {
    left: {
      from: "linear-gradient(90deg, transparent 0%, black 0%)",
      to: "linear-gradient(90deg, transparent 100%, black 100%)",
    },
    right: {
      from: "linear-gradient(90deg, black 0%, transparent 0%)",
      to: "linear-gradient(90deg, black 100%, transparent 100%)",
    },
    center: {
      from: "radial-gradient(circle, black 0%, transparent 0%)",
      to: "radial-gradient(circle, black 100%, transparent 100%)",
    },
  };

  const gradient = (gradients[direction] || gradients.left) as { from: string; to: string };

  useEffect(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(ref.current, { maskImage: gradient.from });
      setMask(gradient.from);
    }, ref);

    return () => ctxRef.current?.revert();
  }, [enabled, gradient]);

  const reveal = useCallback(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.to(ref.current, {
        maskImage: gradient.to,
        duration: duration * durationMultiplier,
        ease,
        onStart: () => setMask(gradient.to),
      });
    }, ref);
  }, [enabled, gradient, duration, durationMultiplier, ease]);

  const hide = useCallback(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.to(ref.current, {
        maskImage: gradient.from,
        duration: duration * durationMultiplier,
        ease,
        onStart: () => setMask(gradient.from),
      });
    }, ref);
  }, [enabled, gradient, duration, durationMultiplier, ease]);

  return {
    ref,
    mask,
    reveal,
    hide,
  };
}
