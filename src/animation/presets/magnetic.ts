/**
 * Magnetic Animation Presets
 *
 * Pre-configured magnetic animation presets.
 */

import type { AnimationPreset } from "../types/animation";

/** Magnetic default */
export const magneticDefault: AnimationPreset = {
  name: "magneticDefault",
  engine: "framer",
  framerConfig: {
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      mass: 0.1,
    },
  },
};

/** Magnetic strong */
export const magneticStrong: AnimationPreset = {
  name: "magneticStrong",
  engine: "framer",
  framerConfig: {
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      mass: 0.1,
    },
  },
};

/** Magnetic gentle */
export const magneticGentle: AnimationPreset = {
  name: "magneticGentle",
  engine: "framer",
  framerConfig: {
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.5,
    },
  },
};

/** Magnetic presets collection */
export const magneticPresets = {
  magneticDefault,
  magneticStrong,
  magneticGentle,
} as const;
