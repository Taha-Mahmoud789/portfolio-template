/**
 * NotFoundPage — Creative 404
 *
 * "Lost in the interface" — branded, premium, minimal.
 * Back home action. Subtle animation. Respects reduced motion.
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/landing/hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

    tl.fromTo(
      codeRef.current,
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8 },
    )
      .fromTo(
        headingRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      )
      .fromTo(descRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      .fromTo(
        actionRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2",
      );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 4rem)",
        background: "#040508",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(300px, 40vw, 500px)",
          height: "clamp(300px, 40vw, 500px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* 404 code */}
      <h1
        ref={codeRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(6rem, 15vw, 12rem)",
          fontWeight: 700,
          letterSpacing: "-0.05em",
          lineHeight: 0.85,
          color: "rgba(255, 255, 255, 0.06)",
          margin: 0,
          userSelect: "none",
          willChange: "transform, opacity",
        }}
      >
        404
      </h1>

      {/* Heading */}
      <h2
        ref={headingRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "rgba(255, 255, 255, 0.9)",
          margin: "1.5rem 0 1rem",
          willChange: "transform, opacity",
        }}
      >
        Lost in the interface
      </h2>

      {/* Description */}
      <p
        ref={descRef}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
          lineHeight: 1.7,
          color: "rgba(214, 204, 190, 0.4)",
          maxWidth: 400,
          margin: "0 0 clamp(2rem, 4vw, 3rem)",
          willChange: "transform, opacity",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Action */}
      <div ref={actionRef} style={{ willChange: "transform, opacity" }}>
        <button
          type="button"
          onClick={() => void navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "0.875rem 2rem",
            borderRadius: 100,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
            cursor: "pointer",
            transition: "all 0.3s ease",
            outline: "2px solid transparent",
            outlineOffset: 2,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid rgba(255, 255, 255, 0.2)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "2px solid transparent";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to home
        </button>
      </div>
    </div>
  );
}
