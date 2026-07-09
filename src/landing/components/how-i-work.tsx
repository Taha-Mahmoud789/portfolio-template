/**
 * Process Section — Horizontal timeline layout
 *
 * Steps displayed in a horizontal row on desktop, vertical on mobile.
 * Each step is a glass card with a connecting line and circular node.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { PROCESS_STEPS } from "@/content";

// ============================================================================
// Process Section
// ============================================================================

export function Process() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) return;

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

          if (headerRef.current) {
            const lines = headerRef.current.querySelectorAll<HTMLElement>("[data-header-line]");
            if (lines.length > 0) {
              lines.forEach((line, i) => {
                tl.fromTo(
                  line,
                  { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                  { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
                  i * 0.15,
                );
              });
            }
          }

          if (stepsRef.current) {
            const stepCards = stepsRef.current.querySelectorAll<HTMLElement>("[data-process-step]");
            if (stepCards.length > 0) {
              stepCards.forEach((card, i) => {
                gsap.fromTo(
                  card,
                  { y: 40, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.15,
                  },
                );
              });
            }
          }
        }, sectionRef);
      },
      { threshold: 0.15 },
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
      id="how-i-work"
      aria-labelledby="process-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "#0B0F1A",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(241, 245, 249, 0.06) 50%, transparent 100%)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={headerRef} style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <h2
            id="process-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            <span
              data-header-line
              style={{
                color: "rgba(241, 245, 249, 0.95)",
                display: "block",
                willChange: "clip-path",
              }}
            >
              Process.
            </span>
            <br />
            <span
              data-header-line
              style={{
                display: "block",
                willChange: "clip-path",
                background:
                  "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(59,130,246,0.7) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Standards.
            </span>
          </h2>
        </div>

        <div ref={stepsRef}>
          {/* Timeline container */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "clamp(1rem, 2vw, 1.5rem)",
              alignItems: "flex-start",
            }}
          >
            {/* Connecting line — desktop horizontal, hidden on mobile since cards stack */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 6,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))",
                zIndex: 0,
              }}
            />

            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                data-process-step
                style={{
                  position: "relative",
                  flex: "1 1 0",
                  minWidth: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 1,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget.querySelector<HTMLElement>("[data-step-card]");
                  if (card) {
                    gsap.to(card, {
                      y: -4,
                      borderColor: "rgba(59, 130, 246, 0.4)",
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.08)",
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.querySelector<HTMLElement>("[data-step-card]");
                  if (card) {
                    gsap.to(card, {
                      y: 0,
                      borderColor: "rgba(255, 255, 255, 0.06)",
                      boxShadow: "none",
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }
                }}
              >
                {/* Step node circle */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "rgba(59, 130, 246, 0.5)",
                    border: "2px solid rgba(59, 130, 246, 0.3)",
                    marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                    flexShrink: 0,
                  }}
                />

                {/* Card */}
                <div
                  data-step-card
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 16,
                    padding: "clamp(1.5rem, 3vw, 2rem)",
                    width: "100%",
                    willChange: "transform",
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      background:
                        "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(59,130,246,0.7) 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: "rgba(241, 245, 249, 0.95)",
                      margin: "0 0 clamp(0.5rem, 1vw, 0.75rem) 0",
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.875rem, 1vw, 1rem)",
                      fontWeight: 400,
                      lineHeight: 1.7,
                      color: "rgba(148, 163, 184, 0.5)",
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
