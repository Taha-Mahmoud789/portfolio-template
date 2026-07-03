/**
 * Floating Animation Presets
 *
 * Pre-configured floating animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS } from "../constants";

/** Floating gentle */
export const floatingGentle: AnimationPreset = {
  name: "floatingGentle",
  engine: "framer",
  framerConfig: {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: ANIMATION_DURATIONS.slower,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
};

/** Floating moderate */
export const floatingModerate: AnimationPreset = {
  name: "floatingModerate",
  engine: "framer",
  framerConfig: {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: ANIMATION_DURATIONS.slowest,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
};

/** Floating strong */
export const floatingStrong: AnimationPreset = {
  name: "floatingStrong",
  engine: "framer",
  framerConfig: {
    initial: { y: 0 },
    animate: {
      y: [-15, 15, -15],
      transition: {
        duration: ANIMATION_DURATIONS.ultra,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
};

/** Floating 3D */
export const floating3D: AnimationPreset = {
  name: "floating3D",
  engine: "framer",
  framerConfig: {
    initial: { y: 0, rotateX: 0, rotateY: 0 },
    animate: {
      y: [-10, 10, -10],
      rotateX: [-2, 2, -2],
      rotateY: [-2, 2, -2],
      transition: {
        duration: ANIMATION_DURATIONS.cinematic,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  },
};

/** Floating presets collection */
export const floatingPresets = {
  floatingGentle,
  floatingModerate,
  floatingStrong,
  floating3D,
} as const;
