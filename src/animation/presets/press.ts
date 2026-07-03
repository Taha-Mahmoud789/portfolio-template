/**
 * Press Effect Animation Presets
 *
 * Pre-configured press effect animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { DEFAULT_SPRING } from "../constants";

/** Press scale */
export const pressScale: AnimationPreset = {
  name: "pressScale",
  engine: "framer",
  framerConfig: {
    initial: { scale: 1 },
    animate: { scale: 0.95 },
    transition: { type: "spring", ...DEFAULT_SPRING },
  },
};

/** Press bounce */
export const pressBounce: AnimationPreset = {
  name: "pressBounce",
  engine: "framer",
  framerConfig: {
    initial: { scale: 1 },
    animate: { scale: [1, 0.9, 1.05, 1] },
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/** Press rotate */
export const pressRotate: AnimationPreset = {
  name: "pressRotate",
  engine: "framer",
  framerConfig: {
    initial: { rotate: 0 },
    animate: { rotate: -3 },
    transition: { type: "spring", ...DEFAULT_SPRING },
  },
};

/** Press squeeze */
export const pressSqueeze: AnimationPreset = {
  name: "pressSqueeze",
  engine: "framer",
  framerConfig: {
    initial: { scaleX: 1, scaleY: 1 },
    animate: { scaleX: 1.02, scaleY: 0.98 },
    transition: { type: "spring", ...DEFAULT_SPRING },
  },
};

/** Press effect presets collection */
export const pressPresets = {
  pressScale,
  pressBounce,
  pressRotate,
  pressSqueeze,
} as const;
