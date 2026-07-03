/**
 * Project Case Study Page
 *
 * Premium case study experience with per-section scroll reveals.
 * Each section animates independently as you scroll.
 */

import { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/landing/hooks";
import { useSplitTextReveal, useVelocityText, useScrambleDecode } from "@/animation";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { getProjectById } from "../data";
import type { ProjectCaseStudy } from "../data";

// ============================================================================
// Props
// ============================================================================

interface ProjectPageProps {
  project: ProjectCaseStudy;
  onNextProject: (id: string) => void;
  onBackToProjects: () => void;
}

// ============================================================================
// Section Reveal Hook
// ============================================================================

function useSectionReveal(
  sectionRef: React.RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    el.style.opacity = "0";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
        if (items.length === 0) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: ANIMATION_EASINGS.backOut,
          });
          return;
        }

        gsap.to(el, { opacity: 1, duration: 0.01 });
        gsap.fromTo(
          items,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: ANIMATION_EASINGS.backOut,
            stagger: 0.1,
          },
        );
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, sectionRef]);
}

// ============================================================================
// Component
// ============================================================================

export function ProjectPage({
  project,
  onNextProject,
  onBackToProjects,
}: ProjectPageProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);

  return (
    <main
      role="main"
      aria-label={`Case study: ${project.title}`}
      className="project-root"
    >
      <ProjectHero
        project={project}
        onBackToProjects={onBackToProjects}
        reducedMotion={reducedMotion}
      />
      <ProjectOverview overview={project.overview} accentRgb={project.accentRgb} reducedMotion={reducedMotion} />
      <ProjectKeyDecision decision={project.keyDecision} accentRgb={project.accentRgb} reducedMotion={reducedMotion} />
      <ProjectRole role={project.role} accentRgb={project.accentRgb} reducedMotion={reducedMotion} />
      <ProjectTechStack techStack={project.techStack} reducedMotion={reducedMotion} />
      <ProjectProcess process={project.process} accentRgb={project.accentRgb} reducedMotion={reducedMotion} />
      <ProjectResults results={project.results} accentColor={project.accentColor} reducedMotion={reducedMotion} />
      <ProjectNext
        projectId={project.nextProjectId}
        onNextProject={onNextProject}
        reducedMotion={reducedMotion}
      />
    </main>
  );
}

// ============================================================================
// Hero
// ============================================================================

