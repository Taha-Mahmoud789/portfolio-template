/**
 * Animation Engine
 *
 * A comprehensive, reusable animation system for the Frontend Multiverse.
 *
 * @example
 * ```tsx
 * import { useReveal, useParallax, useMagnetic } from "@/animation";
 *
 * function Component() {
 *   const { ref, framerProps } = useReveal({ direction: "up" });
 *   const { ref: parallaxRef, transform } = useParallax({ speed: 0.5 });
 *   const { ref: magneticRef, animate } = useMagnetic({ strength: 0.3 });
 *
 *   return (
 *     <div ref={parallaxRef} style={{ transform }}>
 *       <motion.div ref={ref} {...framerProps}>
 *         <motion.button ref={magneticRef} animate={animate}>
 *           Magnetic Button
 *         </motion.button>
 *       </motion.div>
 *     </div>
 *   );
 * }
 * ```
 */

import "./gsap-setup";

// Types
export type {
  AnimationEngine,
  AnimationDirection,
  AnimationTrigger,
  ViewportPosition,
  ReducedMotionMode,
  BaseAnimationOptions,
  DirectionalAnimationOptions,
  OpacityAnimationOptions,
  ScrollAnimationOptions,
  StaggerAnimationOptions,
  AnimationState,
  AnimationPreset,
} from "./types/animation";

export type {
  UseRevealReturn,
  UseParallaxReturn,
  UseMagneticReturn,
  UseSplitTextReturn,
  UseFloatingReturn,
  UseNumberCounterReturn,
  UseStaggerReturn,
  UseClipPathReturn,
  UseMaskRevealReturn,
  UsePageTransitionReturn,
  UseHoverReturn,
  UsePressReturn,
  UseInfiniteLoopReturn,
  UseLoadingSequenceReturn,
  UseRevealOptions,
  UseParallaxOptions,
  UseMagneticOptions,
  UseSplitTextOptions,
  UseFloatingOptions,
  UseNumberCounterOptions,
  UseStaggerOptions,
  UseClipPathOptions,
  UseMaskRevealOptions,
  UsePageTransitionOptions,
  UseHoverOptions,
  UsePressOptions,
  UseInfiniteLoopOptions,
  UseLoadingSequenceOptions,
} from "./types/hooks";

export type {
  AnimationConfig,
  EasingConfig,
  DurationConfig,
  StaggerConfig,
  ScrollTriggerConfig,
  ViewportConfig,
  AnimationFactoryConfig,
} from "./types/config";

// Constants
export { ANIMATION_DURATIONS, getDuration, msToSeconds, secondsToMs } from "./constants/durations";

export { ANIMATION_EASINGS, getEasing, cubicBezier, GSAP_EASINGS } from "./constants/easings";

export {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_FACTORY_CONFIG,
  DEFAULT_STAGGER,
  DEFAULT_SCROLL_TRIGGER,
  DEFAULT_VIEWPORT,
  DEFAULT_DISTANCES,
  DIRECTION_MULTIPLIERS,
  DEFAULT_SPRING,
  CLIP_PATH_SHAPES,
  MASK_GRADIENTS,
} from "./constants/defaults";

// Hooks
export { useAnimationConfig } from "./hooks/use-animation-config";
export { useReveal } from "./hooks/use-reveal";
export { useParallax } from "./hooks/use-parallax";
export { useMagnetic } from "./hooks/use-magnetic";
export { useSplitText } from "./hooks/use-split-text";
export { useFloating } from "./hooks/use-floating";
export { useNumberCounter } from "./hooks/use-number-counter";
export { useMouseFollow } from "./hooks/index";
export { useStagger } from "./hooks/use-stagger";
export { useClipPath } from "./hooks/use-clip-path";
export { useMaskReveal } from "./hooks/use-mask-reveal";
export { usePageTransition } from "./hooks/use-page-transition";
export { usePortalTransition } from "./hooks/index";
export { useHover } from "./hooks/use-hover";
export { usePress } from "./hooks/use-press";
export { useHoverEffect, usePressEffect } from "./hooks/index";
export { useInfiniteLoop } from "./hooks/use-infinite-loop";
export { useLoadingSequence } from "./hooks/use-loading";
export { useSceneEntrance } from "./hooks/use-scene-entrance";
export { useSceneExit } from "./hooks/use-scene-exit";
export { useScrollReveal } from "./hooks/use-scroll-reveal";

export { useScrollVelocity } from "./hooks/use-scroll-velocity";

export { useVelocityText } from "./hooks/use-velocity-text";

export { useSplitTextReveal } from "./hooks/use-split-text-reveal";

export { useScrambleDecode } from "./hooks/use-scramble-decode";

// Context
export {
  AnimationProvider,
  useAnimationContext,
  useOptionalAnimationContext,
} from "./context/animation-context";

// Factory
export {
  createAnimation,
  animateElement,
  getPreset,
  getPresetNames,
  registerPreset,
  createPreset,
  animationRegistry,
} from "./factory";

// Timeline
export {
  createTimeline,
  createLoopingTimeline,
  createStaggeredTimeline,
  createPageEntranceTimeline,
  createCardRevealTimeline,
  createMenuOpenTimeline,
  createModalTimeline,
} from "./timeline";

// Scroll
export {
  createLenis,
  connectLenisToScrollTrigger,
  createScrollTrigger,
  createParallaxTrigger,
  createRevealTrigger,
  killAllScrollTriggers,
  refreshAllScrollTriggers,
  createAnimationObserver,
  createMultiElementObserver,
} from "./scroll";

// GSAP Utilities
export {
  killAnimations,
  killScrollTriggers,
  refreshScrollTriggers,
  createGsapContext,
  animate,
  animateFrom,
  getTransform,
  clamp,
  mapRange,
  lerp,
  smoothStep,
  normalize,
  degToRad,
  radToDeg,
  distance,
  easings,
} from "./utils/gsap";

// Framer Utilities
export {
  createFadeVariants,
  createSlideVariants,
  createScaleVariants,
  createRotateVariants,
  createStaggerContainer,
  createStaggerItem,
  createClipPathVariants,
  combineVariants,
} from "./utils/framer";

// Scroll Utilities
export {
  isInViewport,
  getScrollProgress,
  getScrollPosition,
  getDocumentHeight,
  getViewportHeight,
  getViewportWidth,
  scrollTo,
  scrollToElement,
  calculateParallax,
  throttle,
  debounce,
  rafThrottle,
} from "./utils/scroll";

// Performance Utilities
export {
  isLowEndDevice,
  prefersReducedMotion,
  getOptimalAnimationCount,
  isElementVisible,
  isIntersectionObserverAvailable,
  observeAnimationPerformance,
  measureAnimation,
  isGPUAccelerationSupported,
  getAnimationFrameBudget,
} from "./utils/performance";

// Presets
export * from "./presets";
