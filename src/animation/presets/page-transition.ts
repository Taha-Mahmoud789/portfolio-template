/**
 * Page Transition Animation Presets
 *
 * Pre-configured page transition animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import type { Variants } from "framer-motion";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Page fade transition */
export const pageFade: AnimationPreset<Variants> = {
  name: "pageFade",
  engine: "framer",
  variants: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
    },
    exit: {
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Page slide up transition */
export const pageSlideUp: AnimationPreset<Variants> = {
  name: "pageSlideUp",
  engine: "framer",
  variants: {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Page slide left transition */
export const pageSlideLeft: AnimationPreset<Variants> = {
  name: "pageSlideLeft",
  engine: "framer",
  variants: {
    initial: { x: 100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Page scale transition */
export const pageScale: AnimationPreset<Variants> = {
  name: "pageScale",
  engine: "framer",
  variants: {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Page transition presets collection */
export const pageTransitionPresets = {
  pageFade,
  pageSlideUp,
  pageSlideLeft,
  pageScale,
} as const;
