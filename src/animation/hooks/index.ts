/**
 * Animation Hooks Index
 *
 * All hooks for the animation engine.
 */

export { useAnimationConfig } from "./use-animation-config";

export { useReveal } from "./use-reveal";

export { useParallax } from "./use-parallax";

export { useMagnetic } from "./use-magnetic";

export { useSplitText } from "./use-split-text";

export { useFloating } from "./use-floating";

export { useNumberCounter } from "./use-number-counter";

export { useStagger } from "./use-stagger";

export { useClipPath } from "./use-clip-path";

export { useMaskReveal } from "./use-mask-reveal";

export { usePageTransition } from "./use-page-transition";

export { useHover } from "./use-hover";

export { usePress } from "./use-press";

export { useInfiniteLoop } from "./use-infinite-loop";

export { useLoadingSequence } from "./use-loading";

export { useSceneEntrance } from "./use-scene-entrance";

export { useSceneExit } from "./use-scene-exit";

export { useScrollReveal } from "./use-scroll-reveal";

export { useScrollVelocity } from "./use-scroll-velocity";

export { useVelocityText } from "./use-velocity-text";

export { useSplitTextReveal } from "./use-split-text-reveal";

export { useScrambleDecode } from "./use-scramble-decode";

import { useMagnetic } from "./use-magnetic";
import { usePageTransition } from "./use-page-transition";
import { useHover } from "./use-hover";
import { usePress } from "./use-press";

export const useMouseFollow = useMagnetic;

export const usePortalTransition = usePageTransition;

export const useHoverEffect = useHover;

export const usePressEffect = usePress;
