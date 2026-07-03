/**
 * Animation Factory
 *
 * Creates animations from presets and configurations.
 */

import { gsap } from "gsap";
import type { AnimationEngine, AnimationPreset } from "../types/animation";
import { fadePresets } from "../presets/fade";
import { slidePresets } from "../presets/slide";
import { scalePresets } from "../presets/scale";
import { rotatePresets } from "../presets/rotate";
import { staggerPresets } from "../presets/stagger";
import { revealPresets } from "../presets/reveal";
import { maskRevealPresets } from "../presets/mask-reveal";
import { clipPathPresets } from "../presets/clip-path";
import { splitTextPresets } from "../presets/split-text";
import { numberCounterPresets } from "../presets/number-counter";
import { floatingPresets } from "../presets/floating";
import { magneticPresets } from "../presets/magnetic";
import { parallaxPresets } from "../presets/parallax";
import { infiniteLoopPresets } from "../presets/infinite-loop";
import { pageTransitionPresets } from "../presets/page-transition";
import { hoverPresets } from "../presets/hover";
import { pressPresets } from "../presets/press";
import { loadingPresets } from "../presets/loading";

/** All presets combined */
const allPresets: Record<string, AnimationPreset> = {
  ...fadePresets,
  ...slidePresets,
  ...scalePresets,
  ...rotatePresets,
  ...staggerPresets,
  ...revealPresets,
  ...maskRevealPresets,
  ...clipPathPresets,
  ...splitTextPresets,
  ...numberCounterPresets,
  ...floatingPresets,
  ...magneticPresets,
  ...parallaxPresets,
  ...infiniteLoopPresets,
  ...pageTransitionPresets,
  ...hoverPresets,
  ...pressPresets,
  ...loadingPresets,
};

export interface AnimationFactoryOptions {
  engine?: AnimationEngine;
  duration?: number;
  delay?: number;
  ease?: string;
}

/**
 * Create an animation from a preset name.
 *
 * @example
 * ```ts
 * const animation = createAnimation("fadeInUp");
 * gsap.fromTo(".element", animation.from, animation.to);
 * ```
 */
export function createAnimation(presetName: string, options: AnimationFactoryOptions = {}) {
  const preset = allPresets[presetName];
  if (!preset) {
    console.warn(`Preset "${presetName}" not found`);
    return null;
  }

  const { engine = preset.engine, duration, delay, ease } = options;

  if (engine === "gsap" && preset.gsapVars) {
    return {
      engine: "gsap",
      vars: {
        ...preset.gsapVars,
        ...(duration !== undefined && { duration }),
        ...(delay !== undefined && { delay }),
        ...(ease !== undefined && { ease }),
      } as Record<string, unknown>,
    };
  }

  if (engine === "framer" && preset.framerConfig) {
    return {
      engine: "framer",
      initial: preset.framerConfig.initial,
      animate: preset.framerConfig.animate,
      exit: preset.framerConfig.exit,
      transition: {
        ...preset.framerConfig.transition,
        ...(duration !== undefined && { duration }),
        ...(delay !== undefined && { delay }),
        ...(ease !== undefined && { ease }),
      },
    };
  }

  return null;
}

/**
 * Animate an element using a preset.
 *
 * @example
 * ```ts
 * animateElement(".element", "fadeInUp", { duration: 0.5 });
 * ```
 */
export function animateElement(
  target: HTMLElement | string,
  presetName: string,
  options: AnimationFactoryOptions = {},
) {
  const animation = createAnimation(presetName, options);
  if (!animation) return null;

  if (animation.engine === "gsap") {
    return gsap.fromTo(target, { opacity: 0, y: 20 }, animation.vars as gsap.TweenVars);
  }

  return null;
}

/**
 * Get a preset by name.
 */
export function getPreset(name: string): AnimationPreset | undefined {
  return allPresets[name];
}

/**
 * Get all preset names.
 */
export function getPresetNames(): string[] {
  return Object.keys(allPresets);
}

/**
 * Register a custom preset.
 */
export function registerPreset(name: string, preset: AnimationPreset): void {
  allPresets[name] = preset;
}

/**
 * Create a custom preset.
 */
export function createPreset<T = Record<string, unknown>>(
  name: string,
  config: AnimationPreset<T>,
): AnimationPreset<T> {
  return {
    ...config,
    name,
  };
}
