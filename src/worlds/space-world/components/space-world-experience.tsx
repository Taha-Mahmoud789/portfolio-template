/**
 * Space World Experience
 *
 * 3D Card Carousel — objects in a rotating ring.
 * Front card is largest, back cards recede.
 * Click to select, drag to rotate, auto-rotate when idle.
 */

import { Component, useCallback, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { SpaceCarouselScene } from "../scene/SpaceCarouselScene";
import { OBJECTS, ORBITS } from "../data/space.config";
import type { SpaceObject } from "../data/types";
import { getProjectGalaxy } from "../data/project-galaxy-data";

// ============================================================================
// Error Boundary
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { readonly children: ReactNode; readonly fallback: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Space World WebGL error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function WebGLFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] px-8 text-center">
      <div className="max-w-md space-y-6">
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.2)",
            background: "rgba(201, 169, 110, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <span style={{ fontSize: "14px", color: "#C9A96E" }}>3D</span>
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            color: "#f5f0e8",
          }}
        >
          Space World requires WebGL
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "rgba(180, 170, 155, 0.5)",
          }}
        >
          Your browser or device doesn&apos;t support the 3D experience. Try a modern browser with
          hardware acceleration enabled.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            borderRadius: "9999px",
            border: "1px solid rgba(201, 169, 110, 0.2)",
            background: "rgba(8, 7, 6, 0.6)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(180, 170, 155, 0.5)",
            textDecoration: "none",
          }}
        >
          Back to Portfolio
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// Info Panel
// ============================================================================

function InfoPanel({
  object,
  onClose,
}: {
  readonly object: SpaceObject;
  readonly onClose: () => void;
}) {
  const isProject = object.type === "project";
  const galaxy = isProject ? getProjectGalaxy(object.id) : null;
  const orbitLabel = ORBITS.find((o) => o.group === object.orbitGroup)?.label;

  return (
    <div
      className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-[300px] animate-[fadeIn_0.3s_ease-out]"
      style={{ zIndex: 20 }}
    >
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(201, 169, 110, 0.12)",
          background: "rgba(8, 7, 6, 0.8)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          padding: "28px",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.15)",
            background: "rgba(8, 7, 6, 0.5)",
            color: "rgba(180, 170, 155, 0.5)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.4)";
            e.currentTarget.style.color = "#f5f0e8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.15)";
            e.currentTarget.style.color = "rgba(180, 170, 155, 0.5)";
          }}
        >
          ×
        </button>

        {/* Orbit label */}
        {orbitLabel && (
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(201, 169, 110, 0.5)",
              marginBottom: "12px",
            }}
          >
            {orbitLabel}
          </p>
        )}

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#f5f0e8",
            margin: 0,
          }}
        >
          {object.metadata.title}
        </h3>

        {/* Subtitle */}
        {object.metadata.subtitle && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "rgba(201, 169, 110, 0.7)",
              marginTop: "4px",
            }}
          >
            {object.metadata.subtitle}
          </p>
        )}

        {/* Purpose */}
        {object.metadata.purpose && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "rgba(180, 170, 155, 0.5)",
              marginTop: "16px",
            }}
          >
            {object.metadata.purpose}
          </p>
        )}

        {/* Tags */}
        {object.metadata.tags && object.metadata.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
            {object.metadata.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(201, 169, 110, 0.1)",
                  color: "rgba(180, 170, 155, 0.5)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {galaxy && (
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            {galaxy.actions.map((action) => (
              <a
                key={action.id}
                href={action.url}
                target={action.type === "live-site" ? "_blank" : undefined}
                rel={action.type === "live-site" ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  ...(action.type === "case-study"
                    ? {
                        background: "#C9A96E",
                        color: "#080706",
                      }
                    : {
                        border: "1px solid rgba(201, 169, 110, 0.2)",
                        color: "rgba(180, 170, 155, 0.6)",
                        background: "transparent",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (action.type === "case-study") {
                    e.currentTarget.style.filter = "brightness(1.1)";
                  } else {
                    e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.4)";
                    e.currentTarget.style.color = "#f5f0e8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (action.type === "case-study") {
                    e.currentTarget.style.filter = "none";
                  } else {
                    e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.2)";
                    e.currentTarget.style.color = "rgba(180, 170, 155, 0.6)";
                  }
                }}
              >
                {action.label}
              </a>
            ))}
          </div>
        )}

        {/* Description for non-project */}
        {!isProject && object.metadata.description && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "rgba(180, 170, 155, 0.4)",
              marginTop: "12px",
            }}
          >
            {object.metadata.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

interface SpaceWorldExperienceProps {
  className?: string;
}

export function SpaceWorldExperience({ className }: SpaceWorldExperienceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showUI, setShowUI] = useState(false);

  const selectedObject = selectedId ? (OBJECTS.find((o) => o.id === selectedId) ?? null) : null;

  // Show UI after entrance
  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Keyboard: Escape to deselect
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <WebGLErrorBoundary fallback={<WebGLFallback />}>
      <div className={`relative min-h-screen ${className ?? ""}`}>
        {/* 3D Carousel */}
        <SpaceCarouselScene
          className="absolute inset-0"
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {/* UI Overlay */}
        {showUI && (
          <div className="pointer-events-none absolute inset-0 z-10">
            {/* Back navigation */}
            <div className="pointer-events-auto absolute left-5 top-5 z-20">
              <a
                href="/worlds"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(201, 169, 110, 0.2)",
                  background: "rgba(8, 7, 6, 0.7)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(180, 170, 155, 0.6)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.4)";
                  e.currentTarget.style.color = "#f5f0e8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.2)";
                  e.currentTarget.style.color = "rgba(180, 170, 155, 0.6)";
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7.5 2.5L4 6l3.5 3.5" />
                </svg>
                Worlds
              </a>
            </div>

            {/* Title */}
            <div className="pointer-events-none absolute left-5 top-16 z-20">
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(180, 170, 155, 0.4)",
                }}
              >
                Space
              </h1>
            </div>

            {/* Instructions */}
            {!selectedObject && (
              <div
                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(180, 170, 155, 0.35)",
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(201, 169, 110, 0.08)",
                  background: "rgba(8, 7, 6, 0.4)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                Drag to rotate · Click to explore
              </div>
            )}

            {/* Object counter */}
            <div
              className="pointer-events-none absolute bottom-8 right-6 z-10"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "rgba(180, 170, 155, 0.25)",
              }}
            >
              {OBJECTS.length} objects
            </div>

            {/* Info Panel */}
            {selectedObject && <InfoPanel object={selectedObject} onClose={handleClose} />}
          </div>
        )}
      </div>
    </WebGLErrorBoundary>
  );
}
