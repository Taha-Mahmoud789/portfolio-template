/**
 * Intro Section — Cinematic mask reveals
 *
 * Each line reveals via clip-path mask.
 * Staggered entrance with scroll trigger.
 * "Clarity first. Motion with purpose. Built to last."
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Intro Section
// ============================================================================

export function Intro() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          [line1Ref, line2Ref, line3Ref].forEach((r) => {
            if (r.current) r.current.style.opacity = "1";
          });
          return;
        }

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

          // Vertical line accent — scale from top
          if (verticalLineRef.current) {
            tl.fromTo(
              verticalLineRef.current,
              { scaleY: 0, transformOrigin: "top" },
              { scaleY: 1, duration: 1.2, ease: ANIMATION_EASINGS.expoOut },
              0,
            );
          }

          // Line 1 — clip-path mask reveal
          if (line1Ref.current) {
            tl.fromTo(
              line1Ref.current,
              { clipPath: "inset(0 100% 0 0)", opacity: 1 },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: 1,
              },
              0.3,
            );
          }

          // Line 2 — clip-path mask reveal, delayed
          if (line2Ref.current) {
            tl.fromTo(
              line2Ref.current,
              { clipPath: "inset(0 100% 0 0)", opacity: 1 },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: 1,
              },
              0.5,
            );
          }

          // Line 3 — clip-path mask reveal, delayed more
          if (line3Ref.current) {
            tl.fromTo(
              line3Ref.current,
              { clipPath: "inset(0 100% 0 0)", opacity: 1 },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: 1,
              },
              0.7,
            );
          }
        }, sectionRef);
      },
      { threshold: 0.3 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="intro"
      aria-label="Introduction"
      style={{
        position: "relative",
        padding: "clamp(6rem, 16vh, 14rem) clamp(1.5rem, 8vw, 8rem)",
        background: "#080706",
        overflow: "hidden",
      }}
    >
      {/* Subtle vertical line accent — animated */}
      <div
        ref={verticalLineRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 6rem)",
          top: "10%",
          bottom: "10%",
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(245, 240, 232, 0.06) 50%, transparent 100%)",
          transformOrigin: "top",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.03em",
          }}
        >
          {/* Line 1 — dominant */}
          <div
            ref={line1Ref}
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "rgba(214, 204, 190, 0.35)",
              willChange: "clip-path",
              marginBottom: "clamp(0.25rem, 0.5vw, 0.5rem)",
            }}
          >
            Clarity first.
          </div>

          {/* Line 2 — supporting */}
          <div
            ref={line2Ref}
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "rgba(214, 204, 190, 0.35)",
              willChange: "clip-path",
              marginBottom: "clamp(0.25rem, 0.5vw, 0.5rem)",
            }}
          >
            <span
              style={{
                color: "rgba(245, 240, 232, 0.95)",
              }}
            >
              Motion
            </span>{" "}
            with purpose.
          </div>

          {/* Line 3 — dominant accent */}
          <div
            ref={line3Ref}
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.05,
              color: "rgba(214, 204, 190, 0.35)",
              willChange: "clip-path",
            }}
          >
            Built to{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,240,232,1) 0%, rgba(201,169,110,0.7) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              last
            </span>
            .
          </div>
        </div>
      </div>
    </section>
  );
}
