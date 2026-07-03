/**
 * Animation Defaults
 *
 * Default values for all animation configurations.
 */

import type { AnimationConfig, AnimationFactoryConfig } from "../types/config";
import { ANIMATION_DURATIONS } from "./durations";
import { ANIMATION_EASINGS } from "./easings";

/** Default animation configuration */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  engine: "framer",
  duration: ANIMATION_DURATIONS.normal,
  delay: 0,
  ease: ANIMATION_EASINGS.easeOut,
  direction: "up",
  distance: 50,
  reducedMotion: "partial",
  gpuAcceleration: true,
  performanceMonitoring: false,
};

/** Default factory configuration */
export const DEFAULT_FACTORY_CONFIG: AnimationFactoryConfig = {
  defaultEngine: "framer",
  enabled: true,
  performanceThreshold: 16,
  fallbackEngine: "css",
  debug: false,
};

/** Default stagger configuration */
export const DEFAULT_STAGGER = {
  delay: 0.1,
  maxDelay: 0.8,
  direction: "forward" as const,
};

/** Default scroll trigger configuration */
export const DEFAULT_SCROLL_TRIGGER = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse",
  scrub: false,
  marker: false,
};

/** Default viewport configuration */
export const DEFAULT_VIEWPORT = {
  margin: "0px",
  amount: 0.25,
  once: true,
};

/** Default distances for directional animations */
export const DEFAULT_DISTANCES = {
  small: 20,
  medium: 50,
  large: 100,
  xlarge: 200,
} as const;

/** Direction multipliers */
export const DIRECTION_MULTIPLIERS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
} as const;

/** Default spring configuration */
export const DEFAULT_SPRING = {
  stiffness: 100,
  damping: 10,
  mass: 1,
};

/** Default clip path shapes */
export const CLIP_PATH_SHAPES = {
  circle: "circle(0% at 50% 50%)",
  circleFull: "circle(100% at 50% 50%)",
  inset: "inset(100% 0 0 0)",
  insetFull: "inset(0 0 0 0)",
  polygonTop: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  polygonFull: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  diamond: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
  diamondFull: "polygon(-50% -50%, 150% -50%, 150% 150%, -50% 150%)",
} as const;

/** Mask reveal gradients */
export const MASK_GRADIENTS = {
  leftToRight: "linear-gradient(90deg, transparent 0%, black 100%)",
  rightToLeft: "linear-gradient(90deg, black 0%, transparent 100%)",
  topToBottom: "linear-gradient(180deg, transparent 0%, black 100%)",
  bottomToTop: "linear-gradient(180deg, black 0%, transparent 100%)",
  center: "radial-gradient(circle, black 0%, transparent 100%)",
  diagonal: "linear-gradient(135deg, transparent 0%, black 100%)",
} as const;
