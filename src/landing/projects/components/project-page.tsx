/**
 * Project Case Study Page — Premium TRIONN-inspired Experience
 *
 * Each section tells a story. Not a description.
 * Large typography, editorial spacing, scroll-driven reveals.
 *
 * Sections:
 *   1. Hero Story — huge title, meta, cinematic preview
 *   2. Project Overview — editorial: challenge / idea / solution
 *   3. Project Meta — minimal: role / timeline / stack / responsibilities
 *   4. Visual Showcase — large screenshots, device frames
 *   5. Development Process — numbered: architecture / interface / motion / optimization
 *   6. Technical Details — structure / components / state / animations / performance
 *   7. Results — metrics: performance / accessibility / responsive / ux
 *   8. Next Project — large full-width transition
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/landing/hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { getProjectById } from "../data";
import type { ProjectCaseStudy } from "../data";
import { Breadcrumb } from "@/landing/components/navigation/breadcrumb";
import { ImageComponent } from "@/components/image-component";
import { BrowserFrameMockup } from "@/components/browser-frame-mockup";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// Props
// ============================================================================

interface ProjectPageProps {
  project: ProjectCaseStudy;
  onNextProject: (id: string) => void;
  onBackToProjects: () => void;
}

// ============================================================================
// Scroll Reveal Hook — clip-path + opacity + y
// ============================================================================

function useScrollReveal(sectionRef: React.RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
      if (items.length === 0) return;

      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 32,
            clipPath: "inset(0 100% 0 0)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            delay: i * 0.06,
            ease: ANIMATION_EASINGS.expoOut,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, sectionRef]);
}

// ============================================================================
// Component
// ============================================================================

export function ProjectPage({ project, onNextProject, onBackToProjects }: ProjectPageProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);

  return (
    <main role="main" aria-label={`Case study: ${project.title}`} className="cs-root">
      {/* Breadcrumb */}
      <div className="cs-breadcrumb-wrap">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/#projects" },
            { label: project.title, isCurrent: true },
          ]}
        />
      </div>

      <HeroStory
        project={project}
        onBackToProjects={onBackToProjects}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <ProjectOverview
        overview={project.overview}
        accentRgb={project.accentRgb}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <ProjectMeta
        meta={project.meta}
        accentRgb={project.accentRgb}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <VisualShowcase
        showcase={project.showcase}
        accentRgb={project.accentRgb}
        accentColor={project.accentColor}
        projectId={project.id}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <DevelopmentProcess
        process={project.process}
        accentRgb={project.accentRgb}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <TechnicalDetails
        technical={project.technical}
        accentRgb={project.accentRgb}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <ProjectResults
        results={project.results}
        accentColor={project.accentColor}
        accentRgb={project.accentRgb}
        reducedMotion={reducedMotion}
      />

      <div className="cs-divider" aria-hidden="true" />

      <ProjectNavigation
        project={project}
        onNextProject={onNextProject}
        reducedMotion={reducedMotion}
      />
    </main>
  );
}

// ============================================================================
// 1. Hero Story
// ============================================================================

