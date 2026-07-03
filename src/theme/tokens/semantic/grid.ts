/**
 * Semantic Grid Tokens
 *
 * Grid system assignments.
 * Components USE these tokens.
 */

import { spacing } from "../primitives/spacing";

export const grid = {
  // --- Grid Gaps ---
  "gap-xs": spacing[2],
  "gap-sm": spacing[4],
  "gap-md": spacing[6],
  "gap-lg": spacing[8],
  "gap-xl": spacing[12],

  // --- Grid Margins ---
  "margin-xs": spacing[2],
  "margin-sm": spacing[4],
  "margin-md": spacing[6],
  "margin-lg": spacing[8],
  "margin-xl": spacing[12],
} as const;

export type GridToken = keyof typeof grid;
