/**
 * Scroll Index
 *
 * All scroll utilities for the animation engine.
 */

export {
  createLenis,
  connectLenisToScrollTrigger,
  getLenisProgress,
  getLenisDirection,
  stopLenis,
  startLenis,
  destroyLenis,
} from "./lenis-integration";
export type { LenisConfig } from "./lenis-integration";

export {
  createScrollTrigger,
  createParallaxTrigger,
  createRevealTrigger,
  killAllScrollTriggers,
  refreshAllScrollTriggers,
  getActiveScrollTriggers,
} from "./scroll-trigger";
export type { ScrollTriggerConfig } from "./scroll-trigger";

export {
  createAnimationObserver,
  createMultiElementObserver,
  isElementInViewport,
  waitForElementInViewport,
} from "./intersection-observer";
export type {
  IntersectionObserverConfig,
  IntersectionObserverCallbacks,
} from "./intersection-observer";
