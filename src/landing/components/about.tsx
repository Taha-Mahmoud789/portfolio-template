/**
 * About Section — Merged manifesto + about with playful glass cards
 *
 * Left: Bold editorial manifesto lines + body text
 * Right: Floating stat cards with glass effect + specialization
 */

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { EXPERIENCE_STATS, ABOUT, INTRO } from "@/content";
import { CountUp } from "./count-up";

// ============================================================================
// Glass Stat Card
// ============================================================================

function StatCard({
  item,
  triggered,
  reducedMotion: isReduced,
}: {
  item: (typeof EXPERIENCE_STATS)[number];
  triggered: boolean;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -6,
        scale: 1.02,
        duration: 0.4,
        ease: ANIMATION_EASINGS.backOut,
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      data-number-item
      role="listitem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "clamp(1.25rem, 2vw, 1.75rem)",
        borderRadius: 16,
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(12px)",
        cursor: "default",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        willChange: "clip-path, transform",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(59, 130, 246, 0.06)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
        e.currentTarget.style.boxShadow = "none";
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
            "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(59,130,246,0.8) 50%, rgba(6,182,212,0.6) 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {isReduced ? (
          <>
            {item.value}
            {item.suffix}
          </>
        ) : (
          <CountUp target={item.value} suffix={item.suffix} trigger={triggered} />
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.625rem, 0.7vw, 0.6875rem)",
          fontWeight: 400,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(100, 116, 139, 0.5)",
        }}
      >
        {item.label}
      </div>
    </div>
  );
}

// ============================================================================
// About Section
// ============================================================================

export function About() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
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

          // Manifesto lines — staggered clip-path reveal
          if (manifestoRef.current) {
            const lines =
              manifestoRef.current.querySelectorAll<HTMLElement>("[data-manifesto-line]");
            tl.fromTo(
              lines,
              { clipPath: "inset(0 100% 0 0)", opacity: 1 },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: 0.9,
                stagger: 0.15,
              },
            );
          }

          // Body text — fade + slide up
          if (bodyRef.current) {
            tl.fromTo(
              bodyRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9 },
              "-=0.4",
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
              { scaleX: 1, duration: 0.8 },
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

  const introLines = [INTRO.line1, INTRO.line2, INTRO.line3];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "#0B0F1A",
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
            "linear-gradient(90deg, transparent 0%, rgba(241, 245, 249, 0.06) 50%, transparent 100%)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Two column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: "clamp(3rem, 6vw, 5rem)",
            alignItems: "start",
          }}
        >
          {/* Left — Manifesto + Body */}
          <div>
            {/* Manifesto lines */}
            <div ref={manifestoRef} style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
              <h2
                id="about-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {introLines.map((line, i) => (
                  <div
                    key={line}
                    data-manifesto-line
                    style={{
                      willChange: "clip-path",
                      color: i === 1 ? "rgba(241, 245, 249, 0.95)" : "rgba(148, 163, 184, 0.5)",
                      marginBottom: "clamp(0.25rem, 0.5vw, 0.5rem)",
                    }}
                  >
                    {i === 2 ? (
                      <>
                        {line.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="gradient-text">{line.split(" ").slice(-1)}</span>.
                      </>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </h2>
            </div>

            {/* Body text */}
            <div ref={bodyRef}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: "rgba(148, 163, 184, 0.5)",
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                {ABOUT.body}
              </p>
            </div>
          </div>

          {/* Right — Stat cards + Specialization */}
          <div>
            {/* Experience stat cards */}
            <div
              ref={numbersRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "clamp(0.75rem, 1.5vw, 1rem)",
                marginBottom: "clamp(2rem, 4vw, 3rem)",
              }}
              role="list"
              aria-label="Key metrics"
            >
              {EXPERIENCE_STATS.map((item) => (
                <StatCard
                  key={item.label}
                  item={item}
                  triggered={numbersTriggered}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>

            {/* Divider — animated */}
            <div
              ref={dividerRef}
              aria-hidden="true"
              style={{
                height: 1,
                background: "linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%)",
                marginBottom: "clamp(2rem, 4vw, 3rem)",
                transformOrigin: "left",
              }}
            />

            {/* Specialization */}
            <div ref={philosophyRef}>
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(100, 116, 139, 0.4)",
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
                  color: "rgba(241, 245, 249, 0.8)",
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
