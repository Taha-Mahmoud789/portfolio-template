/**
 * Mask Reveal Animation Presets
 *
 * Pre-configured mask reveal animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Mask reveal left to right */
export const maskRevealLeftToRight: AnimationPreset = {
  name: "maskRevealLeftToRight",
  engine: "framer",
  framerConfig: {
    initial: { maskImage: "linear-gradient(90deg, black 0%, transparent 0%)" },
    animate: { maskImage: "linear-gradient(90deg, black 100%, transparent 100%)" },
    exit: { maskImage: "linear-gradient(90deg, black 0%, transparent 0%)" },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Mask reveal right to left */
export const maskRevealRightToLeft: AnimationPreset = {
  name: "maskRevealRightToLeft",
  engine: "framer",
  framerConfig: {
    initial: { maskImage: "linear-gradient(90deg, transparent 0%, black 0%)" },
    animate: { maskImage: "linear-gradient(90deg, transparent 100%, black 100%)" },
    exit: { maskImage: "linear-gradient(90deg, transparent 0%, black 0%)" },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Mask reveal top to bottom */
export const maskRevealTopToBottom: AnimationPreset = {
  name: "maskRevealTopToBottom",
  engine: "framer",
  framerConfig: {
    initial: { maskImage: "linear-gradient(180deg, transparent 0%, black 0%)" },
    animate: { maskImage: "linear-gradient(180deg, transparent 100%, black 100%)" },
    exit: { maskImage: "linear-gradient(180deg, transparent 0%, black 0%)" },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Mask reveal bottom to top */
export const maskRevealBottomToTop: AnimationPreset = {
  name: "maskRevealBottomToTop",
  engine: "framer",
  framerConfig: {
    initial: { maskImage: "linear-gradient(180deg, black 0%, transparent 0%)" },
    animate: { maskImage: "linear-gradient(180deg, black 100%, transparent 100%)" },
    exit: { maskImage: "linear-gradient(180deg, black 0%, transparent 0%)" },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Mask reveal center */
export const maskRevealCenter: AnimationPreset = {
  name: "maskRevealCenter",
  engine: "framer",
  framerConfig: {
    initial: { maskImage: "radial-gradient(circle, black 0%, transparent 0%)" },
    animate: { maskImage: "radial-gradient(circle, black 100%, transparent 100%)" },
    exit: { maskImage: "radial-gradient(circle, black 0%, transparent 0%)" },
    transition: { duration: ANIMATION_DURATIONS.slower, ease: ANIMATION_EASINGS.easeOut },
  },
};

/** Mask reveal presets collection */
export const maskRevealPresets = {
  maskRevealLeftToRight,
  maskRevealRightToLeft,
  maskRevealTopToBottom,
  maskRevealBottomToTop,
  maskRevealCenter,
} as const;
