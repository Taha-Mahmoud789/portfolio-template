/**
 * Clip Path Animation Presets
 *
 * Pre-configured clip path animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS, CLIP_PATH_SHAPES } from "../constants";
import { revealFromBottom } from "./reveal";

/** Clip path circle reveal */
export const clipPathCircle: AnimationPreset = {
  name: "clipPathCircle",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: CLIP_PATH_SHAPES.circle },
    animate: { clipPath: CLIP_PATH_SHAPES.circleFull },
    exit: { clipPath: CLIP_PATH_SHAPES.circle },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

export const clipPathInset = revealFromBottom;

/** Clip path polygon reveal */
export const clipPathPolygon: AnimationPreset = {
  name: "clipPathPolygon",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: CLIP_PATH_SHAPES.polygonTop },
    animate: { clipPath: CLIP_PATH_SHAPES.polygonFull },
    exit: { clipPath: CLIP_PATH_SHAPES.polygonTop },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Clip path diamond reveal */
export const clipPathDiamond: AnimationPreset = {
  name: "clipPathDiamond",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: CLIP_PATH_SHAPES.diamond },
    animate: { clipPath: CLIP_PATH_SHAPES.diamondFull },
    exit: { clipPath: CLIP_PATH_SHAPES.diamond },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Clip path presets collection */
export const clipPathPresets = {
  clipPathCircle,
  clipPathInset,
  clipPathPolygon,
  clipPathDiamond,
} as const;
