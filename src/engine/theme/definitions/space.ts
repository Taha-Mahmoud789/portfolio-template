import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const spaceTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "space",
  name: "Space",
  description: "Cosmic exploration with 3D scenes and stellar animations",
  category: "cosmic",
  thumbnail: "/icons/themes/space.svg",
  tags: ["space", "cosmic", "stellar", "dark"],

  colors: {
    ...baseTheme.colors,
    primary: "#6366f1",
    "primary-hover": "#818cf8",
    "primary-active": "#4f46e5",
    "primary-subtle": "rgba(99, 102, 241, 0.1)",
    "primary-muted": "rgba(99, 102, 241, 0.2)",

    secondary: "#a855f7",
    "secondary-hover": "#c084fc",
    "secondary-active": "#9333ea",
    "secondary-subtle": "rgba(168, 85, 247, 0.1)",
    "secondary-muted": "rgba(168, 85, 247, 0.2)",

    accent: "#06b6d4",
    "accent-hover": "#22d3ee",
    "accent-active": "#0891b2",
    "accent-subtle": "rgba(6, 182, 212, 0.1)",

    destructive: "#ef4444",

    background: "#030712",
    "background-subtle": "#0a0f1e",
    "background-muted": "#111827",

    foreground: "#e2e8f0",
    "foreground-subtle": "#94a3b8",
    "foreground-muted": "#64748b",
    "foreground-disabled": "#475569",

    surface: "#0f172a",
    "surface-raised": "#1e293b",
    "surface-overlay": "#1e293b",
    "surface-sunken": "#030712",
    "surface-inset": "#0a0f1e",
    "surface-hover": "#1e293b",
    "surface-active": "#334155",

    border: "#1e293b",
    "border-strong": "#334155",
    "border-subtle": "#1e293b",
    "border-muted": "#0f172a",
    "border-focus": "#6366f1",
    "border-disabled": "#1e293b",

    success: "#10b981",
    "success-subtle": "rgba(16, 185, 129, 0.15)",

    warning: "#f59e0b",
    "warning-subtle": "rgba(245, 158, 11, 0.15)",

    error: "#ef4444",
    "error-subtle": "rgba(239, 68, 68, 0.15)",

    info: "#6366f1",
    "info-subtle": "rgba(99, 102, 241, 0.15)",

    "focus-ring": "#6366f1",
    "hover-overlay": "rgba(255, 255, 255, 0.05)",
    "active-overlay": "rgba(255, 255, 255, 0.1)",
    "disabled-bg": "#1e293b",
    "disabled-fg": "#475569",
    "disabled-border": "#1e293b",

    "selection-bg": "rgba(99, 102, 241, 0.3)",
    "selection-fg": "#e2e8f0",

    "overlay-heavy": "rgba(0, 0, 0, 0.85)",
    "overlay-medium": "rgba(0, 0, 0, 0.65)",
    "overlay-light": "rgba(0, 0, 0, 0.4)",
    "overlay-lightest": "rgba(0, 0, 0, 0.2)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    secondary: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    accent: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)",
    hero: "linear-gradient(135deg, #030712 0%, #0f172a 30%, #1e1b4b 60%, #030712 100%)",
    card: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)",
    surface: "linear-gradient(180deg, #0f172a 0%, #030712 100%)",
    "surface-raised": "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.4) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.4) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(6, 182, 212, 0.3) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #6366f1, #a855f7, #06b6d4, #6366f1)",
    "conic-2": "conic-gradient(from 180deg, #a855f7, #06b6d4, #6366f1, #a855f7)",
    "radial-1": "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Space Grotesk', 'Inter', sans-serif",
    "font-heading": "'Space Grotesk', 'Inter', sans-serif",
    "font-display": "'Space Grotesk', 'Inter', sans-serif",
    "font-mono": "'JetBrains Mono', 'Fira Code', monospace",
    "font-serif": "'Inter', sans-serif",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 4px 20px rgba(0, 0, 0, 0.4)",
    "shadow-dropdown": "0 8px 30px rgba(0, 0, 0, 0.5)",
    "shadow-modal": "0 16px 50px rgba(0, 0, 0, 0.6)",
    "shadow-glow-sm": "0 0 10px rgba(99, 102, 241, 0.3)",
    "shadow-glow-md": "0 0 20px rgba(99, 102, 241, 0.4)",
    "shadow-glow-lg": "0 0 30px rgba(99, 102, 241, 0.5)",
    "shadow-glow-xl": "0 0 40px rgba(99, 102, 241, 0.6)",
    "shadow-glow-primary": "0 0 20px rgba(99, 102, 241, 0.5)",
    "shadow-glow-accent": "0 0 20px rgba(6, 182, 212, 0.5)",
  },

  glass: {
    "glass-bg": "rgba(15, 23, 42, 0.6)",
    "glass-bg-heavy": "rgba(15, 23, 42, 0.8)",
    "glass-bg-light": "rgba(15, 23, 42, 0.4)",
    "glass-border": "rgba(99, 102, 241, 0.2)",
    "glass-shadow": "0 8px 32px rgba(0, 0, 0, 0.4)",
    "glass-blur": "16px",
    "glass-saturation": "150%",
  },

  animationPreset: "fluid",
  motionIntensity: "normal",

  particles: {
    enabled: true,
    count: 120,
    type: "dots",
    color: "#6366f1",
    opacity: 0.3,
    size: { min: 1, max: 3 },
    speed: { min: 0.1, max: 0.5 },
    direction: 0,
    spread: 360,
    lifetime: 6000,
    blendMode: "screen",
  },

  noise: {
    intensity: 0.08,
    opacity: 0.05,
    size: 250,
    blendMode: "overlay",
    type: "grain",
  },

  background: {
    ...baseTheme.background,
    color: "#030712",
    "color-subtle": "#0a0f1e",
    gradient: "linear-gradient(180deg, #030712 0%, #0a0f1e 100%)",
    "gradient-radial": "radial-gradient(circle at center, #0f172a 0%, #030712 100%)",
    "gradient-mesh": "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.3) 0px, transparent 50%)",
  },

  foreground: {
    color: "#e2e8f0",
    "color-subtle": "#94a3b8",
    "color-muted": "#64748b",
    "color-disabled": "#475569",
  },

  surface: {
    color: "#0f172a",
    "color-raised": "#1e293b",
    "color-overlay": "#1e293b",
    "color-sunken": "#030712",
    "color-inset": "#0a0f1e",
    "color-hover": "#1e293b",
    "color-active": "#334155",
    border: "#1e293b",
    "border-subtle": "#1e293b",
    shadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    "backdrop-filter": "blur(16px) saturate(150%)",
  },

  border: {
    ...baseTheme.border,
    color: "#1e293b",
    "color-strong": "#334155",
    "color-subtle": "#1e293b",
    "color-muted": "#0f172a",
    "color-focus": "#6366f1",
    "color-disabled": "#1e293b",
    radius: "0.5rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "0.5rem",
    "padding-x": "1.25rem",
    "padding-y": "0.625rem",
    "shadow": "0 4px 15px rgba(99, 102, 241, 0.3)",
    "shadow-hover": "0 6px 20px rgba(99, 102, 241, 0.5)",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "background": "rgba(15, 23, 42, 0.8)",
    "border": "1px solid rgba(99, 102, 241, 0.2)",
    "shadow": "0 4px 20px rgba(0, 0, 0, 0.4)",
    "shadow-hover": "0 8px 30px rgba(0, 0, 0, 0.5)",
    "backdrop-filter": "blur(16px) saturate(150%)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "background": "rgba(10, 15, 30, 0.8)",
    "border": "1px solid rgba(99, 102, 241, 0.2)",
    "border-focus": "2px solid #6366f1",
    "shadow-focus": "0 0 15px rgba(99, 102, 241, 0.2)",
    "placeholder-color": "#64748b",
  },

  selectionStyle: {
    bg: "rgba(99, 102, 241, 0.3)",
    fg: "#e2e8f0",
  },

  isDark: true,
});

export default spaceTheme;
