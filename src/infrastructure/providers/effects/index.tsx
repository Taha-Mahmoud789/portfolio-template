/**
 * Effects Provider
 *
 * Thin provider that applies CSS class side effects based on store state.
 * No Context — just side effects. This is the only provider infrastructure needs.
 *
 * Reads from:
 * - useThemeStore (existing app store) for theme-mode and reduced-motion classes
 *
 * Place this inside the app's provider tree, after ThemeProvider.
 */

import { useEffect, type ReactNode } from "react";

interface EffectsProviderProps {
  children: ReactNode;
  /**
   * Function that returns current theme mode and reduced motion state.
   * This decouples the provider from specific stores — the app passes
   * its own store selectors.
   */
  useThemeState: () => { mode: string; reducedMotion: boolean };
}

export function EffectsProvider({ children, useThemeState }: EffectsProviderProps) {
  const { mode, reducedMotion } = useThemeState();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");

    if (mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "theme-dark" : "theme-light");
    } else {
      root.classList.add(`theme-${mode}`);
    }
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  return <>{children}</>;
}
