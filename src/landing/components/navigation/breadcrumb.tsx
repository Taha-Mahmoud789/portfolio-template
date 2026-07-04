/**
 * Breadcrumb — animated location indicator
 *
 * Minimal, animated breadcrumb for project pages.
 * Shows: Home / Projects / Project Name
 * Uses clip-path reveal animation.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "@/landing/hooks";

interface BreadcrumbProps {
  items: { label: string; href?: string; isCurrent?: boolean }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reducedMotion) return;

    const els = ref.current.querySelectorAll<HTMLElement>("[data-bc-item]");
    gsap.fromTo(
      els,
      { opacity: 0, x: -8 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: ANIMATION_EASINGS.expoOut,
        delay: 0.3,
      },
    );
  }, [reducedMotion]);

  return (
    <nav ref={ref} aria-label="Breadcrumb" className="cs-breadcrumb">
      <ol className="cs-breadcrumb-list">
        {items.map((item, i) => (
          <li key={item.label} className="cs-breadcrumb-item" data-bc-item>
            {i > 0 && (
              <span className="cs-breadcrumb-sep" aria-hidden="true">
                /
              </span>
            )}
            {item.href && !item.isCurrent ? (
              <a href={item.href} className="cs-breadcrumb-link">
                {item.label}
              </a>
            ) : (
              <span className="cs-breadcrumb-current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
