/**
 * Animation Configuration Types
 *
 * Types for animation configuration and settings.
 */

import type { AnimationEngine, AnimationDirection, ReducedMotionMode } from "./animation";

/** Global animation configuration */
export interface AnimationConfig {
  /** Default animation engine */
  engine: AnimationEngine;
  /** Default duration in seconds */
  duration: number;
  /** Default delay in seconds */
  delay: number;
  /** Default easing */
  ease: string;
  /** Default direction */
  direction: AnimationDirection;
  /** Default distance in pixels */
  distance: number;
  /** Reduced motion mode */
  reducedMotion: ReducedMotionMode;
  /** Enable GPU acceleration */
  gpuAcceleration: boolean;
  /** Enable performance monitoring */
  performanceMonitoring: boolean;
}

/** Easing configuration */
export interface EasingConfig {
  /** Linear easing */
  linear: string;
  /** Ease in */
  easeIn: string;
  /** Ease out */
  easeOut: string;
  /** Ease in out */
  easeInOut: string;
  /** Expo in */
  expoIn: string;
  /** Expo out */
  expoOut: string;
  /** Spring */
  spring: string;
  /** Bounce */
  bounce: string;
}

/** Duration configuration */
export interface DurationConfig {
  /** Instant (0ms) */
  instant: number;
  /** Fast (150ms) */
  fast: number;
  /** Normal (300ms) */
  normal: number;
  /** Slow (500ms) */
  slow: number;
  /** Slower (700ms) */
  slower: number;
  /** Slowest (1000ms) */
  slowest: number;
}

/** Stagger configuration */
export interface StaggerConfig {
  /** Delay between items in seconds */
  delay: number;
  /** Maximum delay cap */
  maxDelay: number;
  /** Stagger direction */
  direction: "forward" | "reverse" | "center";
}

/** Scroll trigger configuration */
export interface ScrollTriggerConfig {
  /** Start position */
  start: string;
  /** End position */
  end: string;
  /** Toggle actions */
  toggleActions: string;
  /** Scrub mode */
  scrub: boolean | number;
  /** Marker for debugging */
  marker: boolean;
}

/** Viewport configuration */
export interface ViewportConfig {
  /** Viewport margin */
  margin: string;
  /** Amount visible to trigger (0-1) */
  amount: number;
  /** Whether to trigger once */
  once: boolean;
}

/** Factory configuration for animation creation */
export interface AnimationFactoryConfig {
  /** Default engine to use */
  defaultEngine: AnimationEngine;
  /** Enable animations globally */
  enabled: boolean;
  /** Performance threshold in ms */
  performanceThreshold: number;
  /** Fallback engine if primary fails */
  fallbackEngine: AnimationEngine;
  /** Debug mode */
  debug: boolean;
}
