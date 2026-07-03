/**
 * Theme Engine Types
 *
 * Comprehensive type definitions for the entire Theme Engine.
 * Every visual property a theme can define is typed here.
 */

// ============================================================================
// Theme Identity
// ============================================================================

export type ThemeId =
  | "apple"
  | "cyberpunk"
  | "space"
  | "gaming"
  | "ai"
  | "editorial"
  | "liquid"
  | "retro"
  | "brutalist"
  | "experimental";

export type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export type ThemeCategory =
  | "minimal"
  | "futuristic"
  | "cosmic"
  | "interactive"
  | "intelligent"
  | "typographic"
  | "organic"
  | "nostalgic"
  | "raw"
  | "avant-garde";

// ============================================================================
// Color System
// ============================================================================

export interface ThemeColorPalette {
  primary: string;
  "primary-foreground": string;
  "primary-hover": string;
  "primary-active": string;
  "primary-subtle": string;
  "primary-muted": string;

  secondary: string;
  "secondary-foreground": string;
  "secondary-hover": string;
  "secondary-active": string;
  "secondary-subtle": string;
  "secondary-muted": string;

  accent: string;
  "accent-foreground": string;
  "accent-hover": string;
  "accent-active": string;
  "accent-subtle": string;

  destructive: string;
  "destructive-foreground": string;
  "destructive-hover": string;
  "destructive-subtle": string;

  background: string;
  "background-subtle": string;
  "background-muted": string;

  foreground: string;
  "foreground-subtle": string;
  "foreground-muted": string;
  "foreground-disabled": string;

  surface: string;
  "surface-raised": string;
  "surface-overlay": string;
  "surface-sunken": string;
  "surface-inset": string;
  "surface-hover": string;
  "surface-active": string;

  border: string;
  "border-strong": string;
  "border-subtle": string;
  "border-muted": string;
  "border-focus": string;
  "border-disabled": string;

  success: string;
  "success-foreground": string;
  "success-subtle": string;

  warning: string;
  "warning-foreground": string;
  "warning-subtle": string;

  error: string;
  "error-foreground": string;
  "error-subtle": string;

  info: string;
  "info-foreground": string;
  "info-subtle": string;

  "focus-ring": string;
  "hover-overlay": string;
  "active-overlay": string;
  "disabled-bg": string;
  "disabled-fg": string;
  "disabled-border": string;

  "selection-bg": string;
  "selection-fg": string;

  "overlay-heavy": string;
  "overlay-medium": string;
  "overlay-light": string;
  "overlay-lightest": string;
}

export interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
  hero: string;
  card: string;
  surface: string;
  "surface-raised": string;
  "mesh-1": string;
  "mesh-2": string;
  "mesh-3": string;
  "conic-1": string;
  "conic-2": string;
  "radial-1": string;
  "radial-2": string;
}

// ============================================================================
// Typography System
// ============================================================================

export interface ThemeTypography {
  "font-sans": string;
  "font-heading": string;
  "font-display": string;
  "font-mono": string;
  "font-serif": string;

  "text-2xs": [string, { lineHeight: string }];
  "text-xs": [string, { lineHeight: string }];
  "text-sm": [string, { lineHeight: string }];
  "text-base": [string, { lineHeight: string }];
  "text-lg": [string, { lineHeight: string }];
  "text-xl": [string, { lineHeight: string }];
  "text-2xl": [string, { lineHeight: string }];
  "text-3xl": [string, { lineHeight: string }];
  "text-4xl": [string, { lineHeight: string }];
  "text-5xl": [string, { lineHeight: string }];
  "text-6xl": [string, { lineHeight: string }];
  "text-7xl": [string, { lineHeight: string }];
  "text-8xl": [string, { lineHeight: string }];
  "text-9xl": [string, { lineHeight: string }];

  "font-thin": number;
  "font-extralight": number;
  "font-light": number;
  "font-regular": number;
  "font-medium": number;
  "font-semibold": number;
  "font-bold": number;
  "font-extrabold": number;
  "font-black": number;

  "tracking-tighter": string;
  "tracking-tight": string;
  "tracking-normal": string;
  "tracking-wide": string;
  "tracking-wider": string;
  "tracking-widest": string;

  "leading-none": string;
  "leading-tight": string;
  "leading-snug": string;
  "leading-normal": string;
  "leading-relaxed": string;
  "leading-loose": string;
}

