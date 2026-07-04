/**
 * WorldSelection
 *
 * Premium world selection experience after portal transition.
 * Three immersive cards — Space, Apple, Cyberpunk — each with
 * animated backgrounds, glass morphism, 3D tilt, hover depth, and selection flow.
 *
 * 60 FPS. GPU-accelerated. Accessible.
 */

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
  forwardRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { ANIMATION_EASINGS, ANIMATION_DURATIONS } from "@/animation/constants";
import { useReducedMotion } from "../../hooks";

// ============================================================================
// World Definitions
// ============================================================================

interface WorldDef {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  gradient: string;
  glowColor: string;
  borderHover: string;
  accentColor: string;
  accentBorder: string;
  previewGradient: string;
  iconBg: string;
  iconBorder: string;
}

const WORLDS: readonly WorldDef[] = [
  {
    id: "space",
    name: "Space",
    subtitle: "Explore the Infinite",
    description:
      "Vast cosmic environments with procedural stars, nebulae, and zero-gravity physics.",
    gradient:
      "linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(30,58,95,0.6) 50%, rgba(201,169,110,0.15) 100%)",
    glowColor: "rgba(201,169,110,0.25)",
    borderHover: "rgba(201,169,110,0.5)",
    accentColor: "#c9a96e",
    accentBorder: "rgba(201,169,110,0.4)",
    previewGradient:
      "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(201,169,110,0.15) 0%, transparent 60%)",
    iconBg: "rgba(201,169,110,0.12)",
    iconBorder: "rgba(201,169,110,0.2)",
  },
  {
    id: "apple",
    name: "Apple",
    subtitle: "Designed to Feel Effortless",
    description:
      "Precision-crafted interfaces with liquid metal, frosted glass, and perfect typography.",
    gradient:
      "linear-gradient(160deg, rgba(248,250,252,0.1) 0%, rgba(226,232,240,0.06) 50%, rgba(200,210,220,0.1) 100%)",
    glowColor: "rgba(226,232,240,0.18)",
    borderHover: "rgba(226,232,240,0.45)",
    accentColor: "#e2e8f0",
    accentBorder: "rgba(226,232,240,0.35)",
    previewGradient:
      "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(226,232,240,0.12) 0%, transparent 60%)",
    iconBg: "rgba(226,232,240,0.1)",
    iconBorder: "rgba(226,232,240,0.18)",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    subtitle: "Enter the Neon Future",
    description: "Electric cityscapes with glitch aesthetics, neon light leaks, and raw energy.",
    gradient:
      "linear-gradient(160deg, rgba(180,148,78,0.5) 0%, rgba(201,169,110,0.3) 50%, rgba(212,184,122,0.15) 100%)",
    glowColor: "rgba(201,169,110,0.2)",
    borderHover: "rgba(201,169,110,0.5)",
    accentColor: "#c9a96e",
    accentBorder: "rgba(201,169,110,0.4)",
    previewGradient:
      "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(201,169,110,0.12) 0%, transparent 60%)",
    iconBg: "rgba(201,169,110,0.12)",
    iconBorder: "rgba(201,169,110,0.2)",
  },
] as const;

// ============================================================================
// Animated Backgrounds — CSS/GPU only, no canvas
// ============================================================================

