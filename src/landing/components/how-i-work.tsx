/**
 * How I Work Section
 *
 * Premium process timeline with flowing gradient line, animated dots,
 * gradient-bordered cards, arrow connectors. Fully accessible.
 */

import { useRef, useEffect, useState } from "react";
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
  items: readonly string[];
}

const STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description: "Understanding the problem before writing code",
    items: ["Requirements", "Architecture", "Tech Planning"],
  },
  {
    number: "02",
    title: "Design",
    description: "Turning ideas into component structures",
    items: ["Component Design", "State Management", "API Contracts"],
  },
  {
    number: "03",
    title: "Development",
    description: "Building with clean, tested code",
    items: ["React", "TypeScript", "Testing", "Code Review"],
  },
  {
    number: "04",
    title: "Delivery",
    description: "Shipping fast, accessible, production-ready code",
    items: ["Performance", "Accessibility", "SEO", "Deployment"],
  },
] as const;

// ============================================================================
// Icons
// ============================================================================

function DiscoverIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20L26 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="16" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="17" y="16" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="22" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M10 8L16 4L22 8V14L16 18L10 14V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 18V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 24L16 28L22 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OptimizeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 16L15 19L21 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

const ICONS = [DiscoverIcon, DesignIcon, BuildIcon, OptimizeIcon];

// ============================================================================
// Arrow Connector
// ============================================================================

