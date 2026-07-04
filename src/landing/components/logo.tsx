/**
 * Logo — Image-based mark
 *
 * Uses /images/logo.svg. Replace the file with your own logo.
 */

interface LogoProps {
  size?: "nav" | "footer";
  className?: string;
}

export function Logo({ size = "nav", className = "" }: LogoProps) {
  const px = size === "nav" ? 56 : 80;

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ textDecoration: "none", lineHeight: 0 }}
    >
      <img
        src="/images/logo.svg"
        alt="Home"
        width={px}
        height={px}
        style={{ width: px, height: px, objectFit: "contain" }}
      />
    </span>
  );
}
