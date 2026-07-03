/**
 * Expertise Section — TRIONN-inspired service layout
 *
 * Creative studio style. Large accordion.
 * Frontend Development, Motion Systems,
 * Interactive Experiences, Performance Engineering.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Data
// ============================================================================

interface Service {
  number: string;
  title: string;
  description: string;
  items: readonly string[];
}

const SERVICES: readonly Service[] = [
  {
    number: "01",
    title: "Frontend Architecture",
    description:
      "Building interfaces that are fast, accessible, and built to scale with modern frameworks.",
    items: [
      "React & Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Component Architecture",
      "State Management",
    ],
  },
  {
    number: "02",
    title: "Motion & Rhythm",
    description:
      "Animation that moves with intention — scroll-driven reveals, page transitions, spatial computing.",
    items: [
      "GSAP & ScrollTrigger",
      "Framer Motion",
      "CSS Animations",
      "Scroll-Driven Effects",
      "Page Transitions",
    ],
  },
  {
    number: "03",
    title: "Interactive Worlds",
    description:
      "Creative development that pushes what a browser can do — 3D, shaders, spatial computing.",
    items: [
      "Three.js & WebGL",
      "React Three Fiber",
      "Canvas API",
      "Web Audio",
      "Shader Programming",
    ],
  },
  {
    number: "04",
    title: "Performance Craft",
    description:
      "Optimizing for speed — lazy loading, code splitting, efficient rendering. Users shouldn't wait.",
    items: [
      "Core Web Vitals",
      "Bundle Optimization",
      "Image Optimization",
      "Caching Strategies",
      "Monitoring",
    ],
  },
] as const;

// ============================================================================
// Accordion Item
// ============================================================================

function AccordionItem({
  service,
  isOpen,
  onToggle,
  index,
  reducedMotion,
}: {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  reducedMotion: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const items = itemsRef.current;
    if (!content || !items || reducedMotion) return;

    if (isOpen) {
      const itemsHeight = items.scrollHeight;
      gsap.to(content, {
        height: itemsHeight + 24,
        opacity: 1,
        duration: 0.6,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      const children = items.querySelectorAll<HTMLElement>("[data-service-item]");
      gsap.fromTo(
        children,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: ANIMATION_EASINGS.expoOut,
          delay: 0.15,
        },
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    }
  }, [isOpen, reducedMotion]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle],
  );

  return (
    <div
      ref={itemRef}
      data-service="item"
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`service-content-${String(index)}`}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(1rem, 2vw, 2rem)",
          padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "opacity 0.3s ease",
        }}
        className="focus-ring"
        onMouseEnter={(e) => {
          if (!reducedMotion) {
            gsap.to(e.currentTarget, { opacity: 0.8, duration: 0.2, ease: "power2.out" });
          }
        }}
        onMouseLeave={(e) => {
          if (!reducedMotion) {
            gsap.to(e.currentTarget, { opacity: 1, duration: 0.2, ease: "power2.out" });
          }
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.5rem, 3vw, 3rem)" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.6875rem, 0.8vw, 0.8125rem)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              color: isOpen ? "rgba(255, 255, 255, 0.7)" : "rgba(216, 216, 216, 0.45)",
              transition: "color 0.3s ease",
              minWidth: 32,
            }}
          >
            {service.number}
          </span>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.5rem, 3.5vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: isOpen ? "rgba(255, 255, 255, 0.95)" : "rgba(216, 216, 216, 0.4)",
              margin: 0,
              transition: "color 0.3s ease",
            }}
          >
            {service.title}
          </h3>
        </div>

        {/* Toggle icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.3s ease, transform 0.4s ease",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{
              color: isOpen ? "rgba(255, 255, 255, 0.7)" : "rgba(216, 216, 216, 0.45)",
              transition: "color 0.3s ease",
            }}
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        id={`service-content-${String(index)}`}
        role="region"
        aria-labelledby={`service-title-${String(index)}`}
        style={{
          height: 0,
          opacity: 0,
          overflow: "hidden",
        }}
      >
        <div
          ref={itemsRef}
          style={{
            paddingBottom: "clamp(1.5rem, 3vw, 2rem)",
            paddingLeft: "calc(clamp(0.6875rem, 0.8vw, 0.8125rem) + clamp(1.5rem, 3vw, 3rem))",
          }}
        >
          <p
            data-service-item
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(216, 216, 216, 0.4)",
              margin: "0 0 clamp(1.5rem, 3vw, 2rem) 0",
              maxWidth: 560,
            }}
          >
            {service.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {service.items.map((item) => (
              <span
                key={item}
                data-service-item
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "rgba(255, 255, 255, 0.5)",
                  padding: "6px 14px",
                  borderRadius: 100,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
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
  const listRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

          // Header — clip-path mask reveal
          if (headerRef.current) {
            const headerLines =
              headerRef.current.querySelectorAll<HTMLElement>("[data-header-line]");
            if (headerLines.length > 0) {
              headerLines.forEach((line, i) => {
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
            } else {
              tl.fromTo(
                headerRef.current,
                { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                {
                  clipPath: "inset(0 0% 0 0)",
                  duration: 0.9,
                },
              );
            }
          }

          // Accordion items — staggered clip-path reveal
          if (listRef.current) {
            const items = listRef.current.querySelectorAll<HTMLElement>("[data-service='item']");
            tl.fromTo(
              items,
              { clipPath: "inset(0 0 100% 0)", opacity: 1 },
              {
                clipPath: "inset(0 0 0% 0)",
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

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              Focused vision.
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
              Measured execution.
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <div ref={listRef}>
          {SERVICES.map((service, index) => (
            <AccordionItem
              key={service.number}
              service={service}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
