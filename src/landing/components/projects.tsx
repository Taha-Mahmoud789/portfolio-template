/**
 * Featured Projects — Premium editorial showcase
 *
 * TRIONN/Cuberto/Locomotive-inspired full-viewport project sections.
 * Each project: 100vh, oversized editorial typography,
 * GSAP ScrollTrigger scrub-based reveal sequences,
 * magnetic hover interactions, full-bleed imagery.
 *
 * No-JS: all content visible by default.
 * Animations are enhancement only.
 */

import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks";
import { ROUTES } from "@/constants/routes";
import { useTransitionStore } from "./project-transition-store";
import { ImageComponent } from "@/components/image-component";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// Data
// ============================================================================

interface Project {
  id: number;
  slug: string;
  number: string;
  title: string;
  description: string;
  year: string;
  category: string;
  technologies: readonly string[];
  accentRgb: string;
  coverImage: string;
  heroImage: string;
  galleryImages: readonly string[];
  logo: string;
  liveUrl: string;
}

const PROJECTS: readonly Project[] = [
  {
    id: 1,
    slug: "over-benefits",
    number: "01",
    title: "Over Benefits",
    description:
      "A modern digital platform designed to simplify employee benefits, business solutions and consumer experiences through a clean responsive interface.",
    year: "2026",
    category: "Digital Benefits Platform",
    technologies: ["React", "TypeScript", "Tailwind CSS", "REST API"],
    accentRgb: "59, 130, 246",
    coverImage: "/projects/over-benefits/cover.webp",
    heroImage: "/projects/over-benefits/cover.webp",
    galleryImages: [
      "/projects/over-benefits/gallery-01.webp",
      "/projects/over-benefits/gallery-02.webp",
      "/projects/over-benefits/gallery-03.webp",
    ],
    logo: "/projects/over-benefits/logo.webp",
    liveUrl: "overbenefits.net",
  },
  {
    id: 2,
    slug: "window-corner",
    number: "02",
    title: "Window Corner",
    description:
      "A premium web experience for an architectural aluminum and glass solutions company. Presenting products, projects and brand identity through a modern interface.",
    year: "2026",
    category: "Corporate Website",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    accentRgb: "20, 184, 166",
    coverImage: "/projects/window-corner/cover.webp",
    heroImage: "/projects/window-corner/cover.webp",
    galleryImages: [
      "/projects/window-corner/gallery-01.webp",
      "/projects/window-corner/gallery-02.webp",
      "/projects/window-corner/gallery-03.webp",
    ],
    logo: "/projects/window-corner/logo.webp",
    liveUrl: "window-corner.com",
  },
  {
    id: 3,
    slug: "mts-med",
    number: "03",
    title: "MTS MED",
    description:
      "A healthcare product platform focused on presenting medical solutions with clear navigation and accessible product information.",
    year: "2026",
    category: "Healthcare Platform",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    accentRgb: "239, 68, 68",
    coverImage: "/projects/mts-med/cover.png",
    heroImage: "/projects/mts-med/hero.webp",
    galleryImages: [
      "/projects/mts-med/gallery-01.jpeg",
      "/projects/mts-med/gallery-02.jpeg",
      "/projects/mts-med/gallery-03.jpeg",
    ],
    logo: "/projects/mts-med/logo.png",
    liveUrl: "mtsmed-eg.com",
  },
] as const;

// ============================================================================
// Preview Area — Premium full-bleed visual
// ============================================================================

