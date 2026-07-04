/**
 * CTA Section
 *
 * Premium final call-to-action — aurora background, gradient heading,
 * magnetic button with glow, social links, GSAP staggered reveal. Fully accessible.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { useScrollTo } from "@/providers/lenis-provider";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Social Links
// ============================================================================

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@frontendmultiverse.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  },
] as const;

// ============================================================================
// Magnetic Button
// ============================================================================

function MagneticButton({
  onClick,
  reducedMotion,
}: {
  onClick: () => void;
  reducedMotion: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: ANIMATION_EASINGS.backOut,
        overwrite: "auto",
      });
    };

    const handleMouseDown = () => {
      gsap.to(el, {
        scale: 0.96,
        duration: 0.15,
        ease: ANIMATION_EASINGS.expoOut,
        overwrite: "auto",
      });
    };

    const handleMouseUp = () => {
      gsap.to(el, { scale: 1, duration: 0.3, ease: ANIMATION_EASINGS.backOut, overwrite: "auto" });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseup", handleMouseUp);
    };
  }, [reducedMotion]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className="cta-primary-btn"
      aria-label="Start a Project — scroll to contact section"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        color: "#f5f0e8",
        background:
          "linear-gradient(135deg, rgba(245, 240, 232, 0.08) 0%, rgba(245, 240, 232, 0.05) 100%)",
        border: "1.5px solid rgba(245, 240, 232, 0.12)",
        borderRadius: 100,
        padding: "clamp(1rem, 2.5vw, 1.25rem) clamp(2.5rem, 6vw, 4rem)",
        cursor: "pointer",
        outline: "none",
        willChange: "transform",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      }}
    >
      {/* Glow layer */}
      <div
        aria-hidden="true"
        className="cta-btn-glow"
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: 100,
          background:
            "linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(201, 169, 110, 0.1) 100%)",
          opacity: 0,
          filter: "blur(16px)",
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
          zIndex: -1,
        }}
      />
      Start a Project
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        style={{ transition: "transform 0.3s ease" }}
      >
        <path
          d="M4 9h10M10 5l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ============================================================================
// CTA Section
// ============================================================================

export function CTA() {
  const reducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  // Background orb animation — paused when off-screen for GPU savings
  useEffect(() => {
    if (reducedMotion) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    if (orb1Ref.current) {
      tl.to(orb1Ref.current, { x: 40, y: -30, scale: 1.1, duration: 6, ease: "sine.inOut" }, 0);
    }
    if (orb2Ref.current) {
      tl.to(orb2Ref.current, { x: -50, y: 20, scale: 0.9, duration: 8, ease: "sine.inOut" }, 0);
    }

    // Pause when section is off-screen
    const section = sectionRef.current;
    if (!section)
      return () => {
        tl.kill();
      };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          tl.resume();
        } else {
          tl.pause();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      tl.kill();
    };
  }, [reducedMotion]);

  // Scroll reveal — staggered
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();

          ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

            // Eyebrow
            tl.fromTo(
              eyebrowRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6 },
            );

            // Heading
            tl.fromTo(
              headingRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
              "-=0.3",
            );

            // Text
            tl.fromTo(
              textRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7 },
              "-=0.5",
            );

            // Button
            tl.fromTo(
              buttonRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6 },
              "-=0.4",
            );

            // Social links
            tl.fromTo(
              linksRef.current,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5 },
              "-=0.3",
            );
          }, sectionRef);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion]);

  const handleStartProject = useCallback(() => {
    scrollTo("#contact");
  }, [scrollTo]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      data-cta="section"
      aria-labelledby="cta-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "linear-gradient(180deg, #080706 0%, #0c0b09 50%, #121110 100%)",
        textAlign: "center",
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
          background: "linear-gradient(90deg, transparent, rgba(245, 240, 232, 0.08), transparent)",
        }}
      />

      {/* Aurora orb 1 */}
      <div
        ref={orb1Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(400px, 50vw, 700px)",
          height: "clamp(400px, 50vw, 700px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 240, 232, 0.03) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      {/* Aurora orb 2 */}
      <div
        ref={orb2Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "45%",
          left: "48%",
          transform: "translate(-50%, -50%)",
          width: "clamp(300px, 40vw, 500px)",
          height: "clamp(300px, 40vw, 500px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      {/* Noise texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(245, 240, 232, 0.015) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
            fontWeight: 400,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: "rgba(214, 204, 190, 0.5)",
            display: "block",
            marginBottom: "clamp(1rem, 2vw, 1.5rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          Get in Touch
        </span>

        {/* Headline */}
        <h2
          id="cta-heading"
          ref={headingRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            margin: "0 0 clamp(1.25rem, 3vw, 2rem) 0",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          <span style={{ color: "#f5f0e8" }}>Have a Project</span>
          <br />
          <span className="gradient-text">in Mind?</span>
        </h2>

        {/* Subtext */}
        <p
          ref={textRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "rgba(226, 232, 240, 0.55)",
            margin: "0 0 clamp(2.5rem, 5vw, 3.5rem) 0",
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          I&apos;m available for freelance work and full-time roles. If you need a frontend
          developer who cares about quality, let&apos;s talk.
        </p>

        {/* CTA Button */}
        <div
          ref={buttonRef}
          style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)", opacity: reducedMotion ? 1 : 0 }}
        >
          <MagneticButton onClick={handleStartProject} reducedMotion={reducedMotion} />
        </div>

        {/* Social Links */}
        <div
          ref={linksRef}
          data-cta="links"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            opacity: reducedMotion ? 1 : 0,
          }}
        >
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-social-link"
              aria-label={social.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 400,
                color: "rgba(226, 232, 240, 0.5)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              {social.icon}
              <span className="cta-social-label">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
