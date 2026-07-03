/**
 * Contact Section
 *
 * Premium connection interface — two-column layout, glass contact card,
 * availability status, copy email, magnetic submit, GSAP stagger reveal. Fully accessible.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../hooks";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Data
// ============================================================================

const EMAIL = "hello@frontendmultiverse.com";

const CONTACT_METHODS = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 4L12 13L2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "github.com/frontendmultiverse",
    href: "https://github.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/frontendmultiverse",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

// ============================================================================
// Copy Email Button
// ============================================================================

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="copy-email-btn"
      aria-label={copied ? "Email copied to clipboard" : `Copy ${EMAIL} to clipboard`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.8125rem",
        fontWeight: 400,
        color: copied ? "rgba(52, 211, 153, 0.9)" : "rgba(216, 216, 216, 0.5)",
        background: copied ? "rgba(52, 211, 153, 0.08)" : "rgba(255, 255, 255, 0.04)",
        border: `1px solid ${copied ? "rgba(52, 211, 153, 0.2)" : "rgba(255, 255, 255, 0.08)"}`,
        borderRadius: 10,
        padding: "0.625rem 1rem",
        cursor: "pointer",
        outline: "none",
        transition: "color 0.3s ease, background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
      {copied ? "Copied!" : "Copy Email"}
    </button>
  );
}

// ============================================================================
// Magnetic Submit Button
// ============================================================================

function MagneticSubmitButton({
  status,
  reducedMotion,
}: {
  status: "idle" | "loading" | "success";
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
      gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.5, ease: ANIMATION_EASINGS.backOut, overwrite: "auto" });
    };

    const handleMouseDown = () => {
      gsap.to(el, { scale: 0.96, duration: 0.15, ease: ANIMATION_EASINGS.expoOut, overwrite: "auto" });
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
      type="submit"
      disabled={status === "loading"}
      className="contact-submit-btn"
      aria-label={status === "loading" ? "Sending message..." : status === "success" ? "Message sent!" : "Send Message"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase" as const,
        color: status === "success" ? "#34d399" : "#ffffff",
        background: status === "success"
          ? "rgba(52, 211, 153, 0.12)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(216, 216, 216, 0.06) 100%)",
        border: `1.5px solid ${status === "success" ? "rgba(52, 211, 153, 0.3)" : "rgba(255, 255, 255, 0.2)"}`,
        borderRadius: 12,
        padding: "clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)",
        cursor: status === "loading" ? "wait" : "pointer",
        outline: "none",
        willChange: "transform",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease",
      }}
    >
      {status === "loading" ? (
        <>
          <span className="contact-spinner" aria-hidden="true" />
          Sending...
        </>
      ) : status === "success" ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sent!
        </>
      ) : (
        <>
          Send Message
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transition: "transform 0.3s ease" }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
    </button>
  );
}

// ============================================================================
// Contact Form
// ============================================================================

function ContactForm({ reducedMotion }: { reducedMotion: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current = [];
    };
  }, []);

  const handleSubmit = useCallback((e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const t1 = setTimeout(() => {
      setStatus("success");
      const t2 = setTimeout(() => setStatus("idle"), 3000);
      timersRef.current.push(t2);
    }, 1500);
    timersRef.current.push(t1);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      data-contact="form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(1rem, 2vw, 1.25rem)",
      }}
    >
      {/* Name */}
      <div className="contact-field" style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <label
          htmlFor="contact-name"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "rgba(226, 232, 240, 0.5)",
          }}
        >
          Name
        </label>
        <div style={{ position: "relative" }}>
          <svg className="contact-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(165, 180, 252, 0.3)", pointerEvents: "none", transition: "color 0.3s ease" }}>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="contact-input"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9375rem",
              color: "#f0f0f5",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 12,
              padding: "0.875rem 1rem 0.875rem 2.5rem",
              outline: "none",
              width: "100%",
              boxSizing: "border-box" as const,
              transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Email */}
      <div className="contact-field" style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <label
          htmlFor="contact-email"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "rgba(226, 232, 240, 0.5)",
          }}
        >
          Email
        </label>
        <div style={{ position: "relative" }}>
          <svg className="contact-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(165, 180, 252, 0.3)", pointerEvents: "none", transition: "color 0.3s ease" }}>
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M22 4L12 13L2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="contact-input"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9375rem",
              color: "#f0f0f5",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 12,
              padding: "0.875rem 1rem 0.875rem 2.5rem",
              outline: "none",
              width: "100%",
              boxSizing: "border-box" as const,
              transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="contact-field" style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <label
          htmlFor="contact-message"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "rgba(226, 232, 240, 0.5)",
          }}
        >
          Message
        </label>
        <div style={{ position: "relative" }}>
          <svg className="contact-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ position: "absolute", left: 12, top: 14, color: "rgba(165, 180, 252, 0.3)", pointerEvents: "none", transition: "color 0.3s ease" }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Tell me about your project..."
            className="contact-input"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9375rem",
              color: "#f0f0f5",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 12,
              padding: "0.875rem 1rem 0.875rem 2.5rem",
              outline: "none",
              width: "100%",
              boxSizing: "border-box" as const,
              resize: "vertical" as const,
              minHeight: 120,
              transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Submit */}
      <MagneticSubmitButton status={status} reducedMotion={reducedMotion} />
    </form>
  );
}

