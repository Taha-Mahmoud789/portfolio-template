/**
 * Slide Animation Presets
 *
 * Pre-configured slide animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Slide up preset */
export const slideUp: AnimationPreset = {
  name: "slideUp",
  engine: "framer",
  framerConfig: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide down preset */
export const slideDown: AnimationPreset = {
  name: "slideDown",
  engine: "framer",
  framerConfig: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide left preset */
export const slideLeft: AnimationPreset = {
  name: "slideLeft",
  engine: "framer",
  framerConfig: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide right preset */
export const slideRight: AnimationPreset = {
  name: "slideRight",
  engine: "framer",
  framerConfig: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide in from bottom preset */
export const slideInFromBottom: AnimationPreset = {
  name: "slideInFromBottom",
  engine: "framer",
  framerConfig: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide in from top preset */
export const slideInFromTop: AnimationPreset = {
  name: "slideInFromTop",
  engine: "framer",
  framerConfig: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide in from left preset */
export const slideInFromLeft: AnimationPreset = {
  name: "slideInFromLeft",
  engine: "framer",
  framerConfig: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide in from right preset */
export const slideInFromRight: AnimationPreset = {
  name: "slideInFromRight",
  engine: "framer",
  framerConfig: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Slide presets collection */
export const slidePresets = {
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  slideInFromBottom,
  slideInFromTop,
  slideInFromLeft,
  slideInFromRight,
} as const;
