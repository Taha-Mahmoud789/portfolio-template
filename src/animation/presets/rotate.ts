/**
 * Rotate Animation Presets
 *
 * Pre-configured rotate animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Rotate in preset */
export const rotateIn: AnimationPreset = {
  name: "rotateIn",
  engine: "framer",
  framerConfig: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Rotate left preset */
export const rotateLeft: AnimationPreset = {
  name: "rotateLeft",
  engine: "framer",
  framerConfig: {
    initial: { rotate: -90, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: -90, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Rotate right preset */
export const rotateRight: AnimationPreset = {
  name: "rotateRight",
  engine: "framer",
  framerConfig: {
    initial: { rotate: 90, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 90, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Rotate continuous preset */
export const rotateContinuous: AnimationPreset = {
  name: "rotateContinuous",
  engine: "framer",
  framerConfig: {
    initial: { rotate: 0 },
    animate: { rotate: 360 },
    transition: {
      duration: ANIMATION_DURATIONS.slowest,
      ease: ANIMATION_EASINGS.linear,
      repeat: Infinity,
    },
  },
};

/** Rotate presets collection */
export const rotatePresets = {
  rotateIn,
  rotateLeft,
  rotateRight,
  rotateContinuous,
} as const;
