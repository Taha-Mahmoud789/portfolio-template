/**
 * Semantic Border Tokens
 *
 * Contextual border width assignments.
 * Components USE these tokens.
 */

import { borderWidth } from "../primitives/border";

export const borderSemantic = {
  none: borderWidth[0],
  thin: borderWidth[1],
  medium: borderWidth[2],
  thick: borderWidth[4],
  heavy: borderWidth[8],

  // --- Semantic ---
  default: borderWidth[1],
  emphasis: borderWidth[2],
  focus: borderWidth[2],
} as const;

export type BorderToken = keyof typeof borderSemantic;
