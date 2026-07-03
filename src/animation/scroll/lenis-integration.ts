/**
 * Lenis Integration
 *
 * Utilities for integrating Lenis smooth scrolling with the animation engine.
 */

import Lenis from "lenis";

export interface LenisConfig {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
}

/** Create a Lenis instance with default configuration */
export function createLenis(config: LenisConfig = {}): Lenis {
  const {
    duration = 1.2,
    easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel = true,
    wheelMultiplier = 1,
    touchMultiplier = 2,
  } = config;

  return new Lenis({
    duration,
    easing,
    smoothWheel,
    wheelMultiplier,
    touchMultiplier,
  });
}

/** Connect Lenis to GSAP ScrollTrigger */
export function connectLenisToScrollTrigger(lenis: Lenis): void {
  lenis.on("scroll", () => {
    // Import ScrollTrigger dynamically to avoid circular dependency
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      ScrollTrigger.update();
    });
  });

  // Override GSAP's ticker to use Lenis
  void import("gsap").then(({ gsap }) => {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  });
}

/** Get Lenis scroll progress */
export function getLenisProgress(lenis: Lenis): number {
  return lenis.progress || 0;
}

/** Get Lenis scroll direction */
export function getLenisDirection(lenis: Lenis): "up" | "down" | null {
  const velocity = lenis.velocity;
  if (velocity === 0) return null;
  return velocity > 0 ? "down" : "up";
}

/** Stop Lenis scrolling */
export function stopLenis(lenis: Lenis): void {
  lenis.stop();
}

/** Start Lenis scrolling */
export function startLenis(lenis: Lenis): void {
  lenis.start();
}

/** Destroy Lenis instance */
export function destroyLenis(lenis: Lenis): void {
  lenis.destroy();
}
