/**
 * Theme CSS Variable Generator
 *
 * Converts theme definitions into CSS custom properties.
 * Supports runtime theme switching and server-side rendering.
 */

import type {
  ThemeDefinition,
  ThemeColorPalette,
  ThemeTypography,
  ThemeSpacing,
  ThemeRadius,
  ThemeShadows,
  ThemeBlur,
  ThemeGlass,
  ThemeMotion,
  ThemeGradients,
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
} from "./types";
import { CSS_VAR_PREFIX } from "./constants";

// ============================================================================
// Helper Functions
// ============================================================================

function flattenObject(obj: unknown, prefix: string): Record<string, string> {
  const result: Record<string, string> = {};

  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return result;
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const cssKey = `${prefix}-${key}`;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, cssKey));
    } else {
      result[`--${cssKey}`] = String(value);
    }
  }

  return result;
}

// ============================================================================
// Color Variables
// ============================================================================

function generateColorVariables(colors: ThemeColorPalette): Record<string, string> {
  return flattenObject(colors, `${CSS_VAR_PREFIX}-color`);
}

// ============================================================================
// Typography Variables
// ============================================================================

function generateTypographyVariables(typography: ThemeTypography): Record<string, string> {
  const vars: Record<string, string> = {};

  // Font families
  vars[`--${CSS_VAR_PREFIX}-font-sans`] = typography["font-sans"];
  vars[`--${CSS_VAR_PREFIX}-font-heading`] = typography["font-heading"];
  vars[`--${CSS_VAR_PREFIX}-font-display`] = typography["font-display"];
  vars[`--${CSS_VAR_PREFIX}-font-mono`] = typography["font-mono"];
  vars[`--${CSS_VAR_PREFIX}-font-serif`] = typography["font-serif"];

  // Font sizes with line heights
  for (const [key, value] of Object.entries(typography)) {
    if (key.startsWith("text-")) {
      const [size, lineHeight] = value as [string, { lineHeight: string }];
      vars[`--${CSS_VAR_PREFIX}-font-size-${key}`] = size;
      vars[`--${CSS_VAR_PREFIX}-line-height-${key}`] = lineHeight.lineHeight;
    } else if (
      key.startsWith("font-") &&
      !key.startsWith("font-size-") &&
      typeof value === "number"
    ) {
      vars[`--${CSS_VAR_PREFIX}-font-weight-${key.replace("font-", "")}`] = String(value);
    } else if (key.startsWith("tracking-") && typeof value === "string") {
      vars[`--${CSS_VAR_PREFIX}-tracking-${key.replace("tracking-", "")}`] = value;
    } else if (key.startsWith("leading-") && typeof value === "string") {
      vars[`--${CSS_VAR_PREFIX}-leading-${key.replace("leading-", "")}`] = value;
    }
  }

  return vars;
}

// ============================================================================
// Spacing Variables
// ============================================================================

function generateSpacingVariables(spacing: ThemeSpacing): Record<string, string> {
  return flattenObject(spacing, `${CSS_VAR_PREFIX}-space`);
}

// ============================================================================
// Radius Variables
// ============================================================================

function generateRadiusVariables(radius: ThemeRadius): Record<string, string> {
  return flattenObject(radius, `${CSS_VAR_PREFIX}-radius`);
}

// ============================================================================
// Shadow Variables
// ============================================================================

function generateShadowVariables(shadows: ThemeShadows): Record<string, string> {
  return flattenObject(shadows, `${CSS_VAR_PREFIX}-shadow`);
}

// ============================================================================
// Blur Variables
// ============================================================================

function generateBlurVariables(blur: ThemeBlur): Record<string, string> {
  return flattenObject(blur, `${CSS_VAR_PREFIX}-blur`);
}

// ============================================================================
// Glass Variables
// ============================================================================

function generateGlassVariables(glass: ThemeGlass): Record<string, string> {
  return flattenObject(glass, `${CSS_VAR_PREFIX}-glass`);
}

// ============================================================================
// Motion Variables
// ============================================================================

function generateMotionVariables(motion: ThemeMotion): Record<string, string> {
  return flattenObject(motion, `${CSS_VAR_PREFIX}-motion`);
}

// ============================================================================
// Gradient Variables
// ============================================================================

function generateGradientVariables(gradients: ThemeGradients): Record<string, string> {
  return flattenObject(gradients, `${CSS_VAR_PREFIX}-gradient`);
}

// ============================================================================
// Particle Variables
// ============================================================================

