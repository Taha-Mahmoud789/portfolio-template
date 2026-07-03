/**
 * Semantic Opacity Tokens
 *
 * Contextual opacity assignments.
 * Components USE these tokens.
 */

import { opacity } from "../primitives/opacity";

export const opacitySemantic = {
  // --- Semantic ---
  hidden: opacity[0],
  translucent: opacity[50],
  visible: opacity[100],

  // --- States ---
  disabled: opacity[50],
  hover: opacity[80],
  active: opacity[90],
  overlay: opacity[50],

  // --- Opacity Levels (for layering) ---
  "level-0": opacity[0],
  "level-5": opacity[5],
  "level-10": opacity[10],
  "level-20": opacity[20],
  "level-25": opacity[25],
  "level-30": opacity[30],
  "level-40": opacity[40],
  "level-50": opacity[50],
  "level-60": opacity[60],
  "level-70": opacity[70],
  "level-75": opacity[75],
  "level-80": opacity[80],
  "level-90": opacity[90],
  "level-95": opacity[95],
  "level-100": opacity[100],
} as const;

export type OpacityToken = keyof typeof opacitySemantic;
