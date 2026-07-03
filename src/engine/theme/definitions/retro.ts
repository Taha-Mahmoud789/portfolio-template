import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const retroTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "retro",
  name: "Retro",
  description: "Nostalgic retro computing with CRT effects and terminal aesthetics",
  category: "nostalgic",
  thumbnail: "/icons/themes/retro.svg",
  tags: ["retro", "terminal", "crt", "vintage"],

  colors: {
    ...baseTheme.colors,
    primary: "#00ff00",
    "primary-foreground": "#000000",
    "primary-hover": "#33ff33",
    "primary-active": "#00cc00",
    "primary-subtle": "rgba(0, 255, 0, 0.1)",
    "primary-muted": "rgba(0, 255, 0, 0.2)",

    secondary: "#00ffff",
    "secondary-foreground": "#000000",
    "secondary-hover": "#33ffff",
    "secondary-active": "#00cccc",
    "secondary-subtle": "rgba(0, 255, 255, 0.1)",
    "secondary-muted": "rgba(0, 255, 255, 0.2)",

    accent: "#ffff00",
    "accent-foreground": "#000000",
    "accent-hover": "#ffff33",
    "accent-active": "#cccc00",
    "accent-subtle": "rgba(255, 255, 0, 0.1)",

    destructive: "#ff0000",

    background: "#0a0a0a",
    "background-subtle": "#111111",
    "background-muted": "#1a1a1a",

    foreground: "#00ff00",
    "foreground-subtle": "#00cc00",
    "foreground-muted": "#009900",
    "foreground-disabled": "#006600",

    surface: "#111111",
    "surface-raised": "#1a1a1a",
    "surface-overlay": "#222222",
    "surface-sunken": "#0a0a0a",
    "surface-inset": "#0d0d0d",
    "surface-hover": "#1a1a1a",
    "surface-active": "#282828",

    border: "#00aa00",
    "border-strong": "#00cc00",
    "border-subtle": "#008800",
    "border-muted": "#006600",
    "border-focus": "#00ff00",
    "border-disabled": "#004400",

    success: "#00ff00",
    "success-foreground": "#000000",
    "success-subtle": "rgba(0, 255, 0, 0.15)",

    warning: "#ffff00",
    "warning-foreground": "#000000",
    "warning-subtle": "rgba(255, 255, 0, 0.15)",

    error: "#ff0000",
    "error-subtle": "rgba(255, 0, 0, 0.2)",

    info: "#00ffff",
    "info-foreground": "#000000",
    "info-subtle": "rgba(0, 255, 255, 0.15)",

    "focus-ring": "#00ff00",
    "hover-overlay": "rgba(0, 255, 0, 0.05)",
    "active-overlay": "rgba(0, 255, 0, 0.1)",
    "disabled-bg": "#1a1a1a",
    "disabled-fg": "#006600",
    "disabled-border": "#004400",

    "selection-bg": "rgba(0, 255, 0, 0.3)",
    "selection-fg": "#00ff00",

    "overlay-heavy": "rgba(0, 0, 0, 0.9)",
    "overlay-medium": "rgba(0, 0, 0, 0.7)",
    "overlay-light": "rgba(0, 0, 0, 0.4)",
    "overlay-lightest": "rgba(0, 0, 0, 0.2)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #00ff00 0%, #00cc00 100%)",
    secondary: "linear-gradient(135deg, #00ffff 0%, #00cccc 100%)",
    accent: "linear-gradient(135deg, #ffff00 0%, #cccc00 100%)",
    hero: "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
    card: "linear-gradient(180deg, rgba(17, 17, 17, 0.9) 0%, rgba(26, 26, 26, 1) 100%)",
    surface: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)",
    "surface-raised": "linear-gradient(180deg, #1a1a1a 0%, #111111 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(0, 255, 0, 0.3) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(0, 255, 255, 0.3) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(255, 255, 0, 0.2) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #00ff00, #00ffff, #ffff00, #00ff00)",
    "conic-2": "conic-gradient(from 180deg, #00ffff, #ffff00, #00ff00, #00ffff)",
    "radial-1": "radial-gradient(circle, rgba(0, 255, 0, 0.3) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'IBM Plex Mono', 'Courier New', monospace",
    "font-heading": "'VT323', 'Share Tech Mono', monospace",
    "font-display": "'VT323', 'Share Tech Mono', monospace",
    "font-mono": "'VT323', 'Share Tech Mono', monospace",
    "font-serif": "'IBM Plex Mono', 'Courier New', monospace",

    "text-2xs": ["0.75rem", { lineHeight: "1rem" }],
    "text-xs": ["0.875rem", { lineHeight: "1.25rem" }],
    "text-sm": ["1rem", { lineHeight: "1.5rem" }],
    "text-base": ["1.125rem", { lineHeight: "1.75rem" }],
    "text-lg": ["1.25rem", { lineHeight: "1.75rem" }],
    "text-xl": ["1.5rem", { lineHeight: "2rem" }],
    "text-2xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "text-3xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "text-4xl": ["3rem", { lineHeight: "3rem" }],
    "text-5xl": ["4rem", { lineHeight: "4rem" }],
    "text-6xl": ["5rem", { lineHeight: "5rem" }],
    "text-7xl": ["6rem", { lineHeight: "6rem" }],
    "text-8xl": ["8rem", { lineHeight: "8rem" }],
    "text-9xl": ["10rem", { lineHeight: "10rem" }],
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-none": "none",
    "shadow-xs": "none",
    "shadow-sm": "none",
    "shadow-md": "none",
    "shadow-lg": "none",
    "shadow-xl": "none",
    "shadow-2xl": "none",
    "shadow-card": "0 0 10px rgba(0, 255, 0, 0.2)",
    "shadow-dropdown": "0 0 20px rgba(0, 255, 0, 0.3)",
    "shadow-modal": "0 0 30px rgba(0, 255, 0, 0.4)",
    "shadow-glow-sm": "0 0 8px rgba(0, 255, 0, 0.4)",
    "shadow-glow-md": "0 0 16px rgba(0, 255, 0, 0.5)",
    "shadow-glow-lg": "0 0 24px rgba(0, 255, 0, 0.6)",
    "shadow-glow-xl": "0 0 32px rgba(0, 255, 0, 0.7)",
    "shadow-glow-primary": "0 0 16px rgba(0, 255, 0, 0.6)",
    "shadow-glow-accent": "0 0 16px rgba(0, 255, 255, 0.6)",
  },

  glass: {
    "glass-bg": "rgba(10, 10, 10, 0.8)",
    "glass-bg-heavy": "rgba(10, 10, 10, 0.95)",
    "glass-bg-light": "rgba(10, 10, 10, 0.6)",
    "glass-border": "rgba(0, 255, 0, 0.3)",
    "glass-shadow": "0 0 20px rgba(0, 255, 0, 0.2)",
    "glass-blur": "0px",
    "glass-saturation": "100%",
  },

  animationPreset: "mechanical",
  motionIntensity: "normal",

  particles: {
    enabled: false,
    count: 0,
    type: "dots",
    color: "#00ff00",
    opacity: 0.3,
    size: { min: 1, max: 2 },
    speed: { min: 0.5, max: 1.5 },
    direction: 0,
    spread: 360,
    lifetime: 3000,
    blendMode: "screen",
  },

  noise: {
    intensity: 0.15,
    opacity: 0.12,
    size: 100,
    blendMode: "overlay",
    type: "static",
  },

  background: {
    ...baseTheme.background,
    color: "#0a0a0a",
    "color-subtle": "#111111",
    gradient: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
    "gradient-radial": "radial-gradient(circle at center, #111111 0%, #0a0a0a 100%)",
    pattern: "repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03) 0px, rgba(0, 255, 0, 0.03) 1px, transparent 1px, transparent 2px)",
    "pattern-opacity": 1,
  },

  foreground: {
    color: "#00ff00",
    "color-subtle": "#00cc00",
    "color-muted": "#009900",
    "color-disabled": "#006600",
  },

  surface: {
    color: "#111111",
    "color-raised": "#1a1a1a",
    "color-overlay": "#222222",
    "color-sunken": "#0a0a0a",
    "color-inset": "#0d0d0d",
    "color-hover": "#1a1a1a",
    "color-active": "#282828",
    border: "#00aa00",
    "border-subtle": "#008800",
    shadow: "0 0 10px rgba(0, 255, 0, 0.2)",
    "backdrop-filter": "blur(0px)",
  },

  border: {
    ...baseTheme.border,
    color: "#00aa00",
    "color-strong": "#00cc00",
    "color-subtle": "#008800",
    "color-muted": "#006600",
    "color-focus": "#00ff00",
    "color-disabled": "#004400",
    width: "2px",
    "radius": "0px",
  },

  radius: {
    ...baseTheme.radius,
    "radius-xs": "0px",
    "radius-sm": "0px",
    "radius-md": "0px",
    "radius-lg": "0px",
    "radius-xl": "0px",
    "radius-2xl": "0px",
    "radius-3xl": "0px",
    "radius-full": "0px",
    "radius-button": "0px",
    "radius-input": "0px",
    "radius-card": "0px",
    "radius-badge": "0px",
    "radius-avatar": "0px",
    "radius-modal": "0px",
    "radius-tooltip": "0px",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "0px",
    "padding-x": "1.5rem",
    "padding-y": "0.625rem",
    "font-weight": "700",
    "transition": "all 100ms step-end",
    "shadow": "0 0 8px rgba(0, 255, 0, 0.4)",
    "shadow-hover": "0 0 16px rgba(0, 255, 0, 0.6)",
    "transform-hover": "none",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "0px",
    "border": "2px solid rgba(0, 255, 0, 0.4)",
    "shadow": "0 0 10px rgba(0, 255, 0, 0.2)",
    "shadow-hover": "0 0 20px rgba(0, 255, 0, 0.4)",
    "backdrop-filter": "blur(0px)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "0px",
    "background": "rgba(10, 10, 10, 0.9)",
    "border": "2px solid rgba(0, 255, 0, 0.3)",
    "border-focus": "2px solid #00ff00",
    "shadow-focus": "0 0 10px rgba(0, 255, 0, 0.3)",
    "placeholder-color": "#006600",
  },

  scrollbarStyle: {
    width: "12px",
    height: "12px",
    "track-bg": "#0a0a0a",
    "thumb-bg": "#00aa00",
    "thumb-bg-hover": "#00ff00",
    "thumb-radius": "0px",
    "thumb-border": "2px solid #0a0a0a",
  },

  selectionStyle: {
    bg: "rgba(0, 255, 0, 0.4)",
    fg: "#00ff00",
  },

  isDark: true,
});

export default retroTheme;
