/**
 * Breakpoint System
 *
 * Single source of truth for all responsive behavior.
 * Consumed by hooks, Tailwind config, and layout components.
 *
 * Mobile-first: min-width approach (Tailwind default).
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export const BREAKPOINT_ORDER: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];

/**
 * Named viewport ranges for semantic use.
 */
export const VIEWPORT_RANGES = {
  mobile: { max: 639 },
  tablet: { min: 640, max: 1023 },
  desktop: { min: 1024, max: 1279 },
  wide: { min: 1280, max: 1535 },
  ultrawide: { min: 1536 },
} as const;

export type ViewportRange = keyof typeof VIEWPORT_RANGES;

/**
 * Media query strings for each viewport range.
 */
export const MEDIA_QUERIES = {
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  wide: "(min-width: 1280px)",
  ultrawide: "(min-width: 1536px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  dark: "(prefers-color-scheme: dark)",
  light: "(prefers-color-scheme: light)",
  hover: "(hover: hover)",
  touch: "(pointer: coarse)",
  fine: "(pointer: fine)",
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
} as const;

/**
 * Safe area insets for notched devices.
 */
export const SAFE_AREAS = {
  top: "env(safe-area-inset-top)",
  right: "env(safe-area-inset-right)",
  bottom: "env(safe-area-inset-bottom)",
  left: "env(safe-area-inset-left)",
} as const;

/**
 * Dynamic viewport units (modern browsers).
 */
export const VIEWPORT_UNITS = {
  height: "100dvh",
  heightSmall: "100svh",
  heightLarge: "100lvh",
  width: "100dvw",
  widthSmall: "100svw",
  widthLarge: "100lvw",
} as const;
