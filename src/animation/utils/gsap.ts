/**
 * GSAP Utilities
 *
 * Utility functions for GSAP animations.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



/** Kill all animations on an element */
export function killAnimations(element: HTMLElement | string): void {
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (el) {
    gsap.killTweensOf(el);
  }
}

/** Kill all ScrollTriggers */
export function killScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/** Refresh all ScrollTriggers */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

/** Create a GSAP context for cleanup */
export function createGsapContext(
  scope: HTMLElement | string,
  callback: (context: gsap.Context) => void,
): () => void {
  const context = gsap.context(callback, scope);
  return () => context.revert();
}

/** Animate an element with GSAP */
export function animate(
  target: HTMLElement | string | HTMLElement[],
  vars: gsap.TweenVars,
): gsap.core.Tween {
  return gsap.to(target, vars);
}

/** Animate from state */
export function animateFrom(
  target: HTMLElement | string | HTMLElement[],
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.fromTo(target, fromVars, toVars);
}





/** Get element's computed transform */
export function getTransform(element: HTMLElement): {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
} {
  const style = gsap.getProperty(element, "transform") as string;
  const matrix = new DOMMatrixReadOnly(style || "matrix(1, 0, 0, 1, 0, 0)");
  return {
    x: matrix.m41,
    y: matrix.m42,
    scale: Math.sqrt(matrix.m11 * matrix.m11 + matrix.m12 * matrix.m12),
    rotation: Math.atan2(matrix.m12, matrix.m11) * (180 / Math.PI),
    opacity: gsap.getProperty(element, "opacity") as number,
  };
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** Linear interpolation */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/** Smooth step function */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Normalize a value to 0-1 range */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/** Convert degrees to radians */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Convert radians to degrees */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/** Calculate distance between two points */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/** Ease function implementations */
export const easings = {
  /** Linear easing */
  linear: (t: number) => t,
  /** Ease in quad */
  easeInQuad: (t: number) => t * t,
  /** Ease out quad */
  easeOutQuad: (t: number) => t * (2 - t),
  /** Ease in out quad */
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  /** Ease in cubic */
  easeInCubic: (t: number) => t * t * t,
  /** Ease out cubic */
  easeOutCubic: (t: number) => --t * t * t + 1,
  /** Ease in out cubic */
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  /** Ease in expo */
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  /** Ease out expo */
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  /** Ease in out expo */
  easeInOutExpo: (t: number) => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) {
      return (Math.pow(2, 20 * t - 10) / 2) * 1;
    }
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
} as const;
