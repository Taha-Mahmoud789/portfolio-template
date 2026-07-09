/**
 * Theme Validation
 *
 * Validates theme definitions against the expected schema.
 * Provides detailed error messages for debugging.
 */

import type { ThemeDefinition } from "./types";
import { ALL_THEME_IDS } from "./constants";

// ============================================================================
// Validation Result Types
// ============================================================================

export interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================================================
// Validation Helpers
// ============================================================================

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateRequired(
  obj: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
): void {
  if (!(key in obj) || obj[key] === undefined) {
    errors.push({
      path: `${path}.${key}`,
      message: `Missing required property "${key}"`,
      severity: "error",
    });
  }
}

function validateBoolean(
  obj: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
): void {
  if (key in obj && obj[key] !== undefined && !isBoolean(obj[key])) {
    errors.push({
      path: `${path}.${key}`,
      message: `Property "${key}" must be a boolean`,
      severity: "error",
    });
  }
}

function validateColor(value: string, path: string, warnings: ValidationError[]): void {
  if (
    !value.startsWith("#") &&
    !value.startsWith("rgb") &&
    !value.startsWith("hsl") &&
    !value.startsWith("oklch")
  ) {
    warnings.push({
      path,
      message: `Color value "${value}" may not be a valid color format`,
      severity: "warning",
    });
  }
}

// ============================================================================
// Section Validators
// ============================================================================

function validateColors(
  colors: Record<string, unknown>,
  errors: ValidationError[],
  warnings: ValidationError[],
): void {
  const requiredColors = [
    "primary",
    "secondary",
    "accent",
    "background",
    "foreground",
    "surface",
    "border",
    "destructive",
    "success",
    "warning",
    "error",
    "info",
  ];

  for (const key of requiredColors) {
    validateRequired(colors, key, "colors", errors);
    if (isString(colors[key])) {
      validateColor(colors[key], `colors.${key}`, warnings);
    }
  }
}

function validateTypography(typography: Record<string, unknown>, errors: ValidationError[]): void {
  validateRequired(typography, "font-sans", "typography", errors);
  validateRequired(typography, "font-heading", "typography", errors);
  validateRequired(typography, "font-mono", "typography", errors);
}

function validateSpacing(spacing: Record<string, unknown>, errors: ValidationError[]): void {
  const requiredSpacing = ["space-0", "space-1", "space-2", "space-4", "space-8"];
  for (const key of requiredSpacing) {
    validateRequired(spacing, key, "spacing", errors);
  }
}

function validateRadius(radius: Record<string, unknown>, errors: ValidationError[]): void {
  validateRequired(radius, "radius-none", "radius", errors);
  validateRequired(radius, "radius-full", "radius", errors);
  validateRequired(radius, "radius-button", "radius", errors);
  validateRequired(radius, "radius-card", "radius", errors);
}

function validateShadows(shadows: Record<string, unknown>, errors: ValidationError[]): void {
  validateRequired(shadows, "shadow-none", "shadows", errors);
  validateRequired(shadows, "shadow-sm", "shadows", errors);
  validateRequired(shadows, "shadow-lg", "shadows", errors);
}

// ============================================================================
// Main Validator
// ============================================================================

/**
 * Validate a theme definition against the expected schema.
 */
export function validateTheme(theme: Partial<ThemeDefinition>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate required top-level properties
  validateRequired(theme, "id", "theme", errors);
  validateRequired(theme, "name", "theme", errors);
  validateRequired(theme, "description", "theme", errors);
  validateRequired(theme, "colors", "theme", errors);
  validateRequired(theme, "typography", "theme", errors);
  validateRequired(theme, "spacing", "theme", errors);

  // Validate theme ID
  if (theme.id && !ALL_THEME_IDS.includes(theme.id)) {
    warnings.push({
      path: "theme.id",
      message: `Theme ID "${theme.id}" is not in the predefined list`,
      severity: "warning",
    });
  }

  // Validate sections
  if (isObject(theme.colors)) {
    validateColors(theme.colors, errors, warnings);
  }

  if (isObject(theme.typography)) {
    validateTypography(theme.typography, errors);
  }

  if (isObject(theme.spacing)) {
    validateSpacing(theme.spacing, errors);
  }

  if (isObject(theme.radius)) {
    validateRadius(theme.radius, errors);
  }

  if (isObject(theme.shadows)) {
    validateShadows(theme.shadows, errors);
  }

  // Validate boolean fields
  validateBoolean(theme, "isDark", "theme", errors);
  validateBoolean(theme, "isHighContrast", "theme", errors);
  validateBoolean(theme, "supportsReducedMotion", "theme", errors);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Quick validation check - returns true if theme is valid.
 */
export function isValidTheme(theme: Partial<ThemeDefinition>): boolean {
  return validateTheme(theme).valid;
}

/**
 * Validate and throw if invalid.
 */
export function validateThemeOrThrow(theme: Partial<ThemeDefinition>): void {
  const result = validateTheme(theme);
  if (!result.valid) {
    const errorMessages = result.errors.map((e) => `${e.path}: ${e.message}`).join("\n");
    throw new Error(`Theme validation failed:\n${errorMessages}`);
  }
}