function PreviewArea({
  project,
  previewRef,
  innerRef,
}: {
  project: Project;
  previewRef: React.RefObject<HTMLDivElement | null>;
  innerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={previewRef}
      data-projects="preview"
      role="img"
      aria-label={`${project.title} preview`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: "24px",
        border: "1px solid rgba(245, 240, 232, 0.06)",
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: "-10%",
          willChange: "transform",
        }}
      >
        {/* Full background — screenshot fills entire area */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          <ImageComponent
            src={project.heroImage}
            alt={`${project.title} — ${project.category}`}
            width={1920}
            height={1080}
            accentRgb={project.accentRgb}
            style={{
              borderRadius: "24px",
            }}
          />
        </div>

        {/* Top gradient */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
            borderRadius: "24px 24px 0 0",
            pointerEvents: "none",
          }}
        />

        {/* Bottom gradient */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
            borderRadius: "0 0 24px 24px",
            pointerEvents: "none",
          }}
        />

        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
            borderRadius: "24px",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Top bar — Title + Year */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "24px 28px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "rgba(245, 240, 232, 0.98)",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
            }}
          >
            {project.title}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              fontWeight: 500,
              color: `rgba(${project.accentRgb}, 0.95)`,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Year badge */}
        <div
          style={{
            padding: "8px 16px",
            borderRadius: "24px",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(245, 240, 232, 0.1)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(245, 240, 232, 0.8)",
              letterSpacing: "0.08em",
            }}
          >
            {project.year}
          </span>
        </div>
      </div>

      {/* Center — View Project */}
      <div
        className="project-view-btn"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          opacity: 0,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 32px",
            borderRadius: "60px",
            background: "rgba(245, 240, 232, 0.95)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(245, 240, 232, 0.2)",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#080706",
              letterSpacing: "0.02em",
            }}
          >
            View Project
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#080706"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>

      {/* Bottom bar — Tech tags + Number */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 28px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Tech tags */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(245, 240, 232, 0.8)",
                letterSpacing: "0.03em",
                padding: "7px 14px",
                borderRadius: "20px",
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(245, 240, 232, 0.1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project number */}
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "56px",
            fontWeight: 700,
            color: `rgba(${project.accentRgb}, 0.2)`,
            letterSpacing: "-0.04em",
            lineHeight: 0.8,
            textShadow: `0 0 40px rgba(${project.accentRgb}, 0.1)`,
          }}
        >
          {project.number}
        </span>
      </div>

      {/* Hover overlay */}
      <div
        aria-hidden="true"
        className="project-preview-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.25) 100%)`,
          opacity: 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
          borderRadius: "24px",
        }}
      />
    </div>
  );
}

// ============================================================================
// Project Section — Full editorial block
// ============================================================================

