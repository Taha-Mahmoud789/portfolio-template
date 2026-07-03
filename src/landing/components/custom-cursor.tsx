/**
 * CustomCursor — Premium cursor system
 *
 * Small dot + smooth follower circle.
 * Hover states: button (expand+glow), card (scale), text (minimal), magnetic (attract).
 * Disabled on touch/mobile. Respects prefers-reduced-motion.
 * GSAP quickTo for 60fps transforms only.
 */

import { useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";

type CursorVariant = "default" | "button" | "card" | "text" | "magnetic";

const DOT_SIZE = 8;
const FOLLOWER_SIZE = 40;
const BUTTON_SIZE = 56;
const BUTTON_GLOW_SIZE = 72;
const MAGNETIC_RANGE = 120;
const MAGNETIC_STRENGTH = 0.35;

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return true;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

function getVariant(el: HTMLElement | null): CursorVariant {
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    if (
      node.tagName === "BUTTON" ||
      node.tagName === "A" ||
      node.role === "button" ||
      node.classList.contains("cta-primary-btn") ||
      node.classList.contains("nav-cta-btn") ||
      node.classList.contains("back-to-top-btn") ||
      node.classList.contains("copy-email-btn") ||
      node.classList.contains("contact-submit-btn") ||
      node.classList.contains("contact-method-link")
    ) {
      return "button";
    }
    if (
      node.dataset.cursor === "magnetic" ||
      node.classList.contains("nav-logo")
    ) {
      return "magnetic";
    }
    if (
      node.dataset.cursor === "card" ||
      node.dataset.projects === "card" ||
      node.dataset.expertise === "card" ||
      node.dataset.howIWork === "card" ||
      node.dataset.whyWork === "card" ||
      node.classList.contains("step-card") ||
      node.classList.contains("value-card")
    ) {
      return "card";
    }
    if (
      node.dataset.cursor === "text" ||
      node.tagName === "P" ||
      node.tagName === "H1" ||
      node.tagName === "H2" ||
      node.tagName === "H3" ||
      node.tagName === "H4" ||
      node.tagName === "H5" ||
      node.tagName === "H6" ||
      node.tagName === "SPAN"
    ) {
      return "text";
    }
    node = node.parentElement;
  }
  return "default";
}

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<CursorVariant>("default");
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const magneticTargetRef = useRef<{ x: number; y: number } | null>(null);
  const visibleRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;

    if (variantRef.current === "magnetic") {
      const target = magneticTargetRef.current;
      if (target) {
        const dx = target.x - e.clientX;
        const dy = target.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAGNETIC_RANGE) {
          const pull = (1 - dist / MAGNETIC_RANGE) * MAGNETIC_STRENGTH;
          mouseRef.current.x += dx * pull;
          mouseRef.current.y += dy * pull;
        }
      }
    }
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const variant = getVariant(target);
    variantRef.current = variant;

    if (variant === "magnetic") {
      const node = target.closest("[data-cursor='magnetic'], .nav-logo");
      if (node) {
        const rect = node.getBoundingClientRect();
        magneticTargetRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    } else {
      magneticTargetRef.current = null;
    }

    const follower = followerRef.current;
    const glow = glowRef.current;
    if (!follower) return;

    switch (variant) {
      case "button":
        gsap.to(follower, {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderColor: "rgba(99, 102, 241, 0.5)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (dotRef.current) dotRef.current.style.transform += " scale(0)";
        if (glow) {
          gsap.to(glow, {
            opacity: 0.15,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        break;
      case "card":
        gsap.to(follower, {
          width: 52,
          height: 52,
          borderColor: "rgba(99, 102, 241, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.2 });
        break;
      case "text":
        gsap.to(follower, {
          width: 32,
          height: 32,
          borderColor: "rgba(255, 255, 255, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.2 });
        break;
      case "magnetic":
        gsap.to(follower, {
          width: 48,
          height: 48,
          borderColor: "rgba(99, 102, 241, 0.4)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.2 });
        break;
      default:
        gsap.to(follower, {
          width: FOLLOWER_SIZE,
          height: FOLLOWER_SIZE,
          borderColor: "rgba(255, 255, 255, 0.12)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.2 });
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    variantRef.current = "default";
    magneticTargetRef.current = null;

    const follower = followerRef.current;
    const glow = glowRef.current;
    if (!follower) return;

    gsap.to(follower, {
      width: FOLLOWER_SIZE,
      height: FOLLOWER_SIZE,
      borderColor: "rgba(255, 255, 255, 0.12)",
      duration: 0.3,
      ease: "power2.out",
    });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.2 });
  }, []);

  useEffect(() => {
    if (reducedMotion || isTouchDevice()) return;

    const dot = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    const quickX = gsap.quickTo(follower, "left", {
      duration: 0.15,
      ease: "power3",
    });
    const quickY = gsap.quickTo(follower, "top", {
      duration: 0.15,
      ease: "power3",
    });

    let quickGlowX: ReturnType<typeof gsap.quickTo> | null = null;
    let quickGlowY: ReturnType<typeof gsap.quickTo> | null = null;
    if (glowRef.current) {
      quickGlowX = gsap.quickTo(glowRef.current, "left", {
        duration: 0.2,
        ease: "power3",
      });
      quickGlowY = gsap.quickTo(glowRef.current, "top", {
        duration: 0.2,
        ease: "power3",
      });
    }

    const tick = () => {
      const { x, y } = mouseRef.current;

      dot.style.left = "0";
      dot.style.top = "0";
      dot.style.transform = `translate(${String(x - DOT_SIZE / 2)}px, ${String(y - DOT_SIZE / 2)}px)`;

      quickX(x - FOLLOWER_SIZE / 2);
      quickY(y - FOLLOWER_SIZE / 2);

      if (quickGlowX && quickGlowY) {
        quickGlowX(x - BUTTON_GLOW_SIZE / 2);
        quickGlowY(y - BUTTON_GLOW_SIZE / 2);
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        dot.style.opacity = "1";
        follower.style.opacity = "1";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("custom-cursor-active");

    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      visibleRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reducedMotion, handleMouseMove, handleMouseOver, handleMouseOut]);

  if (reducedMotion || isTouchDevice()) return null;

  return createPortal(
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        data-cursor-dot
        style={{
          position: "fixed",
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: "#fff",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform",
          transform: "translate(-999px, -999px)",
        }}
      />

      <div
        ref={followerRef}
        aria-hidden="true"
        data-cursor-follower
        style={{
          position: "fixed",
          width: FOLLOWER_SIZE,
          height: FOLLOWER_SIZE,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          willChange: "left, top",
          left: -999,
          top: -999,
        }}
      />

      <div
        ref={glowRef}
        aria-hidden="true"
        data-cursor-glow
        style={{
          position: "fixed",
          width: BUTTON_GLOW_SIZE,
          height: BUTTON_GLOW_SIZE,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 99997,
          opacity: 0,
          willChange: "left, top, opacity",
          left: -999,
          top: -999,
        }}
      />
    </>,
    document.body,
  );
}
