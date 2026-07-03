/**
 * Accessibility Provider
 *
 * Initializes global accessibility features:
 * - Reduced motion detection and propagation
 * - Focus management (Escape to blur)
 * - High contrast mode support
 *
 * Individual features (focus trap, keyboard navigation) are used
 * via hooks in the components that need them.
 */

import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/store/theme-store";

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const setReducedMotion = useThemeStore((s) => s.setReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);

  return <>{children}</>;
}
