/**
 * useCharacterAssembly Hook
 *
 * Characters start at random positions across the viewport and assemble
 * into the final text as you scroll. Each character has a random delay
 * and depth for an organic feel.
 */

import { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useAnimationConfig } from "./use-animation-config";

interface UseCharacterAssemblyOptions {
  start?: string;
  end?: string;
  scatter?: number;
  duration?: number;
}

interface CharMeta {
  el: HTMLElement;
  startX: number;
  startY: number;
  startRotation: number;
  delay: number;
}

export function useCharacterAssembly(options: UseCharacterAssemblyOptions = {}) {
  const {
    start = "top 80%",
    end = "bottom 20%",
    scatter = 300,
    duration = 1,
  } = options;
  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const metaRef = useRef<CharMeta[]>([]);

  const viewport = useMemo(
    () => ({
      w: typeof window !== "undefined" ? window.innerWidth : 1200,
      h: typeof window !== "undefined" ? window.innerHeight : 800,
    }),
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const split = new SplitText(el, { type: "chars" });
    splitRef.current = split;

    const chars = split.chars as unknown as HTMLElement[];
    metaRef.current = chars.map((char, i) => ({
      el: char,
      startX: (Math.random() - 0.5) * scatter * 2,
      startY: (Math.random() - 0.5) * scatter * 2,
      startRotation: (Math.random() - 0.5) * 90,
      delay: i * 0.008,
    }));

    metaRef.current.forEach(({ el: char, startX, startY, startRotation }) => {
      gsap.set(char, {
        x: startX,
        y: startY,
        rotation: startRotation,
        opacity: 0,
        force3D: true,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: 0.6,
      },
    });

    tl.to(
      chars,
      {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration,
        ease: "power3.out",
        stagger: 0.008,
        force3D: true,
      },
      0,
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      splitRef.current?.revert();
    };
  }, [enabled, start, end, scatter, duration, viewport.w, viewport.h]);

  return ref;
}
