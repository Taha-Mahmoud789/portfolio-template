/**
 * Animation Context
 *
 * Provides animation configuration and state to the application.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useAnimationConfig } from "../hooks/use-animation-config";
import type { AnimationConfig } from "../types/config";

interface AnimationContextValue extends AnimationConfig {
  enabled: boolean;
  durationMultiplier: number;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

interface AnimationProviderProps {
  children: ReactNode;
}

/**
 * Animation context provider.
 *
 * Wraps the application to provide animation configuration.
 *
 * @example
 * ```tsx
 * <AnimationProvider>
 *   <App />
 * </AnimationProvider>
 * ```
 */
export function AnimationProvider({ children }: AnimationProviderProps) {
  const config = useAnimationConfig();

  return <AnimationContext.Provider value={config}>{children}</AnimationContext.Provider>;
}

/**
 * Hook to access animation context.
 *
 * @example
 * ```tsx
 * const { enabled, durationMultiplier, engine } = useAnimationContext();
 * ```
 */
export function useAnimationContext(): AnimationContextValue {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error("useAnimationContext must be used within an AnimationProvider");
  }

  return context;
}

/**
 * Optional hook to access animation context (returns null if not in provider).
 */
export function useOptionalAnimationContext(): AnimationContextValue | null {
  return useContext(AnimationContext);
}
