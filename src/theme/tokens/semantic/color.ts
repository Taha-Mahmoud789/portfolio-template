/**
 * Semantic Color Tokens
 *
 * Contextual color assignments. These map primitives to meaning.
 * Components USE these tokens. They NEVER reference primitives directly.
 *
 * Override these per-world to create distinct visual identities.
 */

import { gray, brand, success, warning, danger, info, white } from "../primitives/colors";

export const color = {
  // --- Core ---
  primary: brand[500],
  "primary-hover": brand[600],
  "primary-active": brand[700],
  "primary-subtle": brand[50],
  "primary-muted": brand[100],

  secondary: gray[500],
  "secondary-hover": gray[600],
  "secondary-active": gray[700],
  "secondary-subtle": gray[50],
  "secondary-muted": gray[100],

  accent: brand[400],
  "accent-hover": brand[500],
  "accent-active": brand[600],
  "accent-subtle": brand[50],

  // --- Surface ---
  background: white,
  "background-alt": gray[50],
  surface: white,
  "surface-raised": white,
  "surface-overlay": white,
  "surface-sunken": gray[50],
  "surface-inset": gray[100],

  // --- Foreground ---
  foreground: gray[900],
  "foreground-secondary": gray[600],
  "foreground-muted": gray[400],
  "foreground-subtle": gray[300],
  "foreground-inverse": white,

  // --- Border ---
  border: gray[200],
  "border-strong": gray[300],
  "border-subtle": gray[100],
  "border-focus": brand[500],

  // --- Status ---
  success: success[500],
  "success-hover": success[600],
  "success-subtle": success[50],
  "success-foreground": success[700],

  warning: warning[500],
  "warning-hover": warning[600],
  "warning-subtle": warning[50],
  "warning-foreground": warning[700],

  danger: danger[500],
  "danger-hover": danger[600],
  "danger-subtle": danger[50],
  "danger-foreground": danger[700],

  info: info[500],
  "info-hover": info[600],
  "info-subtle": info[50],
  "info-foreground": info[700],

  // --- Interaction ---
  "focus-ring": brand[500],
  "hover-overlay": "rgba(0, 0, 0, 0.05)",
  "active-overlay": "rgba(0, 0, 0, 0.1)",
  "disabled-bg": gray[100],
  "disabled-fg": gray[400],
  "disabled-border": gray[200],

  // --- Selection ---
  "selection-bg": brand[100],
  "selection-fg": brand[900],

  // --- Overlay ---
  "overlay-heavy": "rgba(0, 0, 0, 0.5)",
  "overlay-medium": "rgba(0, 0, 0, 0.3)",
  "overlay-light": "rgba(0, 0, 0, 0.1)",
  "overlay-lightest": "rgba(0, 0, 0, 0.05)",
} as const;

export type ColorToken = keyof typeof color;
