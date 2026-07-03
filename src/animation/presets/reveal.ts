/**
 * Reveal Animation Presets
 *
 * Pre-configured reveal animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS, CLIP_PATH_SHAPES } from "../constants";

/** Reveal from bottom */
export const revealFromBottom: AnimationPreset = {
  name: "revealFromBottom",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: CLIP_PATH_SHAPES.inset, opacity: 0 },
    animate: { clipPath: CLIP_PATH_SHAPES.insetFull, opacity: 1 },
    exit: { clipPath: CLIP_PATH_SHAPES.inset, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Reveal from top */
export const revealFromTop: AnimationPreset = {
  name: "revealFromTop",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
    animate: { clipPath: "inset(0 0 0 0)", opacity: 1 },
    exit: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Reveal from left */
export const revealFromLeft: AnimationPreset = {
  name: "revealFromLeft",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    animate: { clipPath: "inset(0 0 0 0)", opacity: 1 },
    exit: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Reveal from right */
export const revealFromRight: AnimationPreset = {
  name: "revealFromRight",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: "inset(0 0 0 100%)", opacity: 0 },
    animate: { clipPath: "inset(0 0 0 0)", opacity: 1 },
    exit: { clipPath: "inset(0 0 0 100%)", opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Reveal circle */
export const revealCircle: AnimationPreset = {
  name: "revealCircle",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: CLIP_PATH_SHAPES.circle, opacity: 0 },
    animate: { clipPath: CLIP_PATH_SHAPES.circleFull, opacity: 1 },
    exit: { clipPath: CLIP_PATH_SHAPES.circle, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Reveal diamond */
export const revealDiamond: AnimationPreset = {
  name: "revealDiamond",
  engine: "framer",
  framerConfig: {
    initial: { clipPath: CLIP_PATH_SHAPES.diamond, opacity: 0 },
    animate: { clipPath: CLIP_PATH_SHAPES.diamondFull, opacity: 1 },
    exit: { clipPath: CLIP_PATH_SHAPES.diamond, opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Reveal presets collection */
export const revealPresets = {
  revealFromBottom,
  revealFromTop,
  revealFromLeft,
  revealFromRight,
  revealCircle,
  revealDiamond,
} as const;
