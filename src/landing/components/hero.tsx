/**
 * Hero — Cinematic text reveal system
 *
 * Clip-path mask reveals per line.
 * Ambient glow reacts to scroll.
 * Scroll indicator with breathing animation.
 * Each line enters with intentional stagger.
 */

import { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { PERSONAL_INFO, SECTIONS } from "@/content";

// ============================================================================
// Constants
// ============================================================================

const TIMING = {
  lineDelay: 0.2,
  charStagger: 0.03,
  scrollDelay: 1.8,
} as const;

// ============================================================================
// Hero
// ============================================================================

interface HeroProps {
  isVisible: boolean;
}

export function Hero({ isVisible }: HeroProps) {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
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
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
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
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
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

  // ── Time-aware greeting ──────────────────────────────────────────────
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return SECTIONS.hero.greeting.morning;
    if (hour < 18) return SECTIONS.hero.greeting.afternoon;
    return SECTIONS.hero.greeting.evening;
  }, []);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Frontend Developer — Hero"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: "#080706",
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
          background: "radial-gradient(ellipse, rgba(245, 240, 232, 0.02) 0%, transparent 70%)",
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
        {/* Name */}
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(180, 170, 155, 0.5)",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          {greeting} — {PERSONAL_INFO.firstName}
        </div>

        {/* Headline */}
        <h1
          style={{
            margin: 0,
            padding: 0,
            fontWeight: 600,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            textAlign: "left",
            perspective: 800,
          }}
        >
          {/* Line 1 — INTERFACES THAT */}
          <div
            ref={line1Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0 0.3em",
              lineHeight: 0.85,
              transformOrigin: "bottom center",
              background:
                "linear-gradient(135deg, rgba(245,240,232,1) 0%, rgba(201,169,110,0.7) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              willChange: "clip-path",
            }}
            aria-label={SECTIONS.hero.headline1}
          >
            {SECTIONS.hero.headline1.split(" ").map((word, wi) => (
              <span
                key={`w1-${String(wi)}`}
                data-word
                style={{ display: "inline-flex", whiteSpace: "nowrap" }}
              >
                {word.split("").map((char, ci) => (
                  <span
                    key={`l1-${String(wi)}-${String(ci)}`}
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
              </span>
            ))}
          </div>

          {/* Line 2 — MOVE */}
          <div
            ref={line2Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
              color: "rgba(245, 240, 232, 0.95)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0 0.3em",
              marginTop: "clamp(-0.5rem, -1vw, -1rem)",
              lineHeight: 0.85,
              transformOrigin: "top center",
              willChange: "clip-path",
            }}
            aria-label={SECTIONS.hero.headline2}
          >
            {SECTIONS.hero.headline2.split("").map((char, i) => (
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
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              fontWeight: 400,
              lineHeight: 1.75,
              color: "rgba(214, 204, 190, 0.55)",
              letterSpacing: "0.01em",
            }}
          >
            {PERSONAL_INFO.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
