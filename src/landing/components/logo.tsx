/**
 * Logo — Reusable coding brand mark
 *
 * Dark rounded square with `</>` code icon + text.
 * Two sizes: nav (smaller) and footer (larger).
 */

interface LogoProps {
  size?: "nav" | "footer";
  className?: string;
}

export function Logo({ size = "nav", className = "" }: LogoProps) {
  const iconSize = size === "nav" ? 36 : 44;
  const svgSize = size === "nav" ? 18 : 22;
  const textSize = size === "nav" ? "clamp(0.875rem, 1.2vw, 1rem)" : "clamp(1rem, 1.4vw, 1.125rem)";
  const textWeight = size === "nav" ? 700 : 800;

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      style={{ textDecoration: "none", whiteSpace: "nowrap" }}
    >
      {/* Code icon square */}
      <span
        className="logo-icon inline-flex items-center justify-center shrink-0"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === "nav" ? 10 : 12,
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          boxShadow: "0 2px 12px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`logo-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Left bracket < */}
          <path
            d="M8 7L3 12L8 17"
            stroke={`url(#logo-grad-${size})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right bracket > */}
          <path
            d="M16 7L21 12L16 17"
            stroke={`url(#logo-grad-${size})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Slash / */}
          <path
            d="M14 4L10 20"
            stroke={`url(#logo-grad-${size})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </span>

      {/* Text */}
      <span
        className="hidden sm:block"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: textSize,
          fontWeight: textWeight,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "#f0f0f5",
        }}
      >
        Frontend
        <br />
        Multiverse
      </span>
    </span>
  );
}
