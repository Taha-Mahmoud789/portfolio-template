import type { AnimationEngine } from "@/types/animation";

export function getAnimationDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay;
}

export function calculateStaggerDuration(count: number, stagger: number): number {
  return count * stagger;
}

export function getAnimationEngine(): AnimationEngine {
  if (typeof window === "undefined") return "css";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return prefersReducedMotion ? "css" : "framer";
}
