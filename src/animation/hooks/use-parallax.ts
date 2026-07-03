/**
 * useParallax Hook
 *
 * Creates parallax scrolling effect on elements.
 *
 * @example
 * ```tsx
 * const { ref, transform } = useParallax({ speed: 0.5 });
 *
 * <div ref={ref} style={{ transform }}>
 *   Parallax content
 * </div>
 * ```
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseParallaxOptions, UseParallaxReturn } from "../types/hooks";

/**
 * Hook for parallax scrolling effects.
 *
 * @param options - Configuration options
 * @returns Object with ref, progress, and transform
 */
export function useParallax(options: UseParallaxOptions = {}): UseParallaxReturn {
  const { speed = 0.5, direction = "vertical", offset: _offset = 0 } = options;

  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");
  const rafIdRef = useRef<number | null>(null);
  const prevProgressRef = useRef(0);
  const prevTransformRef = useRef("");

  const calculateParallax = useCallback(() => {
    if (!ref.current || !enabled) return;

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distanceFromCenter = elementCenter - viewportCenter;
    const normalizedProgress = distanceFromCenter / (windowHeight / 2);

    const clampedProgress = Math.max(-1, Math.min(1, normalizedProgress));
    if (Math.abs(clampedProgress - prevProgressRef.current) > 0.001) {
      prevProgressRef.current = clampedProgress;
      setProgress(clampedProgress);
    }

    const yOffset = normalizedProgress * speed * 100;
    const xOffset = normalizedProgress * speed * 50;

    let newTransform: string;
    switch (direction) {
      case "horizontal":
        newTransform = `translate3d(${String(xOffset)}px, 0, 0)`;
        break;
      case "diagonal":
        newTransform = `translate3d(${String(xOffset * 0.707)}px, ${String(yOffset * 0.707)}px, 0)`;
        break;
      case "vertical":
      default:
        newTransform = `translate3d(0, ${String(yOffset)}px, 0)`;
    }
    if (newTransform !== prevTransformRef.current) {
      prevTransformRef.current = newTransform;
      setTransform(newTransform);
    }
  }, [enabled, speed, direction]);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        calculateParallax();
        rafIdRef.current = null;
      });
    };

    const handleResize = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        calculateParallax();
        rafIdRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    calculateParallax();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, calculateParallax]);

  return {
    ref,
    progress,
    transform,
  };
}
