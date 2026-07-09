/**
 * Featured Projects — Glass card grid with asymmetric layout
 *
 * Asymmetric masonry grid of glassmorphism project cards.
 * Each card: glass effect, hover reveal, category filter pills.
 * Magnetic hover, GSAP animations.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ROUTES } from "@/constants/routes";
import { useTransitionStore } from "./project-transition-store";
import { ImageComponent } from "@/components/image-component";
import { PROJECTS, type ProjectData } from "@/content";

// ============================================================================
// Glass Project Card
// ============================================================================

function GlassCard({
  project,
  index,
  reducedMotion,
}: {
  project: ProjectData;
  index: number;
  reducedMotion: boolean;
}) {
  const navigate = useNavigate();
  const startTransition = useTransitionStore((s) => s.startTransition);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || reducedMotion) return;
    hasAnimated.current = true;

    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            delay: index * 0.1,
            ease: "expo.out",
          },
        );
      },
      { threshold: 0.1 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [reducedMotion, index]);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion || !cardRef.current) return;

    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.02,
      duration: 0.5,
      ease: "expo.out",
      overwrite: "auto",
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: -12,
        scale: 1.05,
        duration: 0.6,
        ease: "expo.out",
        overwrite: "auto",
      });
    }

    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: -4,
        duration: 0.4,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion || !cardRef.current) return;

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "expo.out",
      overwrite: "auto",
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "expo.out",
        overwrite: "auto",
      });
    }

    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: 0,
        duration: 0.5,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  }, [reducedMotion]);

  const handleClick = useCallback(() => {
    const target = ROUTES.PROJECT.replace(":projectId", project.slug);

    if (reducedMotion || !cardRef.current) {
      void navigate(target);
      return;
    }

    document.body.style.overflow = "hidden";

    gsap.to(cardRef.current, {
      opacity: 0.3,
      scale: 0.98,
      duration: 0.4,
      ease: "power2.inOut",
    });

    const rect = cardRef.current.getBoundingClientRect();
    startTransition({
      fromRect: rect,
      projectId: project.slug,
      accentRgb: project.accentRgb,
      projectNumber: String(project.number).padStart(2, "0"),
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

  // Asymmetric sizing: alternate between large and medium cards
  const isLarge = index % 3 === 0;

  return (
    <div
      ref={cardRef}
      role="article"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        opacity: reducedMotion ? 1 : 0,
        gridRow: isLarge ? "span 2" : "span 1",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
        e.currentTarget.style.boxShadow = "0 24px 80px rgba(59, 130, 246, 0.08)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image area */}
      <div
        ref={imageRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: isLarge ? "16 / 12" : "16 / 10",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        <ImageComponent
          src={project.images.hero}
          alt={`${project.title} — ${project.category}`}
          width={1920}
          height={1080}
          accentRgb={project.accentRgb}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 40%, rgba(11, 15, 26, 0.8) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Year badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              color: "rgba(241, 245, 249, 0.7)",
              letterSpacing: "0.08em",
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Number overlay */}
        <span
          style={{
            position: "absolute",
            bottom: 16,
            right: 20,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 5vw, 4.5rem)",
            fontWeight: 700,
            color: `rgba(${project.accentRgb}, 0.15)`,
            lineHeight: 0.8,
            userSelect: "none",
          }}
        >
          {project.number}
        </span>
      </div>

      {/* Info area */}
      <div
        ref={infoRef}
        style={{
          padding: "clamp(1.25rem, 2vw, 1.75rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 1.5vw, 1rem)",
          willChange: "transform",
        }}
      >
        {/* Category */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: `rgba(${project.accentRgb}, 0.7)`,
          }}
        >
          {project.category}
        </span>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isLarge ? "clamp(1.5rem, 2.5vw, 2rem)" : "clamp(1.25rem, 2vw, 1.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "rgba(241, 245, 249, 0.95)",
            margin: 0,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8125rem, 0.95vw, 0.9375rem)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "rgba(148, 163, 184, 0.45)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: isLarge ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "0.25rem",
          }}
        >
          {project.hero.technologies.slice(0, isLarge ? 4 : 3).map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 400,
                letterSpacing: "0.02em",
                color: "rgba(148, 163, 184, 0.4)",
                padding: "4px 10px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Projects Section
// ============================================================================

export function Projects() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];

  // Filter projects
  const filteredProjects =
    activeFilter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

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
        background: "#0B0F1A",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
      }}
    >
      {/* Section header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          marginBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        <div ref={headerRef} style={{ willChange: "clip-path" }}>
          <h2
            id="projects-heading"
            style={{
              fontFamily: "var(--font-display)",
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
                color: "rgba(241, 245, 249, 0.95)",
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
                  "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(59,130,246,0.6) 50%, rgba(6,182,212,0.4) 100%)",
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
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(148, 163, 184, 0.4)",
              margin: 0,
              maxWidth: 440,
              willChange: "clip-path",
            }}
          >
            Projects that solved real problems. Built with modern tools, designed for performance.
          </p>
        </div>

        {/* Category filter pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "clamp(2rem, 3vw, 3rem)",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 18px",
                borderRadius: 20,
                border: "1px solid",
                borderColor:
                  activeFilter === cat ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.06)",
                background:
                  activeFilter === cat ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.02)",
                color:
                  activeFilter === cat ? "rgba(59, 130, 246, 0.9)" : "rgba(148, 163, 184, 0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "rgba(148, 163, 184, 0.6)";
                }
              }}
              onMouseOut={(e) => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.color = "rgba(148, 163, 184, 0.4)";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid — asymmetric masonry */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
          gap: "clamp(1.25rem, 2.5vw, 2rem)",
          gridAutoFlow: "dense",
        }}
      >
        {filteredProjects.map((project, i) => (
          <GlassCard key={project.id} project={project} index={i} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
