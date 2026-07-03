/**
 * About Section
 *
 * Premium cinematic about — two-column layout with portrait and story.
 * Apple-grade typography, luxury spacing, GSAP scroll reveal.
 * Responsive 2-column → single-column. Full accessibility.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { CountUp } from "./count-up";

// ============================================================================
// Constants
// ============================================================================

const METRICS = [
  { value: 6, suffix: "+", label: "Years" },
  { value: 50, suffix: "+", label: "Projects" },
  { value: 30, suffix: "+", label: "Clients" },
  { value: 99, suffix: "%", label: "Satisfaction" },
] as const;

// ============================================================================
// Portrait
// ============================================================================

function Portrait({ reducedMotion }: { reducedMotion: boolean }) {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = portraitRef.current;
    if (!el || reducedMotion) return;

    const onEnter = () => {
      gsap.to(el, {
        scale: 1.02,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={portraitRef}
      data-about="portrait"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        borderRadius: 24,
        overflow: "hidden",
        willChange: "transform",
        flexShrink: 0,
      }}
    >
      {/* Glass border glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 25,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(216, 216, 216, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Soft ambient glow behind portrait */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -40,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: -1,
          filter: "blur(40px)",
        }}
      />
      {/* Inner container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.06)",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Portrait image */}
        <img
          src="https://i.pravatar.cc/600?img=12"
          alt="Frontend Multiverse — developer portrait"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
        {/* Top highlight */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Metric Card
// ============================================================================

function MetricCard({
  metric,
  trigger,
  reducedMotion,
}: {
  metric: (typeof METRICS)[number];
  trigger: boolean;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLLIElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -4,
      duration: 0.3,
      ease: ANIMATION_EASINGS.backOut,
      overwrite: true,
    });
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: ANIMATION_EASINGS.expoOut,
      overwrite: true,
    });
  }, [reducedMotion]);

  return (
    <li
      ref={cardRef}
      data-about="metric"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        textAlign: "center",
        padding: "clamp(1.25rem, 2vw, 1.75rem) clamp(0.75rem, 1.5vw, 1.25rem)",
        listStyle: "none",
        borderRadius: 12,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
      }}
    >
      <div
        className="about-metric-value"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: "clamp(0.5rem, 1vw, 0.75rem)",
        }}
      >
        {reducedMotion ? (
          <>
            {metric.value}
            {metric.suffix}
          </>
        ) : (
          <CountUp target={metric.value} suffix={metric.suffix} trigger={trigger} />
        )}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "rgba(226, 232, 240, 0.5)",
        }}
      >
        {metric.label}
      </div>
    </li>
  );
}

// ============================================================================
// About Section
// ============================================================================

export function About() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const portraitRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const [metricsTriggered, setMetricsTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          [portraitRef, labelRef, headingRef, storyRef, dividerRef, metricsRef].forEach(
            (r) => {
              if (r.current) r.current.style.opacity = "1";
            },
          );
          setMetricsTriggered(true);
          return;
        }

        ctx = gsap.context(() => {
          const tl = gsap.timeline();

          // 1. Portrait
          if (portraitRef.current) {
            tl.fromTo(
              portraitRef.current,
              { y: 40, opacity: 0, scale: 0.97 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: ANIMATION_EASINGS.expoOut,
              },
            );
          }

          // 2. Label
          if (labelRef.current) {
            tl.fromTo(
              labelRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: ANIMATION_EASINGS.expoOut },
              "-=0.5",
            );
          }

          // 3. Heading
          if (headingRef.current) {
            tl.fromTo(
              headingRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: ANIMATION_EASINGS.expoOut },
              "-=0.4",
            );
          }

          // 4. Story
          if (storyRef.current) {
            tl.fromTo(
              storyRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: ANIMATION_EASINGS.expoOut },
              "-=0.35",
            );
          }

          // 5. Divider
          if (dividerRef.current) {
            tl.fromTo(
              dividerRef.current,
              { scaleX: 0, opacity: 0 },
              {
                scaleX: 1,
                opacity: 1,
                duration: 0.6,
                ease: ANIMATION_EASINGS.expoOut,
              },
              "-=0.2",
            );
          }

          // 6. Metrics (stagger)
          if (metricsRef.current) {
            tl.fromTo(
              metricsRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.01 },
              "-=0.3",
            );
            const cards = metricsRef.current.querySelectorAll<HTMLElement>("[data-about='metric']");
            if (cards.length > 0) {
              tl.fromTo(
                cards,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.08,
                  ease: ANIMATION_EASINGS.backOut,
                  onComplete: () => setMetricsTriggered(true),
                },
                "-=0.2",
              );
            }
          }
        });
      },
      { threshold: 0.12 },
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
        background: "linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #000000 100%)",
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
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)",
        }}
      />

      <div
        data-about="grid"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
          gap: "clamp(3rem, 6vw, 5rem)",
          alignItems: "center",
        }}
      >
        {/* ================================================================ */}
        {/* Left Column — Portrait */}
        {/* ================================================================ */}
        <div
          ref={portraitRef}
          data-about="portrait-wrapper"
          style={{
            opacity: reducedMotion ? 1 : 0,
            maxWidth: 380,
            justifySelf: "center",
          }}
        >
          <Portrait reducedMotion={reducedMotion} />
        </div>

        {/* ================================================================ */}
        {/* Right Column — Story + Metrics */}
        {/* ================================================================ */}
        <div>
          {/* Label */}
          <div
            ref={labelRef}
            style={{
              opacity: reducedMotion ? 1 : 0,
              marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
                fontWeight: 400,
                letterSpacing: "0.3em",
                textTransform: "uppercase" as const,
                color: "rgba(216, 216, 216, 0.5)",
                display: "inline-block",
                padding: "0.4em 0.9em",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 100,
              }}
            >
              About
            </span>
          </div>

          {/* Heading */}
          <div
            ref={headingRef}
            style={{
              opacity: reducedMotion ? 1 : 0,
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            <h2
              id="about-heading"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#f0f0f5",
                margin: 0,
              }}
            >
              Engineering
              <br />
              Meets{" "}
              <span
                className="about-metric-value"
              >
                Design
              </span>
            </h2>
          </div>

          {/* Story */}
          <div
            ref={storyRef}
            style={{
              opacity: reducedMotion ? 1 : 0,
              marginBottom: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
                fontWeight: 400,
                lineHeight: 1.65,
                color: "rgba(226, 232, 240, 0.5)",
                margin: 0,
                maxWidth: 520,
              }}
            >
              I&apos;m a frontend developer who cares about how things work —
              not just whether they render, but whether they&apos;re fast,
              accessible, and built to last. I spend my time thinking about
              component architecture, animation performance, and how to make
              complex interfaces feel simple. Most of my work involves React,
              TypeScript, and the kind of details that separate good software
              from great software.
            </p>
          </div>

          {/* Divider */}
          <div
            ref={dividerRef}
            aria-hidden="true"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
              marginBottom: "clamp(2rem, 4vw, 3rem)",
              opacity: reducedMotion ? 1 : 0,
              transformOrigin: "left center",
            }}
          />

          {/* Metrics */}
          <div
            ref={metricsRef}
            data-about="metrics"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(0.25rem, 0.5vw, 0.5rem)",
              opacity: reducedMotion ? 1 : 0,
            }}
            role="list"
            aria-label="Key metrics"
          >
            {METRICS.map((metric) => (
              <MetricCard
                key={metric.label}
                metric={metric}
                trigger={metricsTriggered}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
