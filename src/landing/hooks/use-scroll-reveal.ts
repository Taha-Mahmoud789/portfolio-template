/**
 * useScrollReveal — Shared IntersectionObserver + GSAP context pattern.
 *
 * Observes a section element and triggers a GSAP animation callback
 * when it enters the viewport. Handles cleanup automatically.
 */

import { useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./use-reduced-motion";
import { ANIMATION_EASINGS } from "@/animation/constants";

interface ScrollRevealOptions {
  threshold?: number;
  onReveal: (timeline: gsap.core.Timeline, reducedMotion: boolean) => void;
}

export function useScrollReveal(
  sectionRef: React.RefObject<HTMLElement | null>,
  { threshold = 0.3, onReveal }: ScrollRevealOptions,
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          onReveal(gsap.timeline(), true);
          return;
        }

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: { ease: ANIMATION_EASINGS.expoOut },
          });
          onReveal(tl, false);
        }, sectionRef);
      },
      { threshold },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [sectionRef, threshold, onReveal, reducedMotion]);
}

export { ANIMATION_EASINGS };
