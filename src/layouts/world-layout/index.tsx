/**
 * World Layout
 *
 * Wraps individual world routes. Provides world-specific error
 * boundary isolation. Each world renders inside this layout.
 *
 * Responsibilities:
 * - World-level error boundary isolation
 * - World-specific data attribute on the container
 */

import { type ReactNode } from "react";
import { ErrorBoundary } from "@/infrastructure";

interface WorldLayoutProps {
  children: ReactNode;
  worldId: string;
}

const worldErrorFallback = (
  <div
    role="alert"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100dvh",
      padding: "2rem",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Failed to load world
      </h2>
      <p style={{ color: "var(--color-foreground-muted)", fontSize: "0.875rem" }}>
        An error occurred while rendering this world.
      </p>
    </div>
  </div>
);

export function WorldLayout({ children, worldId }: WorldLayoutProps) {
  return (
    <ErrorBoundary boundaryId={`world-${worldId}`} fallback={worldErrorFallback}>
      <div
        className="world-layout"
        data-world={worldId}
        style={{ position: "relative", minHeight: "100dvh" }}
      >
        {children}
      </div>
    </ErrorBoundary>
  );
}