function ProjectSection({
  project,
  index,
  reducedMotion,
}: {
  project: Project;
  index: number;
  reducedMotion: boolean;
}) {
  const navigate = useNavigate();
  const startTransition = useTransitionStore((s) => s.startTransition);
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewInnerRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Scroll-triggered reveal via ScrollTrigger scrub ──────────────────
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const section = sectionRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    const desc = descRef.current;
    const meta = metaRef.current;
    const preview = previewRef.current;
    const tech = techRef.current;

    let ctx: gsap.Context | null = null;

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "center center",
          scrub: 0.8,
        },
      });

      // 1. Number — fade + rise
      if (number) {
        tl.fromTo(
          number,
          { y: 80, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1 },
          0,
        );
      }

      // 2. Title — clip-path wipe reveal
      if (title) {
        tl.fromTo(
          title,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1.5 },
          0.1,
        );
      }

      // 3. Description — rise + fade
      if (desc) {
        tl.fromTo(desc, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.3);
      }

      // 4. Meta — staggered rise
      if (meta) {
        const items = meta.querySelectorAll<HTMLElement>("[data-project-meta]");
        if (items.length > 0) {
          tl.fromTo(
            items,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
            0.35,
          );
        }
      }

      // 5. Preview — dramatic clip-path reveal + scale
      if (preview) {
        tl.fromTo(
          preview,
          { clipPath: "inset(12% 0% 12% 0)", opacity: 0, scale: 0.94 },
          {
            clipPath: "inset(0% 0% 0% 0)",
            opacity: 1,
            scale: 1,
            duration: 2,
          },
          0.15,
        );
      }

      // 6. Tech — staggered rise
      if (tech) {
        const tags = tech.querySelectorAll<HTMLElement>("[data-tech-tag]");
        if (tags.length > 0) {
          tl.fromTo(
            tags,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
            0.6,
          );
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  // ── Scroll parallax on preview (continuous scrub) ────────────────────
  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !previewInnerRef.current) return;

    const section = sectionRef.current;
    const inner = previewInnerRef.current;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(inner, {
          y: (progress - 0.5) * -60,
          scale: 1 + Math.abs(progress - 0.5) * 0.04,
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [reducedMotion]);

  // ── Hover: magnetic pull + preview zoom + lift ───────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        // Magnetic pull on preview inner
        if (previewInnerRef.current) {
          const offsetX = (x - 50) * 0.08;
          const offsetY = (y - 50) * 0.08;
          gsap.to(previewInnerRef.current, {
            x: offsetX,
            y: offsetY,
            duration: 1.2,
            ease: "expo.out",
            overwrite: "auto",
          });
        }

        // Subtle perspective tilt on the entire section
        if (sectionRef.current) {
          const rotateY = ((x - 50) / 50) * 0.4;
          const rotateX = ((y - 50) / 50) * -0.3;
          gsap.to(sectionRef.current, {
            rotateX,
            rotateY,
            duration: 1,
            ease: "expo.out",
            overwrite: "auto",
            transformPerspective: 1200,
            transformOrigin: "center center",
          });
        }

        // Magnetic pull on title
        if (titleRef.current) {
          const titleOffsetX = (x - 50) * 0.012;
          gsap.to(titleRef.current, {
            x: titleOffsetX,
            duration: 0.8,
            ease: "expo.out",
            overwrite: "auto",
          });
        }

        // Glow follows cursor
        if (glowRef.current) {
          glowRef.current.style.background = `radial-gradient(1600px circle at ${String(x)}% ${String(y)}%, rgba(${project.accentRgb}, 0.06), transparent 50%)`;
        }
      });
    },
    [reducedMotion, project.accentRgb],
  );

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;

    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        y: -4,
        duration: 0.8,
        ease: "expo.out",
        overwrite: "auto",
      });
    }

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1.03,
        y: -8,
        duration: 1.2,
        ease: "expo.out",
        overwrite: "auto",
      });
      const overlay = previewRef.current.querySelector<HTMLElement>(".project-preview-overlay");
      if (overlay) {
        gsap.to(overlay, { opacity: 1, duration: 0.6 });
      }
      const viewBtn = previewRef.current.querySelector<HTMLElement>(".project-view-btn");
      if (viewBtn) {
        gsap.to(viewBtn, { opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
      }
    }
    if (numberRef.current) {
      gsap.to(numberRef.current, {
        y: -8,
        scale: 1.03,
        duration: 0.8,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 1, duration: 0.8 });
    }
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;

    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "expo.out",
        overwrite: "auto",
      });
    }

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        overwrite: "auto",
      });
      const overlay = previewRef.current.querySelector<HTMLElement>(".project-preview-overlay");
      if (overlay) {
        gsap.to(overlay, { opacity: 0, duration: 0.5 });
      }
      const viewBtn = previewRef.current.querySelector<HTMLElement>(".project-view-btn");
      if (viewBtn) {
        gsap.to(viewBtn, { opacity: 0, duration: 0.3, ease: "power2.in" });
      }
    }
    if (previewInnerRef.current) {
      gsap.to(previewInnerRef.current, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: 0,
        duration: 0.8,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
    if (numberRef.current) {
      gsap.to(numberRef.current, {
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.7 });
    }
  }, [reducedMotion]);

  // ── Click — entire project is the CTA ───────────────────────────────
  const handleClick = useCallback(() => {
    const target = ROUTES.PROJECT.replace(":projectId", project.slug);

    if (reducedMotion || !previewRef.current) {
      void navigate(target);
      return;
    }

    document.body.style.overflow = "hidden";

    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        opacity: 0.3,
        scale: 0.98,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    const rect = previewRef.current.getBoundingClientRect();
    startTransition({
      fromRect: rect,
      projectId: project.slug,
      accentRgb: project.accentRgb,
      projectNumber: project.number,
    });

    void navigate(target);
  }, [reducedMotion, project.slug, project.accentRgb, project.number, navigate, startTransition]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const isReversed = index % 2 === 1;

  return (
    <article
      ref={sectionRef}
      data-projects="row"
      data-cursor="project"
      aria-label={`${project.title} — ${project.category}`}
      role="article"
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(6rem, 15vh, 12rem) clamp(2rem, 6vw, 8rem)",
        cursor: "pointer",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid rgba(245, 240, 232, 0.15)";
        e.currentTarget.style.outlineOffset = "-4px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {/* Top divider */}
      {index > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "clamp(2rem, 6vw, 8rem)",
            right: "clamp(2rem, 6vw, 8rem)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(245, 240, 232, 0.06) 50%, transparent 100%)",
          }}
        />
      )}

      {/* Ambient glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />

      {/* Main layout — alternating grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isReversed ? "1fr 1.2fr" : "1.2fr 1fr",
          gap: "clamp(2rem, 4vw, 4rem)",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.5rem, 2.5vw, 2rem)",
            order: isReversed ? 2 : 1,
          }}
        >
          {/* Meta row */}
          <div
            ref={metaRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              data-project-meta
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: `rgba(${project.accentRgb}, 0.7)`,
              }}
            >
              {project.category}
            </span>
            <span
              data-project-meta
              aria-hidden="true"
              style={{
                width: 20,
                height: 1,
                background: "rgba(245, 240, 232, 0.12)",
              }}
            />
            <span
              data-project-meta
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.1em",
                color: "rgba(214, 204, 190, 0.35)",
              }}
            >
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            ref={titleRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "rgba(245, 240, 232, 0.95)",
              margin: 0,
              willChange: "clip-path, transform",
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            ref={descRef}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
              fontWeight: 400,
              lineHeight: 1.75,
              color: "rgba(214, 204, 190, 0.45)",
              margin: 0,
              maxWidth: 480,
            }}
          >
            {project.description}
          </p>

          {/* Tech tags */}
          <div
            ref={techRef}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px",
              marginTop: "0.5rem",
            }}
          >
            {project.technologies.map((tech, i) => (
              <span
                key={tech}
                data-tech-tag
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  color: i === 0 ? `rgba(${project.accentRgb}, 0.7)` : "rgba(214, 204, 190, 0.35)",
                  padding: "5px 12px",
                  borderRadius: "16px",
                  border: "1px solid rgba(245, 240, 232, 0.06)",
                  background:
                    i === 0 ? `rgba(${project.accentRgb}, 0.08)` : "rgba(245, 240, 232, 0.03)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project number */}
          <div
            ref={numberRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(5rem, 10vw, 10rem)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.8,
              color: `rgba(${project.accentRgb}, 0.08)`,
              marginTop: "0.5rem",
              willChange: "transform",
              userSelect: "none",
            }}
          >
            {project.number}
          </div>
        </div>

        {/* Preview column */}
        <div style={{ order: isReversed ? 1 : 2 }}>
          <PreviewArea project={project} previewRef={previewRef} innerRef={previewInnerRef} />
        </div>
      </div>
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;

    ctx = gsap.context(() => {
      if (!reducedMotion && headerRef.current) {
        const lines = headerRef.current.querySelectorAll<HTMLElement>("[data-header-line]");
        if (lines.length > 0) {
          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
          lines.forEach((line, i) => {
            tl.fromTo(
              line,
              { clipPath: "inset(0 100% 0 0)", opacity: 1 },
              { clipPath: "inset(0 0% 0 0)", duration: 1 },
              i * 0.15,
            );
          });
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      style={{
        position: "relative",
        background: "#080706",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "clamp(6rem, 15vh, 12rem) clamp(2rem, 6vw, 8rem) clamp(3rem, 6vh, 5rem)",
        }}
      >
        <div ref={headerRef} style={{ willChange: "clip-path" }}>
          <h2
            id="projects-heading"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              margin: "0 0 clamp(1.5rem, 3vw, 2.5rem) 0",
            }}
          >
            <span
              data-header-line
              style={{
                color: "rgba(245, 240, 232, 0.95)",
                display: "block",
                willChange: "clip-path",
              }}
            >
              Selected
            </span>
            <span
              data-header-line
              style={{
                display: "block",
                willChange: "clip-path",
                background:
                  "linear-gradient(135deg, rgba(245,240,232,1) 0%, rgba(201,169,110,0.6) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Experiences
            </span>
          </h2>

          <p
            data-header-line
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(214, 204, 190, 0.4)",
              margin: 0,
              maxWidth: 440,
              willChange: "clip-path",
            }}
          >
            Projects that solved real problems. Built with modern tools, designed for performance.
          </p>
        </div>
      </div>

      {/* Project sections */}
      <div>
        {PROJECTS.map((project, i) => (
          <ProjectSection
            key={project.id}
            project={project}
            index={i}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
