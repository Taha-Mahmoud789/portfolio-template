/**
 * CreativeMenu — TRIONN-inspired full-screen navigation overlay
 *
 * Opens from hamburger. Full viewport takeover with large numbered typography.
 * Clip-path reveal animation. Cursor changes. Dramatic hover effects.
 * Focus trap, ESC close, keyboard navigation, ARIA.
 */

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { useReducedMotion } from "@/landing/hooks";

// ============================================================================
// Constants
// ============================================================================

const MENU_ITEMS = [
  { number: "01", label: "HOME", href: "#hero" },
  { number: "02", label: "WORK", href: "#projects" },
  { number: "03", label: "ABOUT", href: "#about" },
  { number: "04", label: "EXPERTISE", href: "#expertise" },
  { number: "05", label: "CONTACT", href: "#contact" },
] as const;

// ============================================================================
// Props
// ============================================================================

interface CreativeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  activeSection?: string;
}

// ============================================================================
// Component
// ============================================================================

export function CreativeMenu({
  isOpen,
  onClose,
  onNavigate,
  activeSection = "#hero",
}: CreativeMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Derive active index from the active section
  const activeIndex = MENU_ITEMS.findIndex((item) => item.href === activeSection);
  const currentActive = activeIndex >= 0 ? activeIndex : 0;

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = String(scrollY);
      document.body.dataset.menuOpen = "true";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
    } else {
      const savedY = document.body.dataset.scrollY ?? "0";
      delete document.body.dataset.menuOpen;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      delete document.body.dataset.scrollY;
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedY, 10));
      });
    }
    return () => {
      delete document.body.dataset.menuOpen;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen]);

  // Open / close animation — clip-path reveal
  useEffect(() => {
    if (!overlayRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const overlay = overlayRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLElement[];
    const extraLinks = overlay.querySelectorAll("[data-menu-extra]");

    if (isOpen) {
      overlay.style.pointerEvents = "auto";
      overlay.style.visibility = "visible";

      const tl = gsap.timeline({
        defaults: { ease: ANIMATION_EASINGS.expoOut },
      });

      // Background clip-path reveal: full → reveal content
      tl.fromTo(
        overlay,
        { clipPath: "inset(0 0% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0 },
      )
        .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        // Items: clip-path from bottom + y translate + opacity
        .fromTo(
          items,
          {
            y: 60,
            opacity: 0,
            clipPath: "inset(0 0% 100% 0)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0% 0% 0)",
            duration: 0.8,
            stagger: 0.08,
            ease: ANIMATION_EASINGS.expoOut,
          },
          "-=0.15",
        )
        // Extra links fade in
        .fromTo(
          extraLinks,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
          "-=0.4",
        );

      timelineRef.current = tl;
    } else {
      const tl = gsap.timeline({
        defaults: { ease: ANIMATION_EASINGS.expoIn },
      });

      tl.to(extraLinks, { y: 16, opacity: 0, duration: 0.2, stagger: 0.02 })
        .to(
          items,
          {
            y: -30,
            opacity: 0,
            clipPath: "inset(0 0% 100% 0)",
            duration: 0.35,
            stagger: 0.04,
          },
          "-=0.1",
        )
        .to(
          overlay,
          {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              overlay.style.pointerEvents = "none";
              overlay.style.visibility = "hidden";
            },
          },
          "-=0.15",
        );

      timelineRef.current = tl;
    }

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [isOpen, reducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = MENU_ITEMS[currentActive];
        if (item) {
          handleNavigate(item.href);
        }
      }
      // Focus trap — cycle Tab within menu items
      if (e.key === "Tab") {
        const focusable = itemsRef.current.filter(Boolean) as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentActive, onClose, onNavigate]);

  // Focus trap — prevent scroll on focus
  useEffect(() => {
    if (!isOpen) return;

    const firstFocusable = itemsRef.current[0];
    if (firstFocusable) {
      requestAnimationFrame(() => {
        firstFocusable.focus({ preventScroll: true });
      });
    }
  }, [isOpen]);

  const handleNavigate = useCallback(
    (href: string) => {
      // Unlock body scroll BEFORE navigating so scrollTo works
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      delete document.body.dataset.menuOpen;

      onClose();
      // Small delay to let overlay close, then navigate
      requestAnimationFrame(() => {
        onNavigate(href);
      });
    },
    [onNavigate, onClose],
  );

  return (
    <div
      ref={overlayRef}
      className="cm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
      style={{
        opacity: 0,
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        visibility: "hidden",
      }}
    >
      {/* Background with grid */}
      <div className="cm-bg" aria-hidden="true">
        <div className="cm-bg-grid" />
      </div>

      {/* Content */}
      <div className="cm-content">
        {/* Main nav items */}
        <nav aria-label="Menu navigation" className="cm-nav">
          <ul className="cm-list" role="menu">
            {MENU_ITEMS.map((item, i) => (
              <li key={item.href} className="cm-item" role="none">
                <button
                  ref={(el) => {
                    itemsRef.current[i] = el;
                  }}
                  type="button"
                  className={`cm-link ${i === currentActive ? "cm-link--active" : ""}`}
                  onClick={() => handleNavigate(item.href)}
                  role="menuitem"
                  aria-label={`Go to ${item.label}`}
                >
                  <span className="cm-link-number">{item.number}</span>
                  <span className="cm-link-label">{item.label}</span>
                  <span className="cm-link-underline" aria-hidden="true" />
                  <span className="cm-link-arrow" aria-hidden="true">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Extra links */}
        <div className="cm-extra">
          <div className="cm-extra-divider" data-menu-extra aria-hidden="true" />
          <div className="cm-extra-row" data-menu-extra>
            <a href="mailto:hello@example.com" className="cm-extra-link" onClick={() => onClose()}>
              hello@example.com
            </a>
            <span className="cm-extra-sep" aria-hidden="true">
              •
            </span>
            <a
              href="#contact"
              className="cm-extra-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("#contact");
              }}
            >
              Available for work
            </a>
          </div>
        </div>

        {/* Close hint */}
        <div className="cm-close-hint" data-menu-extra aria-hidden="true">
          <kbd className="cm-kbd">ESC</kbd>
          <span className="cm-close-text">to close</span>
        </div>
      </div>
    </div>
  );
}
