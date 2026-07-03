import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const liquidTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "liquid",
  name: "Liquid",
  description: "Fluid morphing shapes with WebGL shaders and organic motion",
  category: "organic",
  thumbnail: "/icons/themes/liquid.svg",
  tags: ["liquid", "fluid", "webgl", "organic"],

  colors: {
    ...baseTheme.colors,
    primary: "#06b6d4",
    "primary-hover": "#22d3ee",
    "primary-active": "#0891b2",
    "primary-subtle": "rgba(6, 182, 212, 0.1)",
    "primary-muted": "rgba(6, 182, 212, 0.2)",

    secondary: "#8b5cf6",
    "secondary-hover": "#a78bfa",
    "secondary-active": "#7c3aed",
    "secondary-subtle": "rgba(139, 92, 246, 0.1)",
    "secondary-muted": "rgba(139, 92, 246, 0.2)",

    accent: "#06b6d4",
    "accent-hover": "#22d3ee",
    "accent-active": "#0891b2",
    "accent-subtle": "rgba(6, 182, 212, 0.1)",

    destructive: "#ef4444",

    background: "#021526",
    "background-subtle": "#031f38",
    "background-muted": "#04294a",

    foreground: "#e0f7fa",
    "foreground-subtle": "#80deea",
    "foreground-muted": "#4dd0e1",
    "foreground-disabled": "#26c6da",

    surface: "#03253f",
    "surface-raised": "#043a5c",
    "surface-overlay": "#054a73",
    "surface-sunken": "#021526",
    "surface-inset": "#021c33",
    "surface-hover": "#043a5c",
    "surface-active": "#065180",

    border: "#0a5c7f",
    "border-strong": "#0e7fa8",
    "border-subtle": "#074d6d",
    "border-muted": "#03253f",
    "border-focus": "#06b6d4",
    "border-disabled": "#074d6d",

    success: "#10b981",
    "success-subtle": "rgba(16, 185, 129, 0.15)",

    warning: "#f59e0b",
    "warning-subtle": "rgba(245, 158, 11, 0.15)",

    error: "#ef4444",
    "error-subtle": "rgba(239, 68, 68, 0.15)",

    info: "#06b6d4",
    "info-subtle": "rgba(6, 182, 212, 0.15)",

    "focus-ring": "#06b6d4",
    "hover-overlay": "rgba(6, 182, 212, 0.08)",
    "active-overlay": "rgba(6, 182, 212, 0.15)",
    "disabled-bg": "#03253f",
    "disabled-fg": "#26c6da",
    "disabled-border": "#074d6d",

    "selection-bg": "rgba(6, 182, 212, 0.3)",
    "selection-fg": "#e0f7fa",

    "overlay-heavy": "rgba(2, 21, 38, 0.9)",
    "overlay-medium": "rgba(2, 21, 38, 0.7)",
    "overlay-light": "rgba(2, 21, 38, 0.4)",
    "overlay-lightest": "rgba(2, 21, 38, 0.2)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    secondary: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    accent: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
    hero: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
    card: "linear-gradient(180deg, rgba(3, 37, 63, 0.8) 0%, rgba(4, 58, 92, 0.9) 100%)",
    surface: "linear-gradient(180deg, #03253f 0%, #021526 100%)",
    "surface-raised": "linear-gradient(180deg, #043a5c 0%, #03253f 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.4) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.4) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
    "conic-2": "conic-gradient(from 180deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)",
    "radial-1": "radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Plus Jakarta Sans', 'Inter', sans-serif",
    "font-heading": "'Outfit', 'Inter', sans-serif",
    "font-display": "'Outfit', 'Inter', sans-serif",
    "font-mono": "'JetBrains Mono', 'Fira Code', monospace",
    "font-serif": "'Plus Jakarta Sans', 'Inter', sans-serif",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 8px 30px rgba(6, 182, 212, 0.15)",
    "shadow-dropdown": "0 12px 40px rgba(6, 182, 212, 0.2)",
    "shadow-modal": "0 20px 60px rgba(6, 182, 212, 0.25)",
    "shadow-glow-sm": "0 0 15px rgba(6, 182, 212, 0.3)",
    "shadow-glow-md": "0 0 25px rgba(6, 182, 212, 0.4)",
    "shadow-glow-lg": "0 0 35px rgba(6, 182, 212, 0.5)",
    "shadow-glow-xl": "0 0 45px rgba(6, 182, 212, 0.6)",
    "shadow-glow-primary": "0 0 25px rgba(6, 182, 212, 0.5)",
    "shadow-glow-accent": "0 0 25px rgba(139, 92, 246, 0.5)",
  },

  glass: {
    "glass-bg": "rgba(3, 37, 63, 0.6)",
    "glass-bg-heavy": "rgba(3, 37, 63, 0.8)",
    "glass-bg-light": "rgba(3, 37, 63, 0.4)",
    "glass-border": "rgba(6, 182, 212, 0.25)",
    "glass-shadow": "0 8px 32px rgba(6, 182, 212, 0.15)",
    "glass-blur": "20px",
    "glass-saturation": "200%",
  },

  animationPreset: "fluid",
  motionIntensity: "increased",

  motion: {
    ...baseTheme.motion,
    "ease-spring": "cubic-bezier(0.23, 1, 0.32, 1)",
    "ease-elastic": "cubic-bezier(0.23, 1, 0.32, 1)",
  },

  particles: {
    enabled: true,
    count: 100,
    type: "dots",
    color: "#06b6d4",
    opacity: 0.25,
    size: { min: 2, max: 5 },
    speed: { min: 0.2, max: 0.8 },
    direction: 0,
    spread: 360,
    lifetime: 5000,
    blendMode: "screen",
  },

  noise: {
    intensity: 0.06,
    opacity: 0.04,
    size: 300,
    blendMode: "overlay",
    type: "organic",
  },

  background: {
    ...baseTheme.background,
    color: "#021526",
    "color-subtle": "#031f38",
    gradient: "linear-gradient(180deg, #021526 0%, #031f38 100%)",
    "gradient-radial": "radial-gradient(circle at center, #03253f 0%, #021526 100%)",
    "gradient-mesh": "radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%)",
  },

  foreground: {
    color: "#e0f7fa",
    "color-subtle": "#80deea",
    "color-muted": "#4dd0e1",
    "color-disabled": "#26c6da",
  },

  surface: {
    color: "#03253f",
    "color-raised": "#043a5c",
    "color-overlay": "#054a73",
    "color-sunken": "#021526",
    "color-inset": "#021c33",
    "color-hover": "#043a5c",
    "color-active": "#065180",
    border: "#0a5c7f",
    "border-subtle": "#074d6d",
    shadow: "0 8px 30px rgba(6, 182, 212, 0.15)",
    "backdrop-filter": "blur(20px) saturate(200%)",
  },

  border: {
    ...baseTheme.border,
    color: "#0a5c7f",
    "color-strong": "#0e7fa8",
    "color-subtle": "#074d6d",
    "color-muted": "#03253f",
    "color-focus": "#06b6d4",
    "color-disabled": "#074d6d",
    radius: "1rem",
  },

  radius: {
    ...baseTheme.radius,
    "radius-button": "1rem",
    "radius-card": "1.25rem",
    "radius-input": "0.75rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "1rem",
    "padding-x": "1.5rem",
    "padding-y": "0.75rem",
    "shadow": "0 4px 15px rgba(6, 182, 212, 0.3)",
    "shadow-hover": "0 6px 25px rgba(6, 182, 212, 0.5)",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "1.25rem",
    "background": "rgba(3, 37, 63, 0.7)",
    "border": "1px solid rgba(6, 182, 212, 0.25)",
    "shadow": "0 8px 30px rgba(6, 182, 212, 0.15)",
    "shadow-hover": "0 12px 40px rgba(6, 182, 212, 0.3)",
    "backdrop-filter": "blur(20px) saturate(200%)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "0.75rem",
    "background": "rgba(2, 21, 38, 0.7)",
    "border": "1px solid rgba(6, 182, 212, 0.25)",
    "border-focus": "2px solid #06b6d4",
    "shadow-focus": "0 0 20px rgba(6, 182, 212, 0.2)",
    "placeholder-color": "#4dd0e1",
  },

  selectionStyle: {
    bg: "rgba(6, 182, 212, 0.3)",
    fg: "#e0f7fa",
  },

  isDark: true,
});

export default liquidTheme;
