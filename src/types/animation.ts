import type { Transition, Variants } from "framer-motion";

export type AnimationEngine = "gsap" | "framer" | "three" | "css";

export interface WorldAnimationConfig {
  engine: AnimationEngine;
  pageTransition: PageTransitionConfig;
  scrollAnimations: ScrollAnimationConfig;
  hoverEffects: HoverEffectConfig;
  loadingAnimation: LoadingAnimationConfig;
}

export interface PageTransitionConfig {
  type: "fade" | "slide" | "scale" | "rotate" | "custom";
  duration: number;
  ease?: string;
  variants?: Variants;
}

export interface ScrollAnimationConfig {
  enabled: boolean;
  parallax: boolean;
  reveal: boolean;
  scrub: boolean;
}

export interface HoverEffectConfig {
  type: "scale" | "rotate" | "glow" | "magnetic" | "none";
  intensity: number;
  duration: number;
}

export interface LoadingAnimationConfig {
  type: "spinner" | "skeleton" | "progress" | "custom";
  duration: number;
}

export interface GsapAnimationProps {
  target: string | Element;
  vars: Record<string, unknown>;
}

export interface FramerAnimationProps {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Transition;
  variants?: Variants;
}
