/**
 * Theme API Hooks
 *
 * React hooks for interacting with the Theme Engine.
 * Provides convenient access to theme state and actions.
 */

import { useCallback, useMemo } from "react";
import { useThemeEngineStore, selectCurrentThemeId } from "./store";
import { useThemeEngineContext } from "./context";
import { ThemeRegistry } from "./registry";
import {
  getThemesByCategory,
  searchThemes,
  getThemesByTag,
  getNextThemeId,
  getPreviousThemeId,
  getRandomThemeId,
} from "./utilities";
import type {
  ThemeDefinition,
  ThemeCategory,
  ThemeContextValue,
} from "./types";

// ============================================================================
// Core Hooks
// ============================================================================

/**
 * Hook to access the full theme context.
 * Provides theme state, theme definition, and actions.
 */
export function useThemeEngine(): ThemeContextValue {
  return useThemeEngineContext();
}

/**
 * Hook to get the current theme definition.
 */
export function useTheme(): ThemeDefinition {
  const themeId = useThemeEngineStore(selectCurrentThemeId);
  return useMemo(() => ThemeRegistry.get(themeId) ?? ({} as ThemeDefinition), [themeId]);
}

/**
 * Hook to get a specific theme token value.
 */
export function useThemeToken(tokenPath: string): string {
  const theme = useTheme();
  return useMemo(() => {
    const parts = tokenPath.split(".");
    let current: unknown = theme;
    for (const part of parts) {
      if (current === null || current === undefined) return "";
      current = (current as Record<string, unknown>)[part];
    }
    return String(current ?? "");
  }, [theme, tokenPath]);
}

// ============================================================================
// Theme Navigation Hooks
// ============================================================================

/**
 * Hook to get available themes.
 */
export function useAvailableThemes(): ThemeDefinition[] {
  return useMemo(() => ThemeRegistry.getAllThemes(), []);
}

/**
 * Hook to get themes by category.
 */
export function useThemesByCategory(category: ThemeCategory): ThemeDefinition[] {
  const themes = useAvailableThemes();
  return useMemo(() => getThemesByCategory(themes, category), [themes, category]);
}

/**
 * Hook to search themes.
 */
export function useSearchThemes(query: string): ThemeDefinition[] {
  const themes = useAvailableThemes();
  return useMemo(() => searchThemes(themes, query), [themes, query]);
}

/**
 * Hook to get themes by tag.
 */
export function useThemesByTag(tag: string): ThemeDefinition[] {
  const themes = useAvailableThemes();
  return useMemo(() => getThemesByTag(themes, tag), [themes, tag]);
}

/**
 * Hook to navigate to the next theme.
 */
export function useNextTheme(): () => void {
  const themeId = useThemeEngineStore(selectCurrentThemeId);
  const setTheme = useThemeEngineStore((state) => state.setTheme);

  return useCallback(() => {
    const nextId = getNextThemeId(themeId);
    setTheme(nextId);
  }, [themeId, setTheme]);
}

/**
 * Hook to navigate to the previous theme.
 */
export function usePreviousTheme(): () => void {
  const themeId = useThemeEngineStore(selectCurrentThemeId);
  const setTheme = useThemeEngineStore((state) => state.setTheme);

  return useCallback(() => {
    const prevId = getPreviousThemeId(themeId);
    setTheme(prevId);
  }, [themeId, setTheme]);
}

/**
 * Hook to navigate to a random theme.
 */
export function useRandomTheme(): () => void {
  const themeId = useThemeEngineStore(selectCurrentThemeId);
  const setTheme = useThemeEngineStore((state) => state.setTheme);

  return useCallback(() => {
    const randomId = getRandomThemeId();
    if (randomId !== themeId) {
      setTheme(randomId);
    }
  }, [themeId, setTheme]);
}

// ============================================================================
// Accessibility Hooks
// ============================================================================

/**
 * Hook to toggle reduced motion.
 */
export function useToggleReducedMotion(): () => void {
  const reducedMotion = useThemeEngineStore((state) => state.reducedMotion);
  const setReducedMotion = useThemeEngineStore((state) => state.setReducedMotion);

  return useCallback(() => {
    setReducedMotion(!reducedMotion);
  }, [reducedMotion, setReducedMotion]);
}

/**
 * Hook to toggle high contrast.
 */
export function useToggleHighContrast(): () => void {
  const highContrast = useThemeEngineStore((state) => state.highContrast);
  const setHighContrast = useThemeEngineStore((state) => state.setHighContrast);

  return useCallback(() => {
    setHighContrast(!highContrast);
  }, [highContrast, setHighContrast]);
}

/**
 * Hook to set color blind mode.
 */
export function useSetColorBlindMode(): (
  mode: import("./types").ColorBlindMode
) => void {
  return useThemeEngineStore((state) => state.setColorBlindMode);
}
