/**
 * Framer Motion Utilities
 *
 * Utility functions for Framer Motion animations.
 */

import type { Variants } from "framer-motion";

/** Create fade variants */
export function createFadeVariants(
  duration: number = 0.3,
  ease: string = "easeOut",
): Variants {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration, ease } },
    exit: { opacity: 0, transition: { duration, ease } },
  };
}

/** Create slide variants */
export function createSlideVariants(
  direction: "up" | "down" | "left" | "right" = "up",
  distance: number = 50,
  duration: number = 0.3,
  ease: string = "easeOut",
): Variants {
  const axis = direction === "up" || direction === "down" ? "y" : "x";
  const sign = direction === "up" || direction === "left" ? -1 : 1;

  return {
    initial: { [axis]: sign * distance, opacity: 0 },
    animate: {
      [axis]: 0,
      opacity: 1,
      transition: { duration, ease },
    },
    exit: {
      [axis]: sign * -distance,
      opacity: 0,
      transition: { duration, ease },
    },
  } as unknown as Variants;
}

/** Create scale variants */
export function createScaleVariants(
  scale: number = 0.8,
  duration: number = 0.3,
  ease: string = "easeOut",
): Variants {
  return {
    initial: { scale, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration, ease },
    },
    exit: {
      scale,
      opacity: 0,
      transition: { duration, ease },
    },
  };
}

/** Create rotate variants */
export function createRotateVariants(
  rotation: number = -10,
  duration: number = 0.3,
  ease: string = "easeOut",
): Variants {
  return {
    initial: { rotate: rotation, opacity: 0 },
    animate: {
      rotate: 0,
      opacity: 1,
      transition: { duration, ease },
    },
    exit: {
      rotate: rotation,
      opacity: 0,
      transition: { duration, ease },
    },
  };
}

/** Create stagger container variants */
export function createStaggerContainer(
  staggerChildren: number = 0.1,
  delayChildren: number = 0,
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerChildren * 0.5,
        staggerDirection: -1,
      },
    },
  };
}

/** Create stagger item variants */
export function createStaggerItem(
  direction: "up" | "down" | "left" | "right" = "up",
  distance: number = 30,
): Variants {
  const axis = direction === "up" || direction === "down" ? "y" : "x";
  const sign = direction === "up" || direction === "left" ? -1 : 1;

  return {
    initial: { [axis]: sign * distance, opacity: 0 },
    animate: {
      [axis]: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      [axis]: sign * -distance,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  } as unknown as Variants;
}

/** Create clip path variants */
export function createClipPathVariants(
  from: string = "inset(100% 0 0 0)",
  to: string = "inset(0 0 0 0)",
  duration: number = 0.5,
  ease: string = "easeOut",
): Variants {
  return {
    initial: { clipPath: from },
    animate: {
      clipPath: to,
      transition: { duration, ease },
    },
    exit: {
      clipPath: from,
      transition: { duration, ease },
    },
  };
}

/** Create combined variants */
export function combineVariants(...variants: Variants[]): Variants {
  const merged = {
    initial: {} as Record<string, unknown>,
    animate: {} as Record<string, unknown>,
    exit: {} as Record<string, unknown>,
  };

  for (const variant of variants) {
    for (const [key, value] of Object.entries(variant)) {
      if (typeof value === "object" && value !== null && key in merged) {
        Object.assign(merged[key as keyof typeof merged], value);
      }
    }
  }

  return merged as Variants;
}
