/**
 * useMagnetic Hook
 *
 * Creates magnetic effect that follows mouse movement.
 * Supports "magnetic" (default) and "follow" modes.
 *
 * @example
 * ```tsx
 * // Magnetic mode (default)
 * const { ref, animate } = useMagnetic({ strength: 0.3 });
 * <motion.button ref={ref} animate={animate}>Magnetic Button</motion.button>
 *
 * // Follow mode
 * const { ref, position } = useMagnetic({ mode: "follow", scale: 0.5 });
 * <motion.button ref={ref} animate={position}>Follow Button</motion.button>
 * ```
 */

import { useRef, useState, useCallback, useEffect } from "react";
import { useAnimationConfig } from "./use-animation-config";
import type { UseMagneticOptions, UseMagneticReturn } from "../types/hooks";

/**
 * Hook for magnetic mouse follow effects.
 *
 * @param options - Configuration options
 * @returns Object with ref, position, isHovered, and animate
 */
export function useMagnetic(options: UseMagneticOptions = {}): UseMagneticReturn {
  const { strength = 0.3, range = 100, mode = "magnetic", scale = 1 } = options;

  const { enabled } = useAnimationConfig();
  const ref = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || !enabled) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        if (mode === "follow") {
          setPosition({ x: deltaX * scale, y: deltaY * scale });
        } else {
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          if (distance < range) {
            setPosition({ x: deltaX * strength, y: deltaY * strength });
          }
        }
      });
    },
    [enabled, mode, strength, range, scale],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return {
    ref,
    position,
    isHovered,
    animate: {
      x: position.x,
      y: position.y,
    },
  };
}
