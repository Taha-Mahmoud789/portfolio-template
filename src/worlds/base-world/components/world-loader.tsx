/**
 * World Loader
 *
 * Handles lazy initialization and loading states for a world.
 * Provides loading feedback and error recovery.
 * Uses refs for callbacks to avoid stale closures.
 */

import { useEffect, useCallback, useRef } from "react";
import type { BaseWorldLoaderProps } from "../types";
import { useBaseWorldStore } from "../state";
import { BASE_WORLD_TIMING } from "../constants";

// ============================================================================
// Component
// ============================================================================

export function BaseWorldLoader({
  children,
  className = "",
  onReady,
  onError,
}: BaseWorldLoaderProps) {
  const setPhase = useBaseWorldStore((s) => s.setPhase);
  const setError = useBaseWorldStore((s) => s.setError);
  const phase = useBaseWorldStore((s) => s.phase);

  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    setPhase("initializing");

    const readyTimer = setTimeout(() => {
      setPhase("ready");
      onReadyRef.current?.();
    }, BASE_WORLD_TIMING.focusRestoreDelay);

    return () => {
      clearTimeout(readyTimer);
    };
  }, [setPhase]);

  const handleError = useCallback(
    (error: Error) => {
      setError(error);
      onErrorRef.current?.(error);
    },
    [setError],
  );

  if (phase === "error") {
    return (
      <div
        className={`base-world__loader base-world__loader--error flex items-center justify-center min-h-screen ${className}`}
        role="alert"
      >
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">Something went wrong</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setPhase("idle");
            }}
            className="px-4 py-2 text-sm rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (phase === "idle" || phase === "initializing") {
    return (
      <div
        className={`base-world__loader base-world__loader--loading flex items-center justify-center min-h-screen ${className}`}
        aria-busy="true"
        aria-label="Loading world"
      >
        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  void handleError;

  return <>{children}</>;
}