function HeroStory({
  project,
  onBackToProjects,
  reducedMotion,
}: {
  project: ProjectCaseStudy;
  onBackToProjects: () => void;
  reducedMotion: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.backOut } });

      tl.fromTo("[data-cs-back]", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4 })
        .fromTo(
          "[data-cs-number]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2",
        )
        .fromTo(
          "[data-cs-title]",
          { opacity: 0, y: 60, clipPath: "inset(0 0% 0 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 1,
            ease: ANIMATION_EASINGS.expoOut,
          },
          "-=0.2",
        )
        .fromTo(
          "[data-cs-meta]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.5",
        )
        .fromTo(
          "[data-cs-desc]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          "[data-cs-preview]",
          { opacity: 0, scale: 0.96, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: ANIMATION_EASINGS.expoOut },
          "-=0.3",
        )
        .fromTo(
          "[data-cs-buttons]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.5",
        );
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={heroRef} className="cs-hero" aria-label="Project hero">
      {/* Back */}
      <button
        type="button"
        data-cs-back
        onClick={onBackToProjects}
        className="cs-back"
        aria-label="Back to all projects"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        All Projects
      </button>

      {/* Number */}
      <span data-cs-number className="cs-hero-number">
        {String(project.number).padStart(2, "0")}
      </span>

      {/* Title — oversized editorial */}
      <h1 data-cs-title className="cs-hero-title">
        {project.title}
      </h1>

      {/* Meta row */}
      <div data-cs-meta className="cs-hero-meta">
        <span className="cs-hero-meta-item">{project.hero.category}</span>
        <span className="cs-hero-meta-dot" aria-hidden="true" />
        <span className="cs-hero-meta-item">{project.hero.year}</span>
        <span className="cs-hero-meta-dot" aria-hidden="true" />
        <span className="cs-hero-meta-item">{project.hero.role}</span>
      </div>

      {/* Description */}
      <p data-cs-desc className="cs-hero-desc">
        {project.hero.description}
      </p>

      {/* Preview — unique visual per project */}
      <div data-cs-preview className="cs-hero-preview" aria-hidden="true">
        <HeroVisual project={project} />
      </div>

      {/* Buttons */}
      <div data-cs-buttons className="cs-hero-buttons">
        {project.liveUrl && project.liveUrl !== "#" && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-btn cs-btn--primary"
            style={{
              background: `rgba(${project.accentRgb}, 0.12)`,
              borderColor: `rgba(${project.accentRgb}, 0.25)`,
              color: project.accentColor,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
        )}
        {project.githubUrl && project.githubUrl !== "#" && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-btn cs-btn--secondary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Source Code
          </a>
        )}
      </div>

      {/* Tech tags */}
      <div className="cs-hero-tech">
        {project.hero.technologies.map((tech) => (
          <span key={tech} className="cs-hero-tech-tag">
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Hero Visual — unique per project
// ============================================================================

function HeroVisual({ project }: { project: ProjectCaseStudy }) {
  const { accentRgb, id } = project;

  // Use hero image if available
  if (project.images?.hero) {
    return (
      <div className="cs-visual cs-visual--image">
        <BrowserFrameMockup
          url={project.liveUrl ?? "example.com"}
          accentRgb={accentRgb}
          className="cs-visual-browser"
        >
          <ImageComponent
            src={project.images.hero}
            alt={`${project.title} — Hero Preview`}
            width={1920}
            height={1080}
            accentRgb={accentRgb}
          />
        </BrowserFrameMockup>
      </div>
    );
  }

  if (id === "frontend-multiverse") {
    return (
      <div className="cs-visual cs-visual--multiverse">
        {/* 3D wireframe globe */}
        <svg viewBox="0 0 400 300" className="cs-visual-svg" aria-hidden="true">
          <defs>
            <radialGradient id="glow-fm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(${accentRgb}, 0.3)`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="150" r="120" fill="url(#glow-fm)" />
          {/* Latitude lines */}
          <ellipse
            cx="200"
            cy="150"
            rx="120"
            ry="40"
            fill="none"
            stroke={`rgba(${accentRgb}, 0.2)`}
            strokeWidth="0.8"
          />
          <ellipse
            cx="200"
            cy="150"
            rx="120"
            ry="80"
            fill="none"
            stroke={`rgba(${accentRgb}, 0.15)`}
            strokeWidth="0.8"
          />
          <ellipse
            cx="200"
            cy="150"
            rx="120"
            ry="110"
            fill="none"
            stroke={`rgba(${accentRgb}, 0.12)`}
            strokeWidth="0.8"
          />
          {/* Longitude lines */}
          <ellipse
            cx="200"
            cy="150"
            rx="40"
            ry="120"
            fill="none"
            stroke={`rgba(${accentRgb}, 0.2)`}
            strokeWidth="0.8"
          />
          <ellipse
            cx="200"
            cy="150"
            rx="80"
            ry="120"
            fill="none"
            stroke={`rgba(${accentRgb}, 0.15)`}
            strokeWidth="0.8"
          />
          <ellipse
            cx="200"
            cy="150"
            rx="110"
            ry="120"
            fill="none"
            stroke={`rgba(${accentRgb}, 0.12)`}
            strokeWidth="0.8"
          />
          {/* Center meridian */}
          <line
            x1="200"
            y1="30"
            x2="200"
            y2="270"
            stroke={`rgba(${accentRgb}, 0.25)`}
            strokeWidth="0.8"
          />
          {/* Equator */}
          <line
            x1="80"
            y1="150"
            x2="320"
            y2="150"
            stroke={`rgba(${accentRgb}, 0.25)`}
            strokeWidth="0.8"
          />
          {/* Nodes */}
          <circle cx="200" cy="150" r="4" fill={project.accentColor} opacity="0.8" />
          <circle cx="140" cy="110" r="3" fill={project.accentColor} opacity="0.5" />
          <circle cx="260" cy="110" r="3" fill={project.accentColor} opacity="0.5" />
          <circle cx="140" cy="190" r="3" fill={project.accentColor} opacity="0.5" />
          <circle cx="260" cy="190" r="3" fill={project.accentColor} opacity="0.5" />
          {/* Connection lines */}
          <line
            x1="200"
            y1="150"
            x2="140"
            y2="110"
            stroke={`rgba(${accentRgb}, 0.3)`}
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="200"
            y1="150"
            x2="260"
            y2="110"
            stroke={`rgba(${accentRgb}, 0.3)`}
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="200"
            y1="150"
            x2="140"
            y2="190"
            stroke={`rgba(${accentRgb}, 0.3)`}
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="200"
            y1="150"
            x2="260"
            y2="190"
            stroke={`rgba(${accentRgb}, 0.3)`}
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        </svg>
        <div className="cs-visual-label">
          <span className="cs-visual-label-text" style={{ color: project.accentColor }}>
            PORTAL SYSTEMS
          </span>
          <span className="cs-visual-label-sub">3D Worlds • Custom Cursor • Scroll Magic</span>
        </div>
      </div>
    );
  }

  if (id === "ai-architecture-studio") {
    return (
      <div className="cs-visual cs-visual--ai">
        <svg viewBox="0 0 400 300" className="cs-visual-svg" aria-hidden="true">
          <defs>
            <radialGradient id="glow-ai" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgba(${accentRgb}, 0.25)`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="150" r="100" fill="url(#glow-ai)" />
          {/* Neural network nodes */}
          {/* Input layer */}
          <circle cx="100" cy="90" r="6" fill={`rgba(${accentRgb}, 0.6)`} />
          <circle cx="100" cy="150" r="6" fill={`rgba(${accentRgb}, 0.6)`} />
          <circle cx="100" cy="210" r="6" fill={`rgba(${accentRgb}, 0.6)`} />
          {/* Hidden layer 1 */}
          <circle cx="170" cy="70" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          <circle cx="170" cy="120" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          <circle cx="170" cy="170" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          <circle cx="170" cy="220" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          {/* Hidden layer 2 */}
          <circle cx="240" cy="90" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          <circle cx="240" cy="150" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          <circle cx="240" cy="210" r="5" fill={`rgba(${accentRgb}, 0.5)`} />
          {/* Output layer */}
          <circle cx="310" cy="120" r="7" fill={project.accentColor} opacity="0.8" />
          <circle cx="310" cy="180" r="7" fill={project.accentColor} opacity="0.8" />
          {/* Connections input→hidden1 */}
          {[90, 150, 210].map((y1) =>
            [70, 120, 170, 220].map((y2) => (
              <line
                key={`${String(y1)}-${String(y2)}`}
                x1="106"
                y1={y1}
                x2="165"
                y2={y2}
                stroke={`rgba(${accentRgb}, 0.15)`}
                strokeWidth="0.5"
              />
            )),
          )}
          {/* Connections hidden1→hidden2 */}
          {[70, 120, 170, 220].map((y1) =>
            [90, 150, 210].map((y2) => (
              <line
                key={`h1-${String(y1)}-${String(y2)}`}
                x1="175"
                y1={y1}
                x2="235"
                y2={y2}
                stroke={`rgba(${accentRgb}, 0.12)`}
                strokeWidth="0.5"
              />
            )),
          )}
          {/* Connections hidden2→output */}
          {[90, 150, 210].map((y1) =>
            [120, 180].map((y2) => (
              <line
                key={`h2-${String(y1)}-${String(y2)}`}
                x1="245"
                y1={y1}
                x2="303"
                y2={y2}
                stroke={`rgba(${accentRgb}, 0.15)`}
                strokeWidth="0.5"
              />
            )),
          )}
        </svg>
        <div className="cs-visual-label">
          <span className="cs-visual-label-text" style={{ color: project.accentColor }}>
            ML PIPELINE
          </span>
          <span className="cs-visual-label-sub">
            Token System • Real-time Preview • Code Export
          </span>
        </div>
      </div>
    );
  }

  // Window Corner — desktop grid
  return (
    <div className="cs-visual cs-visual--window">
      <svg viewBox="0 0 400 300" className="cs-visual-svg" aria-hidden="true">
        <defs>
          <radialGradient id="glow-wc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`rgba(${accentRgb}, 0.2)`} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="150" r="110" fill="url(#glow-wc)" />
        {/* Desktop background grid */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`vg-${String(i)}`}
            x1={80 + i * 30}
            y1="50"
            x2={80 + i * 30}
            y2="250"
            stroke={`rgba(${accentRgb}, 0.06)`}
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`hg-${String(i)}`}
            x1="80"
            y1={50 + i * 35}
            x2="320"
            y2={50 + i * 35}
            stroke={`rgba(${accentRgb}, 0.06)`}
            strokeWidth="0.5"
          />
        ))}
        {/* Window 1 — large */}
        <rect
          x="90"
          y="60"
          width="140"
          height="100"
          rx="4"
          fill={`rgba(${accentRgb}, 0.08)`}
          stroke={`rgba(${accentRgb}, 0.2)`}
          strokeWidth="1"
        />
        <rect x="90" y="60" width="140" height="18" rx="4" fill={`rgba(${accentRgb}, 0.12)`} />
        <circle cx="102" cy="69" r="3" fill={`rgba(${accentRgb}, 0.4)`} />
        <circle cx="112" cy="69" r="3" fill={`rgba(${accentRgb}, 0.3)`} />
        <circle cx="122" cy="69" r="3" fill={`rgba(${accentRgb}, 0.2)`} />
        {/* Window 2 — medium */}
        <rect
          x="245"
          y="70"
          width="110"
          height="80"
          rx="4"
          fill={`rgba(${accentRgb}, 0.06)`}
          stroke={`rgba(${accentRgb}, 0.18)`}
          strokeWidth="1"
        />
        <rect x="245" y="70" width="110" height="16" rx="4" fill={`rgba(${accentRgb}, 0.1)`} />
        <circle cx="256" cy="78" r="2.5" fill={`rgba(${accentRgb}, 0.4)`} />
        <circle cx="265" cy="78" r="2.5" fill={`rgba(${accentRgb}, 0.3)`} />
        <circle cx="274" cy="78" r="2.5" fill={`rgba(${accentRgb}, 0.2)`} />
        {/* Window 3 — small */}
        <rect
          x="110"
          y="175"
          width="100"
          height="70"
          rx="4"
          fill={`rgba(${accentRgb}, 0.05)`}
          stroke={`rgba(${accentRgb}, 0.15)`}
          strokeWidth="1"
        />
        <rect x="110" y="175" width="100" height="14" rx="4" fill={`rgba(${accentRgb}, 0.08)`} />
        <circle cx="120" cy="182" r="2" fill={`rgba(${accentRgb}, 0.4)`} />
        <circle cx="128" cy="182" r="2" fill={`rgba(${accentRgb}, 0.3)`} />
        {/* Taskbar */}
        <rect
          x="80"
          y="255"
          width="240"
          height="20"
          rx="3"
          fill={`rgba(${accentRgb}, 0.1)`}
          stroke={`rgba(${accentRgb}, 0.15)`}
          strokeWidth="0.5"
        />
        <circle cx="100" cy="265" r="4" fill={project.accentColor} opacity="0.6" />
        <rect x="120" y="262" width="40" height="6" rx="2" fill={`rgba(${accentRgb}, 0.2)`} />
        <rect x="170" y="262" width="30" height="6" rx="2" fill={`rgba(${accentRgb}, 0.15)`} />
        <rect x="210" y="262" width="35" height="6" rx="2" fill={`rgba(${accentRgb}, 0.12)`} />
        {/* Focus indicator */}
        <rect
          x="245"
          y="70"
          width="110"
          height="80"
          rx="4"
          fill="none"
          stroke={project.accentColor}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
      <div className="cs-visual-label">
        <span className="cs-visual-label-text" style={{ color: project.accentColor }}>
          SPATIAL OS
        </span>
        <span className="cs-visual-label-sub">
          Window Manager • Canvas Renderer • Spatial Audio
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Project Overview — editorial: challenge / idea / solution
// ============================================================================

function ProjectOverview({
  overview,
  accentRgb,
  reducedMotion,
}: {
  overview: ProjectCaseStudy["overview"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="cs-section" aria-labelledby="cs-overview-heading">
      <span data-reveal className="cs-label">
        Overview
      </span>
      <h2 data-reveal id="cs-overview-heading" className="cs-section-title">
        The Story
      </h2>

      <div className="cs-overview-grid">
        <div data-reveal className="cs-overview-block">
          <span className="cs-overview-label" style={{ color: `rgba(${accentRgb}, 0.7)` }}>
            The Challenge
          </span>
          <p className="cs-overview-text">{overview.challenge}</p>
        </div>

        <div data-reveal className="cs-overview-block">
          <span className="cs-overview-label" style={{ color: `rgba(${accentRgb}, 0.7)` }}>
            The Idea
          </span>
          <p className="cs-overview-text">{overview.idea}</p>
        </div>

        <div data-reveal className="cs-overview-block">
          <span className="cs-overview-label" style={{ color: `rgba(${accentRgb}, 0.7)` }}>
            The Solution
          </span>
          <p className="cs-overview-text">{overview.solution}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 3. Project Meta — minimal: role / timeline / stack / responsibilities
// ============================================================================

function ProjectMeta({
  meta,
  accentRgb,
  reducedMotion,
}: {
  meta: ProjectCaseStudy["meta"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="cs-section" aria-labelledby="cs-meta-heading">
      <span data-reveal className="cs-label">
        Details
      </span>
      <h2 data-reveal id="cs-meta-heading" className="cs-section-title">
        Project Info
      </h2>

      <div className="cs-meta-grid">
        {/* Role */}
        <div data-reveal className="cs-meta-block">
          <span className="cs-meta-key">Role</span>
          <span className="cs-meta-value">{meta.role}</span>
        </div>

        {/* Timeline */}
        <div data-reveal className="cs-meta-block">
          <span className="cs-meta-key">Timeline</span>
          <span className="cs-meta-value">{meta.timeline}</span>
        </div>

        {/* Stack */}
        <div data-reveal className="cs-meta-block cs-meta-block--wide">
          <span className="cs-meta-key">Stack</span>
          <div className="cs-meta-tags">
            {meta.stack.map((item) => (
              <span key={item} className="cs-meta-tag">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div data-reveal className="cs-meta-block cs-meta-block--wide">
          <span className="cs-meta-key">Responsibilities</span>
          <div className="cs-meta-list">
            {meta.responsibilities.map((item) => (
              <span
                key={item}
                className="cs-meta-list-item"
                style={{ borderColor: `rgba(${accentRgb}, 0.2)` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 4. Visual Showcase — large screenshots, device frames
// ============================================================================

function VisualShowcase({
  showcase,
  accentRgb,
  accentColor,
  projectId,
  reducedMotion,
}: {
  showcase: ProjectCaseStudy["showcase"];
  accentRgb: string;
  accentColor: string;
  projectId: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, reducedMotion);

  return (
    <section
      ref={sectionRef}
      className="cs-section cs-section--wide"
      aria-labelledby="cs-showcase-heading"
    >
      <span data-reveal className="cs-label">
        Showcase
      </span>
      <h2 data-reveal id="cs-showcase-heading" className="cs-section-title">
        Visual Experience
      </h2>

      <div className="cs-showcase-layout">
        {showcase.map((item, i) => (
          <div
            key={item.label}
            data-reveal
            className={`cs-showcase-item ${i === 0 ? "cs-showcase-item--hero" : ""}`}
          >
            {/* Browser frame */}
            <div className="cs-showcase-frame">
              <div className="cs-showcase-frame-bar">
                <div className="cs-showcase-frame-dots">
                  <span className="cs-showcase-frame-dot" />
                  <span className="cs-showcase-frame-dot" />
                  <span className="cs-showcase-frame-dot" />
                </div>
                <span className="cs-showcase-frame-title">{item.label}</span>
              </div>
              <div className="cs-showcase-frame-content">
                {item.image ? (
                  <BrowserFrameMockup
                    url={
                      projectId === "over-benefits"
                        ? "overbenefits.net"
                        : projectId === "window-corner"
                          ? "window-corner.com"
                          : "mtsmed-eg.com"
                    }
                    accentRgb={accentRgb}
                  >
                    <ImageComponent
                      src={item.image}
                      alt={`${item.label} — ${projectId}`}
                      width={1920}
                      height={1080}
                      accentRgb={accentRgb}
                    />
                  </BrowserFrameMockup>
                ) : (
                  <ShowcaseVisual
                    index={i}
                    projectId={projectId}
                    accentRgb={accentRgb}
                    accentColor={accentColor}
                    label={item.label}
                  />
                )}
              </div>
            </div>

            {/* Label */}
            <div className="cs-showcase-info">
              <span className="cs-showcase-label">{item.label}</span>
              <p className="cs-showcase-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Showcase Visual — unique per project and position
// ============================================================================

function ShowcaseVisual({
  index,
  projectId,
  accentRgb,
  accentColor,
  label,
}: {
  index: number;
  projectId: string;
  accentRgb: string;
  accentColor: string;
  label: string;
}) {
  if (projectId === "frontend-multiverse") {
    return (
      <MultiverseShowcaseVisual
        index={index}
        accentRgb={accentRgb}
        accentColor={accentColor}
        label={label}
      />
    );
  }
  if (projectId === "ai-architecture-studio") {
    return (
      <AIShowcaseVisual
        index={index}
        accentRgb={accentRgb}
        accentColor={accentColor}
        label={label}
      />
    );
  }
  return (
    <WindowShowcaseVisual
      index={index}
      accentRgb={accentRgb}
      accentColor={accentColor}
      label={label}
    />
  );
}

function MultiverseShowcaseVisual({
  index,
  accentRgb,
  accentColor,
  label,
}: {
  index: number;
  accentRgb: string;
  accentColor: string;
  label: string;
}) {
  const visuals = [
    // Hero Experience — portal ring
    <svg key="he" viewBox="0 0 600 340" className="cs-sv-visual">
      <circle
        cx="300"
        cy="170"
        r="100"
        fill="none"
        stroke={`rgba(${accentRgb}, 0.3)`}
        strokeWidth="2"
      />
      <circle
        cx="300"
        cy="170"
        r="80"
        fill="none"
        stroke={`rgba(${accentRgb}, 0.2)`}
        strokeWidth="1"
        strokeDasharray="8 4"
      />
      <circle cx="300" cy="170" r="60" fill={`rgba(${accentRgb}, 0.05)`} />
      <circle cx="300" cy="170" r="8" fill={accentColor} opacity="0.8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={deg}
            cx={300 + Math.cos(rad) * 100}
            cy={170 + Math.sin(rad) * 100}
            r="3"
            fill={`rgba(${accentRgb}, 0.4)`}
          />
        );
      })}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Portal Navigation — perspective grid
    <svg key="pn" viewBox="0 0 600 340" className="cs-sv-visual">
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`v${String(i)}`}
          x1={100 + i * 30}
          y1="40"
          x2={300 + (i - 5) * 15}
          y2="300"
          stroke={`rgba(${accentRgb}, 0.12)`}
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h${String(i)}`}
          x1="100"
          y1={40 + i * 35}
          x2="500"
          y2={40 + i * 35}
          stroke={`rgba(${accentRgb}, 0.08)`}
          strokeWidth="0.5"
        />
      ))}
      <rect
        x="200"
        y="100"
        width="200"
        height="140"
        rx="4"
        fill={`rgba(${accentRgb}, 0.06)`}
        stroke={`rgba(${accentRgb}, 0.2)`}
        strokeWidth="1"
      />
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Custom Cursor — cursor trail
    <svg key="cc" viewBox="0 0 600 340" className="cs-sv-visual">
      <circle cx="200" cy="120" r="40" fill={`rgba(${accentRgb}, 0.08)`} />
      <circle cx="200" cy="120" r="20" fill={`rgba(${accentRgb}, 0.12)`} />
      <circle cx="200" cy="120" r="6" fill={accentColor} opacity="0.8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={String(i)}
          cx={220 + i * 20}
          cy={140 + i * 15}
          r={4 - i * 0.5}
          fill={`rgba(${accentRgb}, ${String(0.4 - i * 0.08)})`}
        />
      ))}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Project Showcase — editorial grid
    <svg key="ps" viewBox="0 0 600 340" className="cs-sv-visual">
      <rect
        x="80"
        y="40"
        width="200"
        height="130"
        rx="2"
        fill={`rgba(${accentRgb}, 0.06)`}
        stroke={`rgba(${accentRgb}, 0.12)`}
        strokeWidth="0.5"
      />
      <rect
        x="300"
        y="40"
        width="220"
        height="130"
        rx="2"
        fill={`rgba(${accentRgb}, 0.04)`}
        stroke={`rgba(${accentRgb}, 0.1)`}
        strokeWidth="0.5"
      />
      <rect
        x="80"
        y="190"
        width="440"
        height="80"
        rx="2"
        fill={`rgba(${accentRgb}, 0.03)`}
        stroke={`rgba(${accentRgb}, 0.08)`}
        strokeWidth="0.5"
      />
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
  ];

  return visuals[index] ?? visuals[0];
}

