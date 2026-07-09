/**
 * Theme Engine Constants
 *
 * Default values, fallbacks, and configuration constants for the Theme Engine.
 */

import type {
  ThemeId,
  ThemeRegistryConfig,
  ThemeMotionIntensity,
  ThemeAnimationPreset,
} from "./types";

// ============================================================================
// Default Theme Configuration
// ============================================================================

export const DEFAULT_THEME_ID: ThemeId = "apple";

export const FALLBACK_THEME_ID: ThemeId = "apple";

export const THEME_REGISTRY_DEFAULTS: ThemeRegistryConfig = {
  defaultTheme: DEFAULT_THEME_ID,
  fallbackTheme: FALLBACK_THEME_ID,
  enableLazyLoading: true,
  enableCaching: true,
  enableValidation: true,
};

// ============================================================================
// All Theme IDs
// ============================================================================

export const ALL_THEME_IDS: readonly ThemeId[] = [
  "apple",
  "cyberpunk",
  "space",
  "gaming",
  "ai",
  "editorial",
  "liquid",
  "retro",
  "brutalist",
  "experimental",
] as const;

// ============================================================================
// Motion Intensity Presets
// ============================================================================

export const MOTION_INTENSITY_PRESETS: Record<
  ThemeMotionIntensity,
  {
    durationMultiplier: number;
    enableParticles: boolean;
    enableParallax: boolean;
    enableHoverEffects: boolean;
  }
> = {
  off: {
    durationMultiplier: 0,
    enableParticles: false,
    enableParallax: false,
    enableHoverEffects: false,
  },
  reduced: {
    durationMultiplier: 0.5,
    enableParticles: false,
    enableParallax: false,
    enableHoverEffects: true,
  },
  normal: {
    durationMultiplier: 1,
    enableParticles: true,
    enableParallax: true,
    enableHoverEffects: true,
  },
  increased: {
    durationMultiplier: 1.5,
    enableParticles: true,
    enableParallax: true,
    enableHoverEffects: true,
  },
  max: {
    durationMultiplier: 2,
    enableParticles: true,
    enableParallax: true,
    enableHoverEffects: true,
  },
};

// ============================================================================
// Animation Preset Defaults
// ============================================================================

export const ANIMATION_PRESET_DEFAULTS: Record<
  ThemeAnimationPreset,
  {
    duration: string;
    easing: string;
    stagger: string;
  }
> = {
  none: { duration: "0ms", easing: "linear", stagger: "0ms" },
  subtle: { duration: "150ms", easing: "ease-out", stagger: "50ms" },
  moderate: { duration: "300ms", easing: "ease-in-out", stagger: "75ms" },
  expressive: { duration: "500ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", stagger: "100ms" },
  dramatic: { duration: "700ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", stagger: "150ms" },
  kinetic: {
    duration: "400ms",
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    stagger: "100ms",
  },
  glitch: { duration: "200ms", easing: "steps(4, end)", stagger: "50ms" },
  organic: { duration: "600ms", easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", stagger: "120ms" },
  mechanical: { duration: "250ms", easing: "cubic-bezier(0.77, 0, 0.175, 1)", stagger: "80ms" },
  fluid: { duration: "800ms", easing: "cubic-bezier(0.23, 1, 0.32, 1)", stagger: "150ms" },
};

// ============================================================================
// CSS Variable Prefixes
// ============================================================================

export const CSS_VAR_PREFIX = "--theme";

export const CSS_VAR_GROUPS = {
  color: `${CSS_VAR_PREFIX}-color`,
  typography: `${CSS_VAR_PREFIX}-font`,
  spacing: `${CSS_VAR_PREFIX}-space`,
  radius: `${CSS_VAR_PREFIX}-radius`,
  shadow: `${CSS_VAR_PREFIX}-shadow`,
  blur: `${CSS_VAR_PREFIX}-blur`,
  glass: `${CSS_VAR_PREFIX}-glass`,
  motion: `${CSS_VAR_PREFIX}-motion`,
  gradient: `${CSS_VAR_PREFIX}-gradient`,
  particle: `${CSS_VAR_PREFIX}-particle`,
  noise: `${CSS_VAR_PREFIX}-noise`,
} as const;

// ============================================================================
// Theme Transition
// ============================================================================

export const THEME_TRANSITION_DURATION = 300; // ms

export const THEME_TRANSITION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

export const THEME_TRANSITION_CSS = `all ${String(THEME_TRANSITION_DURATION)}ms ${THEME_TRANSITION_EASING}`;

// ============================================================================
// Theme Storage
// ============================================================================

export const THEME_STORAGE_KEY = "multiverse-theme-engine";

export const THEME_HISTORY_STORAGE_KEY = "multiverse-theme-history";

// ============================================================================
// Accessibility Defaults
// ============================================================================

export const ACCESSIBILITY_DEFAULTS = {
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: "none" as const,
  minFontSize: "12px",
  maxFontSize: "24px",
  minLineHeight: 1.5,
  maxLineHeight: 2,
  minContrastRatio: 4.5,
  minContrastRatioLarge: 3,
};

// ============================================================================
// Theme Categories
// ============================================================================

export const THEME_CATEGORIES = {
  minimal: { name: "Minimal", description: "Clean, simple, and focused" },
  futuristic: { name: "Futuristic", description: "High-tech and forward-looking" },
  cosmic: { name: "Cosmic", description: "Space and celestial themes" },
  interactive: { name: "Interactive", description: "Engaging and playful" },
  intelligent: { name: "Intelligent", description: "Smart and adaptive" },
  typographic: { name: "Typographic", description: "Typography-focused design" },
  organic: { name: "Organic", description: "Natural and fluid forms" },
  nostalgic: { name: "Nostalgic", description: "Retro and vintage aesthetics" },
  raw: { name: "Raw", description: "Bold, unpolished, and stark" },
  "avant-garde": { name: "Avant-Garde", description: "Experimental and boundary-pushing" },
} as const;

// ============================================================================
// Performance
// ============================================================================

export const PERFORMANCE_CONFIG = {
  maxCacheSize: 10,
  cacheExpiration: 1000 * 60 * 60, // 1 hour
  lazyLoadThreshold: 3, // Load themes in batches of 3
  preloadIdleTimeout: 2000, // ms to wait before preloading
  debounceThemeChange: 100, // ms to debounce rapid theme changes
};
