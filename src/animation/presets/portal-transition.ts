/**
 * Portal Transition Animation Presets
 *
 * Pre-configured portal transition animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import type { Variants } from "framer-motion";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Portal shrink transition */
export const portalShrink: AnimationPreset<Variants> = {
  name: "portalShrink",
  engine: "framer",
  variants: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: 0,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeIn },
    },
    exit: {
      scale: 1,
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
    },
  },
};

/** Portal expand transition */
export const portalExpand: AnimationPreset<Variants> = {
  name: "portalExpand",
  engine: "framer",
  variants: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Portal blur transition */
export const portalBlur: AnimationPreset<Variants> = {
  name: "portalBlur",
  engine: "framer",
  variants: {
    initial: { filter: "blur(10px)", opacity: 0 },
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeOut },
    },
    exit: {
      filter: "blur(10px)",
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Portal transition presets collection */
export const portalTransitionPresets = {
  portalShrink,
  portalExpand,
  portalBlur,
} as const;
