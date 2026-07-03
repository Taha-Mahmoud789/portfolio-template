/**
 * Theme Utilities
 *
 * Helper functions for theme manipulation, merging, and transformation.
 */

import type { ThemeDefinition, ThemeId, ThemeCategory } from "./types";
import { ALL_THEME_IDS } from "./constants";

// ============================================================================
// Theme Merging
// ============================================================================

/**
 * Deep merge two theme definitions.
 * The override theme takes precedence over the base theme.
 */
export function mergeThemes<T extends Partial<ThemeDefinition>>(
  base: T,
  override: Partial<ThemeDefinition>
): ThemeDefinition {
  return deepMerge(base, override) as ThemeDefinition;
}

/**
 * Deep merge utility.
 */
function deepMerge(target: unknown, source: unknown): unknown {
  const result = { ...(target as Record<string, unknown>) };

  for (const key in source as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = (source as Record<string, unknown>)[key];
      const targetValue = result[key];

      if (
        isObject(sourceValue) &&
        isObject(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ============================================================================
// Theme Token Resolution
// ============================================================================

/**
 * Get a CSS variable name from a token path.
 */
export function tokenToCSSVar(path: string): string {
  return `--theme-${path.replace(/\./g, "-")}`;
}

/**
 * Get a token path from a CSS variable name.
 */
export function cssVarToToken(cssVar: string): string {
  return cssVar.replace(/^--theme-/, "").replace(/-/g, ".");
}

// ============================================================================
// Theme Queries
// ============================================================================

/**
 * Get all themes in a specific category.
 */
export function getThemesByCategory(
  themes: ThemeDefinition[],
  category: ThemeCategory
): ThemeDefinition[] {
  return themes.filter((theme) => theme.category === category);
}

/**
 * Search themes by name or description.
 */
export function searchThemes(
  themes: ThemeDefinition[],
  query: string
): ThemeDefinition[] {
  const lowerQuery = query.toLowerCase();
  return themes.filter(
    (theme) =>
      theme.name.toLowerCase().includes(lowerQuery) ||
      theme.description.toLowerCase().includes(lowerQuery) ||
      theme.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get themes by tag.
 */
export function getThemesByTag(
  themes: ThemeDefinition[],
  tag: string
): ThemeDefinition[] {
  return themes.filter((theme) =>
    theme.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

// ============================================================================
// Theme Transformation
// ============================================================================

/**
 * Create a high contrast version of a theme.
 */
export function createHighContrastVersion(theme: ThemeDefinition): ThemeDefinition {
  return mergeThemes(theme, {
    isHighContrast: true,
    colors: {
      ...theme.colors,
      foreground: theme.isDark ? "#ffffff" : "#000000",
      "foreground-subtle": theme.isDark ? "#e5e5e5" : "#1a1a1a",
      "foreground-muted": theme.isDark ? "#cccccc" : "#333333",
      border: theme.isDark ? "#ffffff" : "#000000",
      "border-strong": theme.isDark ? "#ffffff" : "#000000",
      "border-focus": theme.isDark ? "#ffffff" : "#000000",
    },
  });
}

/**
 * Create a reduced motion version of a theme.
 */
export function createReducedMotionVersion(theme: ThemeDefinition): ThemeDefinition {
  return mergeThemes(theme, {
    motionIntensity: "off" as const,
    particles: {
      ...theme.particles,
      enabled: false,
    },
  });
}

/**
 * Create a color blind friendly version of a theme.
 */
export function createColorBlindVersion(
  theme: ThemeDefinition,
  mode: "protanopia" | "deuteranopia" | "tritanopia"
): ThemeDefinition {
  // Color blind friendly palettes
  const palettes = {
    protanopia: {
      primary: "#0077bb",
      secondary: "#33bbee",
      accent: "#009988",
      success: "#009988",
      warning: "#ee7733",
      error: "#cc3311",
      info: "#33bbee",
    },
    deuteranopia: {
      primary: "#0077bb",
      secondary: "#33bbee",
      accent: "#009988",
      success: "#009988",
      warning: "#ee7733",
      error: "#cc3311",
      info: "#33bbee",
    },
    tritanopia: {
      primary: "#ee3377",
      secondary: "#ee3377",
      accent: "#009988",
      success: "#009988",
      warning: "#cc3311",
      error: "#cc3311",
      info: "#33bbee",
    },
  };

  return mergeThemes(theme, {
    colors: {
      ...theme.colors,
      ...palettes[mode],
    },
  });
}

// ============================================================================
// Theme Comparison
// ============================================================================

/**
 * Compare two themes and return their differences.
 */
export function compareThemes(
  theme1: ThemeDefinition,
  theme2: ThemeDefinition
): Record<string, { theme1: unknown; theme2: unknown }> {
  const differences: Record<string, { theme1: unknown; theme2: unknown }> = {};

  function compare(obj1: Record<string, unknown>, obj2: Record<string, unknown>, path: string) {
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of allKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (isObject(val1) && isObject(val2)) {
        compare(val1, val2, fullPath);
      } else if (val1 !== val2) {
        differences[fullPath] = { theme1: val1, theme2: val2 };
      }
    }
  }

  compare(
    theme1 as unknown as Record<string, unknown>,
    theme2 as unknown as Record<string, unknown>,
    ""
  );

  return differences;
}

/**
 * Get the percentage of similarity between two themes.
 */
export function getThemeSimilarity(theme1: ThemeDefinition, theme2: ThemeDefinition): number {
  const differences = compareThemes(theme1, theme2);
  const totalTokens = countTokens(theme1);
  const diffCount = Object.keys(differences).length;

  return Math.round(((totalTokens - diffCount) / totalTokens) * 100);
}

/**
 * Count the number of tokens in a theme.
 */
function countTokens(theme: ThemeDefinition): number {
  let count = 0;

  function countObject(obj: Record<string, unknown>) {
    for (const value of Object.values(obj)) {
      if (isObject(value)) {
        countObject(value);
      } else {
        count++;
      }
    }
  }

  countObject(theme as unknown as Record<string, unknown>);
  return count;
}

// ============================================================================
// Theme ID Utilities
// ============================================================================

/**
 * Check if a string is a valid theme ID.
 */
export function isValidThemeId(id: string): id is ThemeId {
  return ALL_THEME_IDS.includes(id as ThemeId);
}

/**
 * Get the next theme ID in the list.
 */
export function getNextThemeId(current: ThemeId): ThemeId {
  const index = ALL_THEME_IDS.indexOf(current);
  const nextIndex = (index + 1) % ALL_THEME_IDS.length;
  return ALL_THEME_IDS[nextIndex]!;
}

/**
 * Get the previous theme ID in the list.
 */
export function getPreviousThemeId(current: ThemeId): ThemeId {
  const index = ALL_THEME_IDS.indexOf(current);
  const prevIndex = (index - 1 + ALL_THEME_IDS.length) % ALL_THEME_IDS.length;
  return ALL_THEME_IDS[prevIndex]!;
}

/**
 * Get a random theme ID.
 */
export function getRandomThemeId(): ThemeId {
  const index = Math.floor(Math.random() * ALL_THEME_IDS.length);
  return ALL_THEME_IDS[index]!;
}

/**
 * Get a random theme ID different from the current one.
 */
export function getRandomThemeIdExcluding(current: ThemeId): ThemeId {
  const available = ALL_THEME_IDS.filter((id) => id !== current);
  const index = Math.floor(Math.random() * available.length);
  return available[index]!;
}