function AIShowcaseVisual({
  index,
  accentRgb,
  accentColor,
  label,
}: {
  index: number;
  accentRgb: string;
  accentColor: string;
  label: string;
}) {
  const visuals = [
    // Token Editor — slider controls
    <svg key="te" viewBox="0 0 600 340" className="cs-sv-visual">
      {[80, 130, 180, 230].map((y, i) => (
        <g key={y}>
          <text
            x="100"
            y={y + 4}
            fill={`rgba(${accentRgb}, 0.3)`}
            fontSize="10"
            fontFamily="monospace"
          >
            token-{String(i + 1).padStart(2, "0")}
          </text>
          <rect x="200" y={y - 6} width="250" height="4" rx="2" fill={`rgba(${accentRgb}, 0.1)`} />
          <circle cx={250 + i * 40} cy={y - 4} r="6" fill={accentColor} opacity="0.7" />
        </g>
      ))}
      <rect
        x="480"
        y="80"
        width="80"
        height="160"
        rx="4"
        fill={`rgba(${accentRgb}, 0.06)`}
        stroke={`rgba(${accentRgb}, 0.15)`}
        strokeWidth="0.5"
      />
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Component Library — card grid
    <svg key="cl" viewBox="0 0 600 340" className="cs-sv-visual">
      {Array.from({ length: 6 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <rect
            key={i}
            x={100 + col * 140}
            y={60 + row * 100}
            width="120"
            height="80"
            rx="4"
            fill={`rgba(${accentRgb}, 0.05)`}
            stroke={`rgba(${accentRgb}, 0.12)`}
            strokeWidth="0.5"
          />
        );
      })}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // AI Suggestions — brain neural
    <svg key="ai" viewBox="0 0 600 340" className="cs-sv-visual">
      <circle
        cx="300"
        cy="150"
        r="60"
        fill={`rgba(${accentRgb}, 0.06)`}
        stroke={`rgba(${accentRgb}, 0.2)`}
        strokeWidth="1"
      />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={deg}
            cx={300 + Math.cos(rad) * 60}
            cy={150 + Math.sin(rad) * 60}
            r="4"
            fill={accentColor}
            opacity="0.6"
          />
        );
      })}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Code Export — code blocks
    <svg key="ce" viewBox="0 0 600 340" className="cs-sv-visual">
      <rect
        x="80"
        y="40"
        width="440"
        height="250"
        rx="4"
        fill={`rgba(${accentRgb}, 0.04)`}
        stroke={`rgba(${accentRgb}, 0.1)`}
        strokeWidth="0.5"
      />
      {[70, 100, 130, 160, 190, 220].map((y, i) => (
        <rect
          key={String(y)}
          x={100 + (i % 3) * 20}
          y={y}
          width={200 - (i % 3) * 40}
          height="4"
          rx="2"
          fill={`rgba(${accentRgb}, ${String(0.15 - i * 0.015)})`}
        />
      ))}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
  ];

  return visuals[index] ?? visuals[0];
}

