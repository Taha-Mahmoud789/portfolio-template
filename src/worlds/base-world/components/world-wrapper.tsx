/**
 * World Wrapper
 *
 * Provides the outermost container for a world.
 * Handles theme injection, CSS variables, and container setup.
 * Single source of truth: the Zustand store.
 */

import type { BaseWorldWrapperProps } from "../types";
import { useBaseWorldStore, selectBaseWorldTheme, selectBaseWorldId } from "../state";

// ============================================================================
// Component
// ============================================================================

export function BaseWorldWrapper({ children, className = "" }: BaseWorldWrapperProps) {
  const theme = useBaseWorldStore(selectBaseWorldTheme);
  const worldId = useBaseWorldStore(selectBaseWorldId);

  return (
    <div
      className={`base-world__wrapper relative w-full h-full min-h-screen overflow-hidden ${className}`}
      data-world-theme={theme}
      data-world-id={worldId}
      style={{ colorScheme: "dark" }}
    >
      {children}
    </div>
  );
}
