/**
 * Scene Entrance Animation Presets
 *
 * Pre-configured scene entrance animation presets.
 * Re-exports canonical presets from fade.ts and scale.ts.
 */

import type { AnimationPreset } from "../types/animation";
import type { Variants } from "framer-motion";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";
import { fadeIn, fadeInUp } from "./fade";
import { scaleUp } from "./scale";

export { fadeIn as sceneFadeIn } from "./fade";
export { fadeInUp as sceneSlideIn } from "./fade";
export { scaleUp as sceneScaleIn } from "./scale";

/** Scene cinematic entrance (unique) */
export const sceneCinematic: AnimationPreset<Variants> = {
  name: "sceneCinematic",
  engine: "framer",
  variants: {
    initial: { scale: 1.1, opacity: 0, filter: "blur(10px)" },
    animate: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
    },
  },
};

/** Scene entrance presets collection */
export const sceneEntrancePresets = {
  sceneFadeIn: fadeIn,
  sceneSlideIn: fadeInUp,
  sceneScaleIn: scaleUp,
  sceneCinematic,
} as const;
