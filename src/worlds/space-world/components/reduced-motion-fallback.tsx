/**
 * Reduced Motion Fallback
 *
 * Premium static 2D layout for reduced motion preference.
 * Warm white + gold palette. Clean typography.
 */

import { OBJECTS, ORBITS } from "../data/space.config";
import { getProjectGalaxy } from "../data/project-galaxy-data";

const panelStyle = {
  borderRadius: "16px",
  border: "1px solid rgba(201, 169, 110, 0.1)",
  background: "rgba(8, 7, 6, 0.6)",
  padding: "24px",
};

const tagStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.05em",
  padding: "4px 10px",
  borderRadius: "6px",
  border: "1px solid rgba(201, 169, 110, 0.08)",
  color: "rgba(180, 170, 155, 0.4)",
};

export function ReducedMotionFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080706",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: "640px", width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <a
            href="/worlds"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(180, 170, 155, 0.4)",
              textDecoration: "none",
              marginBottom: "24px",
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
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#f5f0e8",
              margin: "0 0 12px 0",
            }}
          >
            Space World
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "rgba(180, 170, 155, 0.45)",
              margin: 0,
            }}
          >
            Explore my developer journey through 4 orbits.
          </p>
        </div>

        {/* Orbits */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {ORBITS.map((orbit) => {
            const orbitObjects = OBJECTS.filter((o) => o.orbitGroup === orbit.group);
            if (orbitObjects.length === 0) return null;

            return (
              <section key={orbit.id}>
                <h3
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(201, 169, 110, 0.6)",
                    margin: "0 0 20px 0",
                  }}
                >
                  {orbit.label}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orbitObjects.map((obj) => {
                    const galaxy = getProjectGalaxy(obj.id);
                    const isProject = obj.type === "project";

                    if (isProject && galaxy) {
                      return (
                        <div key={obj.id} style={panelStyle}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
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
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "rgba(201, 169, 110, 0.5)",
                              }}
                            >
                              {galaxy.identity}
                            </span>
                          </div>

                          <h4
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#f5f0e8",
                              margin: "0 0 4px 0",
                            }}
                          >
                            {obj.metadata.title}
                          </h4>

                          {obj.metadata.subtitle && (
                            <p
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "12px",
                                color: "rgba(201, 169, 110, 0.6)",
                                margin: "0 0 12px 0",
                              }}
                            >
                              {obj.metadata.subtitle}
                            </p>
                          )}

                          {obj.metadata.purpose && (
                            <p
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "12px",
                                lineHeight: 1.6,
                                color: "rgba(180, 170, 155, 0.45)",
                                margin: "0 0 16px 0",
                              }}
                            >
                              {obj.metadata.purpose}
                            </p>
                          )}

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "6px",
                              marginBottom: "16px",
                            }}
                          >
                            {obj.metadata.tags?.map((tag) => (
                              <span key={tag} style={tagStyle}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div style={{ display: "flex", gap: "10px" }}>
                            <a
                              href={obj.metadata.route ?? "#"}
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "11px",
                                fontWeight: 500,
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: "#C9A96E",
                                color: "#080706",
                                textDecoration: "none",
                              }}
                            >
                              View Case Study
                            </a>
                            {obj.metadata.liveUrl && (
                              <a
                                href={obj.metadata.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "11px",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(201, 169, 110, 0.2)",
                                  color: "rgba(180, 170, 155, 0.5)",
                                  textDecoration: "none",
                                }}
                              >
                                Visit Site
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <a
                        key={obj.id}
                        href={obj.metadata.route ?? obj.metadata.liveUrl ?? "#"}
                        target={obj.metadata.liveUrl ? "_blank" : undefined}
                        rel={obj.metadata.liveUrl ? "noopener noreferrer" : undefined}
                        style={{
                          ...panelStyle,
                          display: "block",
                          textDecoration: "none",
                          transition: "border-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.1)";
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#f5f0e8",
                            marginBottom: "4px",
                          }}
                        >
                          {obj.metadata.title}
                        </div>
                        {obj.metadata.subtitle && (
                          <div
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "11px",
                              color: "rgba(201, 169, 110, 0.5)",
                              marginBottom: "8px",
                            }}
                          >
                            {obj.metadata.subtitle}
                          </div>
                        )}
                        {obj.metadata.description && (
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "12px",
                              lineHeight: 1.5,
                              color: "rgba(180, 170, 155, 0.4)",
                              margin: 0,
                            }}
                          >
                            {obj.metadata.description}
                          </p>
                        )}
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
