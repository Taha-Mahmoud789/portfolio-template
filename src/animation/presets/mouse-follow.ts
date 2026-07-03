/**
 * Mouse Follow Animation Presets
 *
 * Pre-configured mouse follow animation presets.
 */

import type { AnimationPreset } from "../types/animation";

/** Mouse follow default */
export const mouseFollowDefault: AnimationPreset = {
  name: "mouseFollowDefault",
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

/** Mouse follow smooth */
export const mouseFollowSmooth: AnimationPreset = {
  name: "mouseFollowSmooth",
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

/** Mouse follow snappy */
export const mouseFollowSnappy: AnimationPreset = {
  name: "mouseFollowSnappy",
  engine: "framer",
  framerConfig: {
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.1,
    },
  },
};

/** Mouse follow presets collection */
export const mouseFollowPresets = {
  mouseFollowDefault,
  mouseFollowSmooth,
  mouseFollowSnappy,
} as const;
