/**
 * Stats Section
 *
 * Animated statistics with GSAP count-up, scroll-triggered reveal,
 * premium glass morphism cards. Responsive 4/2/1 columns.
 */

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { CountUp } from "./count-up";

// ============================================================================
// Data
// ============================================================================

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

const STATS: StatItem[] = [
  {
    value: 6,
    suffix: "+",
    label: "Years of Experience",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z",
  },
  {
    value: 50,
    suffix: "+",
    label: "Completed Projects",
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  },
  {
    value: 15,
    suffix: "+",
    label: "Technologies",
    icon: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  },
  {
    value: 30,
    suffix: "+",
    label: "Happy Clients",
    icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  },
];

// ============================================================================
// Stat Card
// ============================================================================

function StatCard({
  stat,
  trigger,
  reducedMotion,
}: {
  stat: StatItem;
  trigger: boolean;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    const onEnter = () => {
      gsap.to(card, {
        y: -6,
        scale: 1.02,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("focus", onEnter);
    card.addEventListener("blur", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("focus", onEnter);
      card.removeEventListener("blur", onLeave);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      role="group"
      aria-label={`${String(stat.value)}${stat.suffix} ${stat.label}`}
      data-stat
      style={{
        position: "relative",
        padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)",
        borderRadius: 16,
        background: "rgba(245, 240, 232, 0.02)",
        border: "1px solid rgba(245, 240, 232, 0.03)",
        outline: "none",
        cursor: "default",
        overflow: "hidden",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        textAlign: "center" as const,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.2)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(201, 169, 110, 0.06)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(245, 240, 232, 0.05)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(120px, 15vw, 200px)",
          height: "clamp(120px, 15vw, 200px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        <div
          style={{
            width: "clamp(48px, 6vw, 64px)",
            height: "clamp(48px, 6vw, 64px)",
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(201, 169, 110, 0.12) 0%, rgba(180, 140, 80, 0.06) 100%)",
            border: "1px solid rgba(201, 169, 110, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={stat.icon}
              stroke="rgba(201, 169, 110, 0.8)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          background: "linear-gradient(135deg, #d4b87a 0%, #c9a96e 35%, #b8944e 65%, #a07830 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "clamp(0.5rem, 1vw, 0.75rem)",
        }}
      >
        {reducedMotion ? (
          <>
            {stat.value}
            {stat.suffix}
          </>
        ) : (
          <CountUp target={stat.value} suffix={stat.suffix} trigger={trigger} />
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: "rgba(226, 232, 240, 0.5)",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

// ============================================================================
// Stats Section
// ============================================================================

export function Stats() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          if (headingRef.current) headingRef.current.style.opacity = "1";
          if (gridRef.current) gridRef.current.style.opacity = "1";
          setTriggered(true);
          return;
        }

        ctx = gsap.context(() => {
          const tl = gsap.timeline();

          if (headingRef.current) {
            tl.fromTo(
              headingRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: ANIMATION_EASINGS.expoOut },
            );
          }

          if (gridRef.current) {
            tl.to(gridRef.current, { opacity: 1, duration: 0.01 }, "<");
            const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-stat]");
            if (cards.length > 0) {
              tl.fromTo(
                cards,
                { y: 40, opacity: 0, scale: 0.95 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: ANIMATION_EASINGS.backOut,
                  onComplete: () => setTriggered(true),
                },
                "-=0.4",
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
      id="stats"
      aria-labelledby="stats-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "linear-gradient(180deg, #080706 0%, #0c0b09 50%, #121110 100%)",
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
            "linear-gradient(90deg, transparent 0%, rgba(201, 169, 110, 0.15) 50%, transparent 100%)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            textAlign: "center" as const,
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
              color: "rgba(201, 169, 110, 0.7)",
              display: "block",
              marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            }}
          >
            Track Record
          </span>
          <h2
            id="stats-heading"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#f5f0e8",
              margin: 0,
            }}
          >
            By the
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #d4b87a 0%, #c9a96e 50%, #b8944e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Numbers
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              stat={stat}
              trigger={triggered}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
