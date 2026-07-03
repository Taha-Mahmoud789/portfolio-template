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
}

const PROJECTS: readonly Project[] = [
  {
    id: 1,
    slug: "frontend-multiverse",
    number: "01",
    title: "Frontend Multiverse",
    description:
      "A creative developer portfolio built with React 19, Three.js, and GSAP. Cinematic scroll experiences, spatial computing worlds, and a premium dark editorial design.",
    year: "2025",
    category: "Portfolio",
    technologies: ["React 19", "Three.js", "GSAP", "TypeScript", "Vite"],
    accentRgb: "216, 216, 216",
  },
  {
    id: 2,
    slug: "ai-architecture-studio",
    number: "02",
    title: "AI Architecture Studio",
    description:
      "An intelligent SaaS platform for architectural visualization. AI-powered design suggestions, real-time rendering, and collaborative workspace for modern studios.",
    year: "2024",
    category: "SaaS Platform",
    technologies: ["Next.js", "Python", "TensorFlow", "Tailwind", "Framer Motion"],
    accentRgb: "168, 85, 247",
  },
  {
    id: 3,
    slug: "window-corner",
    number: "03",
    title: "Window Corner",
    description:
      "A creative desktop customization tool. Canvas-based rendering, Web Audio integration, and real-time physics simulations for an immersive user experience.",
    year: "2024",
    category: "Creative Tool",
    technologies: ["TypeScript", "Canvas API", "Web Audio", "GSAP", "Zustand"],
    accentRgb: "6, 182, 212",
  },
] as const;

// ============================================================================
// Preview Area — Full-bleed editorial imagery
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
        aspectRatio: "16 / 9",
        overflow: "hidden",
        background: `linear-gradient(180deg, rgba(${project.accentRgb}, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)`,
        willChange: "clip-path, transform",
        cursor: "pointer",
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
        {/* Large ambient glow — the "image" */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${project.accentRgb}, 0.15) 0%, rgba(${project.accentRgb}, 0.04) 40%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        {/* Secondary orb */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "30%",
            right: "15%",
            width: "35%",
            height: "50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${project.accentRgb}, 0.08) 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
        />

        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.015,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Large number watermark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-5%",
            right: "-2%",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(10rem, 25vw, 20rem)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.8,
            color: `rgba(${project.accentRgb}, 0.03)`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {project.number}
        </div>
      </div>

      {/* Hover overlay — subtle vignette */}
      <div
        aria-hidden="true"
        className="project-preview-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%)`,
          opacity: 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
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
          { clipPath: "inset(15% 0% 15% 0)", opacity: 0, scale: 0.92 },
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
        // Magnetic pull on preview inner — stronger factor for living feel
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

        // Magnetic pull on title — more responsive
        if (titleRef.current) {
          const titleOffsetX = (x - 50) * 0.012;
          gsap.to(titleRef.current, {
            x: titleOffsetX,
            duration: 0.8,
            ease: "expo.out",
            overwrite: "auto",
          });
        }

        // Glow follows cursor — larger radius, more visible
        if (glowRef.current) {
          glowRef.current.style.background = `radial-gradient(1600px circle at ${String(x)}% ${String(y)}%, rgba(${project.accentRgb}, 0.08), transparent 50%)`;
        }
      });
    },
    [reducedMotion, project.accentRgb],
  );

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;

    if (sectionRef.current) {
      // Lift the entire card — depth illusion
      gsap.to(sectionRef.current, {
        y: -4,
        duration: 0.8,
        ease: "expo.out",
        overwrite: "auto",
      });
    }

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: 1.04,
        y: -6,
        duration: 1.2,
        ease: "expo.out",
        overwrite: "auto",
      });
      const overlay = previewRef.current.querySelector<HTMLElement>(".project-preview-overlay");
      if (overlay) {
        gsap.to(overlay, { opacity: 1, duration: 0.6 });
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
      // No animation: direct navigation
      void navigate(target);
      return;
    }

    // Lock body scroll during transition
    document.body.style.overflow = "hidden";

    // Dim the source card — creates depth during clone expansion
    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        opacity: 0.3,
        scale: 0.98,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Capture preview bounding rect for shared-element transition
    const rect = previewRef.current.getBoundingClientRect();
    startTransition({
      fromRect: rect,
      projectId: project.slug,
      accentRgb: project.accentRgb,
      projectNumber: project.number,
    });

    // Navigate immediately — overlay handles the visual transition
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
        gap: "clamp(1.5rem, 3vw, 2.5rem)",
        cursor: "pointer",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid rgba(255, 255, 255, 0.15)";
        e.currentTarget.style.outlineOffset = "-4px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {/* Top divider — full width, no margin */}
      {index > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 20%, rgba(255, 255, 255, 0.06) 80%, transparent 100%)",
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

      {/* Content wrapper — full width */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        {/* Meta row — Category · Year · Number */}
        <div
          ref={metaRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(1.5rem, 3vw, 3rem)",
            flexWrap: "wrap",
          }}
        >
          <span
            data-project-meta
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.6875rem, 0.75vw, 0.75rem)",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "rgba(216, 216, 216, 0.45)",
            }}
          >
            {project.category}
          </span>
          <span
            data-project-meta
            aria-hidden="true"
            style={{
              width: 24,
              height: 1,
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <span
            data-project-meta
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.6875rem, 0.75vw, 0.75rem)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              color: "rgba(216, 216, 216, 0.35)",
            }}
          >
            {project.year}
          </span>
          <span
            data-project-meta
            aria-hidden="true"
            style={{
              width: 24,
              height: 1,
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <span
            data-project-meta
            ref={numberRef}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(0.8125rem, 1vw, 1rem)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "rgba(255, 255, 255, 0.6)",
              willChange: "transform",
            }}
          >
            {project.number}
          </span>
        </div>

        {/* Title — oversized editorial */}
        <h3
          ref={titleRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: "rgba(255, 255, 255, 0.95)",
            margin: 0,
            willChange: "clip-path, transform",
          }}
        >
          {project.title}
        </h3>

        {/* Description — editorial subtitle */}
        <p
          ref={descRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "rgba(216, 216, 216, 0.4)",
            margin: 0,
            maxWidth: 520,
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Preview — full width, edge-to-edge */}
      <PreviewArea project={project} previewRef={previewRef} innerRef={previewInnerRef} />

      {/* Bottom row — Tech flowing text */}
      <div
        ref={techRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px",
          maxWidth: 600,
        }}
      >
        {project.technologies.map((tech, i) => (
          <span
            key={tech}
            data-tech-tag
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6875rem",
              fontWeight: 400,
              letterSpacing: "0.02em",
              color: i === 0 ? `rgba(${project.accentRgb}, 0.7)` : "rgba(216, 216, 216, 0.3)",
            }}
          >
            {tech}
            {i < project.technologies.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  margin: "0 8px",
                  color: "rgba(255, 255, 255, 0.08)",
                }}
              >
                /
              </span>
            )}
          </span>
        ))}
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
        background: "#040508",
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
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              margin: "0 0 clamp(1.5rem, 3vw, 2.5rem) 0",
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
              Selected
            </span>
            <span
              data-header-line
              style={{
                display: "block",
                willChange: "clip-path",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(216,216,216,0.6) 100%)",
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
              fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(216, 216, 216, 0.4)",
              margin: 0,
              maxWidth: 480,
              willChange: "clip-path",
            }}
          >
            Digital products crafted with code, motion and interaction.
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
