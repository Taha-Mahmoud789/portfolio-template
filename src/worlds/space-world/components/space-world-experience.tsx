/**
 * Space World Experience — Developer Solar System
 *
 * Cinematic 3-state experience:
 * - SOLAR_VIEW: orbiting overview with HUD
 * - TRAVELING: camera flight to planet
 * - PLANET_VIEW: focused planet with content
 */

import { Component, useCallback, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { SpaceCarouselScene, cameraAPIRef } from "../scene/SpaceCarouselScene";
import { ProjectCard } from "./project-card";

// ============================================================================
// View Mode Type
// ============================================================================

type ViewMode = "solar" | "traveling" | "planet";

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
// Component
// ============================================================================

interface SpaceWorldExperienceProps {
  readonly className?: string;
}

export function SpaceWorldExperience({ className }: SpaceWorldExperienceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("solar");
  const [showUI, setShowUI] = useState(false);

  // Show UI after entrance
  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setViewMode("traveling");
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "solar") {
      setSelectedId(null);
    }
  }, []);

  const handleBack = useCallback(() => {
    setViewMode("solar");
    const api = cameraAPIRef.current as { startReturn: () => void } | null;
    if (api) {
      api.startReturn();
    }
  }, []);

  // Keyboard: Escape to go back
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && viewMode === "planet") {
        handleBack();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleBack]);

  return (
    <WebGLErrorBoundary fallback={<WebGLFallback />}>
      <div className={`relative min-h-screen ${className ?? ""}`}>
        {/* 3D Solar System */}
        <SpaceCarouselScene
          className="absolute inset-0"
          selectedId={selectedId}
          onSelect={handleSelect}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* UI Overlay — SOLAR VIEW */}
        {showUI && viewMode === "solar" && (
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
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
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
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "rgba(201, 169, 110, 0.35)",
                    boxShadow: "0 0 6px rgba(201, 169, 110, 0.15)",
                  }}
                />
                Select a planet to explore
              </div>
            )}
          </div>
        )}

        {/* UI Overlay — PLANET VIEW (Project Card) */}
        <ProjectCard
          projectId={selectedId ?? ""}
          isVisible={viewMode === "planet" && selectedId !== null}
          onBack={handleBack}
        />

        {/* Traveling overlay — subtle depth indicator */}
        {viewMode === "traveling" && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(6, 8, 14, 0.3) 100%)",
            }}
          />
        )}
      </div>
    </WebGLErrorBoundary>
  );
}
