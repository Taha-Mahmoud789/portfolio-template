/**
 * Footer — Clean closing section
 *
 * - CTA heading
 * - Contact button
 * - Minimal layout (Connect + Location)
 * - Entrance animations
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { FOOTER_NAV_LINKS, SOCIAL_LINKS } from "@/content";
import { Logo } from "./logo";

const FOOTER_SOCIAL_ICONS: Record<string, React.ReactNode> = {
  GitHub: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  Email: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

// ============================================================================
// Footer
// ============================================================================

export function Footer() {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        ctx = gsap.context(() => {
          if (ctaRef.current) {
            gsap.fromTo(
              ctaRef.current.children,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: ANIMATION_EASINGS.backOut },
            );
          }

          if (gridRef.current) {
            const cols = gridRef.current.querySelectorAll<HTMLElement>("[data-footer-col]");
            gsap.fromTo(
              cols,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.08,
                delay: 0.5,
                ease: ANIMATION_EASINGS.backOut,
              },
            );
          }

          if (bottomRef.current) {
            gsap.fromTo(
              bottomRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.5, delay: 0.8 },
            );
          }
        }, sectionRef);
      },
      { threshold: 0.1 },
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
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <footer
        ref={sectionRef}
        role="contentinfo"
        aria-label="Site footer"
        style={{
          position: "relative",
          background: "#0B0F1A",
          overflow: "hidden",
        }}
      >
        {/* Top divider */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(241,245,249,0.04) 50%, transparent)",
          }}
        />

        {/* ── Logo + CTA ──────────────────────────────────────── */}
        <div
          ref={ctaRef}
          style={{
            padding: "clamp(3rem, 8vh, 5rem) clamp(2rem, 6vw, 6rem) 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(1.5rem, 3vh, 2.5rem)",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            aria-label="Taha Mahmoud — Home"
            style={{
              display: "inline-flex",
              textDecoration: "none",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <Logo size="footer" />
          </a>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(100, 116, 139, 0.4)",
                margin: "0 0 clamp(0.75rem, 1.5vw, 1rem) 0",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.5)",
                  marginRight: 8,
                  verticalAlign: "middle",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              Currently available
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                margin: 0,
                color: "rgba(241, 245, 249, 0.95)",
              }}
            >
              Let&apos;s{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(59,130,246,0.8) 50%, rgba(6,182,212,0.6) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Talk
              </span>
            </h2>
          </div>

          <a
            href="mailto:hello@taha.dev"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              borderRadius: "60px",
              background: "rgba(241, 245, 249, 0.95)",
              color: "#0B0F1A",
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.01em",
              textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 20px 50px rgba(11, 15, 26, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 28px 70px rgba(11, 15, 26, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 20px 50px rgba(11, 15, 26, 0.4)";
            }}
          >
            Say hello
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* ── Grid Section — 3 columns ──────────────────────── */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "clamp(2rem, 4vw, 3rem)",
            padding: "clamp(2rem, 4vh, 3rem) clamp(2rem, 6vw, 6rem)",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Navigation Column */}
          <div data-footer-col>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(100, 116, 139, 0.3)",
                margin: "0 0 clamp(0.75rem, 1.5vw, 1rem) 0",
              }}
            >
              Navigation
            </h3>
            <nav aria-label="Footer navigation">
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(0.4rem, 0.8vw, 0.6rem)",
                }}
              >
                {FOOTER_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                        fontWeight: 500,
                        color: "rgba(100, 116, 139, 0.4)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(241, 245, 249, 0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(100, 116, 139, 0.4)";
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect Column */}
          <div data-footer-col>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(100, 116, 139, 0.3)",
                margin: "0 0 clamp(0.75rem, 1.5vw, 1rem) 0",
              }}
            >
              Connect
            </h3>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "clamp(0.4rem, 0.8vw, 0.6rem)",
              }}
            >
              {SOCIAL_LINKS.map((link) => {
                const icon = FOOTER_SOCIAL_ICONS[link.label];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                        fontWeight: 500,
                        color: "rgba(100, 116, 139, 0.4)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(241, 245, 249, 0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(100, 116, 139, 0.4)";
                      }}
                    >
                      <span style={{ display: "inline-flex", opacity: 0.5 }}>{icon}</span>
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Location Column */}
          <div data-footer-col>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(100, 116, 139, 0.3)",
                margin: "0 0 clamp(0.75rem, 1.5vw, 1rem) 0",
              }}
            >
              Based in
            </h3>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                fontWeight: 500,
                color: "rgba(100, 116, 139, 0.4)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Cairo, Egypt
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "rgba(59, 130, 246, 0.55)",
                margin: "10px 0 0 0",
                letterSpacing: "0.05em",
              }}
            >
              Open to remote work
            </p>
          </div>
        </div>

        {/* ── Bottom Bar ────────────────────────────────────── */}
        <div
          ref={bottomRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "clamp(1rem, 2vh, 1.5rem) clamp(2rem, 6vw, 6rem)",
            borderTop: "1px solid rgba(241, 245, 249, 0.03)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "rgba(100, 116, 139, 0.2)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span>&copy; {new Date().getFullYear()} Taha Mahmoud</span>
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "rgba(100, 116, 139, 0.12)",
              }}
            >
              <span
                style={{
                  padding: "1px 5px",
                  borderRadius: 3,
                  border: "1px solid rgba(100, 116, 139, 0.1)",
                  fontSize: "0.55rem",
                }}
              >
                ⌘K
              </span>
            </span>
          </p>

          {/* Back to top */}
          <button
            type="button"
            onClick={() => {
              scrollTo("#hero");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "rgba(100, 116, 139, 0.25)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(241, 245, 249, 0.65)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(100, 116, 139, 0.25)";
            }}
            aria-label="Back to top"
          >
            Back to top
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "rgba(100, 116, 139, 0.15)",
              margin: 0,
            }}
          >
            Crafted with care.
          </p>
        </div>
      </footer>
    </>
  );
}
