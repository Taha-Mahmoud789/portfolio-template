/**
 * MagneticLink — premium hover effect
 *
 * Wraps any element. On mouse move, the child follows the cursor
 * with configurable strength. On mouse leave, snaps back with easing.
 * Uses transform only (60fps, no layout thrashing).
 * Disabled on touch devices.
 */

import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";

interface MagneticLinkProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function MagneticLink({
  children,
  strength = 0.3,
  className = "",
  onClick,
}: MagneticLinkProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice()) return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice()) return;
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: ANIMATION_EASINGS.expoOut,
      overwrite: "auto",
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
