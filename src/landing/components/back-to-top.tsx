/**
 * BackToTop — Floating scroll-to-top button
 *
 * Fixed bottom-right, glass morphism, gradient border, animated arrow.
 * Shows when scrolled past Hero, hides when back at Hero. GSAP in/out. Accessible.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";

export function BackToTop() {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const btnRef = useRef<HTMLButtonElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    const setShow = (show: boolean) => {
      if (show === visibleRef.current) return;
      visibleRef.current = show;

      if (reducedMotion) {
        el.style.opacity = show ? "1" : "0";
        el.style.pointerEvents = show ? "auto" : "none";
        el.style.transform = show ? "scale(1)" : "scale(0.8)";
        return;
      }

      gsap.to(el, {
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.8,
        duration: 0.4,
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
          // Show button when scrolled past ~80% of viewport height
          const heroHeight = window.innerHeight * 0.8;
          const shouldShow = window.scrollY > heroHeight;
          setShow(shouldShow);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Check initial state
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const handleClick = useCallback(() => {
    scrollTo("#hero");
  }, [scrollTo]);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label="Scroll back to the top of the page"
      className="back-to-top-btn focus-ring"
      style={{
        position: "fixed",
        bottom: "clamp(1.5rem, 3vw, 2rem)",
        right: "clamp(1.5rem, 3vw, 2rem)",
        zIndex: 50,
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        background: "rgba(4, 5, 8, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        cursor: "pointer",
        opacity: 0,
        pointerEvents: "none",
        transform: "scale(0.8)",
        willChange: "transform, opacity",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      }}
    >
      {/* Glow layer */}
      <span
        aria-hidden="true"
        className="back-to-top-glow"
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(216, 216, 216, 0.03) 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="back-to-top-arrow"
        style={{
          position: "relative",
          color: "#a5b4fc",
          transition: "transform 0.3s ease, color 0.3s ease",
        }}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
