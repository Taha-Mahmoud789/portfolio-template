/**
 * Scroll Reveal Animation Presets
 *
 * Pre-configured scroll reveal animation presets.
 * Re-exports canonical presets from fade.ts and scale.ts.
 */

import { fadeIn, fadeInUp, fadeInLeft, fadeInRight } from "./fade";
import { scaleUp } from "./scale";

export {
  fadeIn as scrollRevealFade,
  fadeInUp as scrollRevealUp,
  fadeInLeft as scrollRevealLeft,
  fadeInRight as scrollRevealRight,
} from "./fade";
export { scaleUp as scrollRevealScale } from "./scale";

/** Scroll reveal presets collection */
export const scrollRevealPresets = {
  scrollRevealFade: fadeIn,
  scrollRevealUp: fadeInUp,
  scrollRevealLeft: fadeInLeft,
  scrollRevealRight: fadeInRight,
  scrollRevealScale: scaleUp,
} as const;
