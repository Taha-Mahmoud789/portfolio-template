/**
 * Why Work With Me Section
 *
 * Premium value proposition - 2x2 glass cards with gradient icons,
 * accent lines, hover glow, GSAP scroll reveal. Fully accessible.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

interface Value {
  number: string;
  title: string;
  description: string;
}

const VALUES: readonly Value[] = [
  {
    number: "01",
    title: "Performance",
    description:
      "I optimize for speed — lazy loading, code splitting, efficient rendering. Users shouldn't wait for your interface.",
  },
  {
    number: "02",
    title: "Clean Architecture",
    description:
      "Components that are reusable, state that is predictable, code that other developers can understand and extend.",
  },
  {
    number: "03",
    title: "UX Thinking",
    description:
      "I don't just implement designs — I think about user flows, error states, loading experiences, and edge cases.",
  },
  {
    number: "04",
    title: "Accessibility",
    description:
      "Semantic HTML, keyboard navigation, screen reader support. Every user should be able to use what I build.",
  },
] as const;

function PerformanceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M4 16L8 12L12 16L16 8L20 14L24 10L28 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="16" r="2" fill="currentColor" />
      <path d="M4 24H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 22L10 16L16 22L22 14L28 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 4L4 10L16 16L28 10L16 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 16L16 22L28 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 22L16 28L28 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccessibilityIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 12V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 28L16 20L20 28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = [PerformanceIcon, DesignIcon, StackIcon, AccessibilityIcon];

function ValueCard({
  value,
  index,
  reducedMotion,
}: {
  value: Value;
  index: number;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || reducedMotion) return;

    const handleEnter = () => {
      gsap.to(el, {
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
      if (accentRef.current) {
        gsap.to(accentRef.current, {
          scaleX: 1,
          duration: 0.4,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
    };

    const handleLeave = () => {
      gsap.to(el, {
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
      if (accentRef.current) {
        gsap.to(accentRef.current, {
          scaleX: 0,
          duration: 0.3,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("focus", handleEnter);
    el.addEventListener("blur", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("focus", handleEnter);
      el.removeEventListener("blur", handleLeave);
    };
  }, [reducedMotion]);

  const Icon = ICONS[index] ?? PerformanceIcon;

  return (
    <div
      ref={cardRef}
      className="value-card"
      data-why-work="card"
      role="group"
      tabIndex={0}
      aria-label={value.title}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(1.75rem, 3vw, 2.25rem)",
        borderRadius: 16,
        background: "rgba(245, 240, 232, 0.025)",
        border: "1px solid rgba(245, 240, 232, 0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        cursor: "default",
        outline: "none",
        willChange: "transform",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease",
      }}
    >
      <div
        ref={accentRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: 2,
          borderRadius: 1,
          background: "linear-gradient(90deg, transparent, rgba(245, 240, 232, 0.2), transparent)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
        }}
      />

      <div
        className="value-glow"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(245, 240, 232, 0.05) 0%, transparent 60%)",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.4s ease",
        }}
      />

      <div
        ref={iconRef}
        className="value-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(245, 240, 232, 0.04) 0%, rgba(245, 240, 232, 0.025) 100%)",
          border: "1px solid rgba(245, 240, 232, 0.06)",
          color: "#c9a96e",
          marginBottom: "1.25rem",
          willChange: "transform",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <Icon />
      </div>

      <span
        className="value-number"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6875rem",
          fontWeight: 500,
          color: "rgba(180, 170, 155, 0.35)",
          letterSpacing: "0.15em",
          marginBottom: "0.75rem",
          transition: "color 0.3s ease",
        }}
      >
        {value.number}
      </span>

      <h3
        ref={titleRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(1.0625rem, 1.2vw, 1.25rem)",
          fontWeight: 600,
          color: "#f5f0e8",
          margin: "0 0 0.75rem 0",
          letterSpacing: "-0.02em",
          willChange: "transform",
        }}
      >
        {value.title}
      </h3>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.875rem, 1vw, 0.9375rem)",
          fontWeight: 400,
          lineHeight: 1.65,
          color: "rgba(226, 232, 240, 0.5)",
          margin: 0,
        }}
      >
        {value.description}
      </p>
    </div>
  );
}

export function WhyWorkWithMe() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();

          ctx = gsap.context(() => {
            const tl = gsap.timeline({
              defaults: { ease: ANIMATION_EASINGS.expoOut },
            });

            tl.fromTo(
              headerRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
            );

            tl.to(gridRef.current, { opacity: 1, duration: 0.01 }, "<");

            const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-why-work='card']");
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
      id="why-work-with-me"
      data-why-work="section"
      aria-labelledby="why-work-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "linear-gradient(180deg, #080706 0%, #0c0b09 50%, #121110 100%)",
        overflow: "hidden",
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
            "linear-gradient(90deg, transparent 0%, rgba(245, 240, 232, 0.08) 50%, transparent 100%)",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 240, 232, 0.025) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(214, 204, 190, 0.5)",
              display: "block",
              marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
            }}
          >
            Values
          </span>
          <h2
            id="why-work-heading"
            className="gradient-text"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
            }}
          >
            Why Work With Me
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "rgba(214, 204, 190, 0.45)",
              margin: "0 auto",
              maxWidth: 520,
            }}
          >
            What I focus on when I build — and what you can expect when we work together.
          </p>
        </div>

        <div
          ref={gridRef}
          data-why-work="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(1.25rem, 2.5vw, 1.75rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {VALUES.map((value, index) => (
            <ValueCard
              key={value.title}
              value={value}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
