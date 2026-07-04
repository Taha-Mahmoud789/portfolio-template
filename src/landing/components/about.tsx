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
import { EXPERIENCE_STATS, ABOUT } from "@/content";
import { CountUp } from "./count-up";

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
        background: "#080706",
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
            "linear-gradient(90deg, transparent 0%, rgba(245, 240, 232, 0.06) 50%, transparent 100%)",
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
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "rgba(245, 240, 232, 0.95)",
              margin: 0,
              maxWidth: 900,
            }}
          >
            {ABOUT.heading}
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
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                fontWeight: 400,
                lineHeight: 1.75,
                color: "rgba(214, 204, 190, 0.45)",
                margin: 0,
                maxWidth: 480,
              }}
            >
              {ABOUT.body}
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
              {EXPERIENCE_STATS.map((item) => (
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
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      background:
                        "linear-gradient(135deg, rgba(245,240,232,1) 0%, rgba(201,169,110,0.7) 100%)",
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
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(0.625rem, 0.7vw, 0.6875rem)",
                      fontWeight: 400,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(214, 204, 190, 0.5)",
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
                  "linear-gradient(90deg, rgba(245, 240, 232, 0.06) 0%, transparent 100%)",
                marginBottom: "clamp(2rem, 4vw, 3rem)",
                transformOrigin: "left",
              }}
            />

            {/* Specialization */}
            <div ref={philosophyRef} style={{}}>
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(214, 204, 190, 0.3)",
                  margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
                }}
              >
                {ABOUT.focusLabel}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  letterSpacing: "-0.02em",
                  color: "rgba(245, 240, 232, 0.8)",
                  margin: 0,
                  maxWidth: 400,
                }}
              >
                {ABOUT.focusText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
