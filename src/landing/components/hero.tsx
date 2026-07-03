/**
 * Hero — TRIONN-inspired premium hero
 *
 * Ultra-clean dark aesthetic. Large display typography with
 * character-by-character SplitText reveal. Minimal motion, maximum impact.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Constants
// ============================================================================

const TIMING = {
  eyebrowDelay: 0.2,
  eyebrowDuration: 0.5,
  charDuration: 0.5,
  charStagger: 0.025,
  lineGap: 0.3,
  subtitleDuration: 0.6,
  ctaDuration: 0.5,
  ctaStagger: 0.1,
  scrollDelay: 0.8,
} as const;

const COLORS = {
  bg: "#040508",
  title: "rgba(255, 255, 255, 0.95)",
  subtitle: "rgba(216, 216, 216, 0.5)",
  eyebrow: "rgba(216, 216, 216, 0.35)",
} as const;

// ============================================================================
// CTAPrimary
// ============================================================================

function CTAPrimary({ label, onClick }: { label: string; onClick: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      boxShadow: "0 0 30px rgba(255, 255, 255, 0.06), 0 0 60px rgba(255, 255, 255, 0.02)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      duration: 0.35,
      ease: ANIMATION_EASINGS.expoOut,
      overwrite: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
      borderColor: "rgba(255, 255, 255, 0.12)",
      duration: 0.4,
      ease: ANIMATION_EASINGS.expoOut,
      overwrite: true,
    });
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, { scale: 0.96, duration: 0.12, ease: "power2.in", overwrite: true });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      scale: 1,
      duration: 0.5,
      ease: ANIMATION_EASINGS.elastic,
      overwrite: true,
    });
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "clamp(0.875rem, 2vw, 1.1rem) clamp(2rem, 4vw, 3.25rem)",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "#ffffff",
        background: "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 100,
        cursor: "pointer",
        whiteSpace: "nowrap" as const,
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
      }}
      aria-label={label}
    >
      {label}
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ transition: "transform 0.3s ease" }}
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ============================================================================
// CTASecondary
// ============================================================================

function CTASecondary({ label, onClick }: { label: string; onClick: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      background: "rgba(255, 255, 255, 0.04)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      duration: 0.3,
      ease: ANIMATION_EASINGS.expoOut,
      overwrite: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      background: "transparent",
      borderColor: "rgba(255, 255, 255, 0.1)",
      duration: 0.3,
      ease: ANIMATION_EASINGS.expoOut,
      overwrite: true,
    });
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "clamp(0.875rem, 2vw, 1.1rem) clamp(2rem, 4vw, 3.25rem)",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "rgba(216, 216, 216, 0.6)",
        background: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 100,
        cursor: "pointer",
        whiteSpace: "nowrap" as const,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease",
      }}
      aria-label={label}
    >
      {label}
    </button>
  );
}

// ============================================================================
// ScrollIndicator — minimal refined mouse icon
// ============================================================================

function ScrollIndicator({
  reducedMotion,
  onClick,
}: {
  reducedMotion: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Scroll to next section"
      className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
      style={{
        position: "absolute",
        bottom: "clamp(2rem, 4vh, 3rem)",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        zIndex: 2,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 8,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          color: "rgba(216, 216, 216, 0.3)",
          letterSpacing: "0.3em",
          textTransform: "uppercase" as const,
        }}
      >
        Scroll
      </span>
      <svg
        width="18"
        height="28"
        viewBox="0 0 18 28"
        fill="none"
        aria-hidden="true"
        style={{
          animation: reducedMotion ? "none" : "hero-breathe-mouse 2.5s ease-in-out infinite",
        }}
      >
        <rect
          x="1"
          y="1"
          width="16"
          height="26"
          rx="8"
          stroke="rgba(216, 216, 216, 0.2)"
          strokeWidth="1"
        />
        <circle cx="9" cy="9" r="1.5" fill="rgba(216, 216, 216, 0.35)">
          {reducedMotion ? null : (
            <animate attributeName="cy" values="7;15;7" dur="2.5s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
    </button>
  );
}

// ============================================================================
// Hero
// ============================================================================

interface HeroProps {
  isVisible: boolean;
  onExploreWorlds?: () => void;
}

export function Hero({ isVisible, onExploreWorlds }: HeroProps) {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // ── Entrance animation ──────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    if (reducedMotion) {
      [eyebrowRef, titleLine1Ref, titleLine2Ref, subtitleRef, ctaRef, scrollRef].forEach(
        (ref) => {
          if (ref.current) ref.current.style.opacity = "1";
        },
      );
      return;
    }

    const tl = gsap.timeline();

    // Eyebrow
    if (eyebrowRef.current) {
      tl.fromTo(
        eyebrowRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: TIMING.eyebrowDuration, ease: ANIMATION_EASINGS.expoOut },
        TIMING.eyebrowDelay,
      );
    }

    // Title line 1 — "FRONTEND"
    if (titleLine1Ref.current) {
      const chars = titleLine1Ref.current.querySelectorAll<HTMLElement>("[data-char]");
      tl.fromTo(
        titleLine1Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        TIMING.eyebrowDelay + 0.15,
      );
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 60, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: TIMING.charDuration,
            stagger: { each: TIMING.charStagger, from: "start" },
            ease: ANIMATION_EASINGS.expoOut,
          },
          "<0.1",
        );
      }
    }

    // Title line 2 — "MULTIVERSE"
    if (titleLine2Ref.current) {
      const chars = titleLine2Ref.current.querySelectorAll<HTMLElement>("[data-char]");
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 60, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: TIMING.charDuration,
            stagger: { each: TIMING.charStagger, from: "start" },
            ease: ANIMATION_EASINGS.expoOut,
          },
          `-=${String(TIMING.lineGap)}`,
        );
      }
    }

    // Subtitle
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: TIMING.subtitleDuration, ease: ANIMATION_EASINGS.expoOut },
        "-=0.35",
      );
    }

    // CTA
    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll<HTMLElement>("button");
      tl.fromTo(
        ctaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        "-=0.25",
      );
      if (buttons.length > 0) {
        tl.fromTo(
          buttons,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: TIMING.ctaDuration,
            stagger: TIMING.ctaStagger,
            ease: ANIMATION_EASINGS.expoOut,
          },
          "-=0.2",
        );
      }
    }

    // Scroll indicator
    if (scrollRef.current) {
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" },
        `+=${String(TIMING.scrollDelay)}`,
      );
    }

    return () => {
      tl.kill();
      hasAnimated.current = false;
    };
  }, [isVisible, reducedMotion]);

  // ── Callbacks ───────────────────────────────────────────────────────
  const scrollToProjects = useCallback(() => {
    scrollTo("#projects");
  }, [scrollTo]);

  const handleExploreWorlds = useCallback(() => {
    onExploreWorlds?.();
  }, [onExploreWorlds]);

  const scrollToNext = useCallback(() => {
    scrollTo("#about");
  }, [scrollTo]);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <section
      id="hero"
      aria-label="Frontend Multiverse — Hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: COLORS.bg,
      }}
    >
      {/* Content */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 11rem) clamp(1.5rem, 5vw, 6rem) clamp(4rem, 8vh, 8rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.6875rem, 0.8vw, 0.8125rem)",
            fontWeight: 400,
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            color: COLORS.eyebrow,
            marginBottom: "clamp(1.25rem, 2.5vw, 2rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          Frontend Developer
        </div>

        {/* Headline */}
        <h1
          style={{
            margin: 0,
            padding: 0,
            fontWeight: 600,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            textAlign: "left",
            perspective: 800,
          }}
        >
          {/* Line 1 — FRONTEND */}
          <div
            ref={titleLine1Ref}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              color: COLORS.title,
              opacity: reducedMotion ? 1 : 0,
              display: "flex",
              flexWrap: "wrap",
              transformOrigin: "bottom center",
            }}
            aria-label="FRONTEND"
          >
            {"FRONTEND".split("").map((char, i) => (
              <span
                key={`l1-${String(i)}`}
                data-char
                style={{
                  display: "inline-block",
                  transformOrigin: "bottom center",
                  backfaceVisibility: "hidden",
                }}
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </div>

          {/* Line 2 — MULTIVERSE */}
          <div
            ref={titleLine2Ref}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(4.5rem, 14vw, 11rem)",
              opacity: reducedMotion ? 1 : 0,
              display: "flex",
              flexWrap: "wrap",
              marginTop: "clamp(-0.25rem, -0.8vw, -0.75rem)",
              lineHeight: 0.88,
              transformOrigin: "top center",
              background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(216,216,216,0.7) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            aria-label="MULTIVERSE"
          >
            {"MULTIVERSE".split("").map((char, i) => (
              <span
                key={`l2-${String(i)}`}
                data-char
                style={{
                  display: "inline-block",
                  transformOrigin: "top center",
                  backfaceVisibility: "hidden",
                }}
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </div>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            margin: 0,
            marginTop: "clamp(1.75rem, 3.5vw, 2.75rem)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
            fontWeight: 400,
            lineHeight: 1.7,
            color: COLORS.subtitle,
            letterSpacing: "0.01em",
            maxWidth: "clamp(340px, 40vw, 480px)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          I build fast, accessible web applications with React and
          TypeScript — combining solid engineering with thoughtful design
          to create interfaces that work well and feel right.
        </p>

        {/* CTA */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            gap: "clamp(0.75rem, 1.5vw, 1rem)",
            marginTop: "clamp(2.25rem, 4.5vw, 3.5rem)",
            opacity: reducedMotion ? 1 : 0,
            flexWrap: "wrap",
          }}
        >
          <CTAPrimary label="Let's Talk" onClick={handleExploreWorlds} />
          <CTASecondary label="View My Work" onClick={scrollToProjects} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          opacity: reducedMotion ? 1 : 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <ScrollIndicator reducedMotion={reducedMotion} onClick={scrollToNext} />
      </div>
    </section>
  );
}
