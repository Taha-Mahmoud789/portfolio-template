/**
 * Space UI
 *
 * Premium 2D overlay for the Space World.
 * Clean typography, gold accents, glass panels.
 */

import { useSpaceWorld } from "../hooks";
import { BreadcrumbMap } from "./breadcrumb-map";
import { ORBITS } from "../data/space.config";
import { getProjectGalaxy } from "../data/project-galaxy-data";

export function SpaceUI() {
  const { cameraMode, focusedId, getById, exitFocus } = useSpaceWorld();

  const focusedObj = focusedId ? getById(focusedId) : null;
  const isOverview = cameraMode === "overview" || cameraMode === "intro";
  const isProject = focusedObj?.type === "project";
  const galaxy = isProject && focusedId ? getProjectGalaxy(focusedId) : null;

  const orbitLabel = focusedObj
    ? ORBITS.find((o) => o.group === focusedObj.orbitGroup)?.label
    : null;

  return (
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

      <BreadcrumbMap
        cameraMode={cameraMode}
        focusedObjectName={focusedObj?.metadata.title ?? null}
        onExit={exitFocus}
      />

      {/* Project Panel */}
      {focusedObj && !isOverview && isProject && galaxy && (
        <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-[290px] animate-[fadeIn_0.3s_ease-out]">
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(201, 169, 110, 0.12)",
              background: "rgba(8, 7, 6, 0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              padding: "24px",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Identity badge */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#C9A96E",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(201, 169, 110, 0.6)",
                }}
              >
                {galaxy.identity}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#f5f0e8",
                margin: 0,
              }}
            >
              {focusedObj.metadata.title}
            </h3>

            {/* Subtitle */}
            {focusedObj.metadata.subtitle && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "rgba(201, 169, 110, 0.7)",
                  marginTop: "4px",
                }}
              >
                {focusedObj.metadata.subtitle}
              </p>
            )}

            {/* Purpose */}
            {focusedObj.metadata.purpose && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "rgba(180, 170, 155, 0.5)",
                  marginTop: "16px",
                }}
              >
                {focusedObj.metadata.purpose}
              </p>
            )}

            {/* Tags */}
            {focusedObj.metadata.tags && focusedObj.metadata.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
                {focusedObj.metadata.tags.map((tag) => (
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
          </div>
        </div>
      )}

      {/* Generic panel — non-project objects */}
      {focusedObj && !isOverview && !isProject && (
        <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-[290px] animate-[fadeIn_0.25s_ease-out]">
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(201, 169, 110, 0.1)",
              background: "rgba(8, 7, 6, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              padding: "24px",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
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
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#f5f0e8",
                margin: 0,
              }}
            >
              {focusedObj.metadata.title}
            </h3>

            {/* Subtitle */}
            {focusedObj.metadata.subtitle && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "rgba(201, 169, 110, 0.6)",
                  marginTop: "4px",
                }}
              >
                {focusedObj.metadata.subtitle}
              </p>
            )}

            {/* Purpose */}
            {focusedObj.metadata.purpose && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "rgba(180, 170, 155, 0.45)",
                  marginTop: "16px",
                  fontStyle: "italic",
                }}
              >
                {focusedObj.metadata.purpose}
              </p>
            )}

            {/* Description */}
            {focusedObj.metadata.description && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "rgba(180, 170, 155, 0.4)",
                  marginTop: "12px",
                }}
              >
                {focusedObj.metadata.description}
              </p>
            )}

            {/* Tags */}
            {focusedObj.metadata.tags && focusedObj.metadata.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px" }}>
                {focusedObj.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      letterSpacing: "0.05em",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid rgba(201, 169, 110, 0.08)",
                      color: "rgba(180, 170, 155, 0.4)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
