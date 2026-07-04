/**
 * Project Universe — Editorial project gallery.
 *
 * NOT a 3D scene. NOT a game menu.
 * A premium editorial layout where projects are presented
 * as large-format cards with cover images, revealed through
 * staggered GSAP entrance animations.
 *
 * Hover: subtle parallax on image, border accent appears.
 * Click: inline expansion showing project details + CTA.
 * Keyboard: Tab through projects, Enter to expand, Escape to close.
 *
 * No-JS: all content visible, no animations.
 * Reduced motion: instant reveals, no parallax.
 */

import { useRef, useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { ROUTES } from "@/constants/routes";
import { useAnalytics } from "@/hooks";
import { useReducedMotion } from "@/landing/hooks";
import { PROJECTS, WORLDS } from "@/content";
import { MultiverseNav } from "../multiverse-nav";
import { MultiverseBreadcrumbs } from "../multiverse-breadcrumbs";

// ============================================================================
// Project Card
// ============================================================================

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  role: string;
  stack: string[];
  coverImage: string;
  accentColor: string;
  index: number;
  isExpanded: boolean;
  onExpand: (index: number) => void;
  onCollapse: () => void;
}

const ProjectCard = memo(function ProjectCard({
  slug,
  title,
  category,
  year,
  description,
  role,
  stack,
  coverImage,
  accentColor,
  index,
  isExpanded,
  onExpand,
  onCollapse,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const rafRef = useRef(0);
  const rectCache = useRef<DOMRect | null>(null);
  const analytics = useAnalytics("ProjectCard");

  // Entrance animation
  useEffect(() => {
    if (!cardRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.1 + index * 0.12,
          ease: ANIMATION_EASINGS.expoOut,
        },
      );
    });
    return () => ctx.revert();
  }, [reducedMotion, index]);

  // Expand / collapse details
  useEffect(() => {
    if (!detailsRef.current) return;
    gsap.killTweensOf(detailsRef.current);
    if (isExpanded) {
      if (!reducedMotion) {
        gsap.fromTo(
          detailsRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: ANIMATION_EASINGS.expoOut },
        );
      } else {
        detailsRef.current.style.height = "auto";
        detailsRef.current.style.opacity = "1";
      }
    } else if (!reducedMotion) {
      gsap.to(detailsRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoIn,
      });
    }
  }, [isExpanded, reducedMotion]);

  // Hover parallax on image — rAF-throttled with cached rect
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    rectCache.current = e.currentTarget.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!imageRef.current || reducedMotion) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!imageRef.current || !rectCache.current) return;
        const rect = rectCache.current;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.set(imageRef.current, { x: x * 8, y: y * 8, scale: 1.04 });
      });
    },
    [reducedMotion],
  );

  const handleMouseLeave = useCallback(() => {
    if (!imageRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rectCache.current = null;
    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: ANIMATION_EASINGS.expoOut,
    });
  }, []);

  const handleClick = useCallback(() => {
    if (isExpanded) {
      onCollapse();
    } else {
      onExpand(index);
    }
  }, [isExpanded, onExpand, onCollapse, index]);

  const handleViewCaseStudy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      analytics.track("project_section_view", { projectId: slug, section: "case_study" });
      void navigate(ROUTES.PROJECT.replace(":projectId", slug));
    },
    [navigate, slug, analytics],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isExpanded) {
          onCollapse();
        } else {
          onExpand(index);
        }
      }
      if (e.key === "Escape" && isExpanded) {
        onCollapse();
      }
    },
    [isExpanded, onExpand, onCollapse],
  );

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={`${title} — ${category}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group"
      style={{
        position: "relative",
        cursor: "pointer",
        opacity: reducedMotion ? 1 : 0,
        outline: "none",
      }}
    >
      {/* Cover image */}
      <div
        ref={imageRef}
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(245, 240, 232, 0.03)",
          border: "1px solid rgba(245, 240, 232, 0.04)",
          transition: "border-color 0.4s ease",
        }}
      >
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
          }}
        />
        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(5,5,7,0.4) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Label row — always visible */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginTop: 16,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: accentColor,
              opacity: 0.7,
              flexShrink: 0,
            }}
          >
            {year}
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "rgba(245, 240, 232, 0.12)",
              flexShrink: 0,
            }}
          />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#f5f0e8",
              margin: 0,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </h3>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "rgba(245, 240, 232, 0.25)",
            flexShrink: 0,
          }}
        >
          {category}
        </span>
      </div>

      {/* Expanded details */}
      <div
        ref={detailsRef}
        style={{
          height: 0,
          opacity: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            paddingTop: 20,
            paddingBottom: 8,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
              lineHeight: 1.7,
              color: "rgba(245, 240, 232, 0.5)",
              margin: 0,
              maxWidth: 600,
            }}
          >
            {description}
          </p>

          {/* Role + Stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(245, 240, 232, 0.2)",
                }}
              >
                Role
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "rgba(245, 240, 232, 0.45)",
                  margin: "4px 0 0",
                }}
              >
                {role}
              </p>
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(245, 240, 232, 0.2)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Stack
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {stack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      color: "rgba(245, 240, 232, 0.4)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      border: "1px solid rgba(245, 240, 232, 0.06)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleViewCaseStudy}
            className="group/cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#f5f0e8",
              padding: "0.75rem 1.25rem",
              borderRadius: 999,
              border: "1px solid rgba(245, 240, 232, 0.1)",
              background: "rgba(245, 240, 232, 0.03)",
              cursor: "pointer",
              width: "fit-content",
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}
          >
            View Case Study
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
        style={{ background: `${accentColor}33` }}
        aria-hidden="true"
      />
    </div>
  );
});

// ============================================================================
// Page
// ============================================================================

export default function ProjectUniversePage() {
  const world = WORLDS.find((w) => w.id === "projects")!;
  const reducedMotion = useReducedMotion();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics("ProjectUniversePage");

  useEffect(() => {
    if (!headerRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      const els = headerRef.current!.querySelectorAll("[data-animate]");
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.05 + i * 0.08,
            ease: ANIMATION_EASINGS.expoOut,
          },
        );
      });
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  const handleExpand = useCallback(
    (index: number) => {
      const project = PROJECTS[index];
      if (project) {
        analytics.track("project_opened", {
          projectId: project.slug,
          referrer: document.referrer || "direct",
        });
      }
      setExpandedIndex(index);
    },
    [analytics],
  );

  const handleCollapse = useCallback(() => {
    setExpandedIndex(null);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#050507", minHeight: "100vh" }}
    >
      <MultiverseNav worldNumber="01" worldName="Projects" />

      {/* Content */}
      <div
        ref={headerRef}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(6rem, 12vh, 10rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vh, 5rem)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <span
            data-animate
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.5rem, 0.6vw, 0.6rem)",
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(201, 169, 110, 0.4)",
              display: "block",
              marginBottom: 16,
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            {world.sectionLabel}
          </span>
          <h1
            data-animate
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: "#f5f0e8",
              margin: "0 0 1rem 0",
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            {world.sectionTitle}
          </h1>
          <p
            data-animate
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 1vw, 1.05rem)",
              lineHeight: 1.7,
              color: "rgba(245, 240, 232, 0.38)",
              margin: 0,
              maxWidth: 480,
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            {world.sectionDescription}
          </p>
        </div>

        {/* Project list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(2rem, 4vw, 3rem)",
          }}
          role="feed"
          aria-label="Projects"
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              category={project.hero.category}
              year={project.hero.year}
              description={project.hero.description}
              role={project.hero.role}
              stack={project.hero.technologies as string[]}
              coverImage={project.images?.cover ?? project.images?.hero ?? ""}
              accentColor={project.accentColor}
              index={i}
              isExpanded={expandedIndex === i}
              onExpand={handleExpand}
              onCollapse={handleCollapse}
            />
          ))}
        </div>
      </div>

      <MultiverseBreadcrumbs currentWorldId="projects" />
    </section>
  );
}
