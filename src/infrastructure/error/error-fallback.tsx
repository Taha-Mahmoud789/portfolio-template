/**
 * Error Fallback
 *
 * Minimal fallback UI for the Error Boundary. Uses inline styles because
 * Tailwind/CSS may be broken when this renders. No hover effects, no
 * auto-reset — the user stays in control.
 */

import { useEffect, useRef } from "react";
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#000",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: "480px", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#a1a1aa", marginBottom: "2rem" }}>
          An unexpected error occurred. Try reloading the page.
        </p>

        {import.meta.env.DEV && (
          <pre
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              padding: "1rem",
              backgroundColor: "#18181b",
              borderRadius: "6px",
              border: "1px solid #27272a",
              marginBottom: "2rem",
              textAlign: "left",
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            ref={buttonRef}
            onClick={resetError}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              backgroundColor: "transparent",
              color: "#a1a1aa",
              border: "1px solid #27272a",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
