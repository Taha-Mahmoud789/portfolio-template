import { useState, useEffect } from "react";

interface ScrollPosition {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right" | null;
  progress: number;
}

export function useScrollPosition(): ScrollPosition {
  const [scroll, setScroll] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    progress: 0,
  });

  useEffect(() => {
    let lastY = window.scrollY;

    function handler() {
      const y = window.scrollY;
      const x = window.scrollX;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const direction = y > lastY ? "down" : y < lastY ? "up" : null;

      setScroll({
        x,
        y,
        direction,
        progress: maxScroll > 0 ? y / maxScroll : 0,
      });

      lastY = y;
    }

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return scroll;
}

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handler() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    }

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return progress;
}

export function useScrollDirection(): "up" | "down" | null {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;

    function handler() {
      const y = window.scrollY;
      setDirection(y > lastY ? "down" : y < lastY ? "up" : null);
      lastY = y;
    }

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return direction;
}
