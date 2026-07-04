/**
 * Creative Universe — Multiverse World 03
 *
 * Not a tech demo collection. A creative developer laboratory.
 * Shows the actual decisions behind the portfolio's design.
 *
 * Three sections:
 * 1. Motion — Real entrance choreography with scrub timeline
 * 2. Interaction — The actual interaction patterns used
 * 3. Visual Language — Design tokens as a living system
 *
 * Every choice has a reason. Every reason is explained.
 */

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "@/landing/hooks";
import { WORLDS } from "@/content";
import { MultiverseNav } from "../multiverse-nav";
import { MultiverseBreadcrumbs } from "../multiverse-breadcrumbs";

// ============================================================================
// Section wrapper
// ============================================================================

const Section = memo(function Section({
  label,
  title,
  description,
  isExpanded,
  onToggle,
  children,
}: {
  label: string;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.killTweensOf(contentRef.current);
    if (isExpanded) {
      if (!reducedMotion) {
        gsap.fromTo(
          contentRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: ANIMATION_EASINGS.expoOut },
        );
      } else {
        contentRef.current.style.height = "auto";
        contentRef.current.style.opacity = "1";
      }
    } else if (!reducedMotion) {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: ANIMATION_EASINGS.expoIn,
      });
    }
  }, [isExpanded, reducedMotion]);

  return (
    <div
      style={{
        background: "rgba(245, 240, 232, 0.02)",
        border: `1px solid ${isExpanded ? "rgba(245, 240, 232, 0.08)" : "rgba(245, 240, 232, 0.04)"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left focus-visible:outline-none"
        style={{
          padding: "clamp(1.25rem, 2vw, 1.75rem)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        aria-expanded={isExpanded}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "rgba(201, 169, 110, 0.4)",
            display: "block",
            marginBottom: 8,
          }}
        >
          {label}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#f5f0e8",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8rem, 0.9vw, 0.88rem)",
            lineHeight: 1.6,
            color: "rgba(245, 240, 232, 0.4)",
            margin: 0,
          }}
        >
          {description}
        </p>
      </button>

      <div ref={contentRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "0 clamp(1.25rem, 2vw, 1.75rem) clamp(1.25rem, 2vw, 1.75rem)",
            borderTop: "1px solid rgba(245, 240, 232, 0.04)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// 1. MOTION — Real Entrance Choreography
// ============================================================================

interface TimelineStep {
  element: string;
  from: number;
  duration: number;
  ease: string;
  description: string;
}

const ENTRANCE_STEPS: readonly TimelineStep[] = [
  {
    element: "Preloader",
    from: 0,
    duration: 0.6,
    ease: "expoOut",
    description: "Counter fades. First thing user sees — must be instant, not heavy.",
  },
  {
    element: "Micro label",
    from: 0.7,
    duration: 0.7,
    ease: "expoOut",
    description: "Sets context before the name. Small, quiet, establishes hierarchy.",
  },
  {
    element: "Name",
    from: 0.82,
    duration: 0.9,
    ease: "expoOut",
    description: "The anchor. Slowest element — weight creates importance.",
  },
  {
    element: "Subtitle",
    from: 0.94,
    duration: 0.7,
    ease: "expoOut",
    description: "Appears after name is settled. Information follows presence.",
  },
  {
    element: "Scroll cue",
    from: 1.4,
    duration: 0.5,
    ease: "expoOut",
    description: "Last. Only appears after everything else is done. Never compete with content.",
  },
] as const;

function EntranceTimeline() {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);
  const reducedMotion = useReducedMotion();

  const activeStep = useMemo(() => {
    const currentTime = progress * 2;
    for (let i = ENTRANCE_STEPS.length - 1; i >= 0; i--) {
      const step = ENTRANCE_STEPS[i];
      if (step && currentTime >= step.from) return i;
    }
    return -1;
  }, [progress]);

  const play = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setProgress(0);
    const obj = { p: 0 };
    animRef.current = gsap.to(obj, {
      p: 1,
      duration: 2,
      ease: "none",
      onUpdate() {
        setProgress(obj.p);
      },
      onComplete() {
        setIsPlaying(false);
      },
    });
  }, [isPlaying]);

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    animRef.current?.kill();
    setIsPlaying(false);
    setProgress(Number.parseFloat(e.target.value));
  }, []);

  useEffect(
    () => () => {
      animRef.current?.kill();
    },
    [],
  );

  return (
    <div style={{ marginTop: 20 }}>
      {/* Scrub bar */}
      <div style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              color: "rgba(245, 240, 232, 0.3)",
              minWidth: 38,
            }}
          >
            {(progress * 2).toFixed(1)}s
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progress}
            onChange={handleScrub}
            aria-label="Timeline scrubber"
            style={{ flex: 1, height: 2, accentColor: "#C9A96E", cursor: "pointer" }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={play}
            disabled={isPlaying || reducedMotion}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: isPlaying || reducedMotion ? "rgba(245, 240, 232, 0.15)" : "#f5f0e8",
              padding: "6px 12px",
              borderRadius: 5,
              border: "1px solid rgba(245, 240, 232, 0.08)",
              background: "rgba(245, 240, 232, 0.03)",
              cursor: isPlaying || reducedMotion ? "not-allowed" : "pointer",
            }}
          >
            {isPlaying ? "Playing..." : reducedMotion ? "Reduced motion" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              animRef.current?.kill();
              setIsPlaying(false);
              setProgress(0);
            }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "rgba(245, 240, 232, 0.3)",
              padding: "6px 12px",
              borderRadius: 5,
              border: "1px solid rgba(245, 240, 232, 0.05)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Visual timeline */}
      <div ref={containerRef} style={{ marginBottom: 20 }}>
        {ENTRANCE_STEPS.map((step, i) => {
          const startTime = step.from / 2;
          const endTime = (step.from + step.duration) / 2;
          const isActive = i <= activeStep;
          const isCurrent = i === activeStep;

          return (
            <div
              key={step.element}
              className="flex items-start gap-3"
              style={{
                padding: "8px 0",
                borderBottom: "1px solid rgba(245, 240, 232, 0.03)",
                opacity: isActive ? 1 : 0.3,
                transition: "opacity 0.3s ease",
              }}
            >
              <div style={{ minWidth: 90, paddingTop: 2 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    fontWeight: 500,
                    color: isCurrent ? "#C9A96E" : "rgba(245, 240, 232, 0.3)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {step.element}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Bar */}
                <div style={{ position: "relative", height: 16, marginBottom: 4 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: `${String(startTime * 100)}%`,
                      width: `${String((endTime - startTime) * 100)}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: isCurrent
                        ? "rgba(201, 169, 110, 0.25)"
                        : isActive
                          ? "rgba(201, 169, 110, 0.1)"
                          : "rgba(245, 240, 232, 0.03)",
                      border: `1px solid ${isCurrent ? "rgba(201, 169, 110, 0.4)" : "rgba(245, 240, 232, 0.04)"}`,
                      transition: "background 0.3s ease, border-color 0.3s ease",
                    }}
                  />
                  {/* Playhead */}
                  {isCurrent && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${String(progress * 100)}%`,
                        top: -2,
                        width: 2,
                        height: 20,
                        background: "#C9A96E",
                        borderRadius: 1,
                        transform: "translateX(-1px)",
                      }}
                    />
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5rem",
                      color: "rgba(245, 240, 232, 0.2)",
                    }}
                  >
                    {String(step.from)}s — {String(step.from + step.duration)}s
                  </code>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5rem",
                      color: "rgba(201, 169, 110, 0.3)",
                    }}
                  >
                    {step.ease}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active step explanation */}
      {activeStep >= 0 && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(201, 169, 110, 0.04)",
            border: "1px solid rgba(201, 169, 110, 0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(201, 169, 110, 0.5)",
              display: "block",
              marginBottom: 4,
            }}
          >
            {ENTRANCE_STEPS[activeStep]?.element} — {ENTRANCE_STEPS[activeStep]?.duration}s
          </span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              lineHeight: 1.6,
              color: "rgba(245, 240, 232, 0.4)",
              margin: 0,
            }}
          >
            {ENTRANCE_STEPS[activeStep]?.description}
          </p>
        </div>
      )}

      <div
        style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(245, 240, 232, 0.04)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "rgba(245, 240, 232, 0.5)",
            margin: "0 0 4px",
          }}
        >
          Why this matters
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: "rgba(245, 240, 232, 0.3)",
            margin: 0,
          }}
        >
          The entrance isn&apos;t random. Each element has a specific timing, a specific ease, a
          specific reason. The name is slowest because it&apos;s most important. The scroll cue is
          last because it should never compete with content. Expo out decelerates naturally — like
          an object settling into place.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 2. INTERACTION — Real Patterns
// ============================================================================

interface InteractionPattern {
  name: string;
  code: string;
  description: string;
  why: string;
}

const INTERACTION_PATTERNS: readonly InteractionPattern[] = [
  {
    name: "Magnetic button",
    code: "threshold: 120px · strength: 0.35 · ease: power2.out",
    description:
      "Button follows cursor within threshold. Strength decreases with distance. Springs back with expo out.",
    why: "Proximity-based feedback. The interface responds to presence, not just clicks.",
  },
  {
    name: "Hover reveal",
    code: "opacity: 0 → 0.6 · y: 8px → 0 · duration: 0.4s",
    description:
      "Content appears on hover with upward drift. Never instant — the brain needs transition to register change.",
    why: "Hover states confirm interactivity. The drift upward feels like lifting a cover.",
  },
  {
    name: "Card parallax",
    code: "mousemove → x/y ±8px · scale: 1.04 · ease: power2.out",
    description:
      "Image follows cursor within card bounds. Subtle enough to feel natural, strong enough to notice.",
    why: "Differential motion creates depth. The card feels like a window, not a flat surface.",
  },
  {
    name: "Stagger entrance",
    code: "delay: 0.1 + i × 0.12 · ease: expoOut · y: 40 → 0",
    description:
      "Elements appear one by one with consistent delay. The rhythm creates anticipation.",
    why: "Staggered reveals guide the eye. Consistent timing creates visual rhythm.",
  },
] as const;

function InteractionShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div style={{ marginTop: 20 }}>
      <div className="flex flex-col gap-2">
        {INTERACTION_PATTERNS.map((pattern, i) => (
          <div
            key={pattern.name}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              padding: "14px 16px",
              borderRadius: 8,
              background: hoveredIndex === i ? "rgba(245, 240, 232, 0.03)" : "transparent",
              border: `1px solid ${hoveredIndex === i ? "rgba(245, 240, 232, 0.08)" : "rgba(245, 240, 232, 0.03)"}`,
              transition: "all 0.3s ease",
              cursor: "default",
            }}
          >
            <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: hoveredIndex === i ? "#f5f0e8" : "rgba(245, 240, 232, 0.6)",
                  transition: "color 0.3s ease",
                }}
              >
                {pattern.name}
              </span>
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  color: "rgba(201, 169, 110, 0.35)",
                  flexShrink: 0,
                }}
              >
                {pattern.code}
              </code>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                lineHeight: 1.55,
                color: "rgba(245, 240, 232, 0.35)",
                margin: "0 0 4px",
              }}
            >
              {pattern.description}
            </p>
            {hoveredIndex === i && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  lineHeight: 1.5,
                  color: "rgba(201, 169, 110, 0.4)",
                  margin: 0,
                }}
              >
                {pattern.why}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(245, 240, 232, 0.04)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "rgba(245, 240, 232, 0.5)",
            margin: "0 0 4px",
          }}
        >
          Why this matters
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: "rgba(245, 240, 232, 0.3)",
            margin: 0,
          }}
        >
          Every interaction has a reason. Magnetic buttons create physical connection. Hover reveals
          confirm interactivity. Card parallax adds depth. Staggered entrances guide the eye. None
          of them are decoration — they&apos;re communication.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 3. VISUAL LANGUAGE — Living System
// ============================================================================

const COLOR_PALETTE = [
  { name: "Background", value: "#080706", usage: "Canvas. The void." },
  { name: "Surface", value: "#0d0c0a", usage: "Cards, elevated elements." },
  { name: "Text", value: "#f5f0e8", usage: "Primary content. Warm white." },
  { name: "Gold", value: "#C9A96E", usage: "Accent. Labels, highlights." },
  { name: "Muted", value: "#737373", usage: "Secondary text, descriptions." },
  { name: "Subtle", value: "#a3a3a3", usage: "Borders, faint elements." },
] as const;

const TYPE_ENTRIES = [
  {
    name: "Space Grotesk",
    role: "Headings",
    trait: "Geometric. Technical. Clean.",
    sample: "Taha Mahmoud",
  },
  {
    name: "Inter",
    role: "Body",
    trait: "Neutral. Readable. Invisible.",
    sample: "Frontend developer focused on React and interfaces that feel right.",
  },
  {
    name: "JetBrains Mono",
    role: "Labels",
    trait: "Monospace. Technical. Precise.",
    sample: "01 — Architecture",
  },
] as const;

function VisualLanguageSection() {
  return (
    <div style={{ marginTop: 20 }}>
      {/* Color palette */}
      <div style={{ marginBottom: 24 }}>
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
          Color palette
        </span>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
        >
          {COLOR_PALETTE.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3"
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background: "rgba(245, 240, 232, 0.02)",
                border: "1px solid rgba(245, 240, 232, 0.04)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  background: c.value,
                  border: "1px solid rgba(245, 240, 232, 0.06)",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "rgba(245, 240, 232, 0.5)",
                    }}
                  >
                    {c.name}
                  </span>
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.5rem",
                      color: "rgba(245, 240, 232, 0.2)",
                    }}
                  >
                    {c.value}
                  </code>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    color: "rgba(245, 240, 232, 0.25)",
                  }}
                >
                  {c.usage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={{ marginBottom: 24 }}>
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
          Typography
        </span>
        <div className="flex flex-col gap-3">
          {TYPE_ENTRIES.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: "rgba(245, 240, 232, 0.02)",
                border: "1px solid rgba(245, 240, 232, 0.04)",
              }}
            >
              <div
                className="flex items-baseline justify-between gap-3"
                style={{ marginBottom: 4 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "rgba(245, 240, 232, 0.5)",
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.5rem",
                    color: "rgba(201, 169, 110, 0.35)",
                  }}
                >
                  {t.role}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  color: "rgba(245, 240, 232, 0.3)",
                  margin: "0 0 6px",
                }}
              >
                {t.trait}
              </p>
              <p
                style={{
                  fontFamily:
                    t.name === "Space Grotesk"
                      ? "var(--font-display)"
                      : t.name === "JetBrains Mono"
                        ? "var(--font-mono)"
                        : "var(--font-body)",
                  fontSize:
                    t.name === "Space Grotesk"
                      ? "1.1rem"
                      : t.name === "JetBrains Mono"
                        ? "0.7rem"
                        : "0.85rem",
                  fontWeight:
                    t.name === "Space Grotesk" ? 600 : t.name === "JetBrains Mono" ? 500 : 400,
                  color: "rgba(245, 240, 232, 0.4)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {t.sample}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
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
          Spacing — 4px grid
        </span>
        <div className="flex flex-wrap items-end gap-3">
          {[4, 8, 12, 16, 24, 32, 48, 64].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              <div
                style={{
                  width: Math.min(s, 64),
                  height: s,
                  borderRadius: 2,
                  background: "rgba(201, 169, 110, 0.12)",
                }}
              />
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  color: "rgba(245, 240, 232, 0.2)",
                }}
              >
                {String(s)}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(245, 240, 232, 0.04)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "rgba(245, 240, 232, 0.5)",
            margin: "0 0 4px",
          }}
        >
          Why this matters
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: "rgba(245, 240, 232, 0.3)",
            margin: 0,
          }}
        >
          Every color has a role. Every font has a personality. Every space follows a grid. The
          system isn&apos;t constraint — it&apos;s the foundation that makes creative decisions
          faster. When the rules are clear, you can break them intentionally.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function CreativeUniversePage() {
  const world = WORLDS.find((w) => w.id === "creative")!;
  const reducedMotion = useReducedMotion();
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
      <MultiverseNav worldNumber="03" worldName="Creative" />

      {/* Content */}
      <div
        ref={headerRef}
        style={{
          maxWidth: 800,
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

        {/* Sections */}
        <div className="flex flex-col gap-3">
          <Section
            label="01 — Motion"
            title="Entrance Choreography"
            description="The real timing, eases, and reasoning behind the hero entrance."
            isExpanded={expandedId === "motion"}
            onToggle={() => handleToggle("motion")}
          >
            <EntranceTimeline />
          </Section>

          <Section
            label="02 — Interaction"
            title="Interaction Patterns"
            description="The actual micro-interactions used. Each one has a reason."
            isExpanded={expandedId === "interaction"}
            onToggle={() => handleToggle("interaction")}
          >
            <InteractionShowcase />
          </Section>

          <Section
            label="03 — Visual Language"
            title="Design System"
            description="Colors, typography, and spacing. The system behind every visual decision."
            isExpanded={expandedId === "visual"}
            onToggle={() => handleToggle("visual")}
          >
            <VisualLanguageSection />
          </Section>
        </div>

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
          Click any section to expand.{" "}
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

      <MultiverseBreadcrumbs currentWorldId="creative" />
    </section>
  );
}
