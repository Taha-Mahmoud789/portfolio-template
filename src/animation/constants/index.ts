/**
 * Animation Constants
 *
 * All animation constants in one place.
 */

export { ANIMATION_DURATIONS, getDuration, msToSeconds, secondsToMs } from "./durations";
export type { AnimationDuration } from "./durations";

export { ANIMATION_EASINGS, getEasing, cubicBezier, GSAP_EASINGS } from "./easings";
export type { AnimationEasing, GsapEasing } from "./easings";

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
} from "./defaults";
