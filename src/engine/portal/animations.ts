import type { Variants, TargetAndTransition } from "framer-motion";
import type { PortalAnimationPreset } from "./types";
import { PORTAL_ANIMATION_PRESETS } from "./constants";

/**
 * Shared mouse-to-element normalized offset.
 * Returns { x, y } in range [-0.5, 0.5].
 */
export function getNormalizedMouseOffset(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  return {
    x: (clientX - rect.left) / rect.width - 0.5,
    y: (clientY - rect.top) / rect.height - 0.5,
  };
}

/**
 * Convert normalized mouse offset to 3D tilt.
 */
export function depthTransform(
  nx: number,
  ny: number,
  maxRotate: number,
): { rotateX: number; rotateY: number } {
  return {
    rotateX: -ny * maxRotate,
    rotateY: nx * maxRotate,
  };
}

/**
 * Convert normalized mouse offset to magnetic translation.
 */
export function magneticOffset(
  nx: number,
  ny: number,
  rect: DOMRect,
  strength: number,
): { x: number; y: number } {
  return {
    x: nx * rect.width * strength,
    y: ny * rect.height * strength,
  };
}

/**
 * Build Framer Motion entrance variants for a portal card.
 * `index` is used for stagger delay.
 */
export function getPortalEntranceVariants(preset: PortalAnimationPreset, index: number): Variants {
  const config = PORTAL_ANIMATION_PRESETS[preset];
  const delay = index * 0.08;

  return {
    hidden: { ...config.entrance, opacity: 0 },
    visible: {
      ...config.idle,
      opacity: 1,
      transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] },
    },
  };
}

/**
 * Build hover/idle variants for a portal card.
 */
export function getPortalHoverVariants(preset: PortalAnimationPreset): Variants {
  const config = PORTAL_ANIMATION_PRESETS[preset];
  return {
    idle: { ...config.idle },
    hover: {
      ...config.hover,
      transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
    },
  };
}

/**
 * Build activation phase variants.
 */
export function getPortalActivationVariants(): Record<string, TargetAndTransition> {
  return {
    idle: { scale: 1, opacity: 1 },
    selected: {
      scale: 1.02,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    },
    expanding: {
      scale: 1.08,
      zIndex: 50,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
    },
    transitioning: {
      scale: 1.15,
      opacity: 0.9,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    loading: {
      scale: 1,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    entering: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
    },
    entered: { scale: 1, opacity: 1 },
  };
}

/**
 * Stagger transition config for grid children.
 */
export function getPortalGridTransition(index: number) {
  return {
    duration: 0.5,
    delay: index * 0.06,
    ease: [0.23, 1, 0.32, 1] as const,
  };
}
