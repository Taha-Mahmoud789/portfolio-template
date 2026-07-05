/**
 * Project Card — Premium Glassmorphism Information Panel
 *
 * Apple Vision Pro inspired design:
 * - Dark transparent background
 * - Blur effect
 * - Thin border
 * - Soft glow
 *
 * Shows real project information when entering a planet.
 */

import { useEffect, useState } from "react";

// ============================================================================
// Project Data
// ============================================================================

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  role: readonly string[];
  tech: readonly string[];
  website: string;
  accentColor: string;
}

export const PROJECTS: Record<string, ProjectData> = {
  "project-over-benefits": {
    id: "project-over-benefits",
    title: "Over Benefits",
    category: "Corporate Business Website",
    description:
      "A modern business platform built to present services, improve brand presence, and deliver a smooth responsive experience across all devices.",
    role: [
      "Frontend Development",
      "UI Implementation",
      "Responsive Experience",
      "Performance Optimization",
    ],
    tech: ["HTML5", "CSS3", "Bootstrap", "JavaScript", "jQuery", "PHP"],
    website: "https://www.overbenefits.net/",
    accentColor: "#3b82f6",
  },
  "project-mts-med": {
    id: "project-mts-med",
    title: "MTS MED",
    category: "Medical E-Commerce Platform",
    description:
      "An online medical equipment store focused on product management, smooth shopping experience, and scalable e-commerce operations.",
    role: ["Website Development", "E-Commerce Setup", "UI Customization", "SEO Optimization"],
    tech: ["WordPress", "WooCommerce", "Elementor", "PHP", "JavaScript", "CSS3"],
    website: "https://mtsmed-eg.com/",
    accentColor: "#ef4444",
  },
  "project-el-hady-law": {
    id: "project-el-hady-law",
    title: "El-Hady Law Firm",
    category: "Legal Corporate Website",
    description:
      "A professional law firm platform designed to showcase legal services, improve client communication, and support multilingual content.",
    role: ["Website Development", "Content Structure", "Responsive Design", "SEO Improvements"],
    tech: ["WordPress", "Elementor", "PHP", "JavaScript", "CSS3", "SEO"],
    website: "https://elhady-lawfirm.com/",
    accentColor: "#8b5cf6",
  },
};

// ============================================================================
// Component
// ============================================================================

interface ProjectCardProps {
  readonly projectId: string;
  readonly isVisible: boolean;
  readonly onBack: () => void;
}

export function ProjectCard({ projectId, isVisible, onBack }: ProjectCardProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const project = PROJECTS[projectId];

  useEffect(() => {
    if (isVisible && project) {
      // Delay before showing card
      const renderTimer = setTimeout(() => {
        setShouldRender(true);
        // Start animation after render
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true);
          });
        });
      }, 500);

      return () => clearTimeout(renderTimer);
    } else {
      // Animate out
      setIsAnimating(false);
      const hideTimer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(hideTimer);
    }
  }, [isVisible, project]);

  if (!project || !shouldRender) return null;

  return (
    <div
      className="pointer-events-auto absolute left-6 bottom-6 z-20 md:left-8 md:bottom-8"
      style={{
        width: "min(380px, calc(100vw - 48px))",
        opacity: isAnimating ? 1 : 0,
        transform: `translateY(${String(isAnimating ? 0 : 30)}px)`,
        transition:
          "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Glassmorphism card */}
      <div
        style={{
          background: "rgba(12, 14, 20, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 24px 48px -12px rgba(0, 0, 0, 0.5),
            0 0 80px -20px ${project.accentColor}15
          `,
          padding: "28px",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: `linear-gradient(180deg, ${project.accentColor}08 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.03)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "rgba(255, 255, 255, 0.4)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            marginBottom: "20px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)";
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.5 2.5L4 6l3.5 3.5" />
          </svg>
          Solar System
        </button>

        {/* Category */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: project.accentColor,
              boxShadow: `0 0 12px ${project.accentColor}60`,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.35)",
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "26px",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: "rgba(255, 255, 255, 0.92)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: 1.7,
            color: "rgba(255, 255, 255, 0.45)",
            marginTop: "12px",
          }}
        >
          {project.description}
        </p>

        {/* Role */}
        <div style={{ marginTop: "20px" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.25)",
              display: "block",
              marginBottom: "8px",
            }}
          >
            My Role
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {project.role.map((r) => (
              <span
                key={r}
                style={{
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginTop: "16px" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.25)",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Tech Stack
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  background: `${project.accentColor}10`,
                  border: `1px solid ${project.accentColor}20`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  color: `${project.accentColor}cc`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Visit Website Button */}
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "24px",
            padding: "10px 20px",
            borderRadius: "9999px",
            background: project.accentColor,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: "#ffffff",
            textDecoration: "none",
            transition: "all 0.2s ease",
            boxShadow: `0 4px 16px ${project.accentColor}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 6px 24px ${project.accentColor}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 16px ${project.accentColor}30`;
          }}
        >
          Visit Website
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 8.5l5-5M4 3.5h4.5V8" />
          </svg>
        </a>
      </div>
    </div>
  );
}
