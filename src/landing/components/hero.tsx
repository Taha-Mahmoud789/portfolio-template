/**
 * Hero — Cinematic text reveal system
 *
 * Clip-path mask reveals per line.
 * Ambient glow reacts to scroll.
 * Scroll indicator with breathing animation.
 * Each line enters with intentional stagger.
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
  lineDelay: 0.2,
  charStagger: 0.03,
  scrollDelay: 1.8,
} as const;

// ============================================================================
// ScrollIndicator
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
        bottom: "clamp(5rem, 8vh, 7rem)",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        zIndex: 10,
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
          color: "rgba(216, 216, 216, 0.45)",
          letterSpacing: "0.3em",
          textTransform: "uppercase" as const,
        }}
      >
        Scroll
      </span>
      <svg
        width="1"
        height="32"
        viewBox="0 0 1 32"
        fill="none"
        aria-hidden="true"
        style={{
          animation: reducedMotion ? "none" : "hero-breathe-mouse 2.5s ease-in-out infinite",
        }}
      >
        <line x1="0.5" y1="0" x2="0.5" y2="32" stroke="rgba(216, 216, 216, 0.2)" strokeWidth="1" />
      </svg>
    </button>
  );
}

// ============================================================================
// Hero
// ============================================================================

interface HeroProps {
  isVisible: boolean;
}

export function Hero({ isVisible }: HeroProps) {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // ── Entrance animation ──────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    if (reducedMotion) return;

    const tl = gsap.timeline();

    // Eyebrow — fade + slide
    if (eyebrowRef.current) {
      tl.fromTo(
        eyebrowRef.current,
        { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.9,
          ease: ANIMATION_EASINGS.expoOut,
        },
        TIMING.lineDelay,
      );
    }

    // Line 1 — clip-path mask reveal with char stagger
    if (line1Ref.current) {
      const chars = line1Ref.current.querySelectorAll<HTMLElement>("[data-char]");
      tl.fromTo(
        line1Ref.current,
        { opacity: 1, clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: ANIMATION_EASINGS.expoOut,
        },
        TIMING.lineDelay + 0.4,
      );
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 80, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            stagger: { each: TIMING.charStagger, from: "start" },
            ease: ANIMATION_EASINGS.expoOut,
          },
          "<0.2",
        );
      }
    }

    // Line 2 — clip-path mask reveal with char stagger
    if (line2Ref.current) {
      const chars = line2Ref.current.querySelectorAll<HTMLElement>("[data-char]");
      tl.fromTo(
        line2Ref.current,
        { opacity: 1, clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: ANIMATION_EASINGS.expoOut,
        },
        "-=0.6",
      );
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 80, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            stagger: { each: TIMING.charStagger, from: "start" },
            ease: ANIMATION_EASINGS.expoOut,
          },
          "<0.2",
        );
      }
    }

    // Subtitle — slide up with mask reveal
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.9,
          ease: ANIMATION_EASINGS.expoOut,
        },
        "-=0.5",
      );
    }

    // Scroll indicator — fade in
    if (scrollRef.current) {
      tl.fromTo(
        scrollRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        `+=${String(TIMING.scrollDelay)}`,
      );
    }

    return () => {
      tl.kill();
      hasAnimated.current = false;
    };
  }, [isVisible, reducedMotion]);

  // ── Scroll-reactive glow ────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion || !glowRef.current || !sectionRef.current) return;

    const glow = glowRef.current;
    const section = sectionRef.current;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      gsap.set(glow, {
        y: progress * -80,
        opacity: 0.6 + progress * 0.4,
        scale: 1 + progress * 0.15,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  // ── Callbacks ───────────────────────────────────────────────────────
  const scrollToNext = useCallback(() => {
    scrollTo("#intro");
  }, [scrollTo]);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Creative Developer — Hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: "#040508",
      }}
    >
      {/* Subtle ambient glow — scroll-reactive */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(600px, 80vw, 1200px)",
          height: "clamp(400px, 50vw, 800px)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      />

      {/* Content */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "clamp(6rem, 14vh, 10rem) clamp(1.5rem, 5vw, 6rem) clamp(4rem, 8vh, 6rem)",
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
            fontSize: "clamp(0.625rem, 0.75vw, 0.75rem)",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: "rgba(216, 216, 216, 0.45)",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              width: 32,
              height: 1,
              background: "rgba(216, 216, 216, 0.15)",
            }}
          />
          Creative Developer &amp; Frontend Engineer
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
          {/* Line 1 — DESIGNED TO MEAN */}
          <div
            ref={line1Ref}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              display: "flex",
              flexWrap: "wrap",
              lineHeight: 0.88,
              transformOrigin: "bottom center",
              background:
                "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(216,216,216,0.7) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              willChange: "clip-path",
            }}
            aria-label="DESIGNED TO MEAN"
          >
            {"DESIGNED TO MEAN".split("").map((char, i) => (
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

          {/* Line 2 — SOMETHING */}
          <div
            ref={line2Ref}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              color: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexWrap: "wrap",
              marginTop: "clamp(-0.25rem, -0.5vw, -0.5rem)",
              lineHeight: 0.88,
              transformOrigin: "top center",
              willChange: "clip-path",
            }}
            aria-label="SOMETHING"
          >
            {"SOMETHING".split("").map((char, i) => (
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
        <div
          ref={subtitleRef}
          style={{
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
            maxWidth: "clamp(340px, 40vw, 480px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.5rem, 3vw, 2rem)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(216, 216, 216, 0.4)",
              letterSpacing: "0.01em",
            }}
          >
            Interfaces built with intention. Motion with purpose. Every pixel earned its place.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          bottom: "clamp(48px, 6vh, 64px)",
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
