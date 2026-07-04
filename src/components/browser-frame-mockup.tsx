/**
 * BrowserFrameMockup — Premium browser chrome overlay for project previews.
 *
 * Creates a realistic browser frame with:
 * - macOS-style traffic lights
 * - URL bar with site logo
 * - Subtle shadows and depth
 * - Responsive design
 */

import type { ReactNode } from "react";

interface BrowserFrameMockupProps {
  children: ReactNode;
  url?: string;
  logo?: string;
  className?: string;
  accentRgb?: string;
}

export function BrowserFrameMockup({
  children,
  url = "example.com",
  logo,
  className,
  accentRgb = "59, 130, 246",
}: BrowserFrameMockupProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(245, 240, 232, 0.08),
          inset 0 1px 0 rgba(245, 240, 232, 0.05)
        `,
        background: "#0a0b0d",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          background: "linear-gradient(180deg, #1e1f22 0%, #17181b 100%)",
          borderBottom: "1px solid rgba(245, 240, 232, 0.08)",
          gap: "12px",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ff5f57",
              boxShadow: "inset 0 -1px 1px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#febc2e",
              boxShadow: "inset 0 -1px 1px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#28c840",
              boxShadow: "inset 0 -1px 1px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "6px 12px",
            background: "rgba(245, 240, 232, 0.05)",
            borderRadius: "6px",
            border: "1px solid rgba(245, 240, 232, 0.06)",
            gap: "8px",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: `rgba(${accentRgb}, 0.7)`, flexShrink: 0 }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(245, 240, 232, 0.5)",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {url}
          </span>
        </div>

        {/* Site logo in browser bar */}
        {logo && (
          <div
            style={{
              flexShrink: 0,
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(245, 240, 232, 0.05)",
            }}
          >
            <img
              src={logo}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>

      {/* Content area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 44px)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
