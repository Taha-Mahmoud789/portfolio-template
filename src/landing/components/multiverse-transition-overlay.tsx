/**
 * Multiverse Transition Overlay
 *
 * Cinematic portal transition between Portfolio and Multiverse.
 *
 * Enter: Trigger element → dark backdrop → portal ring expands →
 *         route change → multiverse hub revealed → overlay fades.
 * Exit:  Multiverse hub → overlay fades in → portal ring collapses →
 *         route change → landing page revealed → overlay fades.
 *
 * Reduced motion: instant crossfade, no portal animation.
 * No-JS: overlay never renders, navigation works directly.
 */

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useMultiverseTransition } from "./multiverse-transition-store";

// ============================================================================
// Overlay
// ============================================================================

export function MultiverseTransitionOverlay() {
  const reducedMotion = useReducedMotion();
  const { phase, triggerRect, setEntering, setActive, completeReturn } = useMultiverseTransition();

  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Cleanup on unmount — kill any running timeline, restore body overflow
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  // ── Enter transition: portal-open phase ─────────────────────────────
  useEffect(() => {
    if (
      phase !== "portal-open" ||
      !triggerRect ||
      !overlayRef.current ||
      !backdropRef.current ||
      !portalRef.current ||
      !ringRef.current
    )
      return;

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const portal = portalRef.current;
    const ring = ringRef.current;
    const ring2 = ring2Ref.current;
    const ring3 = ring3Ref.current;

    // Calculate portal origin from trigger center
    const originX = triggerRect.left + triggerRect.width / 2;
    const originY = triggerRect.top + triggerRect.height / 2;

    if (reducedMotion) {
      gsap.set(overlay, { display: "block" });
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(portal, { scale: 1, opacity: 1 });
      gsap.set(ring, { scale: 1, opacity: 0 });
      if (ring2) gsap.set(ring2, { scale: 1, opacity: 0 });
      if (ring3) gsap.set(ring3, { scale: 1, opacity: 0 });
      setEntering();
      return;
    }

    // Show overlay
    gsap.set(overlay, { display: "block" });

    // Set transform origin to trigger center
    const allRings = [ring, ring2, ring3].filter(Boolean) as HTMLElement[];

    // Apply will-change during animation
    gsap.set([portal, ...allRings], { willChange: "transform,opacity" });

    gsap.set([portal, ...allRings], {
      transformOrigin: `${String(originX)}px ${String(originY)}px`,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Remove will-change after animation completes
        gsap.set([portal, ...allRings], { willChange: "auto" });
        setEntering();
      },
    });
    tlRef.current = tl;

    // Backdrop darken — slow, cinematic
    tl.to(backdrop, { opacity: 1, duration: 0.8, ease: "power2.inOut" }, 0);

    // Portal: tiny dot → expand to fill viewport
    gsap.set(portal, { scale: 0.02, opacity: 1 });
    tl.to(portal, { scale: 1, duration: 1.1, ease: "expo.inOut" }, 0);

    // Ring 1: primary — pulse outward then fade
    gsap.set(ring, { scale: 0.02, opacity: 0.6 });
    tl.to(ring, { scale: 1.15, opacity: 0, duration: 1.0, ease: "expo.out" }, 0.03);

    // Ring 2: secondary — delayed, slower, wider
    if (ring2) {
      gsap.set(ring2, { scale: 0.02, opacity: 0.4 });
      tl.to(ring2, { scale: 1.3, opacity: 0, duration: 1.2, ease: "expo.out" }, 0.1);
    }

    // Ring 3: tertiary — most delayed, ethereal
    if (ring3) {
      gsap.set(ring3, { scale: 0.02, opacity: 0.25 });
      tl.to(ring3, { scale: 1.5, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.18);
    }
  }, [phase, triggerRect, reducedMotion, setEntering]);

  // ── Enter transition: entering → reveal hub ─────────────────────────
  useEffect(() => {
    if (phase !== "entering" || !overlayRef.current || !backdropRef.current) return;

    const timer = setTimeout(() => {
      const overlay = overlayRef.current;
      const backdrop = backdropRef.current;
      if (!overlay || !backdrop) return;

      document.body.style.overflow = "";

      if (reducedMotion) {
        gsap.set(overlay, { display: "none" });
        gsap.set(backdrop, { opacity: 0 });
        setActive();
        return;
      }

      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
      });

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none", opacity: 1 });
          setActive();
        },
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [phase, reducedMotion, setActive]);

  // ── Exit transition: exiting phase ──────────────────────────────────
  useEffect(() => {
    if (
      phase !== "exiting" ||
      !overlayRef.current ||
      !backdropRef.current ||
      !portalRef.current ||
      !ringRef.current
    )
      return;

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const portal = portalRef.current;
    const ring = ringRef.current;
    const ring2 = ring2Ref.current;
    const ring3 = ring3Ref.current;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    document.body.style.overflow = "hidden";

    if (reducedMotion) {
      document.body.style.overflow = "";
      gsap.set(overlay, { display: "none" });
      gsap.set(backdrop, { opacity: 0 });
      completeReturn();
      return;
    }

    gsap.set(overlay, { display: "block", opacity: 1 });
    gsap.set(backdrop, { opacity: 1 });
    gsap.set(portal, { scale: 1, opacity: 1 });

    const allRings = [ring, ring2, ring3].filter(Boolean) as HTMLElement[];
    gsap.set(allRings, { scale: 1, opacity: 0 });

    const tl = gsap.timeline({
      delay: 0.15,
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        gsap.set([portal, ...allRings], { willChange: "auto" });
        document.body.style.overflow = "";
        completeReturn();
      },
    });
    tlRef.current = tl;

    // Apply will-change during animation
    gsap.set([portal, ...allRings], { willChange: "transform,opacity" });

    // Portal: full viewport → collapse to center dot
    const centerX = vw / 2;
    const centerY = vh / 2;
    gsap.set([portal, ...allRings], {
      transformOrigin: `${String(centerX)}px ${String(centerY)}px`,
    });

    tl.to(portal, { scale: 0.02, opacity: 0, duration: 1.0, ease: "expo.inOut" }, 0);

    // Rings: staggered collapse with outward pulse
    gsap.set(ring, { scale: 0.3, opacity: 0.5 });
    tl.to(ring, { scale: 1.4, opacity: 0, duration: 0.9, ease: "expo.out" }, 0);

    if (ring2) {
      gsap.set(ring2, { scale: 0.2, opacity: 0.35 });
      tl.to(ring2, { scale: 1.6, opacity: 0, duration: 1.0, ease: "expo.out" }, 0.08);
    }

    if (ring3) {
      gsap.set(ring3, { scale: 0.15, opacity: 0.2 });
      tl.to(ring3, { scale: 1.8, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.16);
    }

    // Backdrop fade — delayed so rings are visible during collapse
    tl.to(backdrop, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0.35);
  }, [phase, reducedMotion, completeReturn]);

  // Don't render if idle or active (no animation running)
  if (phase === "idle" || phase === "active") return null;

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
          background: "#050507",
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
        {/* Portal circle */}
        <div
          ref={portalRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(201, 169, 110, 0.06) 0%, rgba(8, 7, 6, 0.95) 60%, #050507 100%)",
          }}
        />

        {/* Expanding ring — primary */}
        <div
          ref={ringRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vmax",
            height: "100vmax",
            marginTop: "-50vmax",
            marginLeft: "-50vmax",
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.12)",
          }}
        />

        {/* Expanding ring — secondary */}
        <div
          ref={ring2Ref}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vmax",
            height: "100vmax",
            marginTop: "-50vmax",
            marginLeft: "-50vmax",
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.07)",
          }}
        />

        {/* Expanding ring — tertiary */}
        <div
          ref={ring3Ref}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vmax",
            height: "100vmax",
            marginTop: "-50vmax",
            marginLeft: "-50vmax",
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.04)",
          }}
        />
      </div>
    </>,
    document.body,
  );
}
