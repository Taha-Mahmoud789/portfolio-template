/**
 * Fade Animation Presets
 *
 * Pre-configured fade animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Fade in preset */
export const fadeIn: AnimationPreset = {
  name: "fadeIn",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Fade in up preset */
export const fadeInUp: AnimationPreset = {
  name: "fadeInUp",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Fade in down preset */
export const fadeInDown: AnimationPreset = {
  name: "fadeInDown",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Fade in left preset */
export const fadeInLeft: AnimationPreset = {
  name: "fadeInLeft",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Fade in right preset */
export const fadeInRight: AnimationPreset = {
  name: "fadeInRight",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slow fade preset */
export const fadeSlow: AnimationPreset = {
  name: "fadeSlow",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeInOut },
  },
};

/** Fade in with scale preset */
export const fadeInScale: AnimationPreset = {
  name: "fadeInScale",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Fade presets collection */
export const fadePresets = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeSlow,
  fadeInScale,
} as const;
