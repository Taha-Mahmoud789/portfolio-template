/**
 * Semantic Elevation Tokens
 *
 * Maps shadow + blur to contextual elevation levels.
 * Components USE these tokens.
 */

import { shadow, blur } from "../primitives/shadow";
import { color } from "./color";

export const elevation = {
  // --- Level-based ---
  "elevation-0": shadow.none,
  "elevation-1": shadow.xs,
  "elevation-2": shadow.sm,
  "elevation-3": shadow.md,
  "elevation-4": shadow.lg,
  "elevation-5": shadow.xl,

  // --- Semantic ---
  card: shadow.sm,
  dropdown: shadow.lg,
  modal: shadow["2xl"],
  popover: shadow.lg,
  toast: shadow.xl,
  tooltip: shadow.sm,
  sticky: shadow.sm,
  inner: shadow.inner,
} as const;

export const blurSemantic = {
  none: blur.none,
  sm: blur.sm,
  md: blur.md,
  lg: blur.lg,
  xl: blur.xl,
  "2xl": blur["2xl"],
  "3xl": blur["3xl"],
} as const;

export const glass = {
  bg: color["surface-overlay"],
  "bg-heavy": color["surface-overlay"],
  "bg-light": color["surface-overlay"],
  border: color["border-subtle"],
  shadow: shadow.sm,
} as const;

export type ElevationToken = keyof typeof elevation;
export type BlurToken = keyof typeof blurSemantic;
export type GlassToken = keyof typeof glass;
