/**
 * Suspense Fallback — minimal loading indicator for lazy route loading.
 * Only visible for a split second before the Preloader takes over.
 */

const containerStyle = {
  position: "fixed" as const,
  inset: 0,
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  backgroundColor: "#050507",
  zIndex: 99999,
};

const spinnerStyle = {
  width: 32,
  height: 32,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderTopColor: "rgba(59, 130, 246, 0.5)",
  borderRadius: "50%",
  animation: "sf-spin 0.8s linear infinite",
};

const keyframes = `
  @keyframes sf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export function SuspenseFallback() {
  return (
    <>
      <style>{keyframes}</style>
      <div aria-busy="true" aria-label="Loading" style={containerStyle}>
        <div style={spinnerStyle} />
      </div>
    </>
  );
}
