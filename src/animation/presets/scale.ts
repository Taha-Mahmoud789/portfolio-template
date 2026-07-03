/**
 * Scale Animation Presets
 *
 * Pre-configured scale animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Scale in preset */
export const scaleIn: AnimationPreset = {
  name: "scaleIn",
  engine: "framer",
  framerConfig: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Scale up preset */
export const scaleUp: AnimationPreset = {
  name: "scaleUp",
  engine: "framer",
  framerConfig: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Scale down preset */
export const scaleDown: AnimationPreset = {
  name: "scaleDown",
  engine: "framer",
  framerConfig: {
    initial: { scale: 1.2, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Scale bounce preset */
export const scaleBounce: AnimationPreset = {
  name: "scaleBounce",
  engine: "framer",
  framerConfig: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

/** Scale pulse preset */
export const scalePulse: AnimationPreset = {
  name: "scalePulse",
  engine: "framer",
  framerConfig: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1] },
    transition: {
      duration: ANIMATION_DURATIONS.slow,
      ease: ANIMATION_EASINGS.easeInOut,
      repeat: Infinity,
    },
  },
};

/** Scale presets collection */
export const scalePresets = {
  scaleIn,
  scaleUp,
  scaleDown,
  scaleBounce,
  scalePulse,
} as const;
