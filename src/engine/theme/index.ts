/**
 * Theme Engine
 *
 * Main entry point for the Theme Engine.
 * Export all public APIs, types, and utilities.
 */

// ============================================================================
// Types
// ============================================================================
export type {
  ThemeId,
  ThemeCategory,
  ColorBlindMode,
  ThemeDefinition,
  ThemeColorPalette,
  ThemeGradients,
  ThemeTypography,
  ThemeSpacing,
  ThemeRadius,
  ThemeShadows,
  ThemeBlur,
  ThemeGlass,
  ThemeMotion,
  ThemeAnimationPreset,
  ThemeMotionIntensity,
  ThemeParticles,
  ThemeNoise,
  ThemeBackground,
  ThemeForeground,
  ThemeSurface,
  ThemeBorder,
  ThemeButtonStyle,
  ThemeCardStyle,
  ThemeInputStyle,
  ThemeCursorStyle,
  ThemeScrollbarStyle,
  ThemeSelectionStyle,
  ThemeFocusStyle,
  ThemeSpacingOverrides,
  ThemeRegistryEntry,
  ThemeRegistryConfig,
  ThemeStoreState,
  ThemeStoreActions,
  ThemeStore,
  ThemeContextValue,
  ThemeAPI,
  ThemeLoaderConfig,
  ThemeLoaderInterface,
} from "./types";

// ============================================================================
// Constants
// ============================================================================
export {
  DEFAULT_THEME_ID,
  FALLBACK_THEME_ID,
  THEME_REGISTRY_DEFAULTS,
  ALL_THEME_IDS,
  MOTION_INTENSITY_PRESETS,
  ANIMATION_PRESET_DEFAULTS,
  CSS_VAR_PREFIX,
  CSS_VAR_GROUPS,
  THEME_TRANSITION_DURATION,
  THEME_TRANSITION_EASING,
  THEME_TRANSITION_CSS,
  THEME_STORAGE_KEY,
  THEME_HISTORY_STORAGE_KEY,
  ACCESSIBILITY_DEFAULTS,
  THEME_CATEGORIES,
  PERFORMANCE_CONFIG,
} from "./constants";

// ============================================================================
// Core
// ============================================================================
export { ThemeRegistry, createThemeRegistry } from "./registry";
export { ThemeLoader, createThemeLoader } from "./loader";
export {
  useThemeEngineStore,
  selectCurrentThemeId,
  selectIsTransitioning,
  selectReducedMotion,
  selectHighContrast,
  selectColorBlindMode,
  selectThemeHistory,
  selectPreviousThemeId,
  selectGoBack,
  selectReset,
} from "./store";
export { ThemeEngineContext } from "./context";
export { ThemeEngineProvider } from "./provider";

// ============================================================================
// API
// ============================================================================
export { themeAPI } from "./api";

// ============================================================================
// Hooks
// ============================================================================
export {
  useThemeEngine,
  useTheme,
  useThemeToken,
  useAvailableThemes,
  useThemesByCategory,
  useSearchThemes,
  useThemesByTag,
  useNextTheme,
  usePreviousTheme,
  useRandomTheme,
  useToggleReducedMotion,
  useToggleHighContrast,
  useSetColorBlindMode,
} from "./hooks";

// ============================================================================
// CSS Generator
// ============================================================================
export {
  generateThemeCSSVariables,
  generateThemeCSSString,
  applyThemeToElement,
  removeThemeFromElement,
} from "./css-generator";

// ============================================================================
// Validation
// ============================================================================
export { validateTheme as validateThemeDefinition, isValidTheme, validateThemeOrThrow } from "./validation";

// ============================================================================
// Utilities
// ============================================================================
export {
  mergeThemes,
  tokenToCSSVar,
  cssVarToToken,
  getThemesByCategory as getThemesByCategoryUtil,
  searchThemes,
  getThemesByTag,
  createHighContrastVersion,
  createReducedMotionVersion,
  createColorBlindVersion,
  compareThemes,
  getThemeSimilarity,
  isValidThemeId,
  getNextThemeId,
  getPreviousThemeId,
  getRandomThemeId,
  getRandomThemeIdExcluding,
} from "./utilities";

// ============================================================================
// Initializer
// ============================================================================
export {
  initializeThemeEngine,
  isThemeEngineInitialized,
  resetThemeEngine,
} from "./initializer";

// ============================================================================
// Theme Definitions
// ============================================================================
export {
  appleTheme,
  cyberpunkTheme,
  spaceTheme,
  gamingTheme,
  aiTheme,
  editorialTheme,
  liquidTheme,
  retroTheme,
  brutalistTheme,
  experimentalTheme,
  allThemes,
  getThemeById,
} from "./definitions";
