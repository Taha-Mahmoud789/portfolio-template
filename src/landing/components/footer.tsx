/**
 * Footer
 *
 * Premium cinematic footer — the final impression.
 * Glass morphism design matching the navigation aesthetic.
 * Multi-column grid with ambient glow, gradient accents, and clean hierarchy.
 */

import { useCallback, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { Logo } from "./logo";

// ============================================================================
// Data
// ============================================================================

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Expertise", href: "#expertise" },
  { label: "How I Work", href: "#how-i-work" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com",
    ariaLabel: "View our GitHub profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    ariaLabel: "Connect on LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@frontendmultiverse.com",
    ariaLabel: "Send us an email",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

// ============================================================================
// Footer
// ============================================================================

export function Footer() {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll reveal — consistent with all other sections
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        ctx = gsap.context(() => {
          const items = section.querySelectorAll<HTMLElement>("[data-footer-item]");
          if (items.length > 0) {
            gsap.fromTo(
              items,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: ANIMATION_EASINGS.backOut },
            );
          }
        }, sectionRef);
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion]);

  const handleNavClick = useCallback(
    (href: string) => {
      scrollTo(href);
    },
    [scrollTo],
  );

  return (
    <footer
      ref={sectionRef}
      role="contentinfo"
      aria-label="Site footer"
      data-footer="root"
      className="footer-root"
    >
      {/* Top gradient divider */}
      <div
        aria-hidden="true"
        className="footer-divider"
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="footer-glow"
      />

      {/* Content */}
      <div className="footer-content">
        {/* Top section — closing statement */}
        <div className="footer-statement" data-footer-item>
          <h2 className="footer-headline">
            <span className="footer-headline-dim">Thanks for</span>{" "}
            <span className="footer-headline-gradient">scrolling.</span>
          </h2>
          <p className="footer-subtext">
            Let&apos;s build something great together.
          </p>
        </div>

        {/* Main grid */}
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand" data-footer-item>
            <a
              href="/"
              aria-label="Frontend Multiverse — Home"
              className="footer-logo-link"
            >
              <Logo size="footer" />
            </a>
            <p className="footer-description">
              Frontend developer building fast, accessible web applications
              with React, TypeScript, and modern tooling.
            </p>
            {/* Social icons */}
            <div className="footer-socials">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="footer-social-icon"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div className="footer-nav-col" data-footer-item>
            <h3 className="footer-col-label">Navigate</h3>
            <nav aria-label="Footer navigation">
              <ul className="footer-nav-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className="footer-nav-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect column */}
          <div className="footer-connect-col" data-footer-item>
            <h3 className="footer-col-label">Connect</h3>
            <ul className="footer-connect-list">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="footer-connect-link"
                  >
                    <span className="footer-connect-icon">{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" data-footer-item>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Frontend Multiverse
          </p>
          <p className="footer-credit">
            Built with React, TypeScript &amp; GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
