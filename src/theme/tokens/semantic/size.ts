/**
 * Semantic Size Tokens
 *
 * Component-level size assignments.
 * Components USE these tokens.
 */

import { spacing } from "../primitives/spacing";

export const size = {
  // --- Icon Sizes ---
  "icon-xs": spacing[3],
  "icon-sm": spacing[4],
  "icon-md": spacing[5],
  "icon-lg": spacing[6],
  "icon-xl": spacing[8],

  // --- Avatar Sizes ---
  "avatar-xs": spacing[6],
  "avatar-sm": spacing[8],
  "avatar-md": spacing[10],
  "avatar-lg": spacing[12],
  "avatar-xl": spacing[16],

  // --- Button Heights ---
  "button-xs": spacing[7],
  "button-sm": spacing[8],
  "button-md": spacing[10],
  "button-lg": spacing[12],
  "button-xl": spacing[14],

  // --- Input Heights ---
  "input-xs": spacing[7],
  "input-sm": spacing[8],
  "input-md": spacing[10],
  "input-lg": spacing[12],

  // --- Control Heights (generic) ---
  "control-xs": spacing[7],
  "control-sm": spacing[8],
  "control-md": spacing[10],
  "control-lg": spacing[12],
} as const;

export type SizeToken = keyof typeof size;
