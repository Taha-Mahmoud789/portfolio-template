import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./use-reduced-motion";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal(options?: ScrollRevealOptions) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const hasRevealed = useRef(false);

  const reveal = useCallback(
    (refs: React.RefObject<HTMLElement | null>[], timeline: (tl: gsap.core.Timeline) => void) => {
      const section = sectionRef.current;
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting || hasRevealed.current) return;
          hasRevealed.current = true;
          observer.disconnect();

          if (reducedMotion) {
            refs.forEach((ref) => {
              if (ref.current) ref.current.style.opacity = "1";
            });
            return;
          }

          const tl = gsap.timeline();
          timeline(tl);
        },
        { threshold: options?.threshold ?? 0.1, rootMargin: options?.rootMargin },
      );

      observer.observe(section);
      return () => observer.disconnect();
    },
    [reducedMotion, options?.threshold, options?.rootMargin],
  );

  return { sectionRef, reveal, reducedMotion };
}
