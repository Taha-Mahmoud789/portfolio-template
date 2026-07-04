/**
 * CustomCursor — Minimal dot cursor with contextual labels
 *
 * Single dot that grows on hover. Shows contextual text labels:
 * VIEW (projects), CONNECT (contact), EXPLORE (case studies), GO (nav).
 * Clean, minimal, modern. Disabled on touch. Respects reduced motion.
 */

import { useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

type CursorVariant = "default" | "link" | "project" | "contact" | "case-study" | "nav" | "text";

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
      node.id === "contact" ||
      node.classList.contains("contact-method-link") ||
      node.classList.contains("copy-email-btn")
    ) {
      return "contact";
    }
    if (node.classList.contains("cs-project-nav-card") || node.dataset.cursor === "case-study") {
      return "case-study";
    }
    if (
      node.classList.contains("cm-link") ||
      node.classList.contains("cmd-item") ||
      node.classList.contains("nav-link")
    ) {
      return "nav";
    }
    if (
      node.tagName === "BUTTON" ||
      node.tagName === "A" ||
      node.role === "button" ||
      node.classList.contains("cta-primary-btn") ||
      node.classList.contains("nav-cta-btn") ||
      node.classList.contains("back-to-top-btn")
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

const SIZES: Record<CursorVariant, number> = {
  default: 14,
  link: 44,
  nav: 38,
  project: 56,
  contact: 44,
  "case-study": 50,
  text: 10,
};

const VARIANT_LABELS: Partial<Record<CursorVariant, string>> = {
  project: "VIEW",
  contact: "CONNECT",
  "case-study": "EXPLORE",
  nav: "GO",
};

export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<CursorVariant>("default");
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);
  const labelOpacityRef = useRef(0);
  const labelTargetRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const variant = getVariant(target);
    variantRef.current = variant;

    const dot = dotRef.current;
    if (!dot) return;

    const size = SIZES[variant];
    const hasLabel = variant in VARIANT_LABELS;

    gsap.to(dot, {
      width: size,
      height: size,
      background:
        variant === "default" || variant === "text"
          ? "rgba(245, 240, 232, 0.8)"
          : "rgba(245, 240, 232, 0.12)",
      border:
        variant === "default" || variant === "text"
          ? "none"
          : "1px solid rgba(245, 240, 232, 0.25)",
      duration: 0.4,
      ease: ANIMATION_EASINGS.expoOut,
    });

    // Set label target — RAF loop handles position + opacity
    if (hasLabel) {
      const label = labelRef.current;
      if (label) label.textContent = VARIANT_LABELS[variant] ?? "";
      labelTargetRef.current = 1;
    } else {
      labelTargetRef.current = 0;
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    variantRef.current = "default";
    labelTargetRef.current = 0;

    const dot = dotRef.current;
    if (!dot) return;

    gsap.to(dot, {
      width: SIZES.default,
      height: SIZES.default,
      background: "rgba(245, 240, 232, 0.8)",
      border: "none",
      duration: 0.35,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    if (reducedMotion || isTouchDevice()) return;

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot) return;

    const quickX = gsap.quickTo(dot, "left", { duration: 0.08, ease: "power3" });
    const quickY = gsap.quickTo(dot, "top", { duration: 0.08, ease: "power3" });

    const tick = () => {
      const { x, y } = mouseRef.current;
      const size = SIZES[variantRef.current];

      quickX(x - size / 2);
      quickY(y - size / 2);

      // Label — single system, no GSAP conflicts
      if (label) {
        const target = labelTargetRef.current;
        const current = labelOpacityRef.current;
        const next = current + (target - current) * 0.15;
        labelOpacityRef.current = next;

        if (next > 0.01) {
          label.style.opacity = String(next);
          label.style.transform = `translate(${String(x - 16)}px, ${String(y + size / 2 + 10)}px)`;
        } else {
          label.style.opacity = "0";
        }
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        dot.style.opacity = "1";
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
        style={{
          position: "fixed",
          width: SIZES.default,
          height: SIZES.default,
          borderRadius: "50%",
          background: "rgba(245, 240, 232, 0.8)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "left, top, width, height",
          left: -999,
          top: -999,
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "rgba(245, 240, 232, 0.8)",
          left: -999,
          top: -999,
          willChange: "transform",
        }}
      />
    </>,
    document.body,
  );
}
