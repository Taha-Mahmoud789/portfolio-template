import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const gamingTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "gaming",
  name: "Gaming",
  description: "High-energy gaming aesthetic with pixel art and arcade vibes",
  category: "interactive",
  thumbnail: "/icons/themes/gaming.svg",
  tags: ["gaming", "pixel", "arcade", "retro"],

  colors: {
    ...baseTheme.colors,
    primary: "#ff0000",
    "primary-hover": "#ff3333",
    "primary-active": "#cc0000",
    "primary-subtle": "rgba(255, 0, 0, 0.1)",
    "primary-muted": "rgba(255, 0, 0, 0.2)",

    secondary: "#00ff00",
    "secondary-foreground": "#000000",
    "secondary-hover": "#33ff33",
    "secondary-active": "#00cc00",
    "secondary-subtle": "rgba(0, 255, 0, 0.1)",
    "secondary-muted": "rgba(0, 255, 0, 0.2)",

    accent: "#ffff00",
    "accent-foreground": "#000000",
    "accent-hover": "#ffff33",
    "accent-active": "#cccc00",
    "accent-subtle": "rgba(255, 255, 0, 0.1)",

    destructive: "#ff0000",

    background: "#0a0a0a",
    "background-subtle": "#111111",
    "background-muted": "#1a1a1a",

    foreground: "#ffffff",
    "foreground-subtle": "#cccccc",
    "foreground-muted": "#888888",
    "foreground-disabled": "#555555",

    surface: "#141414",
    "surface-raised": "#1e1e1e",
    "surface-overlay": "#222222",
    "surface-sunken": "#0a0a0a",
    "surface-inset": "#0d0d0d",
    "surface-hover": "#1e1e1e",
    "surface-active": "#282828",

    border: "#333333",
    "border-strong": "#444444",
    "border-subtle": "#222222",
    "border-muted": "#1a1a1a",
    "border-focus": "#ff0000",
    "border-disabled": "#222222",

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

    "focus-ring": "#ff0000",
    "hover-overlay": "rgba(255, 0, 0, 0.1)",
    "active-overlay": "rgba(255, 0, 0, 0.2)",
    "disabled-bg": "#1a1a1a",
    "disabled-fg": "#555555",
    "disabled-border": "#222222",

    "selection-bg": "rgba(255, 0, 0, 0.3)",
    "selection-fg": "#ffffff",

    "overlay-heavy": "rgba(0, 0, 0, 0.85)",
    "overlay-medium": "rgba(0, 0, 0, 0.65)",
    "overlay-light": "rgba(0, 0, 0, 0.4)",
    "overlay-lightest": "rgba(0, 0, 0, 0.2)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #ff0000 0%, #ff6600 100%)",
    secondary: "linear-gradient(135deg, #00ff00 0%, #00ffff 100%)",
    accent: "linear-gradient(135deg, #ffff00 0%, #ff0000 100%)",
    hero: "linear-gradient(135deg, #ff0000 0%, #ff6600 25%, #ffff00 50%, #00ff00 75%, #00ffff 100%)",
    card: "linear-gradient(180deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 1) 100%)",
    surface: "linear-gradient(180deg, #141414 0%, #0a0a0a 100%)",
    "surface-raised": "linear-gradient(180deg, #1e1e1e 0%, #141414 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(255, 0, 0, 0.4) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(0, 255, 0, 0.4) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(255, 255, 0, 0.3) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #ff0000)",
    "conic-2": "conic-gradient(from 180deg, #00ffff, #00ff00, #ffff00, #ff0000, #00ffff)",
    "radial-1": "radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(0, 255, 0, 0.3) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Exo 2', 'Rajdhani', sans-serif",
    "font-heading": "'Press Start 2P', 'Exo 2', monospace",
    "font-display": "'Press Start 2P', 'Exo 2', monospace",
    "font-mono": "'VT323', 'Share Tech Mono', monospace",
    "font-serif": "'Exo 2', sans-serif",

    "tracking-wide": "0.05em",
    "tracking-wider": "0.1em",
    "tracking-widest": "0.15em",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 0 15px rgba(255, 0, 0, 0.3)",
    "shadow-dropdown": "0 0 30px rgba(255, 0, 0, 0.4)",
    "shadow-modal": "0 0 50px rgba(255, 0, 0, 0.5)",
    "shadow-glow-sm": "0 0 10px rgba(255, 0, 0, 0.5)",
    "shadow-glow-md": "0 0 20px rgba(255, 0, 0, 0.6)",
    "shadow-glow-lg": "0 0 30px rgba(255, 0, 0, 0.7)",
    "shadow-glow-xl": "0 0 40px rgba(255, 0, 0, 0.8)",
    "shadow-glow-primary": "0 0 20px rgba(255, 0, 0, 0.6)",
    "shadow-glow-accent": "0 0 20px rgba(255, 255, 0, 0.6)",
  },

  glass: {
    ...baseTheme.glass,
    "glass-bg": "rgba(10, 10, 10, 0.7)",
    "glass-bg-heavy": "rgba(10, 10, 10, 0.85)",
    "glass-bg-light": "rgba(10, 10, 10, 0.5)",
    "glass-border": "rgba(255, 0, 0, 0.3)",
    "glass-shadow": "0 0 30px rgba(255, 0, 0, 0.3)",
    "glass-blur": "12px",
  },

  animationPreset: "kinetic",
  motionIntensity: "increased",

  particles: {
    enabled: true,
    count: 60,
    type: "shapes",
    color: "#ff0000",
    opacity: 0.4,
    size: { min: 2, max: 6 },
    speed: { min: 0.5, max: 2 },
    direction: 0,
    spread: 360,
    lifetime: 2000,
    blendMode: "screen",
  },

  noise: {
    intensity: 0.12,
    opacity: 0.1,
    size: 100,
    blendMode: "overlay",
    type: "dots",
  },

  background: {
    ...baseTheme.background,
    color: "#0a0a0a",
    "color-subtle": "#111111",
    gradient: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
    "gradient-radial": "radial-gradient(circle at center, #141414 0%, #0a0a0a 100%)",
  },

  foreground: {
    color: "#ffffff",
    "color-subtle": "#cccccc",
    "color-muted": "#888888",
    "color-disabled": "#555555",
  },

  surface: {
    color: "#141414",
    "color-raised": "#1e1e1e",
    "color-overlay": "#222222",
    "color-sunken": "#0a0a0a",
    "color-inset": "#0d0d0d",
    "color-hover": "#1e1e1e",
    "color-active": "#282828",
    border: "#333333",
    "border-subtle": "#222222",
    shadow: "0 0 15px rgba(255, 0, 0, 0.3)",
    "backdrop-filter": "blur(12px) saturate(180%)",
  },

  border: {
    ...baseTheme.border,
    color: "#333333",
    "color-strong": "#444444",
    "color-subtle": "#222222",
    "color-muted": "#1a1a1a",
    "color-focus": "#ff0000",
    "color-disabled": "#222222",
    "radius": "0.125rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "0px",
    "padding-x": "1.5rem",
    "padding-y": "0.75rem",
    "font-weight": "700",
    "transition": "all 100ms ease",
    "shadow": "0 0 10px rgba(255, 0, 0, 0.4)",
    "shadow-hover": "0 0 20px rgba(255, 0, 0, 0.6)",
    "transform-hover": "translateY(-2px)",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "0px",
    "background": "rgba(20, 20, 20, 0.9)",
    "border": "2px solid rgba(255, 0, 0, 0.5)",
    "shadow": "0 0 15px rgba(255, 0, 0, 0.3)",
    "shadow-hover": "0 0 25px rgba(255, 0, 0, 0.5)",
    "backdrop-filter": "blur(12px) saturate(180%)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "0px",
    "background": "rgba(10, 10, 10, 0.8)",
    "border": "2px solid rgba(255, 0, 0, 0.3)",
    "border-focus": "2px solid #ff0000",
    "shadow-focus": "0 0 15px rgba(255, 0, 0, 0.3)",
    "placeholder-color": "#555555",
  },

  selectionStyle: {
    bg: "rgba(255, 0, 0, 0.4)",
    fg: "#ffffff",
  },

  isDark: true,
});

export default gamingTheme;
