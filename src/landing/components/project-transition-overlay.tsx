/**
 * Project Transition Overlay
 *
 * Cinematic shared-element transition between Project Showcase and Project Detail.
 *
 * Forward: Clone preview at source rect → expand to fill viewport →
 *          dissolve to reveal project page behind.
 * Back:    Full viewport → shrink clone → fade to reveal landing page.
 *
 * The clone carries the preview's visual identity (glow orbs, grid, number)
 * so the transition feels like the actual preview is expanding, not a proxy.
 *
 * No-JS fallback: overlay never renders, navigation works directly.
 * Reduced motion: instant crossfade, no scale animation.
 */

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useTransitionStore } from "./project-transition-store";

// ============================================================================
// Overlay
// ============================================================================

export function ProjectTransitionOverlay() {
  const reducedMotion = useReducedMotion();
  const { phase, fromRect, accentRgb, projectNumber, scrollY, setIdle, completeReturn } =
    useTransitionStore();

  const overlayRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // ── Forward transition: expanding phase ──────────────────────────────
  useEffect(() => {
    if (
      phase !== "expanding" ||
      !fromRect ||
      !overlayRef.current ||
      !cloneRef.current ||
      !backdropRef.current
    )
      return;

    const overlay = overlayRef.current;
    const clone = cloneRef.current;
    const backdrop = backdropRef.current;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Calculate target: full viewport cover
    const scaleX = vw / fromRect.width;
    const scaleY = vh / fromRect.height;
    const targetScale = Math.max(scaleX, scaleY) * 1.08;

    const targetX = vw / 2 - (fromRect.left + fromRect.width / 2);
    const targetY = vh / 2 - (fromRect.top + fromRect.height / 2);

    if (reducedMotion) {
      // Instant crossfade
      gsap.set(overlay, { display: "block" });
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(clone, {
        scale: targetScale,
        x: targetX,
        y: targetY - scrollY,
        borderRadius: 0,
      });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        useTransitionStore.getState().setEntering();
      },
    });

    // Show overlay
    gsap.set(overlay, { display: "block" });

    // Backdrop darken — slow, cinematic
    tl.to(
      backdrop,
      {
        opacity: 1,
        duration: 0.7,
        ease: "power2.inOut",
      },
      0,
    );

    // Clone: scale up + center + remove border radius — TRIONN-style easing
    tl.to(
      clone,
      {
        scale: targetScale,
        x: targetX,
        y: targetY - scrollY,
        borderRadius: 0,
        duration: 0.9,
        ease: "expo.inOut",
      },
      0,
    );

    // Clone inner glow intensifies during expansion
    const cloneGlow = clone.querySelector<HTMLElement>("[data-clone-glow]");
    if (cloneGlow) {
      tl.to(
        cloneGlow,
        {
          opacity: 0.3,
          scale: 1.3,
          duration: 0.9,
          ease: "expo.inOut",
        },
        0,
      );
    }

    // Clone number fades up and out during expansion
    const cloneNumber = clone.querySelector<HTMLElement>("[data-clone-number]");
    if (cloneNumber) {
      tl.to(
        cloneNumber,
        {
          y: -40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
        },
        0.1,
      );
    }
  }, [phase, fromRect, reducedMotion, scrollY]);

  // ── Forward transition: entering → reveal complete ───────────────────
  useEffect(() => {
    if (phase !== "entering" || !overlayRef.current || !backdropRef.current) return;

    // Wait for project page to mount and begin rendering, then dissolve overlay
    const timer = setTimeout(() => {
      const overlay = overlayRef.current;
      const backdrop = backdropRef.current;
      if (!overlay || !backdrop) return;

      // Unlock body scroll — page is now interactive
      document.body.style.overflow = "";

      if (reducedMotion) {
        gsap.set(overlay, { display: "none" });
        gsap.set(backdrop, { opacity: 0 });
        setIdle();
        return;
      }

      // Dissolve backdrop
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });

      // Dissolve overlay — reveals project page content behind
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none", opacity: 1 });
          setIdle();
        },
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [phase, reducedMotion, setIdle]);

  // ── Back transition: returning phase ─────────────────────────────────
  useEffect(() => {
    if (phase !== "returning" || !overlayRef.current || !cloneRef.current || !backdropRef.current)
      return;

    const overlay = overlayRef.current;
    const clone = cloneRef.current;
    const backdrop = backdropRef.current;

    // Lock body scroll during back transition
    document.body.style.overflow = "hidden";

    if (reducedMotion) {
      document.body.style.overflow = "";
      gsap.set(overlay, { display: "none" });
      gsap.set(backdrop, { opacity: 0 });
      completeReturn();
      return;
    }

    // Show overlay with current viewport state
    gsap.set(overlay, { display: "block", opacity: 1 });
    gsap.set(backdrop, { opacity: 1 });

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Start from full viewport, animate back to small
    gsap.set(clone, {
      scale: Math.max(vw / 200, vh / 200),
      x: 0,
      y: 0,
      borderRadius: 0,
      opacity: 1,
    });

    // Delay shrink animation to let the landing page mount and scroll
    const tl = gsap.timeline({
      delay: 0.35,
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        document.body.style.overflow = "";
        completeReturn();
      },
    });

    // Clone: shrink back — the reverse of expansion
    tl.to(
      clone,
      {
        scale: 0.2,
        opacity: 0,
        duration: 0.9,
        ease: "expo.inOut",
      },
      0,
    );

    // Backdrop fade out — delayed slightly so clone shrinks first
    tl.to(
      backdrop,
      {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
      },
      0.25,
    );
  }, [phase, reducedMotion, completeReturn]);

  // Don't render if idle
  if (phase === "idle") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "#080706",
          opacity: 0,
          pointerEvents: "all",
        }}
      />

      {/* Overlay container */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "none",
          pointerEvents: "all",
        }}
      >
        {/* Cloned preview — carries real visual identity */}
        <div
          ref={cloneRef}
          style={{
            position: "absolute",
            top: fromRect?.top ?? 0,
            left: fromRect?.left ?? 0,
            width: fromRect?.width ?? 0,
            height: fromRect?.height ?? 0,
            borderRadius: 12,
            overflow: "hidden",
            background: accentRgb
              ? `linear-gradient(180deg, rgba(${accentRgb}, 0.04) 0%, rgba(8, 7, 6, 0.6) 100%)`
              : "#080706",
            willChange: "transform",
            transformOrigin: "center center",
          }}
        >
          {/* Main ambient glow — matches preview */}
          <div
            data-clone-glow
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              borderRadius: "50%",
              background: accentRgb
                ? `radial-gradient(circle, rgba(${accentRgb}, 0.15) 0%, rgba(${accentRgb}, 0.04) 40%, transparent 70%)`
                : "none",
              filter: "blur(80px)",
              opacity: 0.15,
              willChange: "transform, opacity",
            }}
          />

          {/* Secondary orb — matches preview */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              right: "15%",
              width: "35%",
              height: "50%",
              borderRadius: "50%",
              background: accentRgb
                ? `radial-gradient(circle, rgba(${accentRgb}, 0.08) 0%, transparent 60%)`
                : "none",
              filter: "blur(60px)",
            }}
          />

          {/* Grid texture — matches preview */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.015,
              backgroundImage:
                "linear-gradient(rgba(245,240,232,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.1) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Number watermark — fades during expansion */}
          <div
            data-clone-number
            style={{
              position: "absolute",
              bottom: "-5%",
              right: "-2%",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(10rem, 25vw, 20rem)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.8,
              color: accentRgb ? `rgba(${accentRgb}, 0.03)` : "rgba(245,240,232,0.02)",
              userSelect: "none",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            {projectNumber ?? "01"}
          </div>

          {/* Vignette overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(8, 7, 6, 0.3) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </>,
    document.body,
  );
}