// ============================================================================
// Spacing & Layout System
// ============================================================================

export interface ThemeSpacing {
  "space-0": string;
  "space-px": string;
  "space-0.5": string;
  "space-1": string;
  "space-1.5": string;
  "space-2": string;
  "space-2.5": string;
  "space-3": string;
  "space-3.5": string;
  "space-4": string;
  "space-5": string;
  "space-6": string;
  "space-7": string;
  "space-8": string;
  "space-9": string;
  "space-10": string;
  "space-11": string;
  "space-12": string;
  "space-14": string;
  "space-16": string;
  "space-20": string;
  "space-24": string;
  "space-28": string;
  "space-32": string;
  "space-36": string;
  "space-40": string;
  "space-44": string;
  "space-48": string;
  "space-52": string;
  "space-56": string;
  "space-60": string;
  "space-64": string;
  "space-72": string;
  "space-80": string;
  "space-96": string;

  "gap-xs": string;
  "gap-sm": string;
  "gap-md": string;
  "gap-lg": string;
  "gap-xl": string;
  "gap-2xl": string;

  "section-xs": string;
  "section-sm": string;
  "section-md": string;
  "section-lg": string;
  "section-xl": string;
  "section-2xl": string;

  "container-sm": string;
  "container-md": string;
  "container-lg": string;
  "container-xl": string;
  "container-2xl": string;
  "container-3xl": string;
  "container-prose": string;

  "content-narrow": string;
  "content-medium": string;
  "content-wide": string;
  "content-full": string;
}

// ============================================================================
// Border Radius System
// ============================================================================

export interface ThemeRadius {
  "radius-none": string;
  "radius-xs": string;
  "radius-sm": string;
  "radius-md": string;
  "radius-lg": string;
  "radius-xl": string;
  "radius-2xl": string;
  "radius-3xl": string;
  "radius-full": string;

  "radius-button": string;
  "radius-input": string;
  "radius-card": string;
  "radius-badge": string;
  "radius-avatar": string;
  "radius-modal": string;
  "radius-tooltip": string;
}

// ============================================================================
// Shadow & Elevation System
// ============================================================================

export interface ThemeShadows {
  "shadow-none": string;
  "shadow-xs": string;
  "shadow-sm": string;
  "shadow-md": string;
  "shadow-lg": string;
  "shadow-xl": string;
  "shadow-2xl": string;
  "shadow-inner": string;

  "shadow-card": string;
  "shadow-dropdown": string;
  "shadow-modal": string;
  "shadow-popover": string;
  "shadow-toast": string;
  "shadow-tooltip": string;
  "shadow-sticky": string;

  "shadow-glow-sm": string;
  "shadow-glow-md": string;
  "shadow-glow-lg": string;
  "shadow-glow-xl": string;
  "shadow-glow-primary": string;
  "shadow-glow-accent": string;

  "shadow-colored-sm": string;
  "shadow-colored-md": string;
  "shadow-colored-lg": string;
}

// ============================================================================
// Blur & Glass System
// ============================================================================

export interface ThemeBlur {
  "blur-none": string;
  "blur-sm": string;
  "blur-md": string;
  "blur-lg": string;
  "blur-xl": string;
  "blur-2xl": string;
  "blur-3xl": string;
}

export interface ThemeGlass {
  "glass-bg": string;
  "glass-bg-heavy": string;
  "glass-bg-light": string;
  "glass-border": string;
  "glass-shadow": string;
  "glass-blur": string;
  "glass-saturation": string;
}

// ============================================================================
// Animation & Motion System
// ============================================================================

export type ThemeAnimationPreset =
  | "none"
  | "subtle"
  | "moderate"
  | "expressive"
  | "dramatic"
  | "kinetic"
  | "glitch"
  | "organic"
  | "mechanical"
  | "fluid";

export type ThemeMotionIntensity = "off" | "reduced" | "normal" | "increased" | "max";

export interface ThemeMotion {
  "duration-instant": string;
  "duration-fast": string;
  "duration-normal": string;
  "duration-slow": string;
  "duration-slower": string;
  "duration-slowest": string;

