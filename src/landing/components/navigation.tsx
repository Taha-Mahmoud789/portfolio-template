/**
 * Navigation — TRIONN-inspired premium nav
 *
 * Character-level hover animations with original/clone text layers.
 * Desktop: circle clip-path menu reveal. Mobile: slide-in overlay.
 * Floating pill with glass morphism, scroll-aware states.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { Logo } from "./logo";

// ============================================================================
// Constants
// ============================================================================

const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Contact", href: "#contact" },
] as const;

const SCROLL_THRESHOLD = 10;

// ============================================================================
// CharLink — TRIONN-style character hover with original/clone layers
// ============================================================================

interface CharLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: (href: string) => void;
  size?: "nav" | "menu";
}

function CharLink({ href, label, isActive, onClick, size = "nav" }: CharLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const originalCharsRef = useRef<HTMLSpanElement[]>([]);
  const cloneCharsRef = useRef<HTMLSpanElement[]>([]);

  const handleMouseEnter = useCallback(() => {
    if (!linkRef.current) return;
    const original = originalCharsRef.current;
    const clone = cloneCharsRef.current;

    gsap.to(original, {
      y: -24,
      opacity: 0,
      duration: 0.3,
      stagger: 0.02,
      ease: ANIMATION_EASINGS.expoOut,
    });
    gsap.fromTo(
      clone,
      {
        y: 24,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        ease: ANIMATION_EASINGS.expoOut,
      },
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!linkRef.current) return;
    const original = originalCharsRef.current;
    const clone = cloneCharsRef.current;

    gsap.to(original, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.02,
      ease: ANIMATION_EASINGS.expoOut,
    });
    gsap.to(clone, {
      y: 24,
      opacity: 0,
      duration: 0.3,
      stagger: 0.02,
      ease: ANIMATION_EASINGS.expoOut,
    });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick(href);
    },
    [href, onClick],
  );

  const fontSize = size === "menu" ? "clamp(2rem, 5vw, 3.5rem)" : "clamp(0.75rem, 0.9vw, 0.875rem)";
  const fontWeight = size === "menu" ? 600 : 500;

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex cursor-pointer leading-none overflow-visible select-none"
      style={{
        fontSize,
        fontWeight,
        letterSpacing: size === "menu" ? "-0.02em" : "0.06em",
        textTransform: "uppercase" as const,
        color: isActive ? "#fff" : "rgba(216, 216, 216, 0.5)",
        transition: "color 0.3s ease",
        height: size === "menu" ? "1.2em" : "1em",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Original layer */}
      <span className="inline-flex" aria-hidden="true">
        {label.split("").map((char, i) => (
          <span
            key={`orig-${String(i)}`}
            ref={(el) => {
              if (el) originalCharsRef.current[i] = el;
            }}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
          >
            {char}
          </span>
        ))}
      </span>
      {/* Clone layer (hidden initially) */}
      <span
        className="absolute left-0 top-0 inline-flex opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        {label.split("").map((char, i) => (
          <span
            key={`clone-${String(i)}`}
            ref={(el) => {
              if (el) cloneCharsRef.current[i] = el;
            }}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
          >
            {char}
          </span>
        ))}
      </span>
      {/* Screen reader text */}
      <span className="sr-only">{label}</span>
    </a>
  );
}

// ============================================================================
// Hamburger — animated 3-line → X
// ============================================================================

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

function Hamburger({ isOpen, onClick }: HamburgerProps) {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current || !line3Ref.current) return;

    if (isOpen) {
      gsap.to(line1Ref.current, {
        y: 7,
        rotation: 45,
        duration: 0.35,
        ease: ANIMATION_EASINGS.backOut,
      });
      gsap.to(line2Ref.current, {
        opacity: 0,
        scaleX: 0,
        duration: 0.2,
        ease: ANIMATION_EASINGS.expoIn,
      });
      gsap.to(line3Ref.current, {
        y: -7,
        rotation: -45,
        duration: 0.35,
        ease: ANIMATION_EASINGS.backOut,
      });
    } else {
      gsap.to(line1Ref.current, {
        y: 0,
        rotation: 0,
        duration: 0.35,
        ease: ANIMATION_EASINGS.backOut,
      });
      gsap.to(line2Ref.current, {
        opacity: 1,
        scaleX: 1,
        duration: 0.2,
        ease: ANIMATION_EASINGS.expoOut,
      });
      gsap.to(line3Ref.current, {
        y: 0,
        rotation: 0,
        duration: 0.35,
        ease: ANIMATION_EASINGS.backOut,
      });
    }
  }, [isOpen]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col justify-center items-center w-10 h-10 gap-[5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30 lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <span ref={line1Ref} className="block w-5 h-[1.5px] bg-white/70 origin-center" />
      <span ref={line2Ref} className="block w-5 h-[1.5px] bg-white/70 origin-center" />
      <span ref={line3Ref} className="block w-5 h-[1.5px] bg-white/70 origin-center" />
    </button>
  );
}