function WindowShowcaseVisual({
  index,
  accentRgb,
  accentColor,
  label,
}: {
  index: number;
  accentRgb: string;
  accentColor: string;
  label: string;
}) {
  const visuals = [
    // Window Management — resize handles
    <svg key="wm" viewBox="0 0 600 340" className="cs-sv-visual">
      <rect
        x="120"
        y="50"
        width="200"
        height="140"
        rx="4"
        fill={`rgba(${accentRgb}, 0.06)`}
        stroke={`rgba(${accentRgb}, 0.2)`}
        strokeWidth="1"
      />
      <rect
        x="250"
        y="100"
        width="180"
        height="120"
        rx="4"
        fill={`rgba(${accentRgb}, 0.04)`}
        stroke={`rgba(${accentRgb}, 0.15)`}
        strokeWidth="0.5"
      />
      <rect
        x="180"
        y="160"
        width="160"
        height="100"
        rx="4"
        fill={`rgba(${accentRgb}, 0.03)`}
        stroke={`rgba(${accentRgb}, 0.1)`}
        strokeWidth="0.5"
      />
      {/* Resize handle */}
      <circle cx="320" cy="190" r="4" fill={accentColor} opacity="0.7" />
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Spatial Audio — sound waves
    <svg key="sa" viewBox="0 0 600 340" className="cs-sv-visual">
      <circle cx="300" cy="150" r="8" fill={accentColor} opacity="0.8" />
      {[20, 40, 60, 80].map((r) => (
        <circle
          key={String(r)}
          cx="300"
          cy="150"
          r={r}
          fill="none"
          stroke={`rgba(${accentRgb}, ${String(0.3 - r * 0.003)})`}
          strokeWidth="0.5"
        />
      ))}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Taskbar — app icons
    <svg key="tb" viewBox="0 0 600 340" className="cs-sv-visual">
      <rect
        x="100"
        y="260"
        width="400"
        height="30"
        rx="4"
        fill={`rgba(${accentRgb}, 0.08)`}
        stroke={`rgba(${accentRgb}, 0.15)`}
        strokeWidth="0.5"
      />
      {[130, 170, 210, 250, 290, 330].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="267"
          width="16"
          height="16"
          rx="3"
          fill={i === 0 ? accentColor : `rgba(${accentRgb}, 0.2)`}
          opacity={i === 0 ? 0.8 : 0.5}
        />
      ))}
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
    // Live App Containers — split view
    <svg key="lc" viewBox="0 0 600 340" className="cs-sv-visual">
      <rect
        x="80"
        y="40"
        width="180"
        height="240"
        rx="4"
        fill={`rgba(${accentRgb}, 0.05)`}
        stroke={`rgba(${accentRgb}, 0.15)`}
        strokeWidth="0.5"
      />
      <rect
        x="280"
        y="40"
        width="120"
        height="110"
        rx="4"
        fill={`rgba(${accentRgb}, 0.04)`}
        stroke={`rgba(${accentRgb}, 0.12)`}
        strokeWidth="0.5"
      />
      <rect
        x="280"
        y="170"
        width="120"
        height="110"
        rx="4"
        fill={`rgba(${accentRgb}, 0.03)`}
        stroke={`rgba(${accentRgb}, 0.1)`}
        strokeWidth="0.5"
      />
      <rect
        x="420"
        y="40"
        width="100"
        height="240"
        rx="4"
        fill={`rgba(${accentRgb}, 0.02)`}
        stroke={`rgba(${accentRgb}, 0.08)`}
        strokeWidth="0.5"
      />
      <text
        x="300"
        y="300"
        textAnchor="middle"
        fill={`rgba(${accentRgb}, 0.15)`}
        fontSize="11"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>,
  ];

  return visuals[index] ?? visuals[0];
}

