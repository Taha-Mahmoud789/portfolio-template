/**
 * useSectionReveal
 *
 * Unified ScrollTrigger-based section reveal.
 * Every section shares the same animation language:
 *   opacity: 0 → 1, translateY: 40px → 0
 * Stagger support for child elements.
 * Properly cleans up with gsap.context. Respects reduced motion.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./use-reduced-motion";

interface SectionRevealOptions {
  /** ScrollTrigger start position. Default: "top 85%" */
  start?: string;
  /** Override the default reveal animation callback. */
  onReveal?: (section: HTMLElement, ctx: gsap.Context) => void;
}

export function useSectionReveal(options?: SectionRevealOptions) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) {
      if (section) section.style.opacity = "1";
      return;
    }

    gsap.set(section, { opacity: 0, y: 40 });

    ctxRef.current = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: optionsRef.current?.start ?? "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });

          const cb = optionsRef.current?.onReveal;
          if (cb) {
            const ctx = ctxRef.current;
            if (ctx) cb(section, ctx);
          }
        },
      });
    });

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [reducedMotion]);

  return { sectionRef };
}