function generateParticleVariables(particles: ThemeParticles): Record<string, string> {
  return {
    [`--${CSS_VAR_PREFIX}-particle-enabled`]: particles.enabled ? "1" : "0",
    [`--${CSS_VAR_PREFIX}-particle-count`]: String(particles.count),
    [`--${CSS_VAR_PREFIX}-particle-type`]: particles.type,
    [`--${CSS_VAR_PREFIX}-particle-color`]: particles.color,
    [`--${CSS_VAR_PREFIX}-particle-opacity`]: String(particles.opacity),
    [`--${CSS_VAR_PREFIX}-particle-size-min`]: String(particles.size.min),
    [`--${CSS_VAR_PREFIX}-particle-size-max`]: String(particles.size.max),
    [`--${CSS_VAR_PREFIX}-particle-speed-min`]: String(particles.speed.min),
    [`--${CSS_VAR_PREFIX}-particle-speed-max`]: String(particles.speed.max),
    [`--${CSS_VAR_PREFIX}-particle-direction`]: String(particles.direction),
    [`--${CSS_VAR_PREFIX}-particle-spread`]: String(particles.spread),
    [`--${CSS_VAR_PREFIX}-particle-lifetime`]: String(particles.lifetime),
    [`--${CSS_VAR_PREFIX}-particle-blend-mode`]: particles.blendMode,
  };
}

// ============================================================================
// Noise Variables
// ============================================================================

function generateNoiseVariables(noise: ThemeNoise): Record<string, string> {
  return {
    [`--${CSS_VAR_PREFIX}-noise-intensity`]: String(noise.intensity),
    [`--${CSS_VAR_PREFIX}-noise-opacity`]: String(noise.opacity),
    [`--${CSS_VAR_PREFIX}-noise-size`]: String(noise.size),
    [`--${CSS_VAR_PREFIX}-noise-blend-mode`]: noise.blendMode,
    [`--${CSS_VAR_PREFIX}-noise-type`]: noise.type,
  };
}

// ============================================================================
// Background Variables
// ============================================================================

function generateBackgroundVariables(bg: ThemeBackground): Record<string, string> {
  const vars: Record<string, string> = {
    [`--${CSS_VAR_PREFIX}-bg-color`]: bg.color,
    [`--${CSS_VAR_PREFIX}-bg-color-subtle`]: bg["color-subtle"],
    [`--${CSS_VAR_PREFIX}-bg-gradient`]: bg.gradient,
    [`--${CSS_VAR_PREFIX}-bg-gradient-radial`]: bg["gradient-radial"],
    [`--${CSS_VAR_PREFIX}-bg-gradient-mesh`]: bg["gradient-mesh"],
    [`--${CSS_VAR_PREFIX}-bg-gradient-conic`]: bg["gradient-conic"],
    [`--${CSS_VAR_PREFIX}-bg-pattern`]: bg.pattern,
    [`--${CSS_VAR_PREFIX}-bg-pattern-opacity`]: String(bg["pattern-opacity"]),
  };

  Object.assign(vars, generateNoiseVariables(bg.noise));
  return vars;
}

// ============================================================================
// Foreground Variables
// ============================================================================

function generateForegroundVariables(fg: ThemeForeground): Record<string, string> {
  return {
    [`--${CSS_VAR_PREFIX}-fg-color`]: fg.color,
    [`--${CSS_VAR_PREFIX}-fg-color-subtle`]: fg["color-subtle"],
    [`--${CSS_VAR_PREFIX}-fg-color-muted`]: fg["color-muted"],
    [`--${CSS_VAR_PREFIX}-fg-color-disabled`]: fg["color-disabled"],
  };
}

// ============================================================================
// Surface Variables
// ============================================================================

function generateSurfaceVariables(surface: ThemeSurface): Record<string, string> {
  return {
    [`--${CSS_VAR_PREFIX}-surface-color`]: surface.color,
    [`--${CSS_VAR_PREFIX}-surface-color-raised`]: surface["color-raised"],
    [`--${CSS_VAR_PREFIX}-surface-color-overlay`]: surface["color-overlay"],
    [`--${CSS_VAR_PREFIX}-surface-color-sunken`]: surface["color-sunken"],
    [`--${CSS_VAR_PREFIX}-surface-color-inset`]: surface["color-inset"],
    [`--${CSS_VAR_PREFIX}-surface-color-hover`]: surface["color-hover"],
    [`--${CSS_VAR_PREFIX}-surface-color-active`]: surface["color-active"],
    [`--${CSS_VAR_PREFIX}-surface-border`]: surface.border,
    [`--${CSS_VAR_PREFIX}-surface-border-subtle`]: surface["border-subtle"],
    [`--${CSS_VAR_PREFIX}-surface-shadow`]: surface.shadow,
    [`--${CSS_VAR_PREFIX}-surface-backdrop-filter`]: surface["backdrop-filter"],
  };
}

