import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const aiTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "ai",
  name: "AI",
  description: "Futuristic AI aesthetic with neural networks and fluid visuals",
  category: "intelligent",
  thumbnail: "/icons/themes/ai.svg",
  tags: ["ai", "neural", "futuristic", "intelligent"],

  colors: {
    ...baseTheme.colors,
    primary: "#7c3aed",
    "primary-hover": "#8b5cf6",
    "primary-active": "#6d28d9",
    "primary-subtle": "rgba(124, 58, 237, 0.1)",
    "primary-muted": "rgba(124, 58, 237, 0.2)",

    secondary: "#06b6d4",
    "secondary-hover": "#22d3ee",
    "secondary-active": "#0891b2",
    "secondary-subtle": "rgba(6, 182, 212, 0.1)",
    "secondary-muted": "rgba(6, 182, 212, 0.2)",

    accent: "#ec4899",
    "accent-hover": "#f472b6",
    "accent-active": "#db2777",
    "accent-subtle": "rgba(236, 72, 153, 0.1)",

    destructive: "#ef4444",

    background: "#0c0a1a",
    "background-subtle": "#110e24",
    "background-muted": "#1a1530",

    foreground: "#f0e6ff",
    "foreground-subtle": "#b8a0d6",
    "foreground-muted": "#7c6a9c",
    "foreground-disabled": "#4a3d66",

    surface: "#161230",
    "surface-raised": "#1e1840",
    "surface-overlay": "#221c4a",
    "surface-sunken": "#0c0a1a",
    "surface-inset": "#0f0c20",
    "surface-hover": "#1e1840",
    "surface-active": "#282050",

    border: "#2a2450",
    "border-strong": "#3a3460",
    "border-subtle": "#1e1840",
    "border-muted": "#161230",
    "border-focus": "#7c3aed",
    "border-disabled": "#1e1840",

    success: "#10b981",
    "success-subtle": "rgba(16, 185, 129, 0.15)",

    warning: "#f59e0b",
    "warning-subtle": "rgba(245, 158, 11, 0.15)",

    error: "#ef4444",
    "error-subtle": "rgba(239, 68, 68, 0.15)",

    info: "#06b6d4",
    "info-subtle": "rgba(6, 182, 212, 0.15)",

    "focus-ring": "#7c3aed",
    "hover-overlay": "rgba(124, 58, 237, 0.1)",
    "active-overlay": "rgba(124, 58, 237, 0.15)",
    "disabled-bg": "#1e1840",
    "disabled-fg": "#4a3d66",
    "disabled-border": "#1e1840",

    "selection-bg": "rgba(124, 58, 237, 0.3)",
    "selection-fg": "#f0e6ff",

    "overlay-heavy": "rgba(0, 0, 0, 0.85)",
    "overlay-medium": "rgba(0, 0, 0, 0.65)",
    "overlay-light": "rgba(0, 0, 0, 0.4)",
    "overlay-lightest": "rgba(0, 0, 0, 0.2)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
    secondary: "linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)",
    accent: "linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)",
    hero: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #ec4899 100%)",
    card: "linear-gradient(180deg, rgba(22, 18, 48, 0.8) 0%, rgba(30, 24, 64, 0.9) 100%)",
    surface: "linear-gradient(180deg, #161230 0%, #0c0a1a 100%)",
    "surface-raised": "linear-gradient(180deg, #1e1840 0%, #161230 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.4) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.4) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #7c3aed, #06b6d4, #ec4899, #7c3aed)",
    "conic-2": "conic-gradient(from 180deg, #06b6d4, #ec4899, #7c3aed, #06b6d4)",
    "radial-1": "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Space Grotesk', 'Inter', sans-serif",
    "font-heading": "'Space Grotesk', 'Inter', sans-serif",
    "font-display": "'Space Grotesk', 'Inter', sans-serif",
    "font-mono": "'Fira Code', 'JetBrains Mono', monospace",
    "font-serif": "'Inter', sans-serif",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 4px 20px rgba(124, 58, 237, 0.2)",
    "shadow-dropdown": "0 8px 30px rgba(124, 58, 237, 0.3)",
    "shadow-modal": "0 16px 50px rgba(124, 58, 237, 0.4)",
    "shadow-glow-sm": "0 0 10px rgba(124, 58, 237, 0.4)",
    "shadow-glow-md": "0 0 20px rgba(124, 58, 237, 0.5)",
    "shadow-glow-lg": "0 0 30px rgba(124, 58, 237, 0.6)",
    "shadow-glow-xl": "0 0 40px rgba(124, 58, 237, 0.7)",
    "shadow-glow-primary": "0 0 20px rgba(124, 58, 237, 0.6)",
    "shadow-glow-accent": "0 0 20px rgba(236, 72, 153, 0.6)",
  },

  glass: {
    ...baseTheme.glass,
    "glass-bg": "rgba(12, 10, 26, 0.7)",
    "glass-bg-heavy": "rgba(12, 10, 26, 0.85)",
    "glass-bg-light": "rgba(12, 10, 26, 0.5)",
    "glass-border": "rgba(124, 58, 237, 0.3)",
    "glass-shadow": "0 8px 32px rgba(124, 58, 237, 0.2)",
    "glass-blur": "16px",
  },

  animationPreset: "organic",
  motionIntensity: "normal",

  particles: {
    enabled: true,
    count: 80,
    type: "dots",
    color: "#7c3aed",
    opacity: 0.3,
    size: { min: 1, max: 4 },
    speed: { min: 0.2, max: 0.8 },
    direction: 0,
    spread: 360,
    lifetime: 5000,
    blendMode: "screen",
  },

  noise: {
    intensity: 0.08,
    opacity: 0.06,
    size: 200,
    blendMode: "overlay",
    type: "organic",
  },

  background: {
    ...baseTheme.background,
    color: "#0c0a1a",
    "color-subtle": "#110e24",
    gradient: "linear-gradient(180deg, #0c0a1a 0%, #110e24 100%)",
    "gradient-radial": "radial-gradient(circle at center, #161230 0%, #0c0a1a 100%)",
    "gradient-mesh": "radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.3) 0px, transparent 50%)",
  },

  foreground: {
    color: "#f0e6ff",
    "color-subtle": "#b8a0d6",
    "color-muted": "#7c6a9c",
    "color-disabled": "#4a3d66",
  },

  surface: {
    color: "#161230",
    "color-raised": "#1e1840",
    "color-overlay": "#221c4a",
    "color-sunken": "#0c0a1a",
    "color-inset": "#0f0c20",
    "color-hover": "#1e1840",
    "color-active": "#282050",
    border: "#2a2450",
    "border-subtle": "#1e1840",
    shadow: "0 4px 20px rgba(124, 58, 237, 0.2)",
    "backdrop-filter": "blur(16px) saturate(180%)",
  },

  border: {
    ...baseTheme.border,
    color: "#2a2450",
    "color-strong": "#3a3460",
    "color-subtle": "#1e1840",
    "color-muted": "#161230",
    "color-focus": "#7c3aed",
    "color-disabled": "#1e1840",
    radius: "0.75rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "0.75rem",
    "padding-x": "1.25rem",
    "padding-y": "0.625rem",
    "shadow": "0 4px 15px rgba(124, 58, 237, 0.3)",
    "shadow-hover": "0 6px 20px rgba(124, 58, 237, 0.5)",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "background": "rgba(22, 18, 48, 0.8)",
    "border": "1px solid rgba(124, 58, 237, 0.2)",
    "shadow": "0 4px 20px rgba(124, 58, 237, 0.2)",
    "shadow-hover": "0 8px 30px rgba(124, 58, 237, 0.4)",
    "backdrop-filter": "blur(16px) saturate(180%)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "background": "rgba(12, 10, 26, 0.8)",
    "border": "1px solid rgba(124, 58, 237, 0.2)",
    "border-focus": "2px solid #7c3aed",
    "shadow-focus": "0 0 15px rgba(124, 58, 237, 0.2)",
    "placeholder-color": "#7c6a9c",
  },

  selectionStyle: {
    bg: "rgba(124, 58, 237, 0.3)",
    fg: "#f0e6ff",
  },

  isDark: true,
});

export default aiTheme;
