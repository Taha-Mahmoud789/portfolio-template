/**
 * Hover Effect Animation Presets
 *
 * Pre-configured hover effect animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS, DEFAULT_SPRING } from "../constants";

/** Hover scale */
export const hoverScale: AnimationPreset = {
  name: "hoverScale",
  engine: "framer",
  framerConfig: {
    initial: { scale: 1 },
    animate: { scale: 1.05 },
    transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Hover lift */
export const hoverLift: AnimationPreset = {
  name: "hoverLift",
  engine: "framer",
  framerConfig: {
    initial: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
    animate: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
    transition: { type: "spring", ...DEFAULT_SPRING },
  },
};

/** Hover rotate */
export const hoverRotate: AnimationPreset = {
  name: "hoverRotate",
  engine: "framer",
  framerConfig: {
    initial: { rotate: 0 },
    animate: { rotate: 3 },
    transition: { type: "spring", ...DEFAULT_SPRING },
  },
};

/** Hover glow */
export const hoverGlow: AnimationPreset = {
  name: "hoverGlow",
  engine: "framer",
  framerConfig: {
    initial: { boxShadow: "0 0 0 rgba(0,0,0,0)" },
    animate: { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
    transition: { duration: ANIMATION_DURATIONS.fast, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Hover tilt */
export const hoverTilt: AnimationPreset = {
  name: "hoverTilt",
  engine: "framer",
  framerConfig: {
    initial: { rotateX: 0, rotateY: 0 },
    animate: { rotateX: 5, rotateY: 5 },
    transition: { type: "spring", ...DEFAULT_SPRING },
  },
};

/** Hover effect presets collection */
export const hoverPresets = {
  hoverScale,
  hoverLift,
  hoverRotate,
  hoverGlow,
  hoverTilt,
} as const;
