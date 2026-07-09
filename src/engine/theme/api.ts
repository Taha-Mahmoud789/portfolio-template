/**
 * Theme API
 *
 * Main API object for interacting with the Theme Engine.
 * Provides a unified interface for all theme operations.
 */

import { ThemeRegistry } from "./registry";
import { useThemeEngineStore } from "./store";
import { generateThemeCSSVariables } from "./css-generator";
import { validateTheme as validateThemeUtil } from "./validation";
import { mergeThemes } from "./utilities";
import type { ThemeId, ThemeDefinition, ThemeCategory, ThemeAPI, ColorBlindMode } from "./types";

// ============================================================================
// Theme API Implementation
// ============================================================================

export const themeAPI: ThemeAPI = {
  // --- Core ---

  /**
   * Set the current theme by ID.
   */
  async setTheme(themeId: ThemeId): Promise<void> {
    const store = useThemeEngineStore.getState();
    await store.setTheme(themeId);
  },

  /**
   * Get the current theme definition.
   */
  getTheme(): ThemeDefinition {
    const id = useThemeEngineStore.getState().currentThemeId;
    return ThemeRegistry.getOrThrow(id);
  },

  /**
   * Get the previous theme definition.
   */
  getPreviousTheme(): ThemeDefinition | null {
    const id = useThemeEngineStore.getState().previousThemeId;
    return id ? (ThemeRegistry.get(id) ?? null) : null;
  },

  /**
   * Get the current theme ID.
   */
  getThemeId(): ThemeId {
    return useThemeEngineStore.getState().currentThemeId;
  },

  /**
   * Get a theme token value by path.
   */
  getThemeToken(tokenPath: string): string {
    const theme = this.getTheme();
    const parts = tokenPath.split(".");
    let current: unknown = theme;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return "";
      }
      current = (current as Record<string, unknown>)[part];
    }

    return current?.toString() ?? "";
  },

  // --- Registry ---

  /**
   * Get all available themes.
   */
  getAvailableThemes(): ThemeDefinition[] {
    return ThemeRegistry.getAllThemes();
  },

  /**
   * Get themes by category.
   */
  getThemesByCategory(category: ThemeCategory): ThemeDefinition[] {
    return ThemeRegistry.getByCategory(category);
  },

  /**
   * Get a theme by ID.
   */
  getThemeById(id: ThemeId): ThemeDefinition | undefined {
    return ThemeRegistry.get(id);
  },

  // --- Utilities ---

  /**
   * Validate a theme definition.
   */
  validateTheme(theme: Partial<ThemeDefinition>): boolean {
    return validateThemeUtil(theme).valid;
  },

  /**
   * Merge two theme definitions.
   */
  mergeThemes(base: ThemeDefinition, override: Partial<ThemeDefinition>): ThemeDefinition {
    return mergeThemes(base, override);
  },

  /**
   * Generate CSS variables for a theme.
   */
  generateCSSVariables(theme: ThemeDefinition): Record<string, string> {
    return generateThemeCSSVariables(theme);
  },

  // --- Accessibility ---

  /**
   * Enable or disable reduced motion.
   */
  setReducedMotion(reduced: boolean): void {
    useThemeEngineStore.getState().setReducedMotion(reduced);
  },

  /**
   * Enable or disable high contrast mode.
   */
  setHighContrast(high: boolean): void {
    useThemeEngineStore.getState().setHighContrast(high);
  },

  /**
   * Set color blind mode.
   */
  setColorBlindMode(mode: ColorBlindMode): void {
    useThemeEngineStore.getState().setColorBlindMode(mode);
  },

  // --- History ---

  /**
   * Get the theme history.
   */
  getThemeHistory(): ThemeId[] {
    return useThemeEngineStore.getState().themeHistory;
  },

  /**
   * Go back to the previous theme.
   */
  goBack(): void {
    useThemeEngineStore.getState().goBack();
  },
};
