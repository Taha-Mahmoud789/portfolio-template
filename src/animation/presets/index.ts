/**
 * Animation Presets Index
 *
 * All animation presets for the animation engine.
 */

export {
  fadePresets,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeSlow,
  fadeInScale,
} from "./fade";

export {
  slidePresets,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  slideInFromBottom,
  slideInFromTop,
  slideInFromLeft,
  slideInFromRight,
} from "./slide";

export { scalePresets, scaleIn, scaleUp, scaleDown, scaleBounce, scalePulse } from "./scale";

export { rotatePresets, rotateIn, rotateLeft, rotateRight, rotateContinuous } from "./rotate";

export {
  staggerPresets,
  staggerUpContainer,
  staggerUpItem,
  staggerFadeContainer,
  staggerFadeItem,
  staggerScaleContainer,
  staggerScaleItem,
} from "./stagger";

export {
  revealPresets,
  revealFromBottom,
  revealFromTop,
  revealFromLeft,
  revealFromRight,
  revealCircle,
  revealDiamond,
} from "./reveal";

export {
  maskRevealPresets,
  maskRevealLeftToRight,
  maskRevealRightToLeft,
  maskRevealTopToBottom,
  maskRevealBottomToTop,
  maskRevealCenter,
} from "./mask-reveal";

export {
  clipPathPresets,
  clipPathCircle,
  clipPathInset,
  clipPathPolygon,
  clipPathDiamond,
} from "./clip-path";

export {
  splitTextPresets,
  splitTextChars,
  splitTextWords,
  splitTextLines,
  splitTextBlur,
} from "./split-text";

export {
  numberCounterPresets,
  numberCounter,
  numberCounterFast,
  numberCounterSlow,
} from "./number-counter";

export {
  floatingPresets,
  floatingGentle,
  floatingModerate,
  floatingStrong,
  floating3D,
} from "./floating";

export {
  mouseFollowPresets,
  mouseFollowDefault,
  mouseFollowSmooth,
  mouseFollowSnappy,
} from "./mouse-follow";

export { magneticPresets, magneticDefault, magneticStrong, magneticGentle } from "./magnetic";

export { parallaxPresets, parallaxSlow, parallaxMedium, parallaxFast } from "./parallax";

export {
  infiniteLoopPresets,
  infiniteRotate,
  infiniteBounce,
  infinitePulse,
  infiniteGlow,
} from "./infinite-loop";

export {
  scrollRevealPresets,
  scrollRevealFade,
  scrollRevealUp,
  scrollRevealLeft,
  scrollRevealRight,
  scrollRevealScale,
} from "./scroll-reveal";

export {
  pageTransitionPresets,
  pageFade,
  pageSlideUp,
  pageSlideLeft,
  pageScale,
} from "./page-transition";

export {
  portalTransitionPresets,
  portalShrink,
  portalExpand,
  portalBlur,
} from "./portal-transition";

export { hoverPresets, hoverScale, hoverLift, hoverRotate, hoverGlow, hoverTilt } from "./hover";

export { pressPresets, pressScale, pressBounce, pressRotate, pressSqueeze } from "./press";

export { loadingPresets, loadingSpinner, loadingDots, loadingPulse, loadingBar } from "./loading";

export {
  sceneEntrancePresets,
  sceneFadeIn,
  sceneSlideIn,
  sceneScaleIn,
  sceneCinematic,
} from "./scene-entrance";

export {
  sceneExitPresets,
  sceneFadeOut,
  sceneSlideOut,
  sceneScaleOut,
  sceneCinematicExit,
} from "./scene-exit";
