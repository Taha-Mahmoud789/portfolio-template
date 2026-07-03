/**
 * Theme Engine Provider
 *
 * React provider that wraps the application and provides theme state and actions.
 * Handles theme initialization, CSS variable application, and accessibility settings.
 */

import type { ReactNode } from "react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { ThemeEngineContext } from "./context";
import { ThemeRegistry } from "./registry";
import { ThemeLoader } from "./loader";
import {
  useThemeEngineStore,
  selectCurrentThemeId,
  selectIsTransitioning,
  selectReducedMotion,
  selectHighContrast,
  selectColorBlindMode,
} from "./store";
import { applyThemeToElement } from "./css-generator";
import type { ThemeContextValue, ThemeDefinition, ThemeId } from "./types";

// ============================================================================
// Provider Props
// ============================================================================

interface ThemeEngineProviderProps {
  children: ReactNode;
  defaultThemeId?: ThemeId;
  preload?: boolean;
}

// ============================================================================
// Provider Component
// ============================================================================

export function ThemeEngineProvider({
  children,
  preload = true,
}: ThemeEngineProviderProps) {
  const isInitialized = useRef(false);

  // Get store state
  const currentThemeId = useThemeEngineStore(selectCurrentThemeId);
  const isTransitioning = useThemeEngineStore(selectIsTransitioning);
  const reducedMotion = useThemeEngineStore(selectReducedMotion);
  const highContrast = useThemeEngineStore(selectHighContrast);
  const colorBlindMode = useThemeEngineStore(selectColorBlindMode);

  // Get store actions
  const setTheme = useThemeEngineStore((state) => state.setTheme);
  const setReducedMotion = useThemeEngineStore((state) => state.setReducedMotion);

  // Get current theme from registry
  const currentTheme = useMemo((): ThemeDefinition => {
    return ThemeRegistry.get(currentThemeId) ?? ({} as ThemeDefinition);
  }, [currentThemeId]);

  // Initialize theme on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeTheme = async () => {
      try {
        // Load and apply the initial theme
        let theme: ThemeDefinition;
        try {
          theme = ThemeRegistry.getOrThrow(currentThemeId);
        } catch {
          theme = await ThemeLoader.loadTheme(currentThemeId);
        }

        applyThemeToElement(theme);
      } catch (error) {
        console.error("Failed to initialize theme:", error);
        // Fallback to default theme
        try {
          const fallbackTheme = ThemeRegistry.get(currentThemeId);
          if (fallbackTheme) {
            applyThemeToElement(fallbackTheme);
          }
        } catch {
          console.error("Failed to apply fallback theme");
        }
      }
    };

    initializeTheme();

    // Preload other themes if enabled
    if (preload) {
      const preloadTimeout = setTimeout(() => {
        ThemeLoader.preloadAllThemes().catch(console.error);
      }, 2000);

      return () => clearTimeout(preloadTimeout);
    }
  }, [currentThemeId, preload]);

  // Detect system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setReducedMotion(true);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setReducedMotion]);

  // Apply reduced motion CSS variable
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty("--theme-motion-duration-multiplier", "0");
    } else {
      document.documentElement.style.removeProperty("--theme-motion-duration-multiplier");
    }
  }, [reducedMotion]);

  // Apply high contrast class
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  // Apply color blind mode attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-color-blind", colorBlindMode);
  }, [colorBlindMode]);

  // Get a theme token by path
  const getThemeToken = useCallback(
    (tokenPath: string): string => {
      const parts = tokenPath.split(".");
      let current: unknown = currentTheme;

      for (const part of parts) {
        if (current === null || current === undefined) {
          return "";
        }
        current = (current as Record<string, unknown>)[part];
      }

      return String(current ?? "");
    },
    [currentTheme]
  );

  // Context value
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme: currentTheme,
      themeId: currentThemeId,
      setTheme,
      getThemeToken,
      isTransitioning,
      reducedMotion,
      highContrast,
      colorBlindMode,
    }),
    [
      currentTheme,
      currentThemeId,
      setTheme,
      getThemeToken,
      isTransitioning,
      reducedMotion,
      highContrast,
      colorBlindMode,
    ]
  );

  return (
    <ThemeEngineContext.Provider value={contextValue}>
      {children}
    </ThemeEngineContext.Provider>
  );
}