function SpaceBackground({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(el, { backgroundPosition: "200% 200%", duration: 20, ease: "none" });
    return () => {
      tl.kill();
    };
  }, [active]);

  useEffect(() => {
    if (!active || !starsRef.current) return;
    const stars = Array.from(starsRef.current.children);
    const ctx = gsap.context(() => {
      stars.forEach((star, i) => {
        gsap.to(star, {
          opacity: i % 3 === 0 ? 0.9 : 0.4,
          scale: i % 4 === 0 ? 1.5 : 1,
          duration: 2 + (i % 4) * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });
    }, starsRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(1px 1px at 10% 20%, rgba(200,210,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 60%, rgba(180,200,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 10%, rgba(220,230,255,0.9) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 40%, rgba(160,180,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 80% 80%, rgba(200,210,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 20% 90%, rgba(190,200,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 30%, rgba(210,220,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 90% 50%, rgba(180,190,255,0.8) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 70%, rgba(200,210,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 45%, rgba(170,180,255,0.6) 0%, transparent 100%)
          `,
          backgroundSize: "200% 200%",
          opacity: active ? 0.7 : 0.15,
          transition: "opacity 1.2s cubic-bezier(0.19,1,0.22,1)",
        }}
      />
      <div
        ref={starsRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${String((i * 8.3) % 100)}%`,
              top: `${String((i * 7.1 + 5) % 90)}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: i % 4 === 0 ? "#d4b87a" : "#c9a96e",
              boxShadow: `0 0 ${String(i % 3 === 0 ? 6 : 3)}px ${i % 4 === 0 ? "rgba(220,200,160,0.6)" : "rgba(201,169,110,0.3)"}`,
              willChange: "transform, opacity",
              opacity: active ? undefined : 0.15,
              transition: "opacity 1s ease",
            }}
          />
        ))}
      </div>
    </>
  );
}

function AppleBackground({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, { opacity: 0.18, duration: 4, ease: "sine.inOut" });
    tl.to(el, { opacity: 0.06, duration: 4, ease: "sine.inOut" });
    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(226,232,240,0.1) 0%, transparent 70%)",
        opacity: active ? undefined : 0.03,
        transition: "opacity 1.2s ease",
      }}
    />
  );
}

function CyberpunkBackground({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(el, { backgroundPosition: "0% 100%", duration: 12, ease: "none" });
    return () => {
      tl.kill();
    };
  }, [active]);

  useEffect(() => {
    if (!active || !gridRef.current) return;
    const lines = Array.from(gridRef.current.children);
    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 0.15,
            scaleX: 1,
            duration: 0.8,
            repeat: -1,
            repeatDelay: 3 + (i % 3) * 1.5,
            ease: "power2.out",
            delay: i * 0.1,
          },
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px),
            linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 60px 60px, 20px 20px, 20px 20px",
          backgroundPosition: "-1px -1px, -1px -1px, -1px -1px, -1px -1px",
          opacity: active ? 0.8 : 0.1,
          transition: "opacity 1.2s ease",
        }}
      />
      <div
        ref={gridRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${String(15 + i * 18)}%`,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${i % 2 === 0 ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.12)"} 50%, transparent 100%)`,
              transformOrigin: "left center",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </>
  );
}

// ============================================================================
// Floating Particles — ambient void energy
// ============================================================================

function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const particles = containerRef.current.children;
    const ctx = gsap.context(() => {
      Array.from(particles).forEach((p, i) => {
        gsap.to(p, {
          y: i % 3 === 0 ? "-25" : i % 3 === 1 ? "18" : "-12",
          x: i % 2 === 0 ? "8" : "-6",
          opacity: i % 4 === 0 ? 0.25 : 0.12,
          duration: 6 + (i % 5) * 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${String((i * 5.7) % 100)}%`,
            top: `${String((i * 4.3 + 10) % 90)}%`,
            width: i % 3 === 0 ? 2 : 1.5,
            height: i % 3 === 0 ? 2 : 1.5,
            borderRadius: "50%",
            background: `hsla(${String(35 + (i % 3) * 5)}, 60%, 70%, 0.15)`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Heading Shimmer
// ============================================================================

function HeadingShimmer({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const tl = gsap.timeline({ repeat: -1, delay: 3 });
    tl.fromTo(
      el,
      { backgroundPosition: "-200% center" },
      { backgroundPosition: "200% center", duration: 3, ease: "none" },
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <span
      ref={ref}
      style={{
        background:
          "linear-gradient(135deg, #d4b87a 0%, #c9a96e 30%, #d4b87a 50%, #c9a96e 70%, #c9a96e 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </span>
  );
}

// ============================================================================
// Energy Connector — line between cards showing multiverse connection
// ============================================================================

const EnergyConnector = forwardRef<HTMLDivElement>(function EnergyConnector(_props, ref) {
  useEffect(() => {
    if (!ref || typeof ref === "function" || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        backgroundPosition: "200% center",
        duration: 4,
        repeat: -1,
        ease: "none",
      });
    }, el);
    return () => ctx.revert();
  }, [ref]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="world-energy-connector"
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 1,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.08) 20%, rgba(180,140,80,0.12) 40%, rgba(201,169,110,0.08) 60%, rgba(201,169,110,0.08) 80%, transparent 100%)",
        backgroundSize: "200% 100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
});

// ============================================================================
// World Card — with 3D tilt + magnetic pull
// ============================================================================

interface WorldCardProps {
  world: WorldDef;
  isHovered: boolean;
  isSelected: boolean;
  isAnyHovered: boolean;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

function WorldCard({
  world,
  isHovered,
  isSelected,
  isAnyHovered,
  reducedMotion,
  onHover,
  onSelect,
  cardRef,
}: WorldCardProps) {
  const cardRefInner = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseEnter = useCallback(() => onHover(world.id), [world.id, onHover]);
  const handleMouseLeave = useCallback(() => {
    onHover(null);
    if (cardRefInner.current && !reducedMotion) {
      gsap.to(cardRefInner.current, {
        rotateX: 0,
        rotateY: 0,
        transformPerspective: 800,
        duration: ANIMATION_DURATIONS.slow,
        ease: ANIMATION_EASINGS.expoOut,
      });
    }
  }, [onHover, reducedMotion]);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRefInner.current) return;
      const rect = cardRefInner.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      tiltRef.current = { x: (y - 0.5) * -12, y: (x - 0.5) * 12 };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (cardRefInner.current) {
          gsap.to(cardRefInner.current, {
            rotateX: tiltRef.current.x,
            rotateY: tiltRef.current.y,
            transformPerspective: 800,
            duration: 0.4,
            ease: ANIMATION_EASINGS.expoOut,
            overwrite: "auto",
          });
        }
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleClick = useCallback(() => onSelect(world.id), [world.id, onSelect]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(world.id);
      }
    },
    [world.id, onSelect],
  );

  const BG = useMemo(() => {
    switch (world.id) {
      case "space":
        return SpaceBackground;
      case "apple":
        return AppleBackground;
      case "cyberpunk":
        return CyberpunkBackground;
      default:
        return AppleBackground;
    }
  }, [world.id]);

  const icon = useMemo(() => {
    switch (world.id) {
      case "space":
        return "✦";
      case "apple":
        return "◆";
      case "cyberpunk":
        return "⬡";
      default:
        return "◆";
    }
  }, [world.id]);

  const worldNumber = useMemo(() => {
    const idx = WORLDS.findIndex((w) => w.id === world.id);
    return idx >= 0 ? idx + 1 : 1;
  }, [world.id]);

  // Dim other cards when one is hovered — creates depth hierarchy
  const dimmed = isAnyHovered && !isHovered;

  return (
    <div
      ref={(el) => {
        cardRef(el);
        cardRefInner.current = el;
      }}
      role="button"
      tabIndex={0}
      aria-label={`${world.name} world — ${world.subtitle}. World ${String(worldNumber)} of ${String(WORLDS.length)}. Press Enter to enter.`}
      aria-pressed={isSelected ? true : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="world-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        cursor: "pointer",
        opacity: reducedMotion ? 1 : 0,
        willChange: reducedMotion ? "auto" : "transform, opacity",
        transformStyle: "preserve-3d",
        transition:
          "box-shadow 0.6s cubic-bezier(0.19,1,0.22,1), border-color 0.6s cubic-bezier(0.19,1,0.22,1), transform 0.6s cubic-bezier(0.19,1,0.22,1), filter 0.6s cubic-bezier(0.19,1,0.22,1), opacity 0.6s cubic-bezier(0.19,1,0.22,1)",
        border: `1px solid ${isHovered ? world.borderHover : "rgba(245,240,232,0.06)"}`,
        boxShadow: isHovered
          ? `0 0 80px ${world.glowColor}, 0 30px 60px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,240,232,0.08)`
          : "0 4px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(245,240,232,0.04)",
        background: world.gradient,
        minHeight: "clamp(340px, 42vh, 460px)",
        maxWidth: 440,
        contentVisibility: "auto",
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        filter: dimmed ? "brightness(0.85)" : "none",
      }}
    >
      {/* Accent top border — unique per world */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent 5%, ${world.accentBorder} 50%, transparent 95%)`,
          opacity: isHovered ? 1 : 0.3,
          transition: "opacity 0.6s cubic-bezier(0.19,1,0.22,1)",
          zIndex: 3,
        }}
      />

      {/* Animated background */}
      <BG active={isHovered || isSelected} />

      {/* Preview gradient — top-to-bottom atmospheric wash */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: world.previewGradient,
          opacity: isHovered ? 1 : 0.2,
          transition: "opacity 0.8s cubic-bezier(0.19,1,0.22,1)",
          pointerEvents: "none",
        }}
      />

      {/* Glass overlay — stronger for premium feel */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(245,240,232,0.06) 0%, transparent 30%, rgba(0,0,0,0.3) 100%)",
          borderRadius: 24,
          pointerEvents: "none",
        }}
      />

      {/* Inner shadow — shifts on hover for depth */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: isHovered
            ? "inset 0 2px 20px rgba(245,240,232,0.04), inset 0 -4px 30px rgba(0,0,0,0.15)"
            : "inset 0 1px 10px rgba(245,240,232,0.02), inset 0 -2px 20px rgba(0,0,0,0.1)",
          borderRadius: 24,
          transition: "box-shadow 0.6s cubic-bezier(0.19,1,0.22,1)",
          pointerEvents: "none",
        }}
      />

      {/* Top glow accent — follows hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          height: 160,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${world.glowColor} 0%, transparent 70%)`,
          filter: "blur(50px)",
          opacity: isHovered ? 1 : 0.25,
          transition: "opacity 0.8s cubic-bezier(0.19,1,0.22,1)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom edge glow on hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${world.borderHover}, transparent)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.19,1,0.22,1)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: "clamp(1.5rem, 3vw, 2.5rem)",
          minHeight: "clamp(340px, 42vh, 460px)",
        }}
      >
        {/* Top: icon + status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            aria-hidden="true"
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isHovered ? world.iconBg : "rgba(245,240,232,0.05)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${isHovered ? world.iconBorder : "rgba(245,240,232,0.08)"}`,
              fontSize: "1.375rem",
              transition: "all 0.6s cubic-bezier(0.19,1,0.22,1)",
              transform: isHovered ? "scale(1.1) rotate(-3deg)" : "scale(1) rotate(0deg)",
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.625rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: isHovered ? "rgba(245,240,232,0.55)" : "rgba(245,240,232,0.3)",
              padding: "5px 12px",
              borderRadius: 8,
              background: isHovered ? "rgba(245,240,232,0.07)" : "rgba(245,240,232,0.03)",
              border: `1px solid ${isHovered ? "rgba(245,240,232,0.12)" : "rgba(245,240,232,0.05)"}`,
              transition: "all 0.6s cubic-bezier(0.19,1,0.22,1)",
            }}
          >
            {`WORLD 0${String(worldNumber)}`}
          </span>
        </div>

        {/* Middle: spacer for breathing room */}
        <div style={{ flex: 1 }} />

        {/* Bottom: text content */}
        <div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.625rem, 0.8vw, 0.6875rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "rgba(245,240,232,0.35)",
              display: "block",
              marginBottom: "clamp(0.5rem, 1vw, 0.75rem)",
            }}
          >
            {world.subtitle}
          </span>

          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#f5f0e8",
              margin: "0 0 clamp(0.5rem, 1vw, 0.75rem) 0",
              transition: "color 0.6s cubic-bezier(0.19,1,0.22,1)",
            }}
          >
            {world.name}
          </h3>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
              lineHeight: 1.6,
              color: isHovered ? "rgba(226,232,240,0.65)" : "rgba(226,232,240,0.45)",
              margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
              maxWidth: 340,
              transition: "color 0.6s cubic-bezier(0.19,1,0.22,1)",
            }}
          >
            {world.description}
          </p>

          {/* Enter prompt */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: isHovered ? 1 : 0.45,
              transform: isHovered ? "translateX(6px)" : "translateX(0)",
              transition: "all 0.6s cubic-bezier(0.19,1,0.22,1)",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6875rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: world.accentColor,
                fontWeight: 500,
              }}
            >
              Enter World
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              style={{
                opacity: isHovered ? 1 : 0.35,
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                transition: "all 0.6s cubic-bezier(0.19,1,0.22,1)",
                color: world.accentColor,
              }}
            >
              <path
                d="M4 9H14M11 5L15 9L11 13"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Selection ring with glow */}
      {isSelected && (
        <>
          <div
            aria-hidden="true"
            className="portal-selection-glow"
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: 34,
              background: `radial-gradient(circle, ${world.glowColor} 0%, transparent 70%)`,
              filter: "blur(16px)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: 26,
              border: `2px solid ${world.borderHover}`,
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </div>
  );
}

// ============================================================================
// WorldSelection
// ============================================================================

export function WorldSelection({ visible, onExit }: { visible: boolean; onExit: () => void }) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardEls.current[i] = el;
    },
    [],
  );

  // ── Background aurora animation ──────────────────────────────────
  useEffect(() => {
    if (!visible || reducedMotion || !bgRef.current) return;
    const orbs = bgRef.current.querySelectorAll<HTMLElement>("[data-aurora]");
    if (orbs.length === 0) return;

    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: i % 2 === 0 ? 40 : -30,
          y: i % 3 === 0 ? -25 : 20,
          scale: 1.15,
          duration: 8 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.5,
        });
      });
    }, bgRef);
    return () => ctx.revert();
  }, [visible, reducedMotion]);

  // ── Energy connector entrance ────────────────────────────────────
  useEffect(() => {
    if (!visible || reducedMotion || !connectorRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        connectorRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.2, ease: ANIMATION_EASINGS.expoOut, delay: 0.8 },
      );
    }, connectorRef);
    return () => ctx.revert();
  }, [visible, reducedMotion]);

  // ── Entrance timeline — organic stagger, slower for luxury ───────
  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: reducedMotion ? 0 : 0.9, ease: ANIMATION_EASINGS.expoOut },
      );

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 14, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: reducedMotion ? 0 : 0.7,
            ease: ANIMATION_EASINGS.expoOut,
          },
          reducedMotion ? 0 : 0.15,
        );
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { y: 28, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: reducedMotion ? 0 : 0.8,
            ease: ANIMATION_EASINGS.expoOut,
          },
          reducedMotion ? 0 : 0.25,
        );
      }

      const validCards = cardEls.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length > 0) {
        tl.fromTo(
          validCards,
          { y: 60, opacity: 0, scale: 0.95, rotateX: 4 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transformPerspective: 800,
            duration: reducedMotion ? 0 : 0.9,
            stagger: { amount: 0.4, from: "center" },
            ease: ANIMATION_EASINGS.backOut,
          },
          reducedMotion ? 0 : 0.35,
        );
      }

      if (backRef.current) {
        tl.fromTo(
          backRef.current,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: reducedMotion ? 0 : 0.6, ease: ANIMATION_EASINGS.expoOut },
          reducedMotion ? 0 : 0.55,
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [visible, reducedMotion]);

  // ── Focus trap ────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const container = containerRef.current;
    const FOCUSABLE = "[role='button'], button:not([disabled])";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  // ── Keyboard navigation (arrow keys between cards) ────────────────
  const handleGlobalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }

      const currentIdx = hoveredId ? WORLDS.findIndex((w) => w.id === hoveredId) : 0;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (currentIdx + 1) % WORLDS.length;
        const nextWorld = WORLDS[next];
        if (nextWorld) {
          setHoveredId(nextWorld.id);
          cardEls.current[next]?.focus();
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (currentIdx - 1 + WORLDS.length) % WORLDS.length;
        const prevWorld = WORLDS[prev];
        if (prevWorld) {
          setHoveredId(prevWorld.id);
          cardEls.current[prev]?.focus();
        }
      }
    },
    [hoveredId, onExit],
  );

  // ── Selection flow — with spring + anticipation ──────────────────
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (id: string) => {
      if (selectedId) return;
      setSelectedId(id);

      if (liveRef.current) {
        liveRef.current.textContent = `Entering ${WORLDS.find((w) => w.id === id)?.name ?? "unknown"} world.`;
      }

      const selectedIdx = WORLDS.findIndex((w) => w.id === id);
      const selectedCard = cardEls.current[selectedIdx];
      if (!selectedCard || !containerRef.current) {
        void navigate(`/worlds/${id}`);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          void navigate(`/worlds/${id}`);
        },
      });

      if (reducedMotion) {
        tl.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: ANIMATION_EASINGS.expoIn,
        });
      } else {
        // Anticipation: brief pull-back
        tl.to(
          selectedCard,
          {
            scale: 0.96,
            duration: 0.12,
            ease: ANIMATION_EASINGS.expoIn,
          },
          0,
        );

        // Fade other cards
        const otherCards = cardEls.current.filter((el, i) => {
          const world = WORLDS[i];
          return el && world && world.id !== id;
        });
        tl.to(
          otherCards,
          {
            opacity: 0.06,
            scale: 0.94,
            filter: "blur(10px)",
            duration: 0.55,
            ease: ANIMATION_EASINGS.expoOut,
            stagger: { amount: 0.15, from: "center" },
          },
          0.1,
        );

        // Selected card rises with glow
        tl.to(
          selectedCard,
          {
            scale: 1.1,
            y: -20,
            duration: 0.65,
            ease: ANIMATION_EASINGS.backOut,
          },
          0.15,
        );

        // Camera push + fade
        tl.to(containerRef.current, {
          scale: 1.18,
          opacity: 0,
          filter: "blur(14px)",
          duration: 0.8,
          ease: ANIMATION_EASINGS.expoIn,
          delay: 0.3,
        });
      }
    },
    [reducedMotion, navigate, selectedId],
  );

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-roledescription="world selection"
      aria-label="World Selection — choose a world to explore"
      onKeyDown={handleGlobalKeyDown}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.5rem, 4vw, 4rem)",
        background:
          "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(8,7,6,1) 0%, rgba(8,7,6,1) 100%)",
        overflow: "auto",
      }}
    >
      {/* Live region for screen readers */}
      <div
        ref={liveRef}
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      {/* Animated aurora background */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          data-aurora="true"
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "50vw",
            height: "50vw",
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 60%)",
            filter: "blur(100px)",
            willChange: "transform",
          }}
        />
        <div
          data-aurora="true"
          style={{
            position: "absolute",
            bottom: "0%",
            right: "0%",
            width: "45vw",
            height: "45vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,140,80,0.05) 0%, transparent 60%)",
            filter: "blur(90px)",
            willChange: "transform",
          }}
        />
        <div
          data-aurora="true"
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            height: "60vw",
            maxWidth: 900,
            maxHeight: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 50%)",
            filter: "blur(120px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Noise texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Back button */}
      <button
        ref={backRef}
        onClick={onExit}
        aria-label="Return to portal"
        aria-keyshortcuts="Escape"
        className="portal-back-btn focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vh, 2rem)",
          left: "clamp(1.5rem, 5vw, 3rem)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(245,240,232,0.04)",
          border: "1px solid rgba(245,240,232,0.08)",
          borderRadius: 10,
          color: "rgba(226,232,240,0.6)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          cursor: "pointer",
          padding: "0.5rem 1rem",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s cubic-bezier(0.19,1,0.22,1)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M9 3L5 7L9 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vh, 4rem)" }}>
        <span
          ref={subtitleRef}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.5625rem, 0.75vw, 0.6875rem)",
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
            color: "rgba(245,240,232,0.3)",
            display: "block",
            marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
          }}
        >
          Choose Your Universe
        </span>
        <h2
          ref={headingRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#f5f0e8",
            margin: 0,
          }}
        >
          Enter a <HeadingShimmer text="World" />
        </h2>
      </div>

      {/* Cards Grid with energy connector */}
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(1.25rem, 2.5vw, 2rem)",
          maxWidth: 1400,
          width: "100%",
          justifyItems: "center",
        }}
      >
        <EnergyConnector ref={connectorRef} />
        {WORLDS.map((world, i) => (
          <WorldCard
            key={world.id}
            world={world}
            isHovered={hoveredId === world.id}
            isSelected={selectedId === world.id}
            isAnyHovered={hoveredId !== null}
            reducedMotion={reducedMotion}
            onHover={handleHover}
            onSelect={handleSelect}
            cardRef={setCardRef(i)}
          />
        ))}
      </div>

      {/* Keyboard hint — hidden on mobile/touch */}
      <div
        aria-hidden="true"
        className="world-keyboard-hints"
        style={{
          marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.5625rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: "rgba(245,240,232,0.2)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <kbd
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: "0.5rem",
              background: "rgba(245,240,232,0.05)",
              border: "1px solid rgba(245,240,232,0.08)",
            }}
          >
            ←
          </kbd>
          <kbd
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: "0.5rem",
              background: "rgba(245,240,232,0.05)",
              border: "1px solid rgba(245,240,232,0.08)",
            }}
          >
            →
          </kbd>
          Navigate
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <kbd
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: "0.5rem",
              background: "rgba(245,240,232,0.05)",
              border: "1px solid rgba(245,240,232,0.08)",
            }}
          >
            ⏎
          </kbd>
          Select
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <kbd
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: "0.5rem",
              background: "rgba(245,240,232,0.05)",
              border: "1px solid rgba(245,240,232,0.08)",
            }}
          >
            Esc
          </kbd>
          Back
        </span>
      </div>
    </div>
  );
}
