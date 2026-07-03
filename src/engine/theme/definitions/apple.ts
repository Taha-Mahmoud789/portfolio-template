import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const appleTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "apple",
  name: "Apple",
  description: "Minimalist design with precision animations and glass morphism",
  category: "minimal",
  thumbnail: "/icons/themes/apple.svg",
  tags: ["minimal", "clean", "apple", "glass"],

  colors: {
    ...baseTheme.colors,
    primary: "#0071e3",
    "primary-hover": "#0077ed",
    "primary-active": "#006edb",
    "primary-subtle": "#f0f7ff",
    "primary-muted": "#e1effe",

    secondary: "#86868b",

    accent: "#147ce5",

    background: "#fbfbfd",
    "background-subtle": "#f5f5f7",

    foreground: "#1d1d1f",
    "foreground-subtle": "#424245",
    "foreground-muted": "#86868b",

    "surface-sunken": "#f5f5f7",
    "surface-inset": "#e8e8ed",

    border: "#d2d2d7",
    "border-strong": "#c7c7cc",
    "border-subtle": "#e8e8ed",
    "border-focus": "#0071e3",

    success: "#248a3d",
    warning: "#b25000",
    error: "#d70015",
    info: "#0071e3",
  },

  gradients: {
    ...baseTheme.gradients,
    primary: "linear-gradient(135deg, #0071e3 0%, #147ce5 100%)",
    hero: "linear-gradient(135deg, #fbfbfd 0%, #f5f5f7 100%)",
    surface: "linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    "font-heading": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
    "font-display": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
    "font-mono": "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
  },

  glass: {
    ...baseTheme.glass,
    "glass-bg": "rgba(255, 255, 255, 0.72)",
    "glass-bg-heavy": "rgba(255, 255, 255, 0.85)",
    "glass-bg-light": "rgba(255, 255, 255, 0.6)",
    "glass-border": "rgba(255, 255, 255, 0.4)",
    "glass-shadow": "0 4px 30px rgba(0, 0, 0, 0.05)",
    "glass-blur": "20px",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 2px 8px rgba(0, 0, 0, 0.04)",
    "shadow-dropdown": "0 4px 20px rgba(0, 0, 0, 0.08)",
    "shadow-modal": "0 8px 40px rgba(0, 0, 0, 0.12)",
  },

  animationPreset: "subtle",
  motionIntensity: "reduced",

  radius: {
    ...baseTheme.radius,
    "radius-button": "0.375rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "0.375rem",
    "padding-x": "1.5rem",
    "padding-y": "0.625rem",
    "transition": "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    "shadow-hover": "0 2px 8px rgba(0, 113, 227, 0.2)",
    "transform-hover": "none",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "shadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
    "shadow-hover": "0 4px 16px rgba(0, 0, 0, 0.08)",
    "transition": "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    "transform-hover": "none",
    "backdrop-filter": "blur(20px) saturate(180%)",
  },

  background: {
    ...baseTheme.background,
    color: "#fbfbfd",
    "color-subtle": "#f5f5f7",
    gradient: "linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%)",
  },
});

export default appleTheme;
