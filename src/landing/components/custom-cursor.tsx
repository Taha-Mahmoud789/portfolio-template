/**
 * CustomCursor — Cinematic cursor system
 *
 * Minimal dot + smooth follower circle.
 * States: default, link, project (with "VIEW" text), text.
 * Magnetic feel on buttons.
 * Disabled on touch/mobile. Respects prefers-reduced-motion.
 * GSAP quickTo for 60fps transforms only.
 */

import { useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

type CursorVariant = "default" | "link" | "project" | "text";

const DOT_SIZE = 6;
const FOLLOWER_SIZE = 36;
const LINK_SIZE = 48;
const PROJECT_SIZE = 72;

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
      return "link";
    }
    if (
      node.dataset.cursor === "project" ||
      node.dataset.projects === "row" ||
      node.dataset.projects === "preview"
    ) {
      return "project";
    }
    if (
      node.dataset.cursor === "text" ||
      node.tagName === "P" ||
      node.tagName === "H1" ||
      node.tagName === "H2" ||
      node.tagName === "H3" ||
      node.tagName === "H4" ||
      node.tagName === "H5" ||
      node.tagName === "H6"
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
  const labelRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<CursorVariant>("default");
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const variant = getVariant(target);
    variantRef.current = variant;

    const follower = followerRef.current;
    const label = labelRef.current;
    if (!follower) return;

    switch (variant) {
      case "link":
        gsap.to(follower, {
          width: LINK_SIZE,
          height: LINK_SIZE,
          borderColor: "rgba(255, 255, 255, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
        }
        if (label) {
          gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
        }
        break;
      case "project":
        gsap.to(follower, {
          width: PROJECT_SIZE,
          height: PROJECT_SIZE,
          borderColor: "rgba(255, 255, 255, 0.25)",
          background: "rgba(255, 255, 255, 0.04)",
          duration: 0.4,
          ease: ANIMATION_EASINGS.expoOut,
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
        }
        if (label) {
          gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
        }
        break;
      case "text":
        gsap.to(follower, {
          width: 28,
          height: 28,
          borderColor: "rgba(255, 255, 255, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
        if (label) {
          gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
        }
        break;
      default:
        gsap.to(follower, {
          width: FOLLOWER_SIZE,
          height: FOLLOWER_SIZE,
          borderColor: "rgba(255, 255, 255, 0.1)",
          background: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
        }
        if (label) {
          gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
        }
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    variantRef.current = "default";

    const follower = followerRef.current;
    if (!follower) return;

    gsap.to(follower, {
      width: FOLLOWER_SIZE,
      height: FOLLOWER_SIZE,
      borderColor: "rgba(255, 255, 255, 0.1)",
      background: "transparent",
      duration: 0.3,
      ease: "power2.out",
    });
    if (dotRef.current) {
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    }
    if (labelRef.current) {
      gsap.to(labelRef.current, { opacity: 0, scale: 0.8, duration: 0.2 });
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || isTouchDevice()) return;

    const dot = dotRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    if (!dot || !follower) return;

    const quickX = gsap.quickTo(follower, "left", {
      duration: 0.15,
      ease: "power3",
    });
    const quickY = gsap.quickTo(follower, "top", {
      duration: 0.15,
      ease: "power3",
    });

    const tick = () => {
      const { x, y } = mouseRef.current;

      dot.style.left = "0";
      dot.style.top = "0";
      dot.style.transform = `translate(${String(x - DOT_SIZE / 2)}px, ${String(y - DOT_SIZE / 2)}px)`;

      quickX(x - FOLLOWER_SIZE / 2);
      quickY(y - FOLLOWER_SIZE / 2);

      // Label follows cursor (for "VIEW" text)
      if (label && variantRef.current === "project") {
        label.style.left = "0";
        label.style.top = "0";
        label.style.transform = `translate(${String(x - 16)}px, ${String(y + PROJECT_SIZE / 2 + 8)}px)`;
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
          border: "1px solid rgba(255, 255, 255, 0.1)",
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
        ref={labelRef}
        aria-hidden="true"
        data-cursor-label
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 99997,
          opacity: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.5625rem",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "rgba(255, 255, 255, 0.8)",
          left: -999,
          top: -999,
          willChange: "transform",
          transform: "scale(0.8)",
        }}
      >
        VIEW
      </div>
    </>,
    document.body,
  );
}
