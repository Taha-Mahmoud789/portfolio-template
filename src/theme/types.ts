/**
 * Token System Types
 *
 * TypeScript types for the entire design token architecture.
 * These ensure type safety when using tokens in code.
 */

// --- Color ---
export type ColorTokenKey =
  | "primary"
  | "primary-hover"
  | "primary-active"
  | "primary-subtle"
  | "primary-muted"
  | "secondary"
  | "secondary-hover"
  | "secondary-active"
  | "secondary-subtle"
  | "secondary-muted"
  | "accent"
  | "accent-hover"
  | "accent-active"
  | "accent-subtle"
  | "background"
  | "background-alt"
  | "surface"
  | "surface-raised"
  | "surface-overlay"
  | "surface-sunken"
  | "surface-inset"
  | "foreground"
  | "foreground-secondary"
  | "foreground-muted"
  | "foreground-subtle"
  | "foreground-inverse"
  | "border"
  | "border-strong"
  | "border-subtle"
  | "border-focus"
  | "success"
  | "success-hover"
  | "success-subtle"
  | "success-foreground"
  | "warning"
  | "warning-hover"
  | "warning-subtle"
  | "warning-foreground"
  | "danger"
  | "danger-hover"
  | "danger-subtle"
  | "danger-foreground"
  | "info"
  | "info-hover"
  | "info-subtle"
  | "info-foreground"
  | "focus-ring"
  | "hover-overlay"
  | "active-overlay"
  | "disabled-bg"
  | "disabled-fg"
  | "disabled-border"
  | "selection-bg"
  | "selection-fg"
  | "overlay-heavy"
  | "overlay-medium"
  | "overlay-light"
  | "overlay-lightest";

// --- Typography ---
export type TypographyTokenKey =
  | "font-sans"
  | "font-heading"
  | "font-mono"
  | "font-display"
  | "text-2xs"
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-2xl"
  | "text-3xl"
  | "text-4xl"
  | "text-5xl"
  | "text-6xl"
  | "text-7xl"
  | "text-8xl"
  | "text-9xl"
  | "font-thin"
  | "font-extralight"
  | "font-light"
  | "font-regular"
  | "font-medium"
  | "font-semibold"
  | "font-bold"
  | "font-extrabold"
  | "font-black"
  | "tracking-tighter"
  | "tracking-tight"
  | "tracking-normal"
  | "tracking-wide"
  | "tracking-wider"
  | "tracking-widest"
  | "leading-none"
  | "leading-tight"
  | "leading-snug"
  | "leading-normal"
  | "leading-relaxed"
  | "leading-loose";

// --- Spacing ---
export type SpacingTokenKey =
  | "padding-xs"
  | "padding-sm"
  | "padding-md"
  | "padding-lg"
  | "padding-xl"
  | "padding-2xl"
  | "gap-xs"
  | "gap-sm"
  | "gap-md"
  | "gap-lg"
  | "gap-xl"
  | "section-xs"
  | "section-sm"
  | "section-md"
  | "section-lg"
  | "section-xl"
  | "section-2xl"
  | "container-sm"
  | "container-md"
  | "container-lg"
  | "container-xl"
  | "container-2xl"
  | "container-3xl"
  | "container-prose"
  | "content-narrow"
  | "content-medium"
  | "content-wide"
  | "content-full";

// --- Radius ---
export type RadiusTokenKey =
  | "radius-none"
  | "radius-xs"
  | "radius-sm"
  | "radius-md"
  | "radius-lg"
  | "radius-xl"
  | "radius-2xl"
  | "radius-3xl"
  | "radius-full"
  | "radius-button"
  | "radius-input"
  | "radius-card"
  | "radius-badge"
  | "radius-avatar"
  | "radius-modal"
  | "radius-tooltip";

// --- Elevation ---
export type ElevationTokenKey =
  | "elevation-0"
  | "elevation-1"
  | "elevation-2"
  | "elevation-3"
  | "elevation-4"
  | "elevation-5"
  | "elevation-card"
  | "elevation-dropdown"
  | "elevation-modal"
  | "elevation-popover"
  | "elevation-toast"
  | "elevation-tooltip"
  | "elevation-sticky"
  | "elevation-inner";

// --- Motion ---
export type MotionTokenKey =
  | "duration-0"
  | "duration-75"
  | "duration-100"
  | "duration-150"
  | "duration-200"
  | "duration-300"
  | "duration-400"
  | "duration-500"
  | "duration-600"
  | "duration-700"
  | "duration-800"
  | "duration-900"
  | "duration-1000"
  | "duration-instant"
  | "duration-fast"
  | "duration-normal"
  | "duration-slow"
  | "duration-slower"
  | "duration-slowest"
  | "ease-linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "ease-in-quad"
  | "ease-out-quad"
  | "ease-in-out-quad"
  | "ease-in-cubic"
  | "ease-out-cubic"
  | "ease-in-out-cubic"
  | "ease-in-expo"
  | "ease-out-expo"
  | "ease-in-out-expo"
  | "ease-spring"
  | "ease-bounce";

/**
 * Complete token map type.
 * Use this when you need to reference any token by key.
 */
export interface TokenMap {
  color: Record<string, string>;
  typography: Record<string, string | string[]>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  elevation: Record<string, string>;
  motion: Record<string, string>;
  border: Record<string, string>;
  opacity: Record<string, string>;
  size: Record<string, string>;
  zIndex: Record<string, string | number>;
}

/**
 * World theme override type.
 * Each world can override any subset of semantic tokens.
 */
export type WorldThemeOverride = {
  [K in keyof TokenMap]?: Partial<TokenMap[K]>;
};
