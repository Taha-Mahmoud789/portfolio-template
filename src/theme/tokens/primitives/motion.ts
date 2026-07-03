/**
 * Primitive Motion Tokens
 *
 * Raw animation timing values.
 * NEVER used directly in components.
 */

export const duration = {
  0: "0ms",
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  400: "400ms",
  500: "500ms",
  600: "600ms",
  700: "700ms",
  800: "800ms",
  900: "900ms",
  1000: "1000ms",
  1500: "1500ms",
  2000: "2000ms",
} as const;

export const easing = {
  linear: "linear",
  ease: "ease",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  inExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  outExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;
