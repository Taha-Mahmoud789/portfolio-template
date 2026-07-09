/**
 * Hero — Modern playful hero with gradient mesh, floating shapes, and word hover
 *
 * Animated gradient mesh background with floating geometric shapes.
 * Words highlight on hover with gradient shift.
 * Magnetic cursor interactions on interactive elements.
 */

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { PERSONAL_INFO, SECTIONS } from "@/content";

// ============================================================================
// Floating Shape Component
// ============================================================================

function FloatingShape({
  size,
  x,
  y,
  delay,
  duration,
  type,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  type: "circle" | "ring" | "dot";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    gsap.set(el, { x: 0, y: 0, opacity: 0 });

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      y: Math.random() * 40 - 20,
      x: Math.random() * 30 - 15,
      duration: duration,
      ease: "sine.inOut",
      delay: delay,
    });
    tl.to(
      el,
      {
        opacity: 0.6,
        duration: duration * 0.5,
        ease: "power2.out",
      },
      0,
    );

    return () => {
      tl.kill();
    };
  }, [delay, duration]);

  const shapeStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: type === "circle" ? "50%" : type === "ring" ? "50%" : "50%",
    border: type === "ring" ? "1px solid rgba(59, 130, 246, 0.15)" : "none",
    background:
      type === "dot"
        ? "rgba(6, 182, 212, 0.3)"
        : type === "ring"
          ? "transparent"
          : "rgba(59, 130, 246, 0.06)",
    pointerEvents: "none" as const,
  };

  return <div ref={ref} style={shapeStyle} aria-hidden="true" />;
}

// ============================================================================
// Animated Word Component (hover effect)
// ============================================================================

function AnimatedWord({ word, isGradient }: { word: string; isGradient?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const wordRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (wordRef.current) {
      gsap.to(wordRef.current, {
        y: -4,
        duration: 0.3,
        ease: ANIMATION_EASINGS.backOut,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (wordRef.current) {
      gsap.to(wordRef.current, {
        y: 0,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
      });
    }
  }, []);

  return (
    <span
      ref={wordRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-block",
        cursor: "default",
        transition: "color 0.3s ease, text-shadow 0.3s ease",
        color: isHovered
          ? "rgba(59, 130, 246, 1)"
          : isGradient
            ? "transparent"
            : "rgba(241, 245, 249, 0.95)",
        textShadow: isHovered ? "0 0 40px rgba(59, 130, 246, 0.3)" : "none",
        ...(isGradient
          ? {
              background:
                "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(59,130,246,0.8) 50%, rgba(6,182,212,0.6) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : {}),
      }}
      aria-hidden="true"
    >
      {word}
    </span>
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

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
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
        0.2,
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
        0.6,
      );
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: { each: 0.03, from: "start" },
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
            stagger: { each: 0.03, from: "start" },
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

    // Floating shapes entrance
    if (shapesRef.current) {
      const shapes = shapesRef.current.querySelectorAll<HTMLElement>("div");
      tl.fromTo(
        shapes,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: ANIMATION_EASINGS.expoOut,
        },
        0.8,
      );
    }

    return () => {
      tl.kill();
      hasAnimated.current = false;
    };
  }, [isVisible, reducedMotion]);

  // ── Gradient mesh parallax on scroll ────────────────────────────────
  useEffect(() => {
    if (reducedMotion || !meshRef.current || !sectionRef.current) return;

    const mesh = meshRef.current;
    const section = sectionRef.current;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      gsap.set(mesh, {
        y: progress * -60,
        opacity: 0.7 + progress * 0.3,
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
        background: "#0B0F1A",
      }}
    >
      {/* Gradient mesh background */}
      <div
        ref={meshRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.7,
          willChange: "transform, opacity",
        }}
      >
        {/* Primary blue mesh blob */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "clamp(400px, 50vw, 700px)",
            height: "clamp(400px, 50vw, 700px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "hero-float 8s ease-in-out infinite",
          }}
        />
        {/* Secondary cyan mesh blob */}
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "clamp(300px, 40vw, 500px)",
            height: "clamp(300px, 40vw, 500px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "hero-float 10s ease-in-out infinite 1s",
          }}
        />
        {/* Tertiary blue-purple mesh */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "30%",
            width: "clamp(250px, 35vw, 450px)",
            height: "clamp(250px, 35vw, 450px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "hero-float 12s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div
        ref={shapesRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <FloatingShape size={120} x="15%" y="20%" delay={0} duration={6} type="ring" />
        <FloatingShape size={80} x="75%" y="30%" delay={0.5} duration={7} type="circle" />
        <FloatingShape size={60} x="85%" y="70%" delay={1} duration={5} type="dot" />
        <FloatingShape size={40} x="10%" y="75%" delay={1.5} duration={8} type="ring" />
        <FloatingShape size={100} x="60%" y="15%" delay={0.3} duration={9} type="circle" />
        <FloatingShape size={30} x="30%" y="85%" delay={2} duration={6} type="dot" />
        <FloatingShape size={50} x="90%" y="45%" delay={0.8} duration={7} type="ring" />
      </div>

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
        {/* Name / Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(100, 116, 139, 0.5)",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(59, 130, 246, 0.5)",
              display: "inline-block",
              animation: "portal-orb-breathe 2s ease-in-out infinite",
            }}
          />
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
                <AnimatedWord word={word} isGradient />
                {wi < SECTIONS.hero.headline1.split(" ").length - 1 && (
                  <span aria-hidden="true">&nbsp;</span>
                )}
              </span>
            ))}
          </div>

          {/* Line 2 — MOVE */}
          <div
            ref={line2Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 11vw, 10rem)",
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
                  color: "rgba(241, 245, 249, 0.95)",
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
              color: "rgba(148, 163, 184, 0.55)",
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
