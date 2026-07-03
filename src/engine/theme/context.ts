/**
 * Theme Context
 *
 * React context for providing theme state and actions to components.
 */

import { createContext, useContext } from "react";
import type { ThemeContextValue } from "./types";
import { ThemeRegistry } from "./registry";
import { DEFAULT_THEME_ID } from "./constants";

// ============================================================================
// Default Context Value
// ============================================================================

const defaultTheme = ThemeRegistry.get(DEFAULT_THEME_ID);

const defaultContextValue: ThemeContextValue = {
  theme: defaultTheme as ThemeContextValue["theme"],
  themeId: DEFAULT_THEME_ID,
  setTheme: async () => {},
  getThemeToken: () => "",
  isTransitioning: false,
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: "none",
};

// ============================================================================
// Create Context
// ============================================================================

export const ThemeEngineContext = createContext<ThemeContextValue>(defaultContextValue);

// ============================================================================
// Hook to Use Context
// ============================================================================

/**
 * Hook to access the theme engine context.
 * Must be used within a ThemeEngineProvider.
 */
export function useThemeEngineContext(): ThemeContextValue {
  const context = useContext(ThemeEngineContext);

  if (!context) {
    throw new Error(
      "useThemeEngineContext must be used within a ThemeEngineProvider"
    );
  }

  return context;
}
