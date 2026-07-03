import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const editorialTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "editorial",
  name: "Editorial",
  description: "Magazine-inspired typography and editorial layout design",
  category: "typographic",
  thumbnail: "/icons/themes/editorial.svg",
  tags: ["editorial", "typography", "magazine", "print"],

  colors: {
    ...baseTheme.colors,
    primary: "#1a1a1a",
    "primary-hover": "#333333",
    "primary-active": "#000000",
    "primary-subtle": "rgba(26, 26, 26, 0.05)",
    "primary-muted": "rgba(26, 26, 26, 0.1)",

    secondary: "#666666",
    "secondary-hover": "#555555",
    "secondary-active": "#444444",
    "secondary-subtle": "rgba(102, 102, 102, 0.1)",
    "secondary-muted": "rgba(102, 102, 102, 0.15)",

    accent: "#c41e3a",
    "accent-hover": "#d62848",
    "accent-active": "#a01830",
    "accent-subtle": "rgba(196, 30, 58, 0.08)",

    destructive: "#c41e3a",
    "destructive-hover": "#a01830",

    background: "#faf8f5",
    "background-subtle": "#f5f2ed",
    "background-muted": "#ebe7e0",

    foreground: "#1a1a1a",
    "foreground-subtle": "#4a4a4a",
    "foreground-muted": "#888888",
    "foreground-disabled": "#cccccc",

    "surface-overlay": "#ffffff",
    "surface-sunken": "#f5f2ed",
    "surface-inset": "#ebe7e0",
    "surface-hover": "#f5f2ed",
    "surface-active": "#ebe7e0",

    border: "#e0dcd5",
    "border-strong": "#c8c4bc",
    "border-subtle": "#ebe7e0",
    "border-muted": "#e0dcd5",
    "border-focus": "#1a1a1a",
    "border-disabled": "#e0dcd5",

    success: "#2d6a4f",
    "success-subtle": "rgba(45, 106, 79, 0.1)",

    warning: "#bc6c25",
    "warning-subtle": "rgba(188, 108, 37, 0.1)",

    error: "#c41e3a",
    "error-subtle": "rgba(196, 30, 58, 0.1)",

    info: "#1a1a1a",
    "info-subtle": "rgba(26, 26, 26, 0.08)",

    "focus-ring": "#1a1a1a",
    "hover-overlay": "rgba(26, 26, 26, 0.03)",
    "active-overlay": "rgba(26, 26, 26, 0.06)",
    "disabled-bg": "#f5f2ed",
    "disabled-fg": "#cccccc",
    "disabled-border": "#e0dcd5",

    "selection-bg": "#1a1a1a",
    "selection-fg": "#ffffff",

    "overlay-heavy": "rgba(26, 26, 26, 0.85)",
    "overlay-medium": "rgba(26, 26, 26, 0.6)",
    "overlay-light": "rgba(26, 26, 26, 0.3)",
    "overlay-lightest": "rgba(26, 26, 26, 0.1)",
  },

  gradients: {
    ...baseTheme.gradients,
    primary: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
    secondary: "linear-gradient(135deg, #666666 0%, #888888 100%)",
    accent: "linear-gradient(135deg, #c41e3a 0%, #e63950 100%)",
    hero: "linear-gradient(180deg, #faf8f5 0%, #f5f2ed 100%)",
    card: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
    surface: "linear-gradient(180deg, #ffffff 0%, #faf8f5 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(26, 26, 26, 0.05) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(196, 30, 58, 0.05) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(26, 26, 26, 0.03) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #1a1a1a, #666666, #c41e3a, #1a1a1a)",
    "conic-2": "conic-gradient(from 180deg, #666666, #c41e3a, #1a1a1a, #666666)",
    "radial-1": "radial-gradient(circle, rgba(26, 26, 26, 0.08) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(196, 30, 58, 0.05) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Source Serif 4', 'Georgia', serif",
    "font-heading": "'Playfair Display', 'Georgia', serif",
    "font-display": "'Playfair Display', 'Georgia', serif",
    "font-mono": "'IBM Plex Mono', 'Courier New', monospace",
    "font-serif": "'Source Serif 4', 'Georgia', serif",

    "tracking-tight": "-0.03em",
    "tracking-tighter": "-0.05em",
    "tracking-wide": "0.02em",
    "tracking-wider": "0.05em",
    "tracking-widest": "0.15em",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 1px 3px rgba(0, 0, 0, 0.08)",
    "shadow-dropdown": "0 4px 12px rgba(0, 0, 0, 0.1)",
    "shadow-modal": "0 8px 24px rgba(0, 0, 0, 0.12)",
  },

  glass: {
    "glass-bg": "rgba(250, 248, 245, 0.85)",
    "glass-bg-heavy": "rgba(250, 248, 245, 0.95)",
    "glass-bg-light": "rgba(250, 248, 245, 0.7)",
    "glass-border": "rgba(224, 220, 213, 0.5)",
    "glass-shadow": "0 4px 16px rgba(0, 0, 0, 0.06)",
    "glass-blur": "12px",
    "glass-saturation": "120%",
  },

  animationPreset: "subtle",
  motionIntensity: "reduced",

  radius: {
    ...baseTheme.radius,
    "radius-xs": "0px",
    "radius-sm": "2px",
    "radius-md": "4px",
    "radius-lg": "6px",
    "radius-xl": "8px",
    "radius-button": "2px",
    "radius-card": "4px",
    "radius-input": "2px",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "2px",
    "padding-x": "1.5rem",
    "padding-y": "0.625rem",
    "font-weight": "600",
    "transition": "all 150ms ease",
    "transform-hover": "none",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "4px",
    "border": "1px solid #e0dcd5",
    "shadow": "0 1px 3px rgba(0, 0, 0, 0.08)",
    "shadow-hover": "0 4px 12px rgba(0, 0, 0, 0.1)",
    "transition": "all 200ms ease",
    "transform-hover": "none",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "2px",
    "border": "1px solid #e0dcd5",
    "border-focus": "2px solid #1a1a1a",
    "shadow-focus": "none",
    "placeholder-color": "#888888",
  },

  background: {
    ...baseTheme.background,
    color: "#faf8f5",
    "color-subtle": "#f5f2ed",
    gradient: "linear-gradient(180deg, #faf8f5 0%, #f5f2ed 100%)",
  },

  foreground: {
    color: "#1a1a1a",
    "color-subtle": "#4a4a4a",
    "color-muted": "#888888",
    "color-disabled": "#cccccc",
  },

  surface: {
    color: "#ffffff",
    "color-raised": "#ffffff",
    "color-overlay": "#ffffff",
    "color-sunken": "#f5f2ed",
    "color-inset": "#ebe7e0",
    "color-hover": "#f5f2ed",
    "color-active": "#ebe7e0",
    border: "#e0dcd5",
    "border-subtle": "#ebe7e0",
    shadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    "backdrop-filter": "blur(12px) saturate(120%)",
  },

  border: {
    ...baseTheme.border,
    color: "#e0dcd5",
    "color-strong": "#c8c4bc",
    "color-subtle": "#ebe7e0",
    "color-muted": "#e0dcd5",
    "color-focus": "#1a1a1a",
    "color-disabled": "#e0dcd5",
    radius: "0.375rem",
  },

  selectionStyle: {
    bg: "#1a1a1a",
    fg: "#ffffff",
  },

});

export default editorialTheme;
