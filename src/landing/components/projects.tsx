/**
 * Featured Projects Showcase
 *
 * Premium case study previews — one per row, large 16:10 preview,
 * GSAP scroll reveal, hover orchestration, fully accessible.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { ROUTES } from "@/constants/routes";

// ============================================================================
// Data
// ============================================================================

interface Project {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  accentColor: string;
  accentRgb: string;
  preview: {
    gridLines: boolean;
    orbs: { x: string; y: string; size: number; opacity: number }[];
    window: { title: string; lines: number; buttons: number };
  };
}

const PROJECTS: readonly Project[] = [
  {
    id: 1,
    slug: "frontend-multiverse",
    category: "Portfolio",
    title: "Frontend Multiverse",
    description:
      "A portfolio site built to push what a browser can do — portal transitions between 3D worlds, scroll-driven animations, and a custom cursor system. The challenge was making heavy animation feel lightweight.",
    tags: ["React 19", "Three.js", "GSAP", "TypeScript", "Vite"],
    accentColor: "rgba(216, 216, 216, 0.8)",
    accentRgb: "216, 216, 216",
    preview: {
      gridLines: true,
      orbs: [
        { x: "65%", y: "30%", size: 200, opacity: 0.15 },
        { x: "25%", y: "65%", size: 160, opacity: 0.1 },
        { x: "80%", y: "70%", size: 120, opacity: 0.07 },
      ],
      window: { title: "portfolio.tsx", lines: 6, buttons: 3 },
    },
  },
  {
    id: 2,
    slug: "ai-architecture-studio",
    category: "SaaS Platform",
    title: "AI Architecture Studio",
    description:
      "A design system tool that helps teams generate and test UI components. Built the frontend architecture with Next.js, implemented real-time preview with Tailwind, and integrated a Python backend for ML-powered layout suggestions.",
    tags: ["Next.js", "Python", "TensorFlow", "Tailwind", "Framer Motion"],
    accentColor: "#a855f7",
    accentRgb: "168, 85, 247",
    preview: {
      gridLines: true,
      orbs: [
        { x: "30%", y: "35%", size: 180, opacity: 0.13 },
        { x: "70%", y: "60%", size: 140, opacity: 0.09 },
        { x: "55%", y: "20%", size: 100, opacity: 0.06 },
      ],
      window: { title: "studio.config.ts", lines: 5, buttons: 2 },
    },
  },
  {
    id: 3,
    slug: "window-corner",
    category: "Creative Tool",
    title: "Window Corner",
    description:
      "A desktop environment recreated in the browser — window management, drag-and-drop, live apps, and spatial audio. The technical challenge was building a performant canvas renderer that handles multiple animated windows without frame drops.",
    tags: ["TypeScript", "Canvas API", "Web Audio", "GSAP", "Zustand"],
    accentColor: "#06b6d4",
    accentRgb: "6, 182, 212",
    preview: {
      gridLines: true,
      orbs: [
        { x: "50%", y: "40%", size: 190, opacity: 0.14 },
        { x: "20%", y: "55%", size: 150, opacity: 0.1 },
        { x: "75%", y: "25%", size: 110, opacity: 0.07 },
      ],
      window: { title: "desktop.tsx", lines: 7, buttons: 3 },
    },
  },
] as const;

// ============================================================================
// Preview Area
// ============================================================================

function PreviewArea({
  project,
  imageRef,
}: {
  project: Project;
  imageRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={imageRef}
      data-projects="preview"
      role="img"
      aria-label={`${project.title} preview`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: 16,
        overflow: "hidden",
        background: `linear-gradient(135deg, rgba(${project.accentRgb}, 0.06) 0%, rgba(${project.accentRgb}, 0.02) 50%, rgba(0, 0, 0, 0.3) 100%)`,
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.04)`,
        willChange: "transform",
      }}
    >
      {/* Grid pattern */}
      {project.preview.gridLines && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      )}

      {/* Orbs */}
      {project.preview.orbs.map((orb, i) => (
        <div
          key={`orb-${String(i)}`}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${project.accentRgb}, ${String(orb.opacity)}) 0%, transparent 70%)`,
            filter: "blur(30px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Mock window */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          maxWidth: 480,
          borderRadius: 12,
          background: "rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(8px)",
          overflow: "hidden",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 14px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255, 95, 86, 0.6)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255, 189, 46, 0.6)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(39, 201, 63, 0.6)" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(255, 255, 255, 0.3)",
              marginLeft: 8,
            }}
          >
            {project.preview.window.title}
          </span>
        </div>
        {/* Window content */}
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ width: "70%", height: 6, borderRadius: 3, background: `rgba(${project.accentRgb}, 0.2)` }} />
          <div style={{ width: "50%", height: 4, borderRadius: 2, background: "rgba(255, 255, 255, 0.06)" }} />
          <div style={{ width: "85%", height: 4, borderRadius: 2, background: "rgba(255, 255, 255, 0.04)" }} />
          <div style={{ width: "40%", height: 4, borderRadius: 2, background: "rgba(255, 255, 255, 0.04)" }} />
          <div style={{ width: "65%", height: 4, borderRadius: 2, background: "rgba(255, 255, 255, 0.03)" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <div style={{ width: 60, height: 24, borderRadius: 6, background: `rgba(${project.accentRgb}, 0.15)` }} />
            <div style={{ width: 60, height: 24, borderRadius: 6, background: "rgba(255, 255, 255, 0.04)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Project Showcase Row
// ============================================================================

function ProjectShowcase({
  project,
  index,
  reducedMotion,
}: {
  project: Project;
  index: number;
  reducedMotion: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const isReversed = index % 2 === 1;

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const row = rowRef.current;
      if (!row) return;

      const rect = row.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.background = `radial-gradient(800px circle at ${String(x)}% ${String(y)}%, rgba(${project.accentRgb}, 0.06), transparent 50%)`;
        }
      });
    },
    [reducedMotion, project.accentRgb],
  );

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1.03,
        duration: 0.6,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      previewRef.current.style.borderColor = `rgba(${project.accentRgb}, 0.25)`;
    }
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: isReversed ? -4 : 4,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    }
    if (buttonsRef.current) {
      gsap.to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    }
    if (tagsRef.current) {
      const pills = tagsRef.current.querySelectorAll<HTMLElement>("[data-tag]");
      gsap.to(pills, {
        y: -2,
        duration: 0.3,
        ease: ANIMATION_EASINGS.expoOut,
        stagger: 0.03,
        overwrite: "auto",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 1, duration: 0.4, ease: ANIMATION_EASINGS.expoOut });
    }
  }, [reducedMotion, project.accentRgb, isReversed]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
      previewRef.current.style.borderColor = "rgba(255, 255, 255, 0.06)";
    }
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: 0,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    }
    if (buttonsRef.current) {
      gsap.to(buttonsRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.3,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    }
    if (tagsRef.current) {
      const pills = tagsRef.current.querySelectorAll<HTMLElement>("[data-tag]");
      gsap.to(pills, {
        y: 0,
        duration: 0.3,
        ease: ANIMATION_EASINGS.expoOut,
        stagger: 0.02,
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4, ease: ANIMATION_EASINGS.expoOut });
    }
  }, [reducedMotion]);

  return (
    <article
      ref={rowRef}
      data-projects="showcase"
      aria-label={`${project.title} — ${project.category}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(2rem, 5vw, 4rem)",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Preview column */}
      <div
        data-projects="preview-wrapper"
        style={{
          order: isReversed ? 2 : 1,
          maxWidth: 640,
        }}
      >
        <PreviewArea project={project} imageRef={previewRef} />
      </div>

      {/* Info column */}
      <div
        data-projects="info"
        style={{
          order: isReversed ? 1 : 2,
          maxWidth: 480,
        }}
      >
        {/* Category */}
        <span
          data-projects="category"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
            fontWeight: 400,
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            color: `rgba(${project.accentRgb}, 0.7)`,
            display: "inline-block",
            padding: "0.4em 0.9em",
            border: `1px solid rgba(${project.accentRgb}, 0.15)`,
            borderRadius: 100,
            marginBottom: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {project.category}
        </span>

        {/* Title */}
        <h3
          ref={titleRef}
          data-projects="title"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#f0f0f5",
            margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
            willChange: "transform",
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          ref={descRef}
          data-projects="desc"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(226, 232, 240, 0.5)",
            margin: "0 0 clamp(1.5rem, 3vw, 2rem) 0",
          }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div
          ref={tagsRef}
          data-projects="tags"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: "clamp(1.5rem, 3vw, 2rem)",
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              data-tag
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: `rgba(${project.accentRgb}, 0.85)`,
                padding: "5px 12px",
                borderRadius: 100,
                background: `rgba(${project.accentRgb}, 0.08)`,
                border: `1px solid rgba(${project.accentRgb}, 0.12)`,
                willChange: "transform",
                transition: "border-color 0.2s ease",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          data-projects="buttons"
          style={{
            display: "flex",
            gap: 12,
            opacity: 0,
            transform: "translateY(8px)",
            willChange: "transform, opacity",
          }}
        >
          <a
            href={`${ROUTES.PROJECT.replace(":projectId", project.slug)}`}
            aria-label={`${project.title} — view case study`}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 10,
              background: `rgba(${project.accentRgb}, 0.2)`,
              border: `1px solid rgba(${project.accentRgb}, 0.35)`,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              transition: "background 0.2s ease, outline 0.2s ease",
              cursor: "pointer",
              outline: "2px solid transparent",
              outlineOffset: 2,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${project.accentColor}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "2px solid transparent";
            }}
          >
            View Case Study
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#projects"
            aria-label={`${project.title} — live demo`}
            aria-disabled="true"
            tabIndex={-1}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "rgba(226, 232, 240, 0.5)",
              padding: "10px 20px",
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              transition: "background 0.2s ease, color 0.2s ease, outline 0.2s ease",
              cursor: "pointer",
              outline: "2px solid transparent",
              outlineOffset: 2,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid rgba(255, 255, 255, 0.3)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "2px solid transparent";
            }}
          >
            Live Demo
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hover glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          opacity: 0,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
    </article>
  );
}

