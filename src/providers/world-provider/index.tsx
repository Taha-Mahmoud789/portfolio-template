/**
 * World Provider
 *
 * Provides world-level context. World state is managed by the
 * world store (Zustand). This provider exists as a composition
 * slot for future world-level concerns (animations, transitions).
 *
 * Current responsibilities: none (pass-through).
 * Future: world transition orchestration, world-specific providers.
 */

import type { ReactNode } from "react";

interface WorldProviderProps {
  children: ReactNode;
}

export function WorldProvider({ children }: WorldProviderProps) {
  return <>{children}</>;
}
