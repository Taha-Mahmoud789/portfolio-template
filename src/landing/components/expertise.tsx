/**
 * Expertise Section — Bento Grid layout
 *
 * Interactive glass cards in a responsive grid.
 * Frontend Development, Motion Systems,
 * Interactive Experiences, Performance Engineering.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { SERVICES, type Service } from "@/content";

// ============================================================================
// Bento Card
// ============================================================================

function BentoCard({
  service,
  index,
  reducedMotion,
}: {
  service: Service;
  index: number;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    const handleEnter = () => {
      gsap.to(card, {
        y: -6,
        scale: 1.01,
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      gsap.to(card, {
        borderColor: "rgba(59, 130, 246, 0.15)",
        boxShadow: "0 8px 32px rgba(59, 130, 246, 0.08)",
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      gsap.to(card, {
        borderColor: "rgba(255, 255, 255, 0.06)",
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, [reducedMotion]);

  const isWide = index === 0 || index === 2;

  return (
    <div
      ref={cardRef}
      data-service-card
      style={{
        gridColumn: isWide ? "span 2" : "span 1",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 16,
        padding: "clamp(1.5rem, 3vw, 2.5rem)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(1rem, 2vw, 1.5rem)",
        willChange: "transform",
        cursor: "default",
      }}
      className="focus-ring"
    >
      {/* Number + Title */}
      <div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 400,
            letterSpacing: "0.12em",
            color: "rgba(59, 130, 246, 0.6)",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          {service.number}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isWide ? "clamp(1.5rem, 3vw, 2.25rem)" : "clamp(1.25rem, 2.5vw, 1.75rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "rgba(241, 245, 249, 0.95)",
            margin: 0,
          }}
        >
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.875rem, 1vw, 1rem)",
          fontWeight: 400,
          lineHeight: 1.7,
          color: "rgba(148, 163, 184, 0.5)",
          margin: 0,
          maxWidth: isWide ? 520 : 400,
        }}
      >
        {service.description}
      </p>

      {/* Tag Pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: "auto",
        }}
      >
        {service.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "rgba(241, 245, 249, 0.5)",
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(241, 245, 249, 0.03)",
              border: "1px solid rgba(241, 245, 249, 0.04)",
              whiteSpace: "nowrap",
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
// Expertise Section
// ============================================================================

export function Expertise() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
          const tl = gsap.timeline({
            defaults: { ease: ANIMATION_EASINGS.expoOut },
          });

          // Header — clip-path mask reveal
          if (headerRef.current) {
            const headerLines =
              headerRef.current.querySelectorAll<HTMLElement>("[data-header-line]");
            if (headerLines.length > 0) {
              headerLines.forEach((line, i) => {
                tl.fromTo(
                  line,
                  { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                  { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
                  i * 0.15,
                );
              });
            } else {
              tl.fromTo(
                headerRef.current,
                { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
              );
            }
          }

          // Bento cards — staggered fade + rise
          if (gridRef.current) {
            const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-service-card]");
            tl.fromTo(
              cards,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.1,
              },
              "-=0.3",
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
      id="expertise"
      aria-labelledby="expertise-heading"
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

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            marginBottom: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          <h2
            id="expertise-heading"
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
              Services.
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
              Focus.
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            gridAutoFlow: "dense",
          }}
        >
          {SERVICES.map((service, index) => (
            <BentoCard
              key={service.number}
              service={service}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
