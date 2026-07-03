/**
 * Core Animation Types
 *
 * Fundamental types used across the animation engine.
 */

import type { Variants, Transition } from "framer-motion";

/** Supported animation engines */
export type AnimationEngine = "gsap" | "framer" | "css";

/** Animation direction options */
export type AnimationDirection = "up" | "down" | "left" | "right" | "none";

/** Animation trigger types */
export type AnimationTrigger = "mount" | "scroll" | "hover" | "click" | "manual";

/** Viewport position for scroll triggers */
export type ViewportPosition = "top" | "center" | "bottom";

/** Reduced motion mode */
export type ReducedMotionMode = "full" | "partial" | "none";

/** Base animation options shared across all animations */
export interface BaseAnimationOptions {
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Easing function name or cubic-bezier values */
  ease?: string | number[];
}

/** Direction-based animation options */
export interface DirectionalAnimationOptions extends BaseAnimationOptions {
  /** Animation direction */
  direction?: AnimationDirection;
  /** Translation distance in pixels */
  distance?: number;
}

/** Opacity-based animation options */
export interface OpacityAnimationOptions extends BaseAnimationOptions {
  /** Initial opacity value (0-1) */
  initialOpacity?: number;
  /** Final opacity value (0-1) */
  finalOpacity?: number;
}

/** Scroll-triggered animation options */
export interface ScrollAnimationOptions extends BaseAnimationOptions {
  /** Scroll trigger position in viewport */
  triggerPosition?: ViewportPosition;
  /** Whether animation should scrub with scroll */
  scrub?: boolean;
  /** Scroll trigger marker for debugging */
  marker?: boolean;
  /** Scroll container selector */
  container?: string;
}

/** Stagger animation options */
export interface StaggerAnimationOptions extends BaseAnimationOptions {
  /** Delay between staggered elements in seconds */
  staggerDelay?: number;
  /** Maximum stagger delay cap in seconds */
  maxStaggerDelay?: number;
  /** Stagger direction */
  staggerDirection?: "forward" | "reverse" | "center";
}

/** Animation state */
export type AnimationState = "idle" | "running" | "paused" | "completed";

/** GSAP animation vars */
export interface GsapVars {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
  repeatDelay?: number;
  yoyo?: boolean;
  stagger?: number | { each?: number; from?: string | number };
  [key: string]: unknown;
}

/** Animation preset definition */
export interface AnimationPreset<T = Record<string, unknown>> {
  name: string;
  engine: AnimationEngine;
  variants?: Variants;
  gsapVars?: GsapVars;
  framerConfig?: {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    exit?: Record<string, unknown>;
    transition?: Transition;
  };
  defaultProps?: T;
}
