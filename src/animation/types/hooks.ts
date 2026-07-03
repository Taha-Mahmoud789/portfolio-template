/**
 * Animation Hook Types
 *
 * Types for all animation hooks.
 */

import type { RefObject } from "react";
import type { Variants, Transition } from "framer-motion";
import type { AnimationState } from "./animation";

/** Return type for useReveal hook */
export interface UseRevealReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Current animation state */
  state: AnimationState;
  /** Framer Motion variant props to spread on element */
  framerProps: {
    variants: Variants;
    initial: string;
    animate: string;
    exit: string;
    transition: Transition;
  };
}

/** Return type for useParallax hook */
export interface UseParallaxReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Current scroll progress (0-1) */
  progress: number;
  /** Calculated transform value */
  transform: string;
}

/** Return type for useMagnetic hook */
export interface UseMagneticReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Current mouse position relative to element */
  position: { x: number; y: number };
  /** Whether mouse is over the element */
  isHovered: boolean;
  /** Framer Motion animate config */
  animate: { x: number; y: number };
}

/** Return type for useSplitText hook */
export interface UseSplitTextReturn {
  /** Ref to attach to the text container */
  ref: RefObject<HTMLElement | null>;
  /** Array of character elements */
  chars: HTMLElement[];
  /** Array of word elements */
  words: HTMLElement[];
  /** Array of line elements */
  lines: HTMLElement[];
  /** Animate characters */
  animateChars: (from?: Record<string, unknown>, to?: Record<string, unknown>) => void;
  /** Animate words */
  animateWords: (from?: Record<string, unknown>, to?: Record<string, unknown>) => void;
  /** Animate lines */
  animateLines: (from?: Record<string, unknown>, to?: Record<string, unknown>) => void;
}

/** Return type for useFloating hook */
export interface UseFloatingReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Current position offset */
  offset: { x: number; y: number };
}

/** Return type for useNumberCounter hook */
export interface UseNumberCounterReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Current displayed value */
  value: number;
  /** Start the counter */
  start: () => void;
  /** Reset the counter */
  reset: () => void;
}

/** @deprecated Use UseMagneticReturn instead */
export type UseMouseFollowReturn = Pick<UseMagneticReturn, "ref" | "position" | "isHovered">;

/** @deprecated Use UseMagneticOptions instead */
export type UseMouseFollowOptions = Pick<UseMagneticOptions, "spring" | "scale">;

/** Return type for useStagger hook */
export interface UseStaggerReturn {
  /** Ref to attach to the container */
  containerRef: RefObject<HTMLElement | null>;
  /** Get stagger config for an item */
  getStaggerProps: (index: number) => {
    variants: Variants;
    initial: string;
    animate: string;
  };
  /** Trigger stagger animation */
  play: () => void;
  /** Reset all items */
  reset: () => void;
}

/** Return type for useClipPath hook */
export interface UseClipPathReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Current clip path value */
  clipPath: string;
  /** Play reveal animation */
  reveal: () => void;
  /** Play hide animation */
  hide: () => void;
}

/** Return type for useMaskReveal hook */
export interface UseMaskRevealReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Mask gradient value */
  mask: string;
  /** Play reveal animation */
  reveal: () => void;
  /** Play hide animation */
  hide: () => void;
}

/** Return type for usePageTransition hook */
export interface UsePageTransitionReturn {
  /** Get page transition variants */
  variants: Variants;
}

/** Return type for useHoverEffect hook */
export interface UseHoverReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Whether element is hovered */
  isHovered: boolean;
  /** Framer Motion whileHover config */
  whileHover: Record<string, unknown>;
}

/** Return type for usePressEffect hook */
export interface UsePressReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Whether element is pressed */
  isPressed: boolean;
  /** Framer Motion whileTap config */
  whileTap: Record<string, unknown>;
}

/** Return type for useInfiniteLoop hook */
export interface UseInfiniteLoopReturn {
  /** Ref to attach to the element */
  ref: RefObject<HTMLElement | null>;
  /** Pause the loop */
  pause: () => void;
  /** Resume the loop */
  resume: () => void;
}

/** Return type for useLoadingSequence hook */
export interface UseLoadingSequenceReturn {
  /** Current loading progress (0-100) */
  progress: number;
  /** Whether loading is complete */
  isComplete: boolean;
  /** Start the loading sequence */
  start: () => void;
  /** Reset the loading sequence */
  reset: () => void;
}

/** Options for useReveal hook */
export interface UseRevealOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  triggerOnMount?: boolean;
  scrollTrigger?: boolean;
  viewportPosition?: "top" | "center" | "bottom";
}

/** Options for useParallax hook */
export interface UseParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal" | "diagonal";
  container?: RefObject<HTMLElement>;
  offset?: number;
}

/** Options for useMagnetic hook */
export interface UseMagneticOptions {
  strength?: number;
  range?: number;
  spring?: { stiffness?: number; damping?: number };
  mode?: "magnetic" | "follow";
  /** Scale factor for follow mode (ignored in magnetic mode) */
  scale?: number;
}

/** Options for useSplitText hook */
export interface UseSplitTextOptions {
  type?: "chars" | "words" | "lines" | "all";
  delimiter?: string;
}

/** Options for useFloating hook */
export interface UseFloatingOptions {
  amplitude?: number;
  frequency?: number;
  offset?: number;
}

/** Options for useNumberCounter hook */
export interface UseNumberCounterOptions {
  from?: number;
  to?: number;
  duration?: number;
  ease?: string;
  decimals?: number;
  separator?: boolean;
  triggerOnMount?: boolean;
  scrollTrigger?: boolean;
}

/** Options for useStagger hook */
export interface UseStaggerOptions {
  staggerDelay?: number;
  direction?: "forward" | "reverse" | "center";
  triggerOnMount?: boolean;
}

/** Options for useClipPath hook */
export interface UseClipPathOptions {
  from?: string;
  to?: string;
  duration?: number;
  ease?: string;
}

/** Options for useMaskReveal hook */
export interface UseMaskRevealOptions {
  direction?: "left" | "right" | "center";
  size?: number;
  duration?: number;
  ease?: string;
}

/** Options for usePageTransition hook */
export interface UsePageTransitionOptions {
  type?: "fade" | "slide" | "scale" | "rotate" | "portal";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  ease?: string;
}

/** Options for useHoverEffect hook */
export interface UseHoverOptions {
  type?: "scale" | "rotate" | "glow" | "lift" | "tilt";
  intensity?: number;
  duration?: number;
}

/** Options for usePressEffect hook */
export interface UsePressOptions {
  type?: "scale" | "bounce" | "rotate" | "squeeze";
  intensity?: number;
  duration?: number;
}

/** Options for useInfiniteLoop hook */
export interface UseInfiniteLoopOptions {
  type?: "rotate" | "bounce" | "pulse" | "float";
  duration?: number;
  ease?: string;
  pauseOnHover?: boolean;
}

/** Options for useLoadingSequence hook */
export interface UseLoadingSequenceOptions {
  duration?: number;
  steps?: number;
  easing?: string;
  onComplete?: () => void;
}