// ============================================================================
// Border Variables
// ============================================================================

function generateBorderVariables(border: ThemeBorder): Record<string, string> {
  return {
    [`--${CSS_VAR_PREFIX}-border-color`]: border.color,
    [`--${CSS_VAR_PREFIX}-border-color-strong`]: border["color-strong"],
    [`--${CSS_VAR_PREFIX}-border-color-subtle`]: border["color-subtle"],
    [`--${CSS_VAR_PREFIX}-border-color-muted`]: border["color-muted"],
    [`--${CSS_VAR_PREFIX}-border-color-focus`]: border["color-focus"],
    [`--${CSS_VAR_PREFIX}-border-color-disabled`]: border["color-disabled"],
    [`--${CSS_VAR_PREFIX}-border-width`]: border.width,
    [`--${CSS_VAR_PREFIX}-border-width-thin`]: border["width-thin"],
    [`--${CSS_VAR_PREFIX}-border-width-medium`]: border["width-medium"],
    [`--${CSS_VAR_PREFIX}-border-width-thick`]: border["width-thick"],
    [`--${CSS_VAR_PREFIX}-border-style`]: border.style,
    [`--${CSS_VAR_PREFIX}-border-radius`]: border.radius,
  };
}

// ============================================================================
// Component Style Variables
// ============================================================================

function generateButtonStyleVariables(style: ThemeButtonStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-button`);
}

function generateCardStyleVariables(style: ThemeCardStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-card`);
}

function generateInputStyleVariables(style: ThemeInputStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-input`);
}

function generateCursorStyleVariables(style: ThemeCursorStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-cursor`);
}

function generateScrollbarStyleVariables(style: ThemeScrollbarStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-scrollbar`);
}

function generateSelectionStyleVariables(style: ThemeSelectionStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-selection`);
}

function generateFocusStyleVariables(style: ThemeFocusStyle): Record<string, string> {
  return flattenObject(style, `${CSS_VAR_PREFIX}-focus`);
}

// ============================================================================
// Main Generator
// ============================================================================

/**
 * Generate all CSS variables from a theme definition.
 */
export function generateThemeCSSVariables(theme: ThemeDefinition): Record<string, string> {
  return {
    // Core systems
    ...generateColorVariables(theme.colors),
    ...generateTypographyVariables(theme.typography),
    ...generateSpacingVariables(theme.spacing),
    ...generateRadiusVariables(theme.radius),
    ...generateShadowVariables(theme.shadows),
    ...generateBlurVariables(theme.blur),
    ...generateGlassVariables(theme.glass),
    ...generateMotionVariables(theme.motion),
    ...generateGradientVariables(theme.gradients),

    // Visual effects
    ...generateParticleVariables(theme.particles),
    ...generateBackgroundVariables(theme.background),
    ...generateForegroundVariables(theme.foreground),
    ...generateSurfaceVariables(theme.surface),
    ...generateBorderVariables(theme.border),

    // Component styles
    ...generateButtonStyleVariables(theme.buttonStyle),
    ...generateCardStyleVariables(theme.cardStyle),
    ...generateInputStyleVariables(theme.inputStyle),
    ...generateCursorStyleVariables(theme.cursorStyle),
    ...generateScrollbarStyleVariables(theme.scrollbarStyle),
    ...generateSelectionStyleVariables(theme.selectionStyle),
    ...generateFocusStyleVariables(theme.focusStyle),
  };
}

/**
 * Generate a CSS string from a theme definition.
 */
export function generateThemeCSSString(theme: ThemeDefinition): string {
  const vars = generateThemeCSSVariables(theme);
  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `:root {\n${lines}\n}`;
}

/**
 * Apply theme CSS variables to an element.
 */
export function applyThemeToElement(
  theme: ThemeDefinition,
  element: HTMLElement = document.documentElement,
): void {
  const vars = generateThemeCSSVariables(theme);
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value);
  }
}

/**
 * Remove all theme CSS variables from an element.
 */
export function removeThemeFromElement(element: HTMLElement = document.documentElement): void {
  const keys = Array.from(element.style);
  for (const key of keys) {
    if (key.startsWith(`--${CSS_VAR_PREFIX}`)) {
      element.style.removeProperty(key);
    }
  }
}

/**
 * Get a single theme token value.
 */
export function getThemeToken(theme: ThemeDefinition, tokenPath: string): string {
  const parts = tokenPath.split(".");
  let current: unknown = theme;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return "";
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current?.toString() ?? "";
}