// ============================================================================
// 5. Development Process — numbered sections
// ============================================================================

function DevelopmentProcess({
  process,
  accentRgb,
  reducedMotion,
}: {
  process: ProjectCaseStudy["process"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="cs-section" aria-labelledby="cs-process-heading">
      <span data-reveal className="cs-label">
        Process
      </span>
      <h2 data-reveal id="cs-process-heading" className="cs-section-title">
        How I Built It
      </h2>

      <div className="cs-process-list">
        {process.map((step) => (
          <div key={step.number} data-reveal className="cs-process-item">
            <span className="cs-process-number" style={{ color: `rgba(${accentRgb}, 0.4)` }}>
              {step.number}
            </span>
            <div className="cs-process-content">
              <h3 className="cs-process-title">{step.title}</h3>
              <p className="cs-process-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 6. Technical Details
// ============================================================================

function TechnicalDetails({
  technical,
  accentRgb,
  reducedMotion,
}: {
  technical: ProjectCaseStudy["technical"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="cs-section" aria-labelledby="cs-technical-heading">
      <span data-reveal className="cs-label">
        Technical
      </span>
      <h2 data-reveal id="cs-technical-heading" className="cs-section-title">
        Under the Hood
      </h2>

      <div className="cs-technical-list">
        {technical.map((item) => (
          <div key={item.label} data-reveal className="cs-technical-item">
            <span className="cs-technical-label" style={{ borderColor: `rgba(${accentRgb}, 0.3)` }}>
              {item.label}
            </span>
            <p className="cs-technical-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 7. Results — metrics
// ============================================================================

function ProjectResults({
  results,
  accentColor,
  accentRgb,
  reducedMotion,
}: {
  results: ProjectCaseStudy["results"];
  accentColor: string;
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="cs-section" aria-labelledby="cs-results-heading">
      <span data-reveal className="cs-label">
        Impact
      </span>
      <h2 data-reveal id="cs-results-heading" className="cs-section-title">
        Results
      </h2>

      <div className="cs-results-grid">
        {results.map((result) => (
          <div key={result.metric} data-reveal className="cs-results-item">
            <span className="cs-results-value" style={{ color: accentColor }}>
              {result.value}
            </span>
            <span className="cs-results-metric">{result.metric}</span>
            <p className="cs-results-desc">{result.description}</p>
            {/* Accent line */}
            <div
              className="cs-results-line"
              style={{ background: `rgba(${accentRgb}, 0.3)` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 8. Project Navigation — prev/next with large title previews
// ============================================================================

function ProjectNavigation({
  project,
  onNextProject,
  reducedMotion,
}: {
  project: ProjectCaseStudy;
  onNextProject: (id: string) => void;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-nav-reveal]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: ANIMATION_EASINGS.expoOut,
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const prevProject = project.prevProjectId ? getProjectById(project.prevProjectId) : undefined;
  const nextProject = project.nextProjectId ? getProjectById(project.nextProjectId) : undefined;

  return (
    <section ref={sectionRef} className="cs-project-nav" aria-label="Project navigation">
      <div className="cs-project-nav-inner">
        {/* Previous */}
        {prevProject && (
          <button
            type="button"
            data-nav-reveal
            className="cs-project-nav-card cs-project-nav-card--prev"
            onClick={() => onNextProject(prevProject.id)}
            aria-label={`Previous project: ${prevProject.title}`}
          >
            <span className="cs-project-nav-direction">← Prev</span>
            <span className="cs-project-nav-title">{prevProject.title}</span>
            <span className="cs-project-nav-category">{prevProject.hero.category}</span>
            <div
              className="cs-project-nav-glow"
              style={{
                background: `radial-gradient(ellipse at 20% 50%, rgba(${prevProject.accentRgb}, 0.08) 0%, transparent 60%)`,
              }}
              aria-hidden="true"
            />
          </button>
        )}

        {/* Next */}
        {nextProject && (
          <button
            type="button"
            data-nav-reveal
            className="cs-project-nav-card cs-project-nav-card--next"
            onClick={() => onNextProject(nextProject.id)}
            aria-label={`Next project: ${nextProject.title}`}
          >
            <span className="cs-project-nav-direction">Next →</span>
            <span className="cs-project-nav-title">{nextProject.title}</span>
            <span className="cs-project-nav-category">{nextProject.hero.category}</span>
            <div
              className="cs-project-nav-glow"
              style={{
                background: `radial-gradient(ellipse at 80% 50%, rgba(${nextProject.accentRgb}, 0.08) 0%, transparent 60%)`,
              }}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  );
}