function ProjectHero({
  project,
  onBackToProjects,
  reducedMotion,
}: {
  project: ProjectCaseStudy;
  onBackToProjects: () => void;
  reducedMotion: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);

  const totalWeeks = useMemo(() => {
    return project.process.reduce((acc, step) => {
      const weeks = parseInt(step.duration, 10);
      return acc + (isNaN(weeks) ? 0 : weeks);
    }, 0);
  }, [project.process]);

  const titleSplitRef = useSplitTextReveal({ delay: 0.3, stagger: 0.03, y: 40, duration: 0.8 });

  const descVelocityRef = useVelocityText({ maxSkew: 6, maxBlur: 1.5 });

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.backOut } });

      tl.fromTo(
        "[data-hero-back]",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.4 },
      )
        .fromTo(
          "[data-hero-number]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2",
        )
        .fromTo(
          "[data-hero-meta]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          "[data-hero-buttons]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2",
        )
        .fromTo(
          "[data-hero-visual]",
          { opacity: 0, scale: 0.96, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: ANIMATION_EASINGS.expoOut },
          "-=0.2",
        );
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      data-project-hero
      className="project-hero"
    >
      {/* Back link */}
      <button
        type="button"
        data-hero-back
        onClick={onBackToProjects}
        className="project-back-link"
        aria-label="Back to all projects"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        All Projects
      </button>

      {/* Project number */}
      <span data-hero-number className="project-hero-number">
        {String(project.number).padStart(2, "0")}
      </span>

      {/* Title — SplitText character reveal on mount */}
      <h1
        data-hero-title
        ref={titleSplitRef as React.RefObject<HTMLHeadingElement>}
        className="project-hero-title"
      >
        {project.title}
      </h1>

      {/* Meta row: category + duration */}
      <div data-hero-meta className="project-hero-meta">
        <span className="project-hero-category">{project.category}</span>
        <span className="project-hero-divider" aria-hidden="true" />
        <span className="project-hero-duration">{totalWeeks} weeks</span>
      </div>

      {/* Description — velocity-responsive text */}
      <p
        data-hero-desc
        ref={descVelocityRef as React.RefObject<HTMLParagraphElement>}
        className="project-hero-description"
      >
        {project.shortDescription}
      </p>

      {/* Action buttons */}
      <div data-hero-buttons className="project-hero-buttons">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-hero-btn project-hero-btn--primary"
            style={{
              background: `rgba(${project.accentRgb}, 0.15)`,
              borderColor: `rgba(${project.accentRgb}, 0.3)`,
              color: project.accentColor,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-hero-btn project-hero-btn--secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Source Code
          </a>
        )}
      </div>

      {/* Hero visual — unique per project */}
      <div
        data-hero-visual
        className="project-hero-visual"
        aria-hidden="true"
      >
        <div
          className="project-hero-visual-orb project-hero-visual-orb--1"
          style={{
            background: `radial-gradient(circle, rgba(${project.accentRgb}, 0.25) 0%, transparent 70%)`,
          }}
        />
        <div
          className="project-hero-visual-orb project-hero-visual-orb--2"
          style={{
            background: `radial-gradient(circle, rgba(${project.accentRgb}, 0.15) 0%, transparent 70%)`,
          }}
        />
        <div
          className="project-hero-visual-orb project-hero-visual-orb--3"
          style={{
            background: `radial-gradient(circle, rgba(${project.accentRgb}, 0.1) 0%, transparent 70%)`,
          }}
        />
        <div className="project-hero-visual-grid" />
        <div
          className="project-hero-visual-glow"
          style={{
            background: `radial-gradient(ellipse at center, rgba(${project.accentRgb}, 0.08) 0%, transparent 60%)`,
          }}
        />
      </div>
    </section>
  );
}

// ============================================================================
// Overview
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
  useSectionReveal(sectionRef, reducedMotion);

  const goalRef = useScrambleDecode({ text: overview.goal });

  return (
    <section ref={sectionRef} className="project-section project-overview">
      <span data-reveal className="project-section-label">Overview</span>

      <h2 data-reveal ref={goalRef as React.RefObject<HTMLHeadingElement>} className="project-overview-statement">
        {overview.goal}
      </h2>

      <div className="project-overview-columns">
        <div data-reveal className="project-overview-col">
          <span className="project-overview-col-label">The Problem</span>
          <p className="project-overview-col-text">{overview.problem}</p>
        </div>
        <div data-reveal className="project-overview-col">
          <span className="project-overview-col-label">The Solution</span>
          <p className="project-overview-col-text">{overview.solution}</p>
        </div>
      </div>

      <div
        data-reveal
        className="project-section-divider"
        style={{ background: `linear-gradient(90deg, rgba(${accentRgb}, 0.4) 0%, transparent 100%)` }}
      />
    </section>
  );
}

// ============================================================================
// Key Decision — unique storytelling per project
// ============================================================================