// ============================================================================
// Contact Section
// ============================================================================

export function Contact() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    let ctx: gsap.Context | null = null;
    let observer: IntersectionObserver | null = null;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer?.disconnect();

        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASINGS.expoOut } });

          // Left container
          if (leftRef.current) {
            tl.to(leftRef.current, { opacity: 1, duration: 0.01 });
          }

          // Left heading
          const leftHeading = leftRef.current?.querySelector<HTMLElement>("[data-contact='heading']");
          if (leftHeading) {
            tl.fromTo(leftHeading, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
          }

          // Left info items
          const leftItems = leftRef.current?.querySelectorAll<HTMLElement>("[data-contact='info']");
          if (leftItems && leftItems.length > 0) {
            tl.fromTo(leftItems, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.4");
          }

          // Right form
          if (rightRef.current) {
            tl.fromTo(rightRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5");
          }
        }, sectionRef);
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    return () => {
      observer?.disconnect();
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-contact="section"
      aria-labelledby="contact-heading"
      style={{
        position: "relative",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 6rem)",
        background: "linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #000000 100%)",
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
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(3rem, 6vw, 5rem)",
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div
          ref={leftRef}
          data-contact="left"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div data-contact="heading">
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
                fontWeight: 400,
                letterSpacing: "0.3em",
                textTransform: "uppercase" as const,
                color: "rgba(216, 216, 216, 0.5)",
                display: "block",
                marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
              }}
            >
              Connect
            </span>
            <h2
              id="contact-heading"
              className="contact-gradient-text"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
              }}
            >
              Let&apos;s work
              <br />
              together.
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "rgba(226, 232, 240, 0.5)",
                margin: "0 0 clamp(2rem, 4vw, 3rem) 0",
                maxWidth: 400,
              }}
            >
              Whether you have a project in mind or just want to connect,
              I&apos;d like to hear from you. I&apos;m always open to
              interesting conversations.
            </p>
          </div>

          {/* Availability */}
          <div
            data-contact="info"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            <span
              className="availability-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 8px rgba(52, 211, 153, 0.5)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "rgba(52, 211, 153, 0.85)",
              }}
            >
              Available for opportunities
            </span>
          </div>

          {/* Contact Methods */}
          <div
            data-contact="info"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(0.75rem, 1.5vw, 1rem)",
            }}
          >
            {CONTACT_METHODS.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method-link"
                aria-label={`${method.label}: ${method.value}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  textDecoration: "none",
                  transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <span className="contact-method-icon" style={{ color: "#a5b4fc", flexShrink: 0, transition: "transform 0.3s ease" }}>{method.icon}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "rgba(226, 232, 240, 0.4)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {method.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.8125rem",
                      color: "rgba(226, 232, 240, 0.65)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {method.value}
                  </span>
                </div>
              </a>
            ))}

            <div style={{ marginTop: "0.25rem" }}>
              <CopyEmailButton />
            </div>
          </div>
        </div>

        {/* Right — Form Card */}
        <div
          ref={rightRef}
          data-contact="right"
          className="contact-form-card"
          style={{
            opacity: reducedMotion ? 1 : 0,
            padding: "clamp(1.5rem, 3vw, 2.25rem)",
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Form header */}
          <div style={{ marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.0625rem, 1.2vw, 1.25rem)",
                fontWeight: 600,
                color: "#f0f0f5",
                margin: "0 0 0.375rem 0",
                letterSpacing: "-0.02em",
              }}
            >
              Send a Message
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8125rem",
                color: "rgba(226, 232, 240, 0.4)",
                margin: 0,
              }}
            >
              I&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <ContactForm reducedMotion={reducedMotion} />
        </div>
      </div>

    </section>
  );
}
