/**
 * Semantic Motion Tokens
 *
 * Contextual animation timing assignments.
 * Components USE these tokens.
 */

import { duration, easing } from "../primitives/motion";

export const motion = {
  // --- Semantic Durations ---
  instant: duration[0],
  fast: duration[150],
  normal: duration[300],
  slow: duration[500],
  slower: duration[700],
  slowest: duration[1000],

  // --- Easing ---
  linear: easing.linear,
  ease: easing.ease,
  "ease-in": easing.easeIn,
  "ease-out": easing.easeOut,
  "ease-in-out": easing.easeInOut,
  "ease-in-expo": easing.inExpo,
  "ease-out-expo": easing.outExpo,
  spring: easing.spring,
  bounce: easing.bounce,
} as const;

export type MotionToken = keyof typeof motion;