function ProjectKeyDecision({
  decision,
  accentRgb,
  reducedMotion,
}: {
  decision: ProjectCaseStudy["keyDecision"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, reducedMotion);

  const questionRef = useScrambleDecode({ text: decision.question });

  return (
    <section ref={sectionRef} className="project-section project-key-decision">
      <span data-reveal className="project-section-label">Key Decision</span>

      <blockquote data-reveal className="project-key-decision-quote">
        <p ref={questionRef as React.RefObject<HTMLParagraphElement>} className="project-key-decision-question">{decision.question}</p>
      </blockquote>

      <div data-reveal className="project-key-decision-answer">
        <span className="project-key-decision-answer-label">Answer</span>
        <p className="project-key-decision-answer-text">{decision.answer}</p>
      </div>

      <div
        data-reveal
        className="project-key-decision-tradeoff"
        style={{ borderColor: `rgba(${accentRgb}, 0.2)` }}
      >
        <span className="project-key-decision-tradeoff-label">Tradeoff</span>
        <p className="project-key-decision-tradeoff-text">{decision.tradeoff}</p>
      </div>
    </section>
  );
}

// ============================================================================
// Role
// ============================================================================

function ProjectRole({
  role,
  accentRgb,
  reducedMotion,
}: {
  role: ProjectCaseStudy["role"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="project-section project-role">
      <span data-reveal className="project-section-label">Role & Responsibilities</span>

      <div className="project-role-list">
        {role.map((item, i) => (
          <div key={item.area} data-reveal className="project-role-item">
            <div className="project-role-index">
              <span
                className="project-role-index-number"
                style={{ color: `rgba(${accentRgb}, 0.5)` }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < role.length - 1 && (
                <div
                  className="project-role-line"
                  style={{ background: `rgba(${accentRgb}, 0.15)` }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="project-role-content">
              <h3 className="project-role-title">{item.area}</h3>
              <p className="project-role-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Tech Stack
// ============================================================================

function ProjectTechStack({
  techStack,
  reducedMotion,
}: {
  techStack: ProjectCaseStudy["techStack"];
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="project-section project-tech-stack">
      <span data-reveal className="project-section-label">Technology</span>

      <div className="project-tech-groups">
        {techStack.map((group) => (
          <div key={group.category} data-reveal className="project-tech-group">
            <span className="project-tech-group-label">{group.category}</span>
            <div className="project-tech-tags">
              {group.items.map((item) => (
                <span key={item} className="project-tech-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Process
// ============================================================================

function ProjectProcess({
  process,
  accentRgb,
  reducedMotion,
}: {
  process: ProjectCaseStudy["process"];
  accentRgb: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="project-section project-process">
      <span data-reveal className="project-section-label">Process</span>

      <div className="project-process-timeline">
        {process.map((step, i) => (
          <div key={step.phase} data-reveal className="project-process-step">
            <div className="project-process-marker">
              <div
                className="project-process-dot"
                style={{ background: `rgba(${accentRgb}, 0.6)` }}
              />
              {i < process.length - 1 && (
                <div
                  className="project-process-line"
                  style={{ background: `rgba(${accentRgb}, 0.12)` }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="project-process-content">
              <div className="project-process-header">
                <span className="project-process-phase">{step.phase}</span>
                <span className="project-process-duration">{step.duration}</span>
              </div>
              <h3 className="project-process-title">{step.title}</h3>
              <p className="project-process-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Results
// ============================================================================

function ProjectResults({
  results,
  accentColor,
  reducedMotion,
}: {
  results: ProjectCaseStudy["results"];
  accentColor: string;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, reducedMotion);

  return (
    <section ref={sectionRef} className="project-section project-results">
      <span data-reveal className="project-section-label">Impact</span>

      <div className="project-results-grid">
        {results.map((result) => (
          <div key={result.metric} data-reveal className="project-result-card">
            <span
              className="project-result-value"
              style={{ color: accentColor }}
            >
              {result.value}
            </span>
            <span className="project-result-metric">{result.metric}</span>
            <p className="project-result-desc">{result.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Next Project — uses data lookup, not hardcoded names
// ============================================================================

function ProjectNext({
  projectId,
  onNextProject,
  reducedMotion,
}: {
  projectId: string | null;
  onNextProject: (id: string) => void;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, reducedMotion);

  const nextProject = projectId ? getProjectById(projectId) : undefined;

  if (!projectId || !nextProject) return null;

  return (
    <section ref={sectionRef} className="project-section project-next">
      <div data-reveal className="project-next-label">
        <span className="project-section-label" style={{ marginBottom: 0 }}>Up Next</span>
      </div>

      <button
        type="button"
        data-reveal
        onClick={() => onNextProject(projectId)}
        className="project-next-card"
      >
        <div className="project-next-card-content">
          <span className="project-next-card-category">
            {nextProject.category}
          </span>
          <span className="project-next-card-title">
            {nextProject.title}
          </span>
        </div>
        <svg
          className="project-next-card-arrow"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </button>
    </section>
  );
}
