/**
 * Code Universe — Multiverse World 02
 *
 * An honest technical reference. No fake diagrams.
 * Shows the real architecture with real file paths and real metrics.
 *
 * Desktop: 2-column card grid. Click expands detail panel (slide-in from right).
 * Mobile: stacked cards. Click expands inline.
 *
 * No decorative gradients. No glow effects. No fake metaphors.
 * The architecture IS the content.
 *
 * Reduced motion: no animations, instant state changes.
 */

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "@/landing/hooks";
import { useIsMobile } from "@/hooks";
import { WORLDS } from "@/content";
import { MultiverseNav } from "../multiverse-nav";
import { MultiverseBreadcrumbs } from "../multiverse-breadcrumbs";

interface SystemCard {
  id: string;
  label: string;
  tagline: string;
  stats: readonly { label: string; value: string }[];
  files: readonly string[];
  description: string;
  decisions: readonly { label: string; detail: string }[];
}

const SYSTEMS: readonly SystemCard[] = [
  {
    id: "components",
    label: "Components",
    tagline: "46 UI primitives. 10 categories. Composition, not inheritance.",
    stats: [
      { label: "Primitives", value: "46" },
      { label: "Categories", value: "10" },
      { label: "Landing", value: "28" },
    ],
    files: ["src/components/ui/", "src/landing/components/", "src/components/shared/"],
    description:
      "46 UI components organized into 10 categories: actions, core, display, feedback, forms, layout, navigation, overlay, state, shared. 28 landing-specific components. cn() utility combining clsx + tailwind-merge.",
    decisions: [
      {
        label: "Why composition",
        detail:
          'Components compose. They don\'t extend. <Button variant="ghost"> over class inheritance.',
      },
      {
        label: "Why tailwind-merge",
        detail: "Tailwind classes conflict. tailwind-merge resolves precedence automatically.",
      },
      {
        label: "Why separate landing",
        detail:
          "Landing components are page-specific. UI primitives are shared. Different change cadences.",
      },
    ],
  },
  {
    id: "motion",
    label: "Motion",
    tagline: "GSAP with 6 plugins. 24 hooks. 24 presets. Every motion justified.",
    stats: [
      { label: "Files", value: "76" },
      { label: "Hooks", value: "24" },
      { label: "Presets", value: "24" },
    ],
    files: [
      "src/animation/hooks/",
      "src/animation/presets/",
      "src/animation/gsap-setup.ts",
      "src/animation/scroll/",
    ],
    description:
      "GSAP with ScrollTrigger, SplitText, Flip, ScrambleTextPlugin, MotionPathPlugin, Observer. 24 animation hooks (reveal, parallax, stagger, split-text, magnetic, clip-path). 24 reusable presets. Single gsap-setup.ts registers all plugins.",
    decisions: [
      {
        label: "Why GSAP over Framer Motion",
        detail:
          "GSAP handles complex sequenced timelines. Framer Motion is better for simple enter/exit. This project needs both.",
      },
      {
        label: "Why presets",
        detail:
          "Motion patterns repeat. Presets ensure consistency. Change once, update everywhere.",
      },
      {
        label: "Why hooks",
        detail:
          "Each hook encapsulates one animation pattern. useParallax, useStagger, useReveal. Composable, not monolithic.",
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    tagline: "Zustand stores. Design tokens. Persist middleware. Clean separation.",
    stats: [
      { label: "Stores", value: "5" },
      { label: "Providers", value: "8" },
      { label: "Tokens", value: "11" },
    ],
    files: ["src/store/", "src/providers/", "src/theme/tokens/", "src/engine/theme/"],
    description:
      "5 Zustand stores (world, UI, theme, settings, app). 8 providers (accessibility, Lenis, theme, engine). 11 design token categories (color, typography, spacing, radius, elevation, motion, border, opacity, size, grid, z-index). CSS variable generator for per-world theming.",
    decisions: [
      {
        label: "Why Zustand",
        detail:
          "Minimal API. No boilerplate. One function to create a store. No providers needed (but we use them for nesting).",
      },
      {
        label: "Why tokens over hard-coded",
        detail:
          "11 token categories. Change one value, update the entire system. Theme switching becomes swapping token sets.",
      },
      {
        label: "Why persist middleware",
        detail: "User preferences (theme, sound, locale) survive page refresh. One line of config.",
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    tagline: "Lazy routes. Manual chunks. Hidden sourcemaps. Build target ES2022.",
    stats: [
      { label: "Lazy Routes", value: "6" },
      { label: "Vendor Chunks", value: "3" },
      { label: "Main Bundle", value: "125 kB" },
    ],
    files: ["src/router/routes.tsx", "vite.config.ts", "tsconfig.json"],
    description:
      "6 lazy-loaded route chunks. 3 manual vendor bundles (React, Animation, Three.js). ES2022 build target. Hidden sourcemaps in production. Prefetch on hover for instant navigation.",
    decisions: [
      {
        label: "Why manual chunks",
        detail:
          "vendor-react (45 kB), vendor-animation (187 kB), vendor-three (1,061 kB). Each loads only when needed.",
      },
      {
        label: "Why ES2022",
        detail:
          "Modern browsers only. Smaller output. No unnecessary polyfills. Target audience uses modern browsers.",
      },
      {
        label: "Why hidden sourcemaps",
        detail: "Sourcemaps for debugging in dev. Hidden in prod — not exposed to users.",
      },
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    tagline: "Skip link. Focus trap. Arrow navigation. Reduced motion at every layer.",
    stats: [
      { label: "Skip Link", value: "Yes" },
      { label: "Focus Trap", value: "Yes" },
      { label: "ARIA", value: "Full" },
    ],
    files: [
      "src/engine/navigation/accessibility.tsx",
      "src/providers/accessibility-provider/",
      "src/hooks/use-accessibility.ts",
    ],
    description:
      "Skip link targeting #main-content. Navigation announcer with aria-live regions. Focus trap with Tab/Shift+Tab cycling and focus restoration. Arrow key navigation with Home/End. CSS + JS reduced motion detection at three layers.",
    decisions: [
      {
        label: "Why three reduced-motion layers",
        detail:
          "CSS (motion tokens → 0ms), JS provider (detects preference), hooks (each animation checks before running). Defense in depth.",
      },
      {
        label: "Why focus restoration",
        detail:
          "Trapping focus is easy. Returning it to the right element after closing is the hard part. Our trap handles both.",
      },
      {
        label: "Why aria-live for routes",
        detail:
          "Screen readers don't know the page changed. NavigationAnnouncer tells them. One line, big impact.",
      },
    ],
  },
] as const;

// ============================================================================
// System Card (desktop)
// ============================================================================

const SystemCardDesktop = memo(function SystemCardDesktop({
  system,
  isExpanded,
  onToggle,
}: {
  system: SystemCard;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!expandedRef.current) return;
    gsap.killTweensOf(expandedRef.current);
    if (isExpanded) {
      if (!reducedMotion) {
        gsap.fromTo(
          expandedRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: ANIMATION_EASINGS.expoOut },
        );
      } else {
        expandedRef.current.style.height = "auto";
        expandedRef.current.style.opacity = "1";
      }
    } else if (!reducedMotion) {
      gsap.to(expandedRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: ANIMATION_EASINGS.expoIn,
      });
    }
  }, [isExpanded, reducedMotion]);

  return (
    <div
      ref={cardRef}
      className="group"
      style={{
        background: "rgba(245, 240, 232, 0.02)",
        border: `1px solid ${isExpanded ? "rgba(245, 240, 232, 0.08)" : "rgba(245, 240, 232, 0.04)"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        cursor: "pointer",
      }}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        onClick={() => onToggle(system.id)}
        className="w-full text-left focus-visible:outline-none"
        style={{
          padding: "clamp(1.25rem, 2vw, 1.75rem)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        aria-expanded={isExpanded}
        aria-label={`${system.label} — ${system.tagline}`}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#f5f0e8",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          {system.label}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.78rem, 0.85vw, 0.85rem)",
            lineHeight: 1.6,
            color: "rgba(245, 240, 232, 0.4)",
            margin: "0 0 14px",
          }}
        >
          {system.tagline}
        </p>
        <div className="flex gap-5">
          {system.stats.map((stat) => (
            <div key={stat.label}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(245, 240, 232, 0.2)",
                }}
              >
                {stat.label}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#f5f0e8",
                  margin: "1px 0 0",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </button>

      {/* Expanded detail */}
      <div ref={expandedRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "0 clamp(1.25rem, 2vw, 1.75rem) clamp(1.25rem, 2vw, 1.75rem)",
            borderTop: "1px solid rgba(245, 240, 232, 0.04)",
          }}
        >
          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.8rem, 0.9vw, 0.88rem)",
              lineHeight: 1.7,
              color: "rgba(245, 240, 232, 0.45)",
              margin: "16px 0",
            }}
          >
            {system.description}
          </p>

          {/* File paths */}
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "rgba(245, 240, 232, 0.2)",
                display: "block",
                marginBottom: 8,
              }}
            >
              File paths
            </span>
            <div className="flex flex-wrap gap-1.5">
              {system.files.map((file) => (
                <code
                  key={file}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "rgba(245, 240, 232, 0.4)",
                    padding: "3px 7px",
                    borderRadius: 4,
                    background: "rgba(245, 240, 232, 0.03)",
                    border: "1px solid rgba(245, 240, 232, 0.04)",
                  }}
                >
                  {file}
                </code>
              ))}
            </div>
          </div>

          {/* Decisions */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "rgba(245, 240, 232, 0.2)",
                display: "block",
                marginBottom: 10,
              }}
            >
              Key decisions
            </span>
            <div className="flex flex-col gap-3">
              {system.decisions.map((d) => (
                <div key={d.label}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "rgba(245, 240, 232, 0.6)",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    {d.label}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      lineHeight: 1.55,
                      color: "rgba(245, 240, 232, 0.32)",
                      margin: 0,
                    }}
                  >
                    {d.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard hint */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              letterSpacing: "0.1em",
              color: "rgba(245, 240, 232, 0.1)",
              marginTop: 20,
            }}
          >
            <kbd
              style={{
                padding: "0.15em 0.4em",
                borderRadius: 3,
                border: "1px solid rgba(245, 240, 232, 0.06)",
                marginRight: "0.3em",
              }}
            >
              Esc
            </kbd>
            to collapse
          </p>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// System Card (mobile)
// ============================================================================

const SystemCardMobile = memo(function SystemCardMobile({
  system,
  isExpanded,
  onToggle,
}: {
  system: SystemCard;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) {
  const expandedRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!expandedRef.current) return;
    gsap.killTweensOf(expandedRef.current);
    if (isExpanded) {
      if (!reducedMotion) {
        gsap.fromTo(
          expandedRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: ANIMATION_EASINGS.expoOut },
        );
      } else {
        expandedRef.current.style.height = "auto";
        expandedRef.current.style.opacity = "1";
      }
    } else if (!reducedMotion) {
      gsap.to(expandedRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: ANIMATION_EASINGS.expoIn,
      });
    }
  }, [isExpanded, reducedMotion]);

  return (
    <div
      style={{
        background: "rgba(245, 240, 232, 0.02)",
        border: `1px solid ${isExpanded ? "rgba(245, 240, 232, 0.08)" : "rgba(245, 240, 232, 0.04)"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(system.id)}
        className="w-full flex items-center justify-between text-left focus-visible:outline-none"
        style={{
          padding: "1rem 1.25rem",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        aria-expanded={isExpanded}
      >
        <div className="min-w-0 flex-1">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f5f0e8",
              margin: "0 0 3px",
              lineHeight: 1.2,
            }}
          >
            {system.label}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              color: "rgba(245, 240, 232, 0.35)",
              margin: 0,
            }}
          >
            {system.tagline}
          </p>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: "rgba(245, 240, 232, 0.2)",
            transform: isExpanded ? "rotate(180deg)" : "none",
            transition: "transform 0.3s ease",
            flexShrink: 0,
            marginLeft: 12,
          }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div ref={expandedRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              lineHeight: 1.65,
              color: "rgba(245, 240, 232, 0.4)",
              margin: "0 0 12px",
            }}
          >
            {system.description}
          </p>

          <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 14 }}>
            {system.files.map((file) => (
              <code
                key={file}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  color: "rgba(245, 240, 232, 0.35)",
                  padding: "2px 6px",
                  borderRadius: 3,
                  background: "rgba(245, 240, 232, 0.03)",
                }}
              >
                {file}
              </code>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {system.decisions.map((d) => (
              <div key={d.label}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "rgba(245, 240, 232, 0.5)",
                  }}
                >
                  {d.label}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    lineHeight: 1.5,
                    color: "rgba(245, 240, 232, 0.28)",
                    margin: "1px 0 0",
                  }}
                >
                  {d.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// Page
// ============================================================================

export default function CodeUniversePage() {
  const world = WORLDS.find((w) => w.id === "code")!;
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedId) {
        e.preventDefault();
        setExpandedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId]);

  return (
    <section className="relative" style={{ background: "#050507", minHeight: "100vh" }}>
      <MultiverseNav worldNumber="02" worldName="Code" />

      {/* Content */}
      <div
        ref={headerRef}
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "clamp(6rem, 12vh, 10rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vh, 5rem)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <span
            data-animate
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.5rem, 0.6vw, 0.6rem)",
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              color: "rgba(96, 165, 250, 0.4)",
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
              maxWidth: 520,
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            {world.sectionDescription}
          </p>
        </div>

        {/* Cards — render only the needed variant */}
        {isMobile ? (
          <div className="flex flex-col gap-2">
            {SYSTEMS.map((system) => (
              <SystemCardMobile
                key={system.id}
                system={system}
                isExpanded={expandedId === system.id}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {SYSTEMS.map((system) => (
              <SystemCardDesktop
                key={system.id}
                system={system}
                isExpanded={expandedId === system.id}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* Hint */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            color: "rgba(245, 240, 232, 0.12)",
            marginTop: "clamp(2rem, 4vw, 3rem)",
            textAlign: "center",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          Click any card to expand.{" "}
          <kbd
            style={{
              padding: "0.15em 0.4em",
              borderRadius: 3,
              border: "1px solid rgba(245, 240, 232, 0.06)",
              marginRight: "0.2em",
            }}
          >
            Esc
          </kbd>
          to collapse
        </p>
      </div>

      <MultiverseBreadcrumbs currentWorldId="code" />
    </section>
  );
}
