import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const experimentalTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "experimental",
  name: "Experimental",
  description: "Pushing boundaries with unconventional layouts and interactions",
  category: "avant-garde",
  thumbnail: "/icons/themes/experimental.svg",
  tags: ["experimental", "avant-garde", "innovative", "unconventional"],

  colors: {
    ...baseTheme.colors,
    primary: "#f59e0b",
    "primary-foreground": "#000000",
    "primary-hover": "#fbbf24",
    "primary-active": "#d97706",
    "primary-subtle": "rgba(245, 158, 11, 0.1)",
    "primary-muted": "rgba(245, 158, 11, 0.2)",

    secondary: "#8b5cf6",
    "secondary-hover": "#a78bfa",
    "secondary-active": "#7c3aed",
    "secondary-subtle": "rgba(139, 92, 246, 0.1)",
    "secondary-muted": "rgba(139, 92, 246, 0.2)",

    accent: "#ec4899",
    "accent-hover": "#f472b6",
    "accent-active": "#db2777",
    "accent-subtle": "rgba(236, 72, 153, 0.1)",

    destructive: "#ef4444",

    background: "#fafaf9",
    "background-subtle": "#f5f5f4",
    "background-muted": "#e7e5e4",

    foreground: "#1c1917",
    "foreground-subtle": "#57534e",
    "foreground-muted": "#a8a29e",
    "foreground-disabled": "#d6d3d1",

    "surface-overlay": "#ffffff",
    "surface-sunken": "#f5f5f4",
    "surface-inset": "#e7e5e4",
    "surface-hover": "#f5f5f4",
    "surface-active": "#e7e5e4",

    border: "#d6d3d1",
    "border-strong": "#a8a29e",
    "border-subtle": "#e7e5e4",
    "border-muted": "#d6d3d1",
    "border-focus": "#f59e0b",
    "border-disabled": "#d6d3d1",

    success: "#10b981",
    "success-subtle": "rgba(16, 185, 129, 0.1)",

    warning: "#f59e0b",
    "warning-foreground": "#000000",
    "warning-subtle": "rgba(245, 158, 11, 0.1)",

    error: "#ef4444",
    "error-subtle": "rgba(239, 68, 68, 0.1)",

    info: "#3b82f6",
    "info-subtle": "rgba(59, 130, 246, 0.1)",

    "focus-ring": "#f59e0b",
    "hover-overlay": "rgba(245, 158, 11, 0.05)",
    "active-overlay": "rgba(245, 158, 11, 0.1)",
    "disabled-bg": "#f5f5f4",
    "disabled-fg": "#a8a29e",
    "disabled-border": "#d6d3d1",

    "selection-bg": "#f59e0b",
    "selection-fg": "#000000",

    "overlay-heavy": "rgba(28, 25, 23, 0.85)",
    "overlay-medium": "rgba(28, 25, 23, 0.6)",
    "overlay-light": "rgba(28, 25, 23, 0.3)",
    "overlay-lightest": "rgba(28, 25, 23, 0.1)",
  },

  gradients: {
    ...baseTheme.gradients,
    primary: "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
    secondary: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
    accent: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)",
    hero: "linear-gradient(135deg, #f59e0b 0%, #ec4899 25%, #8b5cf6 50%, #3b82f6 75%, #06b6d4 100%)",
    card: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
    surface: "linear-gradient(180deg, #ffffff 0%, #fafaf9 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.2) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.2) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6, #06b6d4, #f59e0b)",
    "conic-2": "conic-gradient(from 180deg, #8b5cf6, #3b82f6, #06b6d4, #f59e0b, #ec4899, #8b5cf6)",
    "radial-1": "radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'General Sans', 'Inter', sans-serif",
    "font-heading": "'Syne', 'Inter', sans-serif",
    "font-display": "'Syne', 'Inter', sans-serif",
    "font-mono": "'Fira Code', 'JetBrains Mono', monospace",
    "font-serif": "'General Sans', 'Inter', sans-serif",

    "tracking-wide": "0.02em",
    "tracking-wider": "0.05em",
    "tracking-widest": "0.1em",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 4px 20px rgba(245, 158, 11, 0.1)",
    "shadow-dropdown": "0 8px 30px rgba(245, 158, 11, 0.15)",
    "shadow-modal": "0 16px 50px rgba(245, 158, 11, 0.2)",
    "shadow-glow-sm": "0 0 10px rgba(245, 158, 11, 0.2)",
    "shadow-glow-md": "0 0 20px rgba(245, 158, 11, 0.3)",
    "shadow-glow-lg": "0 0 30px rgba(245, 158, 11, 0.4)",
    "shadow-glow-xl": "0 0 40px rgba(245, 158, 11, 0.5)",
    "shadow-glow-primary": "0 0 20px rgba(245, 158, 11, 0.4)",
    "shadow-glow-accent": "0 0 20px rgba(236, 72, 153, 0.4)",
  },

  glass: {
    ...baseTheme.glass,
    "glass-bg": "rgba(250, 250, 249, 0.8)",
    "glass-bg-heavy": "rgba(250, 250, 249, 0.95)",
    "glass-bg-light": "rgba(250, 250, 249, 0.6)",
    "glass-border": "rgba(245, 158, 11, 0.2)",
    "glass-shadow": "0 8px 32px rgba(245, 158, 11, 0.1)",
    "glass-blur": "16px",
  },

  animationPreset: "expressive",
  motionIntensity: "increased",

  motion: {
    ...baseTheme.motion,
    "ease-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "ease-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    "ease-elastic": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  particles: {
    enabled: true,
    count: 40,
    type: "shapes",
    color: "#f59e0b",
    opacity: 0.2,
    size: { min: 3, max: 8 },
    speed: { min: 0.3, max: 1 },
    direction: 45,
    spread: 180,
    lifetime: 4000,
    blendMode: "normal",
  },

  noise: {
    intensity: 0.06,
    opacity: 0.04,
    size: 250,
    blendMode: "overlay",
    type: "organic",
  },

  background: {
    ...baseTheme.background,
    color: "#fafaf9",
    "color-subtle": "#f5f5f4",
    gradient: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)",
    "gradient-radial": "radial-gradient(circle at center, #ffffff 0%, #f5f5f4 100%)",
    "gradient-mesh": "radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)",
  },

  foreground: {
    color: "#1c1917",
    "color-subtle": "#57534e",
    "color-muted": "#a8a29e",
    "color-disabled": "#d6d3d1",
  },

  surface: {
    color: "#ffffff",
    "color-raised": "#ffffff",
    "color-overlay": "#ffffff",
    "color-sunken": "#f5f5f4",
    "color-inset": "#e7e5e4",
    "color-hover": "#f5f5f4",
    "color-active": "#e7e5e4",
    border: "#d6d3d1",
    "border-subtle": "#e7e5e4",
    shadow: "0 4px 20px rgba(245, 158, 11, 0.1)",
    "backdrop-filter": "blur(16px) saturate(180%)",
  },

  border: {
    ...baseTheme.border,
    color: "#d6d3d1",
    "color-strong": "#a8a29e",
    "color-subtle": "#e7e5e4",
    "color-muted": "#d6d3d1",
    "color-focus": "#f59e0b",
    "color-disabled": "#d6d3d1",
    radius: "1rem",
  },

  radius: {
    ...baseTheme.radius,
    "radius-button": "1rem",
    "radius-card": "1.5rem",
    "radius-input": "0.75rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "1rem",
    "padding-x": "1.5rem",
    "padding-y": "0.75rem",
    "font-weight": "600",
    "transition": "all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    "shadow": "0 4px 15px rgba(245, 158, 11, 0.2)",
    "shadow-hover": "0 6px 25px rgba(245, 158, 11, 0.35)",
    "transform-hover": "translateY(-2px) scale(1.02)",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "1.5rem",
    "border": "1px solid rgba(245, 158, 11, 0.15)",
    "shadow": "0 4px 20px rgba(245, 158, 11, 0.1)",
    "shadow-hover": "0 8px 30px rgba(245, 158, 11, 0.2)",
    "backdrop-filter": "blur(16px) saturate(180%)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "0.75rem",
    "border": "1px solid rgba(245, 158, 11, 0.2)",
    "border-focus": "2px solid #f59e0b",
    "shadow-focus": "0 0 15px rgba(245, 158, 11, 0.15)",
    "placeholder-color": "#a8a29e",
  },

  selectionStyle: {
    bg: "#f59e0b",
    fg: "#000000",
  },

});

export default experimentalTheme;
