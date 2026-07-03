/**
 * useVelocityText Hook
 *
 * Applies scroll-velocity-based skewX and blur to split text characters.
 * Characters at different "depth" values respond differently, creating parallax.
 * Uses native scroll events (not Observer) to work with Lenis.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useAnimationConfig } from "./use-animation-config";

interface UseVelocityTextOptions {
  maxSkew?: number;
  maxBlur?: number;
  depth?: number;
}

interface DepthChar {
  el: HTMLElement;
  depthFactor: number;
}

export function useVelocityText(options: UseVelocityTextOptions = {}) {
  const { maxSkew = 8, maxBlur = 2, depth = 1 } = options;
  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const charsRef = useRef<DepthChar[]>([]);
  const splitRef = useRef<SplitText | null>(null);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const split = new SplitText(el, { type: "chars" });
    splitRef.current = split;

    const chars = split.chars as unknown as HTMLElement[];
    const depthFactors = chars.map(() => 0.3 + Math.random() * depth);
    charsRef.current = chars.map((char, i) => ({
      el: char,
      depthFactor: depthFactors[i] ?? 0.5,
    }));

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY.current);
      lastScrollY.current = window.scrollY;
      velocityRef.current = Math.max(velocityRef.current, delta);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      const v = velocityRef.current;
      const targetSkew = Math.min(v * 0.15, maxSkew);
      const targetBlur = Math.min(v * 0.03, maxBlur);

      charsRef.current.forEach(({ el: char, depthFactor }) => {
        gsap.set(char, {
          skewX: targetSkew * depthFactor,
          filter: `blur(${String(targetBlur * depthFactor)}px)`,
          force3D: true,
        });
      });

      velocityRef.current *= 0.9;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      splitRef.current?.revert();
    };
  }, [enabled, maxSkew, maxBlur, depth]);

  return ref;
}
