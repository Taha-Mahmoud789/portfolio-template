/**
 * Contact Section — Kinetic typography + glass pill buttons
 *
 * "Let's Create Together" with staggered word animation,
 * gradient mesh background, floating glass pills.
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
        fontSize: "clamp(0.8125rem, 0.9vw, 0.9375rem)",
        fontWeight: 400,
        color: copied ? "rgba(59, 130, 246, 0.85)" : "rgba(148, 163, 184, 0.5)",
        background: copied ? "rgba(59, 130, 246, 0.06)" : "rgba(255, 255, 255, 0.03)",
        border: `1px solid ${copied ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.06)"}`,
        borderRadius: 60,
        padding: "14px 28px",
        cursor: "pointer",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition:
          "background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(59, 130, 246, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8.5L6.5 12L13 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
  const pillsRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

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

          // Heading words — stagger in with clip-path reveal
          if (headingRef.current) {
            const words = headingRef.current.querySelectorAll<HTMLElement>("[data-heading-word]");
            if (words.length > 0) {
              words.forEach((word, i) => {
                tl.fromTo(
                  word,
                  { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                  { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
                  i * 0.15,
                );
              });
            }

            // Availability indicator
            const indicator = headingRef.current.querySelector<HTMLElement>("[data-availability]");
            if (indicator) {
              tl.fromTo(
                indicator,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                "-=0.4",
              );
            }
          }

          // Social pills — fade + slide in with stagger
          if (pillsRef.current) {
            const pills = pillsRef.current.querySelectorAll<HTMLElement>("[data-social-pill]");
            tl.fromTo(
              pills,
              { y: 24, opacity: 0, scale: 0.96 },
              { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.07 },
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
        background: "#0B0F1A",
        overflow: "hidden",
        minHeight: "80dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Gradient mesh background */}
      <div
        ref={blob1Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: "clamp(500px, 55vw, 800px)",
          height: "clamp(500px, 55vw, 800px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "blobFloat1 18s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        ref={blob2Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: "clamp(400px, 45vw, 700px)",
          height: "clamp(400px, 45vw, 700px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "blobFloat2 22s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        ref={blob3Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(350px, 40vw, 600px)",
          height: "clamp(350px, 40vw, 600px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "blobFloat3 20s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Keyframes for blob animation */}
      <style>{`
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 30px) scale(1.08); }
          66% { transform: translate(15px, -20px) scale(0.92); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1000,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Kinetic typography heading */}
        <div ref={headingRef} style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <h2
            id="contact-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 7.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              margin: 0,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0 clamp(0.5rem, 1.5vw, 1.2rem)",
            }}
          >
            <span
              data-heading-word
              style={{
                color: "rgba(241, 245, 249, 0.95)",
                display: "inline-block",
                willChange: "clip-path",
              }}
            >
              Let&apos;s
            </span>
            <span
              data-heading-word
              style={{
                display: "inline-block",
                willChange: "clip-path",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.9) 0%, rgba(6,182,212,0.8) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create
            </span>
            <span
              data-heading-word
              style={{
                color: "rgba(241, 245, 249, 0.95)",
                display: "inline-block",
                willChange: "clip-path",
              }}
            >
              Together
            </span>
          </h2>

          {/* Availability indicator */}
          <div
            data-availability
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(59, 130, 246, 0.7)",
                boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)",
                animation: "pulseGlow 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.8125rem, 0.9vw, 0.9375rem)",
                fontWeight: 400,
                color: "rgba(148, 163, 184, 0.5)",
              }}
            >
              Available for new projects
            </span>
          </div>
        </div>

        {/* Floating social pill buttons */}
        <div
          ref={pillsRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(0.75rem, 1.5vw, 1.25rem)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-social-pill
              className="contact-method-link focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/20"
              aria-label={link.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 60,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.8125rem, 0.9vw, 0.9375rem)",
                fontWeight: 500,
                color: "rgba(148, 163, 184, 0.5)",
                transition:
                  "background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(59, 130, 246, 0.08)";
                e.currentTarget.style.color = "rgba(241, 245, 249, 0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.color = "";
              }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}

          <div data-social-pill>
            <CopyEmailButton />
          </div>
        </div>
      </div>
    </section>
  );
}
