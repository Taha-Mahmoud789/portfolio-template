/**
 * BackToTop — Premium Micro Interaction
 *
 * Magnetic cursor, breathing idle, gradient progress ring,
 * haptic click feedback, smart appearance timing.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";

const SIZE = 52;
const STROKE = 2;
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const btnRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const ringGlowRef = useRef<SVGCircleElement>(null);
  const visibleRef = useRef(false);
  const magnetRef = useRef({ x: 0, y: 0 });

  // ── Smart appearance timing ─────────────────────────────────
  useEffect(() => {
    const el = btnRef.current;
    const circle = circleRef.current;
    if (!el || !circle) return;

    // Calculate hero section height for smarter trigger
    const getTriggerPoint = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        return hero.offsetHeight * 0.8;
      }
      return window.innerHeight * 0.7;
    };

    const setProgress = (progress: number) => {
      const offset = CIRCUMFERENCE * (1 - progress);
      gsap.set(circle, { strokeDashoffset: offset });

      // Change ring color based on progress
      const ringGlow = ringGlowRef.current;
      if (ringGlow) {
        if (progress > 0.9) {
          gsap.to(ringGlow, {
            attr: { stroke: "rgba(201, 169, 110, 0.5)" },
            duration: 0.3,
            overwrite: "auto",
          });
        } else if (progress > 0.5) {
          gsap.to(ringGlow, {
            attr: { stroke: "rgba(201, 169, 110, 0.5)" },
            duration: 0.3,
            overwrite: "auto",
          });
        } else {
          gsap.to(ringGlow, {
            attr: { stroke: "rgba(201, 169, 110, 0.5)" },
            duration: 0.3,
            overwrite: "auto",
          });
        }
      }
    };

    const setShow = (show: boolean) => {
      if (show === visibleRef.current) return;
      visibleRef.current = show;

      if (reducedMotion) {
        el.style.opacity = show ? "1" : "0";
        el.style.pointerEvents = show ? "auto" : "none";
        return;
      }

      gsap.to(el, {
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.5,
        y: show ? 0 : 12,
        duration: show ? 0.6 : 0.3,
        ease: show ? ANIMATION_EASINGS.backOut : ANIMATION_EASINGS.expoOut,
        pointerEvents: show ? "auto" : "none",
        overwrite: "auto",
      });
    };

    let ticking = false;
    let rafId = 0;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

          setProgress(progress);
          setShow(scrollY > getTriggerPoint());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // ── Breathing idle animation ────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const el = btnRef.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      scale: 1.03,
      duration: 2.5,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // ── Arrow fluid animation ───────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const arrow = arrowRef.current;
    if (!arrow) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(arrow, {
      y: -2.5,
      duration: 2,
      ease: "sine.inOut",
    });
    tl.to(
      arrow,
      {
        rotation: 3,
        duration: 2,
        ease: "sine.inOut",
      },
      0,
    );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // ── Magnetic cursor effect ──────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const el = btnRef.current;
    if (!el) return;

    let rafId = 0;
    let isHovering = false;

    const onMove = (e: MouseEvent) => {
      if (!isHovering) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const maxDist = 60;

      if (dist < maxDist) {
        const strength = 0.35;
        magnetRef.current.x = distX * strength;
        magnetRef.current.y = distY * strength;
      } else {
        magnetRef.current.x = 0;
        magnetRef.current.y = 0;
      }
    };

    const animate = () => {
      gsap.to(el, {
        x: magnetRef.current.x,
        y: magnetRef.current.y,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      isHovering = true;
      animate();
    };

    const onLeave = () => {
      isHovering = false;
      magnetRef.current.x = 0;
      magnetRef.current.y = 0;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: ANIMATION_EASINGS.backOut,
        overwrite: "auto",
      });
      cancelAnimationFrame(rafId);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // ── Hover interaction ───────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;
    const el = btnRef.current;
    const arrow = arrowRef.current;
    const glow = glowRef.current;
    if (!el) return;

    gsap.to(el, {
      scale: 1.15,
      duration: 0.5,
      ease: ANIMATION_EASINGS.backOut,
      overwrite: "auto",
    });

    if (arrow) {
      gsap.to(arrow, {
        y: -4,
        scale: 1.1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.backOut,
        overwrite: "auto",
      });
    }

    if (glow) {
      gsap.to(glow, {
        opacity: 0.7,
        scale: 1.3,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;
    const el = btnRef.current;
    const arrow = arrowRef.current;
    const glow = glowRef.current;
    if (!el) return;

    gsap.to(el, {
      scale: 1,
      duration: 0.5,
      ease: ANIMATION_EASINGS.backOut,
      overwrite: "auto",
    });

    if (arrow) {
      gsap.to(arrow, {
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.backOut,
        overwrite: "auto",
      });
    }

    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [reducedMotion]);

  // ── Click experience ────────────────────────────────────────
  const handleClick = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;

    if (!reducedMotion) {
      // Haptic press animation
      const tl = gsap.timeline();
      tl.to(el, {
        scale: 0.82,
        duration: 0.1,
        ease: "power3.in",
      });
      tl.to(el, {
        scale: 1.08,
        duration: 0.15,
        ease: "power2.out",
      });
      tl.to(el, {
        scale: 1,
        duration: 0.4,
        ease: ANIMATION_EASINGS.backOut,
      });

      // Pulse glow on click
      const glow = glowRef.current;
      if (glow) {
        gsap.to(glow, {
          opacity: 1,
          scale: 1.8,
          duration: 0.3,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }

      // Arrow flash upward
      const arrow = arrowRef.current;
      if (arrow) {
        gsap.to(arrow, {
          y: -10,
          duration: 0.2,
          ease: "power3.out",
          yoyo: true,
          repeat: 1,
        });
      }
    }

    scrollTo("#hero");
  }, [scrollTo, reducedMotion]);

  // ── Focus state ─────────────────────────────────────────────
  const handleFocus = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    gsap.to(el, {
      scale: 1.1,
      duration: 0.3,
      ease: ANIMATION_EASINGS.backOut,
      overwrite: "auto",
    });
  }, []);

  const handleBlur = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    gsap.to(el, {
      scale: 1,
      duration: 0.3,
      ease: ANIMATION_EASINGS.backOut,
      overwrite: "auto",
    });
  }, []);

  const viewbox = `0 0 ${String(SIZE)} ${String(SIZE)}`;

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "clamp(1.25rem, 3vw, 2rem)",
        right: "clamp(1.25rem, 3vw, 2rem)",
        zIndex: 50,
        width: SIZE,
        height: SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "rgba(8, 7, 6, 0.75)",
        border: "1px solid rgba(245, 240, 232, 0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow:
          "0 8px 32px rgba(8, 7, 6, 0.5), 0 2px 8px rgba(8, 7, 6, 0.3), inset 0 1px 0 rgba(245, 240, 232, 0.06)",
        cursor: "pointer",
        opacity: 0,
        pointerEvents: "none",
        transform: "scale(0.5) translateY(12px)",
        willChange: "transform, opacity",
        padding: 0,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Glow layer */}
      <span
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -12,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.2) 0%, transparent 70%)",
          opacity: 0,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      />

      {/* SVG progress ring */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={viewbox}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
          pointerEvents: "none",
        }}
      >
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(245, 240, 232, 0.06)"
          strokeWidth={STROKE}
        />
        {/* Progress glow */}
        <circle
          ref={ringGlowRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(201, 169, 110, 0.5)"
          strokeWidth={STROKE + 4}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          strokeLinecap="round"
          style={{
            filter: "blur(4px)",
            transition: "none",
          }}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(201, 169, 110, 0.7)"
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          strokeLinecap="round"
          style={{ transition: "none" }}
        />
      </svg>

      {/* Arrow icon */}
      <svg
        ref={arrowRef}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(245, 240, 232, 0.7)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          position: "relative",
          willChange: "transform",
        }}
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
