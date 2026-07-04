/**
 * Breadcrumb Map
 *
 * Premium location indicator.
 * Shows back-arrow + object name when focused.
 */

import type { CameraMode } from "../data/types";

interface BreadcrumbMapProps {
  cameraMode: CameraMode;
  focusedObjectName: string | null;
  onExit: () => void;
}

export function BreadcrumbMap({ cameraMode, focusedObjectName, onExit }: BreadcrumbMapProps) {
  const isFocused = cameraMode === "object-focus";

  if (!isFocused || !focusedObjectName) return null;

  return (
    <div className="pointer-events-none absolute left-6 top-6 z-10">
      <nav aria-label="Location" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onExit}
          aria-label="Back to overview"
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid rgba(201, 169, 110, 0.15)",
            background: "rgba(8, 7, 6, 0.6)",
            color: "rgba(180, 170, 155, 0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.3)";
            e.currentTarget.style.color = "#f5f0e8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.15)";
            e.currentTarget.style.color = "rgba(180, 170, 155, 0.5)";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#f5f0e8",
          }}
        >
          {focusedObjectName}
        </span>
      </nav>
    </div>
  );
}
