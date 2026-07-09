/**
 * WorldCard — Floating world element for the Multiverse Hub.
 *
 * Not a card in the traditional sense. No borders, no box.
 * Each world is a floating object with a name beneath it.
 * Like objects suspended in dark space.
 *
 * Hover: object lifts, glow intensifies, subtle scale.
 * Focus: visible ring for keyboard navigation.
 * Click: selects the world (placeholder for future navigation).
 *
 * Reduced motion: no floating animation, instant hover transitions.
 */

import { useRef, useEffect, useCallback, memo } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "@/landing/hooks";

// ============================================================================
// Types
// ============================================================================

interface WorldCardProps {
  number: string;
  name: string;
  description: string;
  status: "available" | "coming-soon";
  accentColor: string;
  index: number;
  onSelect: (worldId: string) => void;
}

// ============================================================================
// Floating shapes — larger, more atmospheric
// ============================================================================

const SHAPES = ["octahedron", "torus", "dodecahedron", "icosahedron"] as const;

function FloatingShape({ type, color }: { type: (typeof SHAPES)[number]; color: string }) {
  const shapeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shapeRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(shapeRef.current, {
        y: -10,
        rotation: 8,
        duration: 4 + Math.random() * 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  const shapeStyles: Record<(typeof SHAPES)[number], React.CSSProperties> = {
    octahedron: {
      width: 56,
      height: 56,
      background: `linear-gradient(135deg, ${color}18, ${color}06)`,
      border: `1px solid ${color}22`,
      transform: "rotate(45deg)",
    },
    torus: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      border: `1.5px solid ${color}33`,
      background: "transparent",
      boxShadow: `inset 0 0 20px ${color}0a, 0 0 30px ${color}06`,
    },
    dodecahedron: {
      width: 54,
      height: 54,
      background: `linear-gradient(135deg, ${color}12, ${color}04)`,
      border: `1px solid ${color}1a`,
      clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    },
    icosahedron: {
      width: 58,
      height: 58,
      background: `linear-gradient(135deg, ${color}14, ${color}05)`,
      border: `1px solid ${color}22`,
      clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
    },
  };

  return (
    <div
      ref={shapeRef}
      aria-hidden="true"
      style={{
        ...shapeStyles[type],
      }}
    />
  );
}

// ============================================================================
// WorldCard
// ============================================================================

export const WorldCard = memo(function WorldCard({
  number,
  name,
  description,
  status,
  accentColor,
  index,
  onSelect,
}: WorldCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shapeContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Entrance animation
  useEffect(() => {
    if (!cardRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.2 + index * 0.1,
          ease: ANIMATION_EASINGS.expoOut,
        },
      );
    });

    return () => ctx.revert();
  }, [reducedMotion, index]);

  // Hover: lift shape, intensify glow
  const handleEnter = useCallback(() => {
    if (reducedMotion) return;
    if (shapeContainerRef.current) {
      gsap.to(shapeContainerRef.current, {
        y: -8,
        scale: 1.05,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: true,
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.2,
        scale: 1.15,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: true,
      });
    }
  }, [reducedMotion]);

  const handleLeave = useCallback(() => {
    if (reducedMotion) return;
    if (shapeContainerRef.current) {
      gsap.to(shapeContainerRef.current, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: true,
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.08,
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: true,
      });
    }
  }, [reducedMotion]);

  const shapeType = SHAPES[index % SHAPES.length] ?? "octahedron";

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onSelect(name.toLowerCase().replace(/\s+/g, "-"))}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className="group relative flex flex-col items-center text-center w-full cursor-pointer focus-visible:outline-none"
      style={{
        padding: "clamp(1.5rem, 2.5vw, 2.5rem) clamp(1rem, 1.5vw, 1.5rem)",
        opacity: reducedMotion ? 1 : 0,
        background: "transparent",
        border: "none",
      }}
      aria-label={`${name} — ${description}. Status: ${status === "available" ? "Available" : "Coming soon"}`}
    >
      {/* Glow — soft radial behind shape */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "50%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 65%)`,
          opacity: 0.08,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Number — micro, top */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          fontWeight: 500,
          letterSpacing: "0.15em",
          color: "rgba(241, 245, 249, 0.2)",
          marginBottom: "clamp(1rem, 1.5vw, 1.5rem)",
        }}
      >
        {number}
      </span>

      {/* Shape — floating object */}
      <div
        ref={shapeContainerRef}
        style={{
          marginBottom: "clamp(1.25rem, 2vw, 1.75rem)",
          position: "relative",
        }}
      >
        <FloatingShape type={shapeType} color={accentColor} />
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "#F1F5F9",
          margin: "0 0 0.4rem 0",
          lineHeight: 1.2,
        }}
      >
        {name}
      </h3>

      {/* Description — quieter */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.75rem, 0.85vw, 0.85rem)",
          lineHeight: 1.6,
          color: "rgba(241, 245, 249, 0.35)",
          margin: "0 0 1rem 0",
          maxWidth: 220,
        }}
      >
        {description}
      </p>

      {/* Status — minimal dot */}
      <div
        className="flex items-center gap-1.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: status === "available" ? `${accentColor}cc` : "rgba(241, 245, 249, 0.18)",
        }}
      >
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: status === "available" ? accentColor : "rgba(241, 245, 249, 0.12)",
          }}
        />
        {status === "available" ? "Open" : "Soon"}
      </div>
    </button>
  );
});
