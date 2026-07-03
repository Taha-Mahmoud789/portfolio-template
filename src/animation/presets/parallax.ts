/**
 * Parallax Animation Presets
 *
 * Pre-configured parallax animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Parallax slow */
export const parallaxSlow: AnimationPreset = {
  name: "parallaxSlow",
  engine: "framer",
  framerConfig: {
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.linear },
  },
};

/** Parallax medium */
export const parallaxMedium: AnimationPreset = {
  name: "parallaxMedium",
  engine: "framer",
  framerConfig: {
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.linear },
  },
};

/** Parallax fast */
export const parallaxFast: AnimationPreset = {
  name: "parallaxFast",
  engine: "framer",
  framerConfig: {
    transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.linear },
  },
};

/** Parallax presets collection */
export const parallaxPresets = {
  parallaxSlow,
  parallaxMedium,
  parallaxFast,
} as const;
