/**
 * Navigation — TRIONN-inspired premium nav
 *
 * Clean underline hover on links. Full-screen creative menu on all devices.
 * Floating pill with glass morphism. Active section indicator.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { Logo } from "./logo";
import { CreativeMenu } from "./navigation/creative-menu";
import { MagneticLink } from "./navigation/magnetic-link";

// ============================================================================
// Constants
// ============================================================================

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
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
}

function CharLink({ href, label, isActive, onClick }: CharLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick(href);
    },
    [href, onClick],
  );

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className="nav-link group relative inline-flex cursor-pointer leading-none overflow-visible select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:rounded-sm px-1 -mx-1 py-0.5"
      style={{
        fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        color: isActive ? "#f5f0e8" : "rgba(180, 170, 155, 0.45)",
        transition: "color 0.3s ease",
        height: "1em",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      <span
        className="absolute bottom-[-4px] left-0 h-[1px] origin-left transition-transform duration-300 ease-out"
        style={{
          width: "100%",
          background: "rgba(245, 240, 232, 0.6)",
          transform: isActive ? "scaleX(1)" : "scaleX(0)",
        }}
        aria-hidden="true"
      />
      <span
        className="absolute bottom-[-4px] left-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
        style={{
          width: "100%",
          background: "rgba(245, 240, 232, 0.4)",
        }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </a>
  );
}

// ============================================================================
// Hamburger — animated 3-line → X (visible on all devices)
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
      className="relative flex flex-col justify-center items-center w-10 h-10 gap-[5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="creative-menu"
    >
      <span ref={line1Ref} className="block w-5 h-[1.5px] bg-[#f5f0e8]/70 origin-center" />
      <span ref={line2Ref} className="block w-5 h-[1.5px] bg-[#f5f0e8]/70 origin-center" />
      <span ref={line3Ref} className="block w-5 h-[1.5px] bg-[#f5f0e8]/70 origin-center" />
    </button>
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
      className="absolute top-0 left-0 right-0 h-[1px] origin-left"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, rgba(201, 169, 110, 0.2), rgba(201, 169, 110, 0.05))",
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Navigation
// ============================================================================

export function Navigation() {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Scroll detection for background
  useEffect(() => {
    let ticking = false;
    let rafId = 0;
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrolled(currentY > SCROLL_THRESHOLD);
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

  // Active section detection — scroll-based, retries until sections exist
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));

    let currentSection = "hero";
    let ticking = false;
    let rafId = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const detect = () => {
      const offset = window.innerHeight * 0.35;
      let current = "hero";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }
      if (current !== currentSection) {
        currentSection = current;
        setActiveSection(`#${current}`);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          detect();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Try immediately, then retry until sections appear
    const trySetup = () => {
      const firstId = sectionIds[0];
      if (!firstId) return false;
      const firstSection = document.getElementById(firstId);
      if (firstSection) {
        detect();
        window.addEventListener("scroll", onScroll, { passive: true });
        return true;
      }
      return false;
    };

    if (!trySetup()) {
      const poll = () => {
        if (trySetup()) return;
        retryTimer = setTimeout(poll, 200);
      };
      retryTimer = setTimeout(poll, 200);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  const handleNavigate = useCallback(
    (href: string) => {
      scrollTo(href);
    },
    [scrollTo],
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

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
        className={`fixed top-0 left-0 right-0 ${isMenuOpen ? "z-[10000]" : "z-50"}`}
        style={{
          padding: "0.5rem clamp(1rem, 4vw, 3rem) 0.75rem",
        }}
      >
        {/* Container */}
        <div
          className="mx-auto flex items-center justify-between transition-all duration-500 ease-out"
          style={{
            maxWidth: 1200,
            padding: scrolled ? "0.75rem 1.5rem" : "0.875rem 2rem",
            borderRadius: scrolled ? 14 : 16,
            background: scrolled ? "rgba(8, 7, 6, 0.85)" : "rgba(8, 7, 6, 0.4)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            border: scrolled ? "1px solid rgba(245, 240, 232, 0.04)" : "1px solid transparent",
            boxShadow: scrolled ? "0 0 0 1px rgba(245, 240, 232, 0.03)" : "none",
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

          {/* Desktop links — visible on lg+ */}
          <ul className="nav-desktop-links hidden lg:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <MagneticLink strength={0.2}>
                  <CharLink
                    href={link.href}
                    label={link.label}
                    isActive={activeSection === link.href}
                    onClick={handleNavigate}
                  />
                </MagneticLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — visible on lg+ */}
          <div className="hidden lg:flex items-center shrink-0">
            <MagneticLink strength={0.15}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("#contact");
                }}
                className="inline-flex items-center rounded-full px-5 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 border transition-all duration-300 hover:text-white hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/30"
                style={{
                  borderColor: "rgba(245, 240, 232, 0.08)",
                }}
              >
                Let&apos;s talk
              </a>
            </MagneticLink>
          </div>

          {/* Hamburger — visible on mobile only */}
          <div className="nav-hamburger-wrap lg:hidden">
            <Hamburger isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>

        <ScrollProgress />
      </nav>

      {/* Creative Menu — full-screen overlay */}
      <CreativeMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />
    </>
  );
}
