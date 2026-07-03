/**
 * Split Text Animation Presets
 *
 * Pre-configured split text animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Split text characters */
export const splitTextChars: AnimationPreset = {
  name: "splitTextChars",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.normal,
    stagger: 0.02,
    ease: ANIMATION_EASINGS.easeOut,
    y: 20,
    opacity: 0,
  },
};

/** Split text words */
export const splitTextWords: AnimationPreset = {
  name: "splitTextWords",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.normal,
    stagger: 0.08,
    ease: ANIMATION_EASINGS.easeOut,
    y: 30,
    opacity: 0,
  },
};

/** Split text lines */
export const splitTextLines: AnimationPreset = {
  name: "splitTextLines",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.normal,
    stagger: 0.15,
    ease: ANIMATION_EASINGS.easeOut,
    y: 40,
    opacity: 0,
  },
};

/** Split text blur */
export const splitTextBlur: AnimationPreset = {
  name: "splitTextBlur",
  engine: "gsap",
  gsapVars: {
    duration: ANIMATION_DURATIONS.slow,
    stagger: 0.05,
    ease: ANIMATION_EASINGS.easeOut,
    filter: "blur(10px)",
    opacity: 0,
  },
};

/** Split text presets collection */
export const splitTextPresets = {
  splitTextChars,
  splitTextWords,
  splitTextLines,
  splitTextBlur,
} as const;
