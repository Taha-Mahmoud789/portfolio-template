/**
 * Suspense Fallback
 *
 * Minimal loading indicator for Suspense boundaries.
 * Uses inline styles to avoid dependency on CSS modules or
 * Tailwind classes which may not be loaded yet.
 */

const containerStyle = {
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  minHeight: "100dvh",
  backgroundColor: "var(--color-background, #000)",
};

const spinnerStyle = {
  width: 32,
  height: 32,
  border: "2px solid var(--color-border, #333)",
  borderTopColor: "var(--color-primary, #3b82f6)",
  borderRadius: "50%",
  animation: "app-spinner 0.6s linear infinite",
};

export function SuspenseFallback() {
  return (
    <div aria-busy="true" aria-label="Loading" style={containerStyle}>
      <div style={spinnerStyle} />
    </div>
  );
}
