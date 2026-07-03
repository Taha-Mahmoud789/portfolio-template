/**
 * Number Counter Animation Presets
 *
 * Pre-configured number counter animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Number counter default */
export const numberCounter: AnimationPreset = {
  name: "numberCounter",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.slower,
    ease: ANIMATION_EASINGS.easeOut,
  },
};

/** Number counter fast */
export const numberCounterFast: AnimationPreset = {
  name: "numberCounterFast",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.normal,
    ease: ANIMATION_EASINGS.easeOut,
  },
};

/** Number counter slow */
export const numberCounterSlow: AnimationPreset = {
  name: "numberCounterSlow",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.cinematic,
    ease: ANIMATION_EASINGS.easeInOut,
  },
};

/** Number counter presets collection */
export const numberCounterPresets = {
  numberCounter,
  numberCounterFast,
  numberCounterSlow,
} as const;
