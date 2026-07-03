import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const cyberpunkTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "cyberpunk",
  name: "Cyberpunk",
  description: "Neon-lit dystopia with glitch effects and holographic elements",
  category: "futuristic",
  thumbnail: "/icons/themes/cyberpunk.svg",
  tags: ["cyberpunk", "neon", "glitch", "dark"],

  colors: {
    ...baseTheme.colors,
    primary: "#00ffff",
    "primary-foreground": "#0a0a0f",
    "primary-hover": "#33ffff",
    "primary-active": "#00cccc",
    "primary-subtle": "rgba(0, 255, 255, 0.1)",
    "primary-muted": "rgba(0, 255, 255, 0.2)",

    secondary: "#ff00ff",
    "secondary-foreground": "#0a0a0f",
    "secondary-hover": "#ff33ff",
    "secondary-active": "#cc00cc",
    "secondary-subtle": "rgba(255, 0, 255, 0.1)",
    "secondary-muted": "rgba(255, 0, 255, 0.2)",

    accent: "#ff6600",
    "accent-foreground": "#0a0a0f",
    "accent-hover": "#ff8533",
    "accent-active": "#cc5200",
    "accent-subtle": "rgba(255, 102, 0, 0.1)",

    destructive: "#ff0040",
    "destructive-hover": "#ff3366",
    "destructive-subtle": "rgba(255, 0, 64, 0.2)",

    background: "#0a0a0f",
    "background-subtle": "#0f0f1a",
    "background-muted": "#141420",

    foreground: "#e0e0ff",
    "foreground-subtle": "#a0a0cc",
    "foreground-muted": "#6060aa",
    "foreground-disabled": "#404066",

    surface: "#12121f",
    "surface-raised": "#1a1a2e",
    "surface-overlay": "#1f1f33",
    "surface-sunken": "#0a0a0f",
    "surface-inset": "#0d0d15",
    "surface-hover": "#1a1a2e",
    "surface-active": "#222238",

    border: "#333355",
    "border-strong": "#444466",
    "border-subtle": "#222244",
    "border-muted": "#1a1a33",
    "border-focus": "#00ffff",
    "border-disabled": "#222233",

    success: "#00ff88",
    "success-foreground": "#0a0a0f",
    "success-subtle": "rgba(0, 255, 136, 0.15)",

    warning: "#ffff00",
    "warning-foreground": "#0a0a0f",
    "warning-subtle": "rgba(255, 255, 0, 0.15)",

    error: "#ff0040",
    "error-subtle": "rgba(255, 0, 64, 0.2)",

    info: "#00ffff",
    "info-foreground": "#0a0a0f",
    "info-subtle": "rgba(0, 255, 255, 0.15)",

    "focus-ring": "#00ffff",
    "hover-overlay": "rgba(0, 255, 255, 0.05)",
    "active-overlay": "rgba(0, 255, 255, 0.1)",
    "disabled-bg": "#1a1a2e",
    "disabled-fg": "#404066",
    "disabled-border": "#222233",

    "selection-bg": "rgba(0, 255, 255, 0.3)",
    "selection-fg": "#00ffff",

    "overlay-heavy": "rgba(0, 0, 0, 0.8)",
    "overlay-medium": "rgba(0, 0, 0, 0.6)",
    "overlay-light": "rgba(0, 0, 0, 0.3)",
    "overlay-lightest": "rgba(0, 0, 0, 0.15)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)",
    secondary: "linear-gradient(135deg, #ff00ff 0%, #ff6600 100%)",
    accent: "linear-gradient(135deg, #ff6600 0%, #ffff00 100%)",
    hero: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    card: "linear-gradient(180deg, rgba(18, 18, 31, 0.8) 0%, rgba(26, 26, 46, 0.9) 100%)",
    surface: "linear-gradient(180deg, #12121f 0%, #0a0a0f 100%)",
    "surface-raised": "linear-gradient(180deg, #1a1a2e 0%, #12121f 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(0, 255, 255, 0.3) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(255, 0, 255, 0.3) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(255, 102, 0, 0.3) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #00ffff, #ff00ff, #ff6600, #00ffff)",
    "conic-2": "conic-gradient(from 180deg, #ff00ff, #ff6600, #00ffff, #ff00ff)",
    "radial-1": "radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Rajdhani', 'Orbitron', sans-serif",
    "font-heading": "'Orbitron', 'Rajdhani', sans-serif",
    "font-display": "'Orbitron', 'Rajdhani', sans-serif",
    "font-mono": "'Share Tech Mono', 'Courier New', monospace",
    "font-serif": "'Rajdhani', sans-serif",

    "tracking-wide": "0.05em",
    "tracking-wider": "0.1em",
    "tracking-widest": "0.2em",
  },

  shadows: {
    ...baseTheme.shadows,
    "shadow-card": "0 0 15px rgba(0, 255, 255, 0.2)",
    "shadow-dropdown": "0 0 30px rgba(0, 255, 255, 0.3)",
    "shadow-modal": "0 0 50px rgba(0, 255, 255, 0.4)",
    "shadow-glow-sm": "0 0 10px rgba(0, 255, 255, 0.4)",
    "shadow-glow-md": "0 0 20px rgba(0, 255, 255, 0.5)",
    "shadow-glow-lg": "0 0 30px rgba(0, 255, 255, 0.6)",
    "shadow-glow-xl": "0 0 40px rgba(0, 255, 255, 0.7)",
    "shadow-glow-primary": "0 0 20px rgba(0, 255, 255, 0.6)",
    "shadow-glow-accent": "0 0 20px rgba(255, 0, 255, 0.6)",
    "shadow-colored-sm": "0 4px 15px rgba(0, 255, 255, 0.3)",
    "shadow-colored-md": "0 8px 25px rgba(0, 255, 255, 0.4)",
    "shadow-colored-lg": "0 16px 40px rgba(0, 255, 255, 0.5)",
  },

  glass: {
    "glass-bg": "rgba(10, 10, 15, 0.7)",
    "glass-bg-heavy": "rgba(10, 10, 15, 0.85)",
    "glass-bg-light": "rgba(10, 10, 15, 0.5)",
    "glass-border": "rgba(0, 255, 255, 0.3)",
    "glass-shadow": "0 0 30px rgba(0, 255, 255, 0.2)",
    "glass-blur": "16px",
    "glass-saturation": "200%",
  },

  animationPreset: "glitch",
  motionIntensity: "increased",

  motion: {
    ...baseTheme.motion,
    "ease-spring": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    "ease-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  particles: {
    enabled: true,
    count: 80,
    type: "lines",
    color: "#00ffff",
    opacity: 0.4,
    size: { min: 1, max: 2 },
    speed: { min: 0.3, max: 1.2 },
    direction: 90,
    spread: 180,
    lifetime: 4000,
    blendMode: "screen",
  },

  noise: {
    intensity: 0.1,
    opacity: 0.08,
    size: 150,
    blendMode: "overlay",
    type: "static",
  },

  background: {
    ...baseTheme.background,
    color: "#0a0a0f",
    "color-subtle": "#0f0f1a",
    gradient: "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 100%)",
    "gradient-radial": "radial-gradient(circle at center, #12121f 0%, #0a0a0f 100%)",
    "gradient-mesh": "radial-gradient(at 0% 0%, rgba(0, 255, 255, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 0, 255, 0.3) 0px, transparent 50%)",
  },

  foreground: {
    color: "#e0e0ff",
    "color-subtle": "#a0a0cc",
    "color-muted": "#6060aa",
    "color-disabled": "#404066",
  },

  surface: {
    color: "#12121f",
    "color-raised": "#1a1a2e",
    "color-overlay": "#1f1f33",
    "color-sunken": "#0a0a0f",
    "color-inset": "#0d0d15",
    "color-hover": "#1a1a2e",
    "color-active": "#222238",
    border: "#333355",
    "border-subtle": "#222244",
    shadow: "0 0 15px rgba(0, 255, 255, 0.2)",
    "backdrop-filter": "blur(16px) saturate(200%)",
  },

  border: {
    ...baseTheme.border,
    color: "#333355",
    "color-strong": "#444466",
    "color-subtle": "#222244",
    "color-muted": "#1a1a33",
    "color-focus": "#00ffff",
    "color-disabled": "#222233",
    "radius": "0.25rem",
  },

  buttonStyle: {
    ...baseTheme.buttonStyle,
    "radius": "0.125rem",
    "padding-x": "1.5rem",
    "padding-y": "0.625rem",
    "font-weight": "600",
    "transition": "all 150ms ease",
    "shadow": "0 0 10px rgba(0, 255, 255, 0.3)",
    "shadow-hover": "0 0 20px rgba(0, 255, 255, 0.5)",
    "transform-hover": "translateY(-2px)",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "0.125rem",
    "background": "rgba(18, 18, 31, 0.8)",
    "border": "1px solid rgba(0, 255, 255, 0.3)",
    "shadow": "0 0 15px rgba(0, 255, 255, 0.2)",
    "shadow-hover": "0 0 25px rgba(0, 255, 255, 0.4)",
    "backdrop-filter": "blur(16px) saturate(200%)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "0.125rem",
    "background": "rgba(10, 10, 15, 0.8)",
    "border": "1px solid rgba(0, 255, 255, 0.3)",
    "border-focus": "2px solid #00ffff",
    "shadow-focus": "0 0 15px rgba(0, 255, 255, 0.3)",
    "placeholder-color": "#6060aa",
  },

  selectionStyle: {
    bg: "rgba(0, 255, 255, 0.3)",
    fg: "#00ffff",
  },

  focusStyle: {
    ...baseTheme.focusStyle,
    "ring-color": "#00ffff",
  },

  isDark: true,
});

export default cyberpunkTheme;
