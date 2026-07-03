/**
 * About Section — Cinematic scroll reveals
 *
 * Heading: clip-path mask reveal.
 * Body: fade + slide.
 * Numbers: staggered reveal with countUp.
 * Philosophy: slide-up reveal.
 */

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { CountUp } from "./count-up";

// ============================================================================
// Data
// ============================================================================

const EXPERIENCE = [
  { value: 6, suffix: "+", label: "Years of Craft" },
  { value: 50, suffix: "+", label: "Projects Shipped" },
  { value: 30, suffix: "+", label: "Clients Worldwide" },
] as const;

// ============================================================================
// About Section
// ============================================================================

export function About() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [numbersTriggered, setNumbersTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          setNumbersTriggered(true);
          return;
        }

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

          // Statement — clip-path mask reveal
          if (statementRef.current) {
            tl.fromTo(
              statementRef.current,
              { clipPath: "inset(0 0 100% 0)", opacity: 1 },
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.1,
              },
            );
          }

          // Body text — fade + slide up
          if (bodyRef.current) {
            tl.fromTo(
              bodyRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9 },
              "-=0.5",
            );
          }

          // Numbers — staggered reveal
          if (numbersRef.current) {
            const items = numbersRef.current.querySelectorAll<HTMLElement>("[data-number-item]");
            tl.fromTo(
              items,
              { y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)" },
              {
                y: 0,
                opacity: 1,
                clipPath: "inset(0 0 0% 0)",
                duration: 0.7,
                stagger: 0.1,
              },
              "-=0.4",
            );
            tl.add(() => setNumbersTriggered(true), "-=0.3");
          }

          // Divider — scale from left
          if (dividerRef.current) {
            tl.fromTo(
              dividerRef.current,
              { scaleX: 0, transformOrigin: "left" },
              { scaleX: 1, duration: 0.8, ease: ANIMATION_EASINGS.expoOut },
              "-=0.5",
            );
          }

          // Philosophy — slide up
          if (philosophyRef.current) {
            tl.fromTo(
              philosophyRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
              "-=0.4",
            );
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
      id="about"
      aria-labelledby="about-heading"
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
        {/* Large editorial statement */}
        <div
          ref={statementRef}
          style={{
            marginBottom: "clamp(3rem, 6vw, 5rem)",
            willChange: "clip-path",
          }}
        >
          <h2
            id="about-heading"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              color: "rgba(216, 216, 216, 0.5)",
              margin: 0,
              maxWidth: 900,
            }}
          >
            Independent creative developer building interfaces where{" "}
            <span style={{ color: "rgba(255, 255, 255, 0.95)" }}>strategy</span>,{" "}
            <span style={{ color: "rgba(255, 255, 255, 0.95)" }}>design</span>, and{" "}
            <span style={{ color: "rgba(255, 255, 255, 0.95)" }}>technology</span> converge.
          </h2>
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "clamp(3rem, 6vw, 5rem)",
            alignItems: "start",
          }}
        >
          {/* Left — Body text */}
          <div ref={bodyRef} style={{}}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                fontWeight: 400,
                lineHeight: 1.8,
                color: "rgba(216, 216, 216, 0.4)",
                margin: 0,
                maxWidth: 480,
              }}
            >
              I think about interfaces the way architects think about buildings — structure, flow,
              and the experience of moving through space. Every component has a reason. Every
              animation earns its frame.
            </p>
          </div>

          {/* Right — Numbers + Philosophy */}
          <div>
            {/* Experience numbers */}
            <div
              ref={numbersRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(1rem, 2vw, 1.5rem)",
                marginBottom: "clamp(3rem, 6vw, 4rem)",
              }}
              role="list"
              aria-label="Key metrics"
            >
              {EXPERIENCE.map((item) => (
                <div
                  key={item.label}
                  data-number-item
                  role="listitem"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    willChange: "clip-path, transform",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(216,216,216,0.7) 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {reducedMotion ? (
                      <>
                        {item.value}
                        {item.suffix}
                      </>
                    ) : (
                      <CountUp
                        target={item.value}
                        suffix={item.suffix}
                        trigger={numbersTriggered}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "clamp(0.625rem, 0.7vw, 0.6875rem)",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "rgba(216, 216, 216, 0.45)",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider — animated */}
            <div
              ref={dividerRef}
              aria-hidden="true"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, transparent 100%)",
                marginBottom: "clamp(2rem, 4vw, 3rem)",
                transformOrigin: "left",
              }}
            />

            {/* Philosophy */}
            <div ref={philosophyRef} style={{}}>
              <h3
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
                  fontWeight: 400,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase" as const,
                  color: "rgba(216, 216, 216, 0.3)",
                  margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
                }}
              >
                Philosophy
              </h3>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  letterSpacing: "-0.02em",
                  color: "rgba(255, 255, 255, 0.8)",
                  margin: 0,
                  maxWidth: 400,
                }}
              >
                Design for clarity. Code for performance. Ship with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