// ============================================================================
// MobileMenu — full-screen slide-in with character-level links
// ============================================================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const items = menuRef.current.querySelectorAll<HTMLElement>("[data-menu-item]");
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: ANIMATION_EASINGS.expoOut,
        delay: 0.1,
      },
    );
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen]);

  const handleNavigate = useCallback(
    (href: string) => {
      onNavigate(href);
      onClose();
    },
    [onClose, onNavigate],
  );

  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-40 lg:hidden"
      style={{ transform: "translateX(100%)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      ref={menuRef}
    >
      {/* Black background */}
      <div
        className="absolute inset-0"
        style={{ background: "#040508" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-full w-full py-20 px-6 pt-40">
        {/* Links */}
        <div className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div key={link.href} data-menu-item>
              <CharLink
                href={link.href}
                label={link.label}
                isActive={false}
                onClick={handleNavigate}
                size="menu"
              />
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div className="flex flex-col items-center gap-6 mt-16">
          {/* Divider with plus */}
          <div className="relative flex items-center w-full max-w-xs">
            <div className="flex-1 h-px bg-white/10" />
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="mx-3">
              <line x1="6.5" y1="0" x2="6.5" y2="13" stroke="#D8D8D8" strokeWidth="1" />
              <line x1="13" y1="6.5" x2="0" y2="6.5" stroke="#D8D8D8" strokeWidth="1" />
            </svg>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-white/30 text-sm text-center">Business enquiry</p>
          <a
            href="mailto:hello@example.com"
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            E. hello@example.com
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ScrollProgress — thin gradient line
// ============================================================================

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let rafId = 0;
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          if (!barRef.current) {
            ticking = false;
            return;
          }
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? scrollTop / docHeight : 0;
          barRef.current.style.transform = `scaleX(${String(progress)})`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="absolute bottom-0 left-0 right-0 h-[1px] origin-left"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, rgba(216, 216, 216, 0.2), rgba(216, 216, 216, 0.05))",
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Navigation
// ============================================================================

export function Navigation({
  onExploreWorlds: _onExploreWorlds,
}: {
  onExploreWorlds?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLElement>(null);

  // Entrance animation
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: ANIMATION_EASINGS.expoOut, delay: 0.5 },
    );
  }, [reducedMotion]);

  // Scroll detection
  useEffect(() => {
    let ticking = false;
    let rafId = 0;
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          setScrolled(window.scrollY > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Active section detection
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
    let ticking = false;
    let rafId = 0;
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const offset = window.innerHeight * 0.35;
          let current = "hero";
          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (!el) continue;
            if (el.getBoundingClientRect().top <= offset) current = id;
          }
          setActiveSection(`#${current}`);
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
  }, []);

  const handleNavigate = useCallback(
    (href: string) => {
      scrollTo(href);
    },
    [scrollTo],
  );

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen, closeMobile]);

  return (
    <>
      {/* Skip to content */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:bg-white/10 focus:rounded-lg focus:outline-none focus:border focus:border-white/20"
      >
        Skip to content
      </a>

      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: "1rem clamp(1rem, 4vw, 3rem)",
        }}
      >
        {/* Container */}
        <div
          className="mx-auto flex items-center justify-between transition-all duration-500 ease-out"
          style={{
            maxWidth: 1200,
            padding: scrolled ? "0.75rem 1.5rem" : "0.875rem 2rem",
            borderRadius: scrolled ? 14 : 16,
            background: scrolled ? "rgba(4, 5, 8, 0.85)" : "rgba(4, 5, 8, 0.4)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            border: scrolled
              ? "1px solid rgba(216, 216, 216, 0.08)"
              : "1px solid rgba(216, 216, 216, 0.04)",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            aria-label="Home"
            className="text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
          >
            <Logo size="nav" />
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <CharLink
                  href={link.href}
                  label={link.label}
                  isActive={activeSection === link.href}
                  onClick={handleNavigate}
                />
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center shrink-0">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("#contact");
              }}
              className="inline-flex items-center rounded-full px-5 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 border transition-all duration-300 hover:text-white hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
              style={{
                borderColor: "rgba(216, 216, 216, 0.12)",
              }}
            >
              Let&apos;s talk
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className={`lg:hidden ${isMobileOpen ? "invisible" : ""}`}>
            <Hamburger isOpen={isMobileOpen} onClick={toggleMobile} />
          </div>
        </div>

        <ScrollProgress />
      </nav>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileOpen} onClose={closeMobile} onNavigate={handleNavigate} />
    </>
  );
}
