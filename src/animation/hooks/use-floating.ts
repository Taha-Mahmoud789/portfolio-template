/**
 * useFloating Hook
 *
 * Creates a floating animation effect.
 */

import { useRef, useEffect, useState } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseFloatingOptions, UseFloatingReturn } from "../types/hooks";

export function useFloating(options: UseFloatingOptions = {}): UseFloatingReturn {
  const { amplitude = 10, frequency = 0.02, offset = 0 } = options;

  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [floatingOffset, setFloatingOffset] = useState({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number;

    const animate = (time: number) => {
      if (!isVisibleRef.current) {
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      const y = Math.sin(elapsed * frequency + offset) * amplitude;
      const x = Math.cos(elapsed * frequency * 0.5 + offset) * (amplitude * 0.5);

      setFloatingOffset({ x, y });

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, amplitude, frequency, offset]);

  return {
    ref,
    offset: floatingOffset,
  };
}
