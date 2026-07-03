/**
 * useClipPath Hook
 *
 * Creates clip path reveal animations.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseClipPathOptions, UseClipPathReturn } from "../types/hooks";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS, CLIP_PATH_SHAPES } from "../constants";
import { gsap } from "gsap";

export function useClipPath(options: UseClipPathOptions = {}): UseClipPathReturn {
  const {
    from = CLIP_PATH_SHAPES.inset,
    to = CLIP_PATH_SHAPES.insetFull,
    duration = ANIMATION_DURATIONS.slower,
    ease = ANIMATION_EASINGS.easeOut,
  } = options;

  const { enabled, durationMultiplier } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [clipPath, setClipPath] = useState(from);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current = gsap.context(() => {
      gsap.set(ref.current, { clipPath: from });
    }, ref);

    return () => ctxRef.current?.revert();
  }, [enabled, from]);

  const reveal = useCallback(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.to(ref.current, {
        clipPath: to,
        duration: duration * durationMultiplier,
        ease,
        onStart: () => setClipPath(to),
      });
    }, ref);
  }, [enabled, to, duration, durationMultiplier, ease]);

  const hide = useCallback(() => {
    if (!ref.current || !enabled) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.to(ref.current, {
        clipPath: from,
        duration: duration * durationMultiplier,
        ease,
        onStart: () => setClipPath(from),
      });
    }, ref);
  }, [enabled, from, duration, durationMultiplier, ease]);

  return {
    ref,
    clipPath,
    reveal,
    hide,
  };
}