  "duration-75": string;
  "duration-100": string;
  "duration-150": string;
  "duration-200": string;
  "duration-300": string;
  "duration-400": string;
  "duration-500": string;
  "duration-600": string;
  "duration-700": string;
  "duration-800": string;
  "duration-900": string;
  "duration-1000": string;

  "ease-linear": string;
  "ease-in": string;
  "ease-out": string;
  "ease-in-out": string;
  "ease-in-quad": string;
  "ease-out-quad": string;
  "ease-in-out-quad": string;
  "ease-in-cubic": string;
  "ease-out-cubic": string;
  "ease-in-out-cubic": string;
  "ease-in-expo": string;
  "ease-out-expo": string;
  "ease-in-out-expo": string;
  "ease-spring": string;
  "ease-bounce": string;
  "ease-elastic": string;

  "spring-stiff": string;
  "spring-damping": string;
  "spring-mass": string;
}

// ============================================================================
// Particle Configuration
// ============================================================================

export interface ThemeParticles {
  enabled: boolean;
  count: number;
  type: "dots" | "lines" | "shapes" | "custom";
  color: string;
  opacity: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  direction: number;
  spread: number;
  lifetime: number;
  blendMode: "normal" | "multiply" | "screen" | "overlay";
}

// ============================================================================
// Noise & Texture
// ============================================================================

export interface ThemeNoise {
  intensity: number;
  opacity: number;
  size: number;
  blendMode: "normal" | "multiply" | "screen" | "overlay" | "soft-light";
  type: "grain" | "static" | "dots" | "lines" | "organic";
}

// ============================================================================
// Background System
// ============================================================================

export interface ThemeBackground {
  color: string;
  "color-subtle": string;
  gradient: string;
  "gradient-radial": string;
  "gradient-mesh": string;
  "gradient-conic": string;
  pattern: string;
  "pattern-opacity": number;
  noise: ThemeNoise;
}

// ============================================================================
// Foreground System
// ============================================================================

export interface ThemeForeground {
  color: string;
  "color-subtle": string;
  "color-muted": string;
  "color-disabled": string;
}

// ============================================================================
// Surface System
// ============================================================================

export interface ThemeSurface {
  color: string;
  "color-raised": string;
  "color-overlay": string;
  "color-sunken": string;
  "color-inset": string;
  "color-hover": string;
  "color-active": string;
  border: string;
  "border-subtle": string;
  shadow: string;
  "backdrop-filter": string;
}

// ============================================================================
// Border System
// ============================================================================

export interface ThemeBorder {
  color: string;
  "color-strong": string;
  "color-subtle": string;
  "color-muted": string;
  "color-focus": string;
  "color-disabled": string;
  width: string;
  "width-thin": string;
  "width-medium": string;
  "width-thick": string;
  style: string;
  radius: string;
}

// ============================================================================
// Component Styles
// ============================================================================

export interface ThemeButtonStyle {
  "radius": string;
  "padding-x": string;
  "padding-y": string;
  "font-size": string;
  "font-weight": string;
  "transition": string;
  "shadow": string;
  "shadow-hover": string;
  "transform-hover": string;
  "disabled-opacity": string;
}

export interface ThemeCardStyle {
  "radius": string;
  "padding": string;
  "background": string;
  "border": string;
  "shadow": string;
  "shadow-hover": string;
  "transition": string;
  "transform-hover": string;
  "backdrop-filter": string;
}

export interface ThemeInputStyle {
  "radius": string;
  "padding-x": string;
  "padding-y": string;
  "font-size": string;
  "background": string;
  "border": string;
  "border-focus": string;
  "shadow-focus": string;
  "placeholder-color": string;
  "disabled-opacity": string;
  "transition": string;
}

export interface ThemeCursorStyle {
  "default": string;
  "pointer": string;
  "text": string;
  "move": string;
  "not-allowed": string;
  "grab": string;
  "grabbing": string;
}

export interface ThemeScrollbarStyle {
  "width": string;
  "height": string;
  "track-bg": string;
  "thumb-bg": string;
  "thumb-bg-hover": string;
  "thumb-radius": string;
  "thumb-border": string;
}

export interface ThemeSelectionStyle {
  "bg": string;
  "fg": string;
}

export interface ThemeFocusStyle {
  "ring-color": string;
  "ring-width": string;
  "ring-offset": string;
  "ring-style": string;
}

// ============================================================================
// Spacing Overrides
// ============================================================================

