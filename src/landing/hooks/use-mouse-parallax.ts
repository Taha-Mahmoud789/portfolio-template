/**
 * useMouseParallax Hook
 *
 * Tracks mouse position and returns normalized values for parallax effects.
 * Returns values from -1 to 1 based on mouse position relative to viewport center.
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface UseMouseParallaxReturn {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMouseParallax(factor = 1): UseMouseParallaxReturn {
  const [position, setPosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const nx = ((e.clientX / window.innerWidth) * 2 - 1) * factor;
        const ny = ((e.clientY / window.innerHeight) * 2 - 1) * factor;
        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: nx,
          normalizedY: ny,
        });
      });
    },
    [factor],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return position;
}
