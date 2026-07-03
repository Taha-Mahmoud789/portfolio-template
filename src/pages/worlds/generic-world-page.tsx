/**
 * Generic World Page
 *
 * Placeholder page for worlds that haven't been implemented yet.
 * Uses BaseWorld with a back button and basic content.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router";
import { BaseWorld } from "@/worlds/base-world";
import type { WorldId } from "@/types/world";

interface GenericWorldPageProps {
  worldId: WorldId;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
}

export function GenericWorldPage({
  worldId,
  title,
  subtitle,
  description,
  accentColor,
}: GenericWorldPageProps) {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    void navigate("/");
  }, [navigate]);

  const handleReady = useCallback(() => {}, []);

  const handleError = useCallback((_error: Error) => {}, []);

  return (
    <BaseWorld
      worldId={worldId}
      showHeader={true}
      showBackground={true}
      showOverlays={false}
      enableAccessibility={true}
      onReady={handleReady}
      onError={handleError}
    >
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(2rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.5625rem, 0.75vw, 0.6875rem)",
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            display: "block",
            marginBottom: "clamp(0.75rem, 1.5vw, 1rem)",
          }}
        >
          {subtitle}
        </span>

        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#f0f0f5",
            margin: "0 0 clamp(1rem, 2vw, 1.5rem) 0",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)",
            lineHeight: 1.6,
            color: "rgba(226,232,240,0.5)",
            margin: "0 0 clamp(2rem, 4vw, 3rem) 0",
            maxWidth: 480,
          }}
        >
          {description}
        </p>

        <button
          onClick={handleBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "rgba(226,232,240,0.6)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "0.75rem 1.5rem",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s cubic-bezier(0.19,1,0.22,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = accentColor;
            e.currentTarget.style.color = "#f0f0f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "rgba(226,232,240,0.6)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>
      </div>
    </BaseWorld>
  );
}