// ============================================================================
// Projects Section
// ============================================================================

export function Projects() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
          if (listRef.current) listRef.current.style.opacity = "1";
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

          // Showcase rows
          if (listRef.current) {
            tl.to(listRef.current, { opacity: 1, duration: 0.01 }, "<");
            const rows = listRef.current.querySelectorAll<HTMLElement>("[data-projects='showcase']");
            rows.forEach((row, i) => {
              const preview = row.querySelector<HTMLElement>("[data-projects='preview']");
              const title = row.querySelector<HTMLElement>("[data-projects='title']");
              const desc = row.querySelector<HTMLElement>("[data-projects='desc']");
              const tags = row.querySelector<HTMLElement>("[data-projects='tags']");
              const buttons = row.querySelector<HTMLElement>("[data-projects='buttons']");

              const offset = i === 0 ? "-=0.2" : "-=0.5";

              if (preview) {
                tl.fromTo(
                  preview,
                  { y: 40, opacity: 0, scale: 0.98 },
                  { y: 0, opacity: 1, scale: 1, duration: 0.6 },
                  offset,
                );
              }
              if (title) {
                tl.fromTo(title, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.4");
              }
              if (desc) {
                tl.fromTo(desc, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
              }
              if (tags) {
                tl.fromTo(tags, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
              }
              if (buttons) {
                tl.fromTo(buttons, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
              }
            });
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
      id="projects"
      aria-labelledby="projects-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "linear-gradient(180deg, #000000 0%, #050510 50%, #0a0a1a 100%)",
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
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)",
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
            Featured Work
          </span>
          <h2
            id="projects-heading"
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
            Selected
            <br />
            <span className="projects-gradient-text">
              Projects
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
          A selection of projects I&apos; built — each one solving a specific
          problem with clean code and careful attention to detail.
        </p>

        {/* Showcase rows */}
        <div
          ref={listRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(4rem, 8vh, 7rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
