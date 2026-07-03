/**
 * useSplitTextReveal Hook
 *
 * SplitText character-by-character reveal on mount.
 * Characters animate from y-offset + opacity 0 with stagger.
 * Used for hero titles and headings that should animate immediately.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useAnimationConfig } from "./use-animation-config";

interface UseSplitTextRevealOptions {
  delay?: number;
  stagger?: number;
  y?: number;
  duration?: number;
}

export function useSplitTextReveal(options: UseSplitTextRevealOptions = {}) {
  const { delay = 0, stagger = 0.03, y = 40, duration = 0.8 } = options;
  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const splitRef = useRef<SplitText | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const split = new SplitText(el, { type: "chars,words" });
    splitRef.current = split;

    const chars = split.chars as unknown as HTMLElement[];
    gsap.set(chars, { y, opacity: 0, force3D: true });

    gsap.to(chars, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      force3D: true,
    });

    return () => {
      splitRef.current?.revert();
    };
  }, [enabled, delay, stagger, y, duration]);

  return ref;
}
