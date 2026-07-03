/**
 * Expertise Section
 *
 * Premium categorized showcase — merges Skills and TechStack into
 * one cohesive experience. Large glass cards, SVG icons, hover
 * orchestration, GSAP scroll reveal. Fully accessible.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Data
// ============================================================================

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

interface Category {
  title: string;
  description: string;
  accentColor: string;
  accentRgb: string;
  items: TechItem[];
}

const CATEGORIES: readonly Category[] = [
  {
    title: "Frontend Development",
    description: "The core of what I do — building interfaces that are fast, accessible, and built to scale.",
    accentColor: "rgba(216, 216, 216, 0.8)",
    accentRgb: "216, 216, 216",
    items: [
      { name: "React", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.5v-2.1a2.5 2.5 0 01-2.5-2.5c0-1.7 1.3-3 3-3h.5v-2h-.5a5 5 0 00-5 5 1.8 1.8 0 00.9 3.2l4.1.9zm4 0v-2.2l4.1-.9A1.8 1.8 0 0020 11.4a5 5 0 00-5-5h-.5v2h.5a3 3 0 013 3 2.5 2.5 0 01-2.5 2.5v2.1a.5.5 0 01-.5.1.5.5 0 01-.5-.1z", color: "#61dafb" },
      { name: "TypeScript", icon: "M3 3h18v18H3V3zm4.5 13.2V14H6.6v-6.8h.1l2.4 6.8h1.2l2.4-6.8h.1V14h-1.9v2.2h-1.2v-2.2H9.7v2.2H7.5zm10.2-3.4c0 .7-.2 1.2-.6 1.6-.4.4-1 .6-1.6.6s-1.1-.2-1.5-.5c-.4-.4-.6-.9-.6-1.5V10h1.2v2.9c0 .3.1.6.3.8s.5.3.8.3c.3 0 .6-.1.8-.3s.3-.5.3-.8V10h1.2v3.8z", color: "#3178c6" },
      { name: "Next.js", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.36 14.3L10.2 8.4h-.01V14H8V6h2.16l5.16 7.6V6H17v10.3h-1.64z", color: "#ffffff" },
      { name: "JavaScript", icon: "M3 3h18v18H3V3zm9.6 14.4c.5 0 1-.1 1.4-.4.4-.3.7-.7.9-1.2l-1.4-.8c-.1.2-.3.4-.5.5-.2.1-.4.2-.7.2-.5 0-.8-.2-.9-.6V10h-1.4v5.4c0 1 .3 1.7.9 2.2.6.4 1.3.7 2.1.7 1 0 1.8-.3 2.5-.9V14c-.5.4-1.1.6-1.8.6-.7 0-1.3-.2-1.7-.6-.4-.4-.6-1-.6-1.8V10h-1.4v5.8c0 1.2.3 2.1.9 2.6z", color: "#f7df1e" },
      { name: "Tailwind CSS", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-2.1a2.5 2.5 0 01-2.5-2.5c0-1.7 1.3-3 3-3h.5v-2h-.5a5 5 0 00-5 5 1.8 1.8 0 00.9 3.2l4.1.9zm4 0v-2.2l4.1-.9A1.8 1.8 0 0020 11.4a5 5 0 00-5-5h-.5v2h.5a3 3 0 013 3 2.5 2.5 0 01-2.5 2.5v2.1a.5.5 0 01-.5.1.5.5 0 01-.5-.1z", color: "#38bdf8" },
    ],
  },
  {
    title: "Motion & 3D",
    description: "Animation and spatial computing for interfaces that feel alive — without sacrificing performance.",
    accentColor: "#a855f7",
    accentRgb: "168, 85, 247",
    items: [
      { name: "GSAP", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", color: "#88ce02" },
      { name: "Three.js", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L19.5 8 12 11.8 4.5 8 12 4.2zM4 9.5l7 3.5v7l-7-3.5v-7zm9 10.5v-7l7-3.5v7l-7 3.5z", color: "#049ef4" },
      { name: "React Three Fiber", icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.5v-2.1a2.5 2.5 0 01-2.5-2.5c0-1.7 1.3-3 3-3h.5v-2h-.5a5 5 0 00-5 5 1.8 1.8 0 00.9 3.2l4.1.9zm4 0v-2.2l4.1-.9A1.8 1.8 0 0020 11.4a5 5 0 00-5-5h-.5v2h.5a3 3 0 013 3 2.5 2.5 0 01-2.5 2.5v2.1a.5.5 0 01-.5.1.5.5 0 01-.5-.1z", color: "#61dafb" },
      { name: "Shaders", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L18.5 8 12 11.5 5.5 8 12 4.5zM4 9.2l7 3.5v6.6l-7-3.5V9.2zm9 10.1v-6.6l7-3.5v6.6l-7 3.5z", color: "#06b6d4" },
    ],
  },
  {
    title: "Tools & Workflow",
    description: "The tooling that keeps projects running — version control, build systems, and design collaboration.",
    accentColor: "#06b6d4",
    accentRgb: "6, 182, 212",
    items: [
      { name: "Git", icon: "M21 8.2a3.7 3.7 0 00-6-3.9 3.7 3.7 0 001.2 6.6 3 3 0 01-2.7 1.7h-3a4.5 4.5 0 00-3 1.2V7.6a3.7 3.7 0 10-1.5 0v8.9a3.7 3.7 0 101.8.3 3 3 0 012.7-1.7h3a4.5 4.5 0 004.2-3.1 3.7 3.7 0 003.3-3.7z", color: "#f05032" },
      { name: "GitHub", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", color: "#ffffff" },
      { name: "Figma", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.36 14.3L10.2 8.4h-.01V14H8V6h2.16l5.16 7.6V6H17v10.3h-1.64z", color: "#a259ff" },
      { name: "Vite", icon: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L18.5 8 12 11.5 5.5 8 12 4.5zM4 9.2l7 3.5v6.6l-7-3.5V9.2zm9 10.1v-6.6l7-3.5v6.6l-7 3.5z", color: "#bd34fe" },
      { name: "Node.js", icon: "M12 2l-8 4.5v7L12 18l8-2.5v-7L12 2zm0 2.2L18 7v5l-6 2.2L6 12V7l6-2.8zM6 13.5v-3L12 13l6-2.5v3L12 16l-6-2.5z", color: "#68a063" },
    ],
  },
] as const;

// ============================================================================
// Category Card
// ============================================================================

function CategoryCard({
  category,
  reducedMotion,
}: {
  category: Category;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(SVGSVGElement | null)[]>([]);
  const itemsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    const onEnter = () => {
      gsap.to(card, {
        y: -4,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 1, duration: 0.4, ease: ANIMATION_EASINGS.expoOut, overwrite: "auto" });
      }
      card.style.borderColor = `rgba(${category.accentRgb}, 0.25)`;
      card.style.boxShadow = `0 12px 40px rgba(${category.accentRgb}, 0.08), 0 0 0 1px rgba(${category.accentRgb}, 0.12)`;
      iconRefs.current.forEach((icon, i) => {
        if (icon) {
          gsap.to(icon, {
            rotation: 8,
            scale: 1.1,
            duration: 0.4,
            delay: i * 0.03,
            ease: ANIMATION_EASINGS.backOut,
            overwrite: "auto",
          });
        }
      });
      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll<HTMLElement>("[data-expertise-item]");
        gsap.to(items, {
          x: 4,
          duration: 0.3,
          stagger: 0.03,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
    };

    const onLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0, duration: 0.3, ease: ANIMATION_EASINGS.expoOut, overwrite: "auto" });
      }
      card.style.borderColor = `rgba(${category.accentRgb}, 0.1)`;
      card.style.boxShadow = `0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.04)`;
      iconRefs.current.forEach((icon) => {
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: ANIMATION_EASINGS.expoOut,
            overwrite: "auto",
          });
        }
      });
      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll<HTMLElement>("[data-expertise-item]");
        gsap.to(items, {
          x: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: ANIMATION_EASINGS.expoOut,
          overwrite: "auto",
        });
      }
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
  }, [reducedMotion, category.accentRgb]);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      role="article"
      aria-label={`${category.title} — ${String(category.items.length)} technologies`}
      data-expertise="card"
      style={{
        position: "relative",
        padding: "clamp(1.75rem, 3vw, 2.5rem)",
        borderRadius: 16,
        background: `linear-gradient(135deg, rgba(${category.accentRgb}, 0.06) 0%, rgba(${category.accentRgb}, 0.02) 100%)`,
        border: `1px solid rgba(${category.accentRgb}, 0.1)`,
        boxShadow: `0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.04)`,
        cursor: "default",
        outline: "none",
        overflow: "hidden",
        willChange: "transform",
        display: "flex",
        flexDirection: "column",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = `rgba(${category.accentRgb}, 0.3)`;
        e.currentTarget.style.boxShadow = `0 8px 40px rgba(${category.accentRgb}, 0.1), 0 0 0 1px rgba(${category.accentRgb}, 0.15)`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = `rgba(${category.accentRgb}, 0.1)`;
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.04)`;
      }}
    >
      {/* Background glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: `radial-gradient(ellipse at 50% 0%, rgba(${category.accentRgb}, 0.08) 0%, transparent 60%)`,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Category header */}
        <div style={{ marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#f0f0f5",
              margin: "0 0 0.5rem 0",
            }}
          >
            {category.title}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.8125rem, 1vw, 0.875rem)",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(226, 232, 240, 0.55)",
              margin: 0,
            }}
          >
            {category.description}
          </p>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: `linear-gradient(90deg, rgba(${category.accentRgb}, 0.2) 0%, rgba(${category.accentRgb}, 0.05) 100%)`,
            marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
          }}
        />

        {/* Technology items */}
        <div
          ref={itemsRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.625rem, 1.2vw, 0.875rem)",
            flex: 1,
          }}
        >
          {category.items.map((item, i) => (
            <div
              key={item.name}
              data-expertise-item
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(0.75rem, 1.5vw, 1rem)",
                padding: "clamp(0.5rem, 1vw, 0.625rem) clamp(0.625rem, 1.2vw, 0.875rem)",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                transition: "background 0.25s ease, border-color 0.25s ease",
                willChange: "transform",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `rgba(${category.accentRgb}, 0.06)`;
                e.currentTarget.style.borderColor = `rgba(${category.accentRgb}, 0.12)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)";
              }}
            >
              {/* SVG Icon */}
              <svg
                ref={(el) => { iconRefs.current[i] = el; }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  willChange: "transform",
                }}
              >
                <path d={item.icon} fill={item.color} fillOpacity={0.85} />
              </svg>

              {/* Name */}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
                  fontWeight: 500,
                  color: "rgba(226, 232, 240, 0.75)",
                  letterSpacing: "0.01em",
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
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
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) {
          if (headerRef.current) headerRef.current.style.opacity = "1";
          if (subtitleRef.current) subtitleRef.current.style.opacity = "1";
          if (gridRef.current) gridRef.current.style.opacity = "1";
          return;
        }

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

          // Header
          if (headerRef.current) {
            tl.fromTo(
              headerRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
            );
          }

          // Subtitle
          if (subtitleRef.current) {
            tl.fromTo(
              subtitleRef.current,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6 },
              "-=0.5",
            );
          }

          // Cards
          if (gridRef.current) {
            tl.to(gridRef.current, { opacity: 1, duration: 0.01 }, "<");
            const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-expertise='card']");
            if (cards.length > 0) {
              tl.fromTo(
                cards,
                { y: 40, opacity: 0, scale: 0.97 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.7,
                  stagger: 0.1,
                  ease: ANIMATION_EASINGS.backOut,
                },
                "-=0.3",
              );
            }
          }
        }, sectionRef);
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
      id="expertise"
      aria-labelledby="expertise-heading"
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

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.025) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
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
            Expertise
          </span>
          <h2
            id="expertise-heading"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#f0f0f5",
              margin: 0,
            }}
          >
            Skills &
            <br />
            <span className="expertise-gradient-text">
              Technologies
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.9375rem, 1.15vw, 1.0625rem)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "rgba(226, 232, 240, 0.5)",
            margin: "0 0 clamp(3rem, 6vw, 5rem) 0",
            maxWidth: 480,
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          Technologies I work with daily, chosen for reliability, performance, and developer experience.
        </p>

        {/* Category grid */}
        <div
          ref={gridRef}
          data-expertise="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1.25rem, 2.5vw, 1.75rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.title}
              category={category}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
