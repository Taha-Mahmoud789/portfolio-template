/**
 * Infinite Loop Animation Presets
 *
 * Pre-configured infinite loop animation presets.
 * Re-exports canonical presets from rotate.ts and scale.ts.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { rotateContinuous } from "./rotate";
import { scalePulse } from "./scale";

export { rotateContinuous as infiniteRotate } from "./rotate";
export { scalePulse as infinitePulse } from "./scale";

/** Infinite bounce (unique) */
export const infiniteBounce: AnimationPreset = {
  name: "infiniteBounce",
  engine: "framer",
  framerConfig: {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
    },
    transition: {
      duration: ANIMATION_DURATIONS.slower,
      ease: ANIMATION_EASINGS.easeInOut,
      repeat: Infinity,
    },
  },
};

/** Infinite glow (unique) */
export const infiniteGlow: AnimationPreset = {
  name: "infiniteGlow",
  engine: "framer",
  framerConfig: {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: ANIMATION_DURATIONS.slower,
      ease: ANIMATION_EASINGS.easeInOut,
      repeat: Infinity,
    },
  },
};

/** Infinite loop presets collection */
export const infiniteLoopPresets = {
  infiniteRotate: rotateContinuous,
  infiniteBounce,
  infinitePulse: scalePulse,
  infiniteGlow,
} as const;
