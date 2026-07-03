/**
 * Animation Easing Constants
 *
 * Easing functions for smooth animations.
 */

export const ANIMATION_EASINGS = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  expoIn: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  expoOut: "cubic-bezier(0.19, 1, 0.22, 1)",
  expoInOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  backIn: "cubic-bezier(0.36, 0, 0.66, -0.56)",
  backOut: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  backInOut: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
  elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

export type AnimationEasing = keyof typeof ANIMATION_EASINGS;

/** Get easing value */
export function getEasing(name: AnimationEasing): string {
  return ANIMATION_EASINGS[name];
}

/** Create custom cubic-bezier easing */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): string {
  return `cubic-bezier(${String(x1)}, ${String(y1)}, ${String(x2)}, ${String(y2)})`;
}

/** GSAP-compatible easing names */
export const GSAP_EASINGS = {
  power1: "power1",
  power2: "power2",
  power3: "power3",
  power4: "power4",
  back: "back",
  elastic: "elastic",
  bounce: "bounce",
  steppps: "steps",
} as const;

export type GsapEasing = keyof typeof GSAP_EASINGS;