function ArrowConnector() {
  return (
    <div
      aria-hidden="true"
      className="step-arrow"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        flexShrink: 0,
        color: "rgba(255, 255, 255, 0.15)",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12H19M19 12L13 6M19 12L13 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ============================================================================
// Step Card
// ============================================================================

function StepCard({
  step,
  index,
  isHovered,
  onHover,
  onLeave,
  reducedMotion,
}: {
  step: ProcessStep;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const Icon = ICONS[index] ?? DiscoverIcon;

  useEffect(() => {
    const el = cardRef.current;
    if (!el || reducedMotion) return;

    if (isHovered) {
      gsap.to(el, {
        scale: 1.03,
        y: -6,
        duration: 0.4,
        ease: ANIMATION_EASINGS.backOut,
        overwrite: "auto",
      });
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          rotate: 8,
          scale: 1.1,
          duration: 0.4,
          ease: ANIMATION_EASINGS.backOut,
          overwrite: "auto",
        });
      }
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -2,
          duration: 0.3,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
      const items = itemsRef.current?.querySelectorAll<HTMLElement>("span");
      if (items && items.length > 0) {
        gsap.to(items, {
          y: -2,
          duration: 0.3,
          stagger: 0.04,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
    } else {
      gsap.to(el, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          rotate: 0,
          scale: 1,
          duration: 0.4,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: 0,
          duration: 0.3,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
      const items = itemsRef.current?.querySelectorAll<HTMLElement>("span");
      if (items && items.length > 0) {
        gsap.to(items, {
          y: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
    }
  }, [isHovered, reducedMotion]);

  return (
    <div
      ref={cardRef}
      className="step-card"
      data-how-i-work="card"
      role="button"
      tabIndex={0}
      aria-label={`${step.title} step: ${step.items.join(", ")}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "clamp(1.5rem, 2.5vw, 2rem) clamp(1rem, 2vw, 1.5rem)",
        borderRadius: 16,
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
        outline: "none",
        willChange: "transform",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Top gradient accent line */}
      <div
        className="step-accent"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 2,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Glow effect */}
      <div
        className="step-glow"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.06) 0%, transparent 60%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Step number */}
      <span
        className="step-number"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6875rem",
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.4)",
          letterSpacing: "0.15em",
          marginBottom: "1rem",
          transition: "color 0.3s ease",
        }}
      >
        {step.number}
      </span>

      {/* Icon */}
      <div
        ref={iconRef}
        className="step-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(216, 216, 216, 0.03) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#a5b4fc",
          marginBottom: "1.25rem",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          willChange: "transform",
        }}
      >
        <Icon />
      </div>

      {/* Title */}
      <h3
        ref={titleRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(1.0625rem, 1.2vw, 1.25rem)",
          fontWeight: 600,
          color: "#f0f0f5",
          margin: "0 0 0.375rem 0",
          letterSpacing: "-0.02em",
          willChange: "transform",
        }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.8125rem",
          fontWeight: 400,
          color: "rgba(226, 232, 240, 0.5)",
          margin: "0 0 1rem 0",
          lineHeight: 1.5,
        }}
      >
        {step.description}
      </p>

      {/* Divider */}
      <div
        aria-hidden="true"
        style={{
          width: 32,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
          marginBottom: "1rem",
        }}
      />

      {/* Items */}
      <div
        ref={itemsRef}
        className="step-items"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        {step.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8125rem",
              color: "rgba(226, 232, 240, 0.5)",
              lineHeight: 1.6,
              willChange: "transform",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// How I Work Section
// ============================================================================

export function HowIWork() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();

          ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

            // Header
            tl.fromTo(
              headerRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
            );

            // Reveal containers
            tl.to(lineRef.current, { opacity: 1, duration: 0.01 }, "<");
            tl.to(cardsRef.current, { opacity: 1, duration: 0.01 }, "<");

            // Timeline line
            tl.fromTo(
              lineRef.current,
              { scaleX: 0 },
              { scaleX: 1, duration: 1.2, ease: ANIMATION_EASINGS.expoInOut },
              "-=0.4",
            );

            // Cards stagger with arrows
            const cards = cardsRef.current?.querySelectorAll<HTMLElement>("[data-how-i-work='card']");
            if (cards && cards.length > 0) {
              tl.fromTo(
                cards,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: ANIMATION_EASINGS.backOut,
                  stagger: 0.1,
                },
                "-=0.8",
              );
            }

            // Arrows
            const arrows = cardsRef.current?.querySelectorAll<HTMLElement>(".step-arrow");
            if (arrows && arrows.length > 0) {
              tl.fromTo(
                arrows,
                { opacity: 0, x: -8 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.4,
                  stagger: 0.08,
                  ease: ANIMATION_EASINGS.backOut,
                },
                "-=0.5",
              );
            }
          }, sectionRef);
        }
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
      id="how-i-work"
      data-how-i-work="section"
      aria-labelledby="how-i-work-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #000000 100%)",
        overflow: "hidden",
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

      {/* Ambient glow — left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow — right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          right: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: "center",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
              fontWeight: 400,
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              color: "rgba(216, 216, 216, 0.5)",
              display: "block",
              marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
            }}
          >
            Process
          </span>
          <h2
            id="how-i-work-heading"
            className="how-i-work-gradient-text"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
            }}
          >
            How I Work
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(226, 232, 240, 0.5)",
              margin: "0 auto",
              maxWidth: 480,
            }}
          >
            How I approach every project — from understanding the problem
            to shipping production-ready code.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Flowing gradient line */}
          <div
            ref={lineRef}
            data-how-i-work="line"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "42px",
              left: "12.5%",
              right: "12.5%",
              height: 2,
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.2) 25%, rgba(216, 216, 216, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.06) 100%)",
              transformOrigin: "left center",
              opacity: reducedMotion ? 1 : 0,
              zIndex: 0,
            }}
          />

          {/* Cards row with arrows */}
          <div
            ref={cardsRef}
            data-how-i-work="grid"
            className="timeline-grid"
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "stretch",
              gap: 0,
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <StepCard
                  step={step}
                  index={index}
                  isHovered={hoveredStep === index}
                  onHover={() => setHoveredStep(index)}
                  onLeave={() => setHoveredStep(null)}
                  reducedMotion={reducedMotion}
                />
                {index < STEPS.length - 1 && <ArrowConnector />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
