/**
 * Semantic Spacing Tokens
 *
 * Contextual spacing assignments for layout and components.
 * Components USE these tokens.
 */

import { spacing, containerWidth } from "../primitives/spacing";

export const spacingSemantic = {
  // --- Component Padding ---
  "padding-xs": spacing[1],
  "padding-sm": spacing[2],
  "padding-md": spacing[3],
  "padding-lg": spacing[4],
  "padding-xl": spacing[6],
  "padding-2xl": spacing[8],

  // --- Component Gap ---
  "gap-xs": spacing[1],
  "gap-sm": spacing[2],
  "gap-md": spacing[3],
  "gap-lg": spacing[4],
  "gap-xl": spacing[6],

  // --- Section Spacing (derived from spacing scale) ---
  "section-xs": spacing[8],
  "section-sm": spacing[12],
  "section-md": spacing[16],
  "section-lg": spacing[24],
  "section-xl": spacing[32],
  "section-2xl": spacing[48],

  // --- Layout ---
  "container-sm": containerWidth.sm,
  "container-md": containerWidth.md,
  "container-lg": containerWidth.lg,
  "container-xl": containerWidth.xl,
  "container-2xl": containerWidth["2xl"],
  "container-3xl": containerWidth["3xl"],
  "container-prose": containerWidth.prose,

  // --- Content Widths ---
  "content-narrow": containerWidth.prose,
  "content-medium": containerWidth.lg,
  "content-wide": containerWidth.xl,
  "content-full": "100%",
} as const;

export type SpacingToken = keyof typeof spacingSemantic;
