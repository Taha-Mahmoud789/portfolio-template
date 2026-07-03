/**
 * Stagger Animation Presets
 *
 * Pre-configured stagger animation presets.
 */

import type { AnimationPreset } from "../types/animation";
import type { Variants } from "framer-motion";

/** Stagger up container */
export const staggerUpContainer: AnimationPreset<Variants> = {
  name: "staggerUpContainer",
  engine: "framer",
  variants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
};

/** Stagger up item */
export const staggerUpItem: AnimationPreset<Variants> = {
  name: "staggerUpItem",
  engine: "framer",
  variants: {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
};

/** Stagger fade container */
export const staggerFadeContainer: AnimationPreset<Variants> = {
  name: "staggerFadeContainer",
  engine: "framer",
  variants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  },
};

/** Stagger fade item */
export const staggerFadeItem: AnimationPreset<Variants> = {
  name: "staggerFadeItem",
  engine: "framer",
  variants: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
};

/** Stagger scale container */
export const staggerScaleContainer: AnimationPreset<Variants> = {
  name: "staggerScaleContainer",
  engine: "framer",
  variants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
};

/** Stagger scale item */
export const staggerScaleItem: AnimationPreset<Variants> = {
  name: "staggerScaleItem",
  engine: "framer",
  variants: {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
};

/** Stagger presets collection */
export const staggerPresets = {
  staggerUpContainer,
  staggerUpItem,
  staggerFadeContainer,
  staggerFadeItem,
  staggerScaleContainer,
  staggerScaleItem,
} as const;