export interface ThemeSpacingOverrides {
  "button-padding-x": string;
  "button-padding-y": string;
  "card-padding": string;
  "input-padding-x": string;
  "input-padding-y": string;
  "section-gap": string;
  "container-padding": string;
  "grid-gap": string;
}

// ============================================================================
// Complete Theme Definition
// ============================================================================

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  category: ThemeCategory;
  version: string;
  author: string;
  thumbnail: string;

  // Core Systems
  colors: ThemeColorPalette;
  gradients: ThemeGradients;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  blur: ThemeBlur;
  glass: ThemeGlass;

  // Animation & Motion
  animationPreset: ThemeAnimationPreset;
  motionIntensity: ThemeMotionIntensity;
  motion: ThemeMotion;
  particles: ThemeParticles;

  // Visual Effects
  noise: ThemeNoise;
  background: ThemeBackground;
  foreground: ThemeForeground;
  surface: ThemeSurface;
  border: ThemeBorder;

  // Component Styles
  buttonStyle: ThemeButtonStyle;
  cardStyle: ThemeCardStyle;
  inputStyle: ThemeInputStyle;
  cursorStyle: ThemeCursorStyle;
  scrollbarStyle: ThemeScrollbarStyle;
  selectionStyle: ThemeSelectionStyle;
  focusStyle: ThemeFocusStyle;

  // Overrides
  spacingOverrides: ThemeSpacingOverrides;

  // Metadata
  tags: string[];
  isDark: boolean;
  isHighContrast: boolean;
  supportsReducedMotion: boolean;
}

// ============================================================================
// Theme Registry Types
// ============================================================================

export interface ThemeRegistryEntry {
  id: ThemeId;
  definition: ThemeDefinition;
  loaded: boolean;
}

export interface ThemeRegistryConfig {
  defaultTheme: ThemeId;
  fallbackTheme: ThemeId;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  enableValidation: boolean;
}

// ============================================================================
// Theme Store Types
// ============================================================================

export interface ThemeStoreState {
  currentThemeId: ThemeId;
  previousThemeId: ThemeId | null;
  themeHistory: ThemeId[];
  isTransitioning: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlindMode: ColorBlindMode;
}

export interface ThemeStoreActions {
  setTheme: (themeId: ThemeId) => Promise<void>;
  setThemeSync: (themeId: ThemeId) => void;
  goBack: () => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (high: boolean) => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  reset: () => void;
}

export type ThemeStore = ThemeStoreState & ThemeStoreActions;

// ============================================================================
// Theme Context Types
// ============================================================================

export interface ThemeContextValue {
  theme: ThemeDefinition;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => Promise<void>;
  getThemeToken: (token: string) => string;
  isTransitioning: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlindMode: ColorBlindMode;
}

// ============================================================================
// Theme API Types
// ============================================================================

export interface ThemeAPI {
  // Core
  setTheme: (themeId: ThemeId) => Promise<void>;
  getTheme: () => ThemeDefinition;
  getPreviousTheme: () => ThemeDefinition | null;
  getThemeId: () => ThemeId;
  getThemeToken: (token: string) => string;

  // Registry
  getAvailableThemes: () => ThemeDefinition[];
  getThemesByCategory: (category: ThemeCategory) => ThemeDefinition[];
  getThemeById: (id: ThemeId) => ThemeDefinition | undefined;

  // Utilities
  validateTheme: (theme: Partial<ThemeDefinition>) => boolean;
  mergeThemes: (base: ThemeDefinition, override: Partial<ThemeDefinition>) => ThemeDefinition;
  generateCSSVariables: (theme: ThemeDefinition) => Record<string, string>;

  // Accessibility
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (high: boolean) => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;

  // History
  getThemeHistory: () => ThemeId[];
  goBack: () => void;
}

// ============================================================================
// Theme Loader Types
// ============================================================================

export interface ThemeLoaderConfig {
  registry: ThemeRegistryConfig;
}

export interface ThemeLoaderInterface {
  loadTheme: (themeId: ThemeId) => Promise<ThemeDefinition>;
  preloadTheme: (themeId: ThemeId) => Promise<void>;
  preloadAllThemes: () => Promise<void>;
  getLoadedThemes: () => ThemeId[];
  isThemeLoaded: (themeId: ThemeId) => boolean;
}
