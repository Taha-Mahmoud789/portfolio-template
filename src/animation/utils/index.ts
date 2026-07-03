/**
 * Animation Utilities Index
 *
 * All utility functions for the animation engine.
 */

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
} from "./gsap";

export {
  createFadeVariants,
  createSlideVariants,
  createScaleVariants,
  createRotateVariants,
  createStaggerContainer,
  createStaggerItem,
  createClipPathVariants,
  combineVariants,
} from "./framer";

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
} from "./scroll";

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
} from "./performance";
