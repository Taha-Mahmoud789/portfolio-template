/**
 * Loading Sequence Animation Presets
 *
 * Pre-configured loading sequence animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import type { Variants } from "framer-motion";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Loading spinner */
export const loadingSpinner: AnimationPreset = {
  name: "loadingSpinner",
  engine: "framer",
  framerConfig: {
    initial: { rotate: 0 },
    animate: { rotate: 360 },
    transition: {
      duration: ANIMATION_DURATIONS.slower,
      ease: ANIMATION_EASINGS.linear,
      repeat: Infinity,
    },
  },
};

/** Loading dots */
export const loadingDots: AnimationPreset<Variants> = {
  name: "loadingDots",
  engine: "framer",
  variants: {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: ANIMATION_DURATIONS.slower,
        ease: ANIMATION_EASINGS.easeInOut,
        repeat: Infinity,
      },
    },
  },
};

/** Loading pulse */
export const loadingPulse: AnimationPreset = {
  name: "loadingPulse",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0.5, scale: 0.95 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [0.95, 1, 0.95],
    },
    transition: {
      duration: ANIMATION_DURATIONS.slower,
      ease: ANIMATION_EASINGS.easeInOut,
      repeat: Infinity,
    },
  },
};

/** Loading bar */
export const loadingBar: AnimationPreset = {
  name: "loadingBar",
  engine: "framer",
  framerConfig: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: {
      duration: ANIMATION_DURATIONS.cinematic,
      ease: ANIMATION_EASINGS.easeInOut,
    },
  },
};

/** Loading sequence presets collection */
export const loadingPresets = {
  loadingSpinner,
  loadingDots,
  loadingPulse,
  loadingBar,
} as const;
