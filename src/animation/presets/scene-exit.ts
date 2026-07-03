/**
 * Scene Exit Animation Presets
 *
 * Pre-configured scene exit animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import type { Variants } from "framer-motion";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Scene fade out */
export const sceneFadeOut: AnimationPreset<Variants> = {
  name: "sceneFadeOut",
  engine: "framer",
  variants: {
    exit: {
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Scene slide out */
export const sceneSlideOut: AnimationPreset<Variants> = {
  name: "sceneSlideOut",
  engine: "framer",
  variants: {
    exit: {
      y: -50,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Scene scale out */
export const sceneScaleOut: AnimationPreset<Variants> = {
  name: "sceneScaleOut",
  engine: "framer",
  variants: {
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Scene cinematic exit */
export const sceneCinematicExit: AnimationPreset<Variants> = {
  name: "sceneCinematicExit",
  engine: "framer",
  variants: {
    exit: {
      scale: 1.1,
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeIn },
    },
  },
};

/** Scene exit presets collection */
export const sceneExitPresets = {
  sceneFadeOut,
  sceneSlideOut,
  sceneScaleOut,
  sceneCinematicExit,
} as const;
