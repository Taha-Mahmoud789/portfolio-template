/**
 * Animation Factory Index
 *
 * All factory utilities for the animation engine.
 */

export {
  createAnimation,
  animateElement,
  getPreset,
  getPresetNames,
  registerPreset,
  createPreset,
} from "./animation-factory";

export { animationRegistry } from "./animation-registry";
export type { AnimationRegistryEntry } from "./animation-registry";
