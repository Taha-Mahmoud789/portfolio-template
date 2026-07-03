/**
 * Process Section — TRIONN-inspired numbered steps
 *
 * Horizontal/vertical journey. Large numbers.
 * 01, 02, 03. Not cards. Editorial layout.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Data
// ============================================================================

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "Before writing code, I learn the problem. Architecture decisions shape everything that follows.",
  },
  {
    number: "02",
    title: "Craft",
    description:
      "Component by component, frame by frame. Clean TypeScript, intentional motion, and structure that scales.",
  },
  {
    number: "03",
    title: "Refine",
    description:
      "Performance, accessibility, and the details that separate functional from exceptional. Then ship.",
  },
] as const;

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

          // Header — clip-path mask reveal per line
          if (headerRef.current) {
            const lines = headerRef.current.querySelectorAll<HTMLElement>("[data-header-line]");
            if (lines.length > 0) {
              lines.forEach((line, i) => {
                tl.fromTo(
                  line,
                  { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                  {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 0.9,
                  },
                  i * 0.15,
                );
              });
            }
          }

          // Steps — staggered clip-path reveal
          if (stepsRef.current) {
            const stepItems = stepsRef.current.querySelectorAll<HTMLElement>("[data-process-step]");
            if (stepItems.length > 0) {
              stepItems.forEach((step, i) => {
                const number = step.querySelector<HTMLElement>("[data-step-number]");
                const content = step.querySelector<HTMLElement>("[data-step-content]");

                const stepTl = gsap.timeline();

                // Number — clip-path reveal
                if (number) {
                  stepTl.fromTo(
                    number,
                    { clipPath: "inset(0 0 100% 0)", opacity: 1 },
                    {
                      clipPath: "inset(0 0 0% 0)",
                      duration: 0.8,
                    },
                    0,
                  );
                }

                // Content — clip-path reveal
                if (content) {
                  stepTl.fromTo(
                    content,
                    { clipPath: "inset(0 0 100% 0)", opacity: 1 },
                    {
                      clipPath: "inset(0 0 0% 0)",
                      duration: 0.8,
                    },
                    0.15,
                  );
                }

                tl.add(stepTl, i * 0.2);
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
        background: "#040508",
      }}
    >
      {/* Top divider */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          <h2
            id="process-heading"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            <span
              data-header-line
              style={{
                color: "rgba(255, 255, 255, 0.95)",
                display: "block",
                willChange: "clip-path",
              }}
            >
              Different skills.
            </span>
            <br />
            <span
              data-header-line
              style={{
                display: "block",
                willChange: "clip-path",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(216,216,216,0.7) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              One standard.
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              data-process-step
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(60px, 10vw, 120px) 1fr",
                gap: "clamp(1.5rem, 4vw, 4rem)",
                alignItems: "start",
                padding: "clamp(2rem, 4vw, 3.5rem) 0",
                borderBottom:
                  index < STEPS.length - 1 ? "1px solid rgba(255, 255, 255, 0.04)" : "none",
              }}
            >
              {/* Number */}
              <div
                data-step-number
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(3rem, 7vw, 6rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(216,216,216,0.7) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  willChange: "clip-path",
                }}
              >
                {step.number}
              </div>

              {/* Content */}
              <div data-step-content style={{ willChange: "clip-path" }}>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    color: "rgba(255, 255, 255, 0.95)",
                    margin: "0 0 clamp(0.75rem, 1.5vw, 1.25rem) 0",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: "rgba(216, 216, 216, 0.4)",
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
