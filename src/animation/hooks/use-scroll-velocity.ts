/**
 * useScrollVelocity Hook
 *
 * Tracks scroll velocity in real-time using native scroll events.
 * Works with Lenis smooth scrolling (Observer doesn't).
 * Returns velocity (px/frame), direction, and scrolling state.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { useAnimationConfig } from "./use-animation-config";

interface ScrollVelocityState {
  velocity: number;
  direction: number;
  isScrolling: boolean;
}

export function useScrollVelocity(): ScrollVelocityState {
  const { enabled } = useAnimationConfig();
  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    direction: 0,
    isScrolling: false,
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    if (!enabled) return;

    const currentY = window.scrollY;
    const delta = currentY - lastScrollY.current;
    lastScrollY.current = currentY;

    const absDelta = Math.abs(delta);
    const dir = delta > 0 ? 1 : -1;

    setState({ velocity: absDelta, direction: dir, isScrolling: true });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, velocity: 0, isScrolling: false }));
    }, 150);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, handleScroll]);

  return state;
}
