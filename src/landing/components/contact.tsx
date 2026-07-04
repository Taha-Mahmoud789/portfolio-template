/**
 * Contact Section — TRIONN-inspired huge typography
 *
 * "Have a project in mind?"
 * Minimal links. Premium spacing. Dark editorial.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";
import { PERSONAL_INFO, SOCIAL_LINKS } from "@/content";

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  GitHub: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  LinkedIn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="9"
        width="4"
        height="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="4"
        cy="4"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M22 4L12 13L2 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const LINKS = SOCIAL_LINKS.map((link) => ({
  ...link,
  icon: CONTACT_ICONS[link.label],
}));

// ============================================================================
// Copy Email
// ============================================================================

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);

      // Brief scale pulse feedback
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { scale: 0.95 },
          { scale: 1, duration: 0.4, ease: ANIMATION_EASINGS.backOut },
        );
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      ref={btnRef}
      onClick={handleCopy}
      className="copy-email-btn focus-ring"
      aria-label={copied ? "Email copied to clipboard" : `Copy ${PERSONAL_INFO.email} to clipboard`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(0.75rem, 0.85vw, 0.8125rem)",
        fontWeight: 400,
        color: copied ? "rgba(201, 169, 110, 0.85)" : "rgba(214, 204, 190, 0.4)",
        background: copied ? "rgba(201, 169, 110, 0.06)" : "transparent",
        border: `1px solid ${copied ? "rgba(201, 169, 110, 0.15)" : "rgba(245, 240, 232, 0.06)"}`,
        borderRadius: 100,
        padding: "0.625rem 1.25rem",
        cursor: "pointer",
        transition: "color 0.3s ease, background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8.5L6.5 12L13 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      )}
      {copied ? "Copied!" : "Copy Email"}
    </button>
  );
}

// ============================================================================
// Contact Section
// ============================================================================

export function Contact() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (reducedMotion) return;

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

          // Heading — clip-path mask reveal per line
          if (headingRef.current) {
            const lines = headingRef.current.querySelectorAll<HTMLElement>("[data-heading-line]");
            if (lines.length > 0) {
              lines.forEach((line, i) => {
                tl.fromTo(
                  line,
                  { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                  {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 1,
                  },
                  i * 0.2,
                );
              });
            }

            // Availability badge
            const badge = headingRef.current.querySelector<HTMLElement>("[data-availability]");
            if (badge) {
              tl.fromTo(badge, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
            }
          }

          // Links — staggered reveal
          if (linksRef.current) {
            const linkItems = linksRef.current.querySelectorAll<HTMLElement>("[data-contact-link]");
            tl.fromTo(
              linkItems,
              { y: 20, opacity: 0, clipPath: "inset(0 0 100% 0)" },
              {
                y: 0,
                opacity: 1,
                clipPath: "inset(0 0 0% 0)",
                duration: 0.6,
                stagger: 0.08,
              },
              "-=0.3",
            );
          }
        }, sectionRef);
      },
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        position: "relative",
        padding: "clamp(6rem, 16vh, 14rem) clamp(1.5rem, 5vw, 6rem)",
        background: "#080706",
        overflow: "hidden",
        minHeight: "80dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
            "linear-gradient(90deg, transparent 0%, rgba(245, 240, 232, 0.06) 50%, transparent 100%)",
        }}
      />

      {/* Subtle glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(400px, 50vw, 700px)",
          height: "clamp(400px, 50vw, 700px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 240, 232, 0.01) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div ref={headingRef} style={{}}>
          {/* Huge heading */}
          <h2
            id="contact-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 7.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              margin: "0 0 clamp(2.5rem, 5vw, 4rem) 0",
            }}
          >
            <span
              data-heading-line
              style={{
                color: "rgba(245, 240, 232, 0.95)",
                display: "block",
                willChange: "clip-path",
              }}
            >
              Got an idea?
            </span>
            <br />
            <span
              data-heading-line
              style={{
                display: "block",
                willChange: "clip-path",
                background:
                  "linear-gradient(135deg, rgba(245,240,232,1) 0%, rgba(201,169,110,0.7) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Let&apos;s talk.
            </span>
          </h2>

          {/* Contact instruction */}
          <div
            data-availability
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.8125rem, 0.9vw, 0.9375rem)",
                fontWeight: 400,
                color: "rgba(214, 204, 190, 0.45)",
              }}
            >
              Currently open to new projects and collaborations
            </span>
          </div>
        </div>

        {/* Links */}
        <div
          ref={linksRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(1rem, 2vw, 2rem)",
            flexWrap: "wrap",
          }}
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-contact-link
              className="contact-method-link focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/20"
              aria-label={link.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0.75rem 1.5rem",
                borderRadius: 100,
                background: "rgba(245, 240, 232, 0.03)",
                border: "1px solid rgba(245, 240, 232, 0.06)",
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.8125rem, 0.9vw, 0.9375rem)",
                fontWeight: 500,
                color: "rgba(214, 204, 190, 0.5)",
                transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}

          <div data-contact-link>
            <CopyEmailButton />
          </div>
        </div>
      </div>
    </section>
  );
}
