/**
 * Space World Experience — Developer Solar System
 *
 * Interactive solar system:
 * - Click a planet to focus
 * - Camera travels to the planet
 * - Info panel shows planet details
 * - Click background to return to overview
 * - Escape to deselect
 *
 * Minimal HUD: current planet, description, controls.
 */

import { Component, useCallback, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { SpaceCarouselScene } from "../scene/SpaceCarouselScene";
import { ORBITS } from "../data/space.config";

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
          Solar System requires WebGL
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
// Planet Info Panel — glass card with details
// ============================================================================

function PlanetInfoPanel({
  orbitId,
  onClose,
}: {
  readonly orbitId: string;
  readonly onClose: () => void;
}) {
  const orbit = ORBITS.find((o) => o.id === orbitId);
  if (!orbit) return null;

  const planetColors: Record<string, string> = {
    projects: "#3b82f6",
    technology: "#06b6d4",
    creative: "#a855f7",
    future: "#f59e0b",
  };

  const planetDescriptions: Record<string, string> = {
    projects:
      "Interactive moons showcasing completed projects. Each moon represents a real product delivered to clients.",
    technology:
      "The code tools and frameworks that power every project. Technical precision meets creative ambition.",
    creative: "The design philosophy and motion principles. Where aesthetics meet functionality.",
    future: "Exploring the frontier. New technologies, new ideas, new possibilities.",
  };

  const color = planetColors[orbitId] ?? "#C9A96E";

  return (
    <div
      className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-[280px] animate-[fadeIn_0.3s_ease-out]"
      style={{ zIndex: 20 }}
    >
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(201, 169, 110, 0.12)",
          background: "rgba(8, 7, 6, 0.85)",
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

        {/* Planet color dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 12px ${color}40`,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(201, 169, 110, 0.5)",
            }}
          >
            Orbit {String(ORBITS.indexOf(orbit) + 1)}
          </span>
        </div>

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
          {orbit.label}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            lineHeight: 1.7,
            color: "rgba(180, 170, 155, 0.5)",
            marginTop: "12px",
          }}
        >
          {planetDescriptions[orbitId] ?? ""}
        </p>

        {/* Object count */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(201, 169, 110, 0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(180, 170, 155, 0.3)",
            }}
          >
            {String(orbit.objectIds.length)} objects in orbit
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

interface SpaceWorldExperienceProps {
  readonly className?: string;
}

export function SpaceWorldExperience({ className }: SpaceWorldExperienceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showUI, setShowUI] = useState(false);

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
        {/* 3D Solar System */}
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
                Solar System
              </h1>
            </div>

            {/* Instructions — bottom center */}
            {!selectedId && (
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
                Click a planet to explore
              </div>
            )}

            {/* Object counter — bottom right */}
            <div
              className="pointer-events-none absolute bottom-8 right-6 z-10"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "rgba(180, 170, 155, 0.25)",
              }}
            >
              {String(ORBITS.length)} orbits
            </div>

            {/* Planet Info Panel */}
            {selectedId && <PlanetInfoPanel orbitId={selectedId} onClose={handleClose} />}
          </div>
        )}
      </div>
    </WebGLErrorBoundary>
  );
}
