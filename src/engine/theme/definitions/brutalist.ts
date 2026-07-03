import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const brutalistTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "brutalist",
  name: "Brutalist",
  description: "Raw, unpolished design with bold typography and stark contrasts",
  category: "raw",
  thumbnail: "/icons/themes/brutalist.svg",
  tags: ["brutalist", "raw", "bold", "minimal"],

  colors: {
    ...baseTheme.colors,
    primary: "#000000",
    "primary-hover": "#333333",
    "primary-active": "#1a1a1a",
    "primary-subtle": "rgba(0, 0, 0, 0.05)",
    "primary-muted": "rgba(0, 0, 0, 0.1)",

    secondary: "#ffffff",
    "secondary-foreground": "#000000",
    "secondary-hover": "#f5f5f5",
    "secondary-active": "#e5e5e5",
    "secondary-subtle": "rgba(255, 255, 255, 0.1)",
    "secondary-muted": "rgba(255, 255, 255, 0.15)",

    accent: "#ff0000",
    "accent-hover": "#cc0000",
    "accent-active": "#990000",
    "accent-subtle": "rgba(255, 0, 0, 0.1)",

    destructive: "#ff0000",
    "destructive-hover": "#dc2626",
    "destructive-subtle": "#fef2f2",

    background: "#ffffff",
    "background-subtle": "#f5f5f5",
    "background-muted": "#e5e5e5",

    foreground: "#000000",
    "foreground-subtle": "#333333",
    "foreground-muted": "#666666",
    "foreground-disabled": "#999999",

    "surface-overlay": "#ffffff",
    "surface-sunken": "#f5f5f5",
    "surface-inset": "#e5e5e5",
    "surface-hover": "#f5f5f5",
    "surface-active": "#e5e5e5",

    border: "#000000",
    "border-strong": "#000000",
    "border-subtle": "#333333",
    "border-muted": "#666666",
    "border-focus": "#000000",
    "border-disabled": "#cccccc",

    success: "#000000",
    "success-subtle": "rgba(0, 0, 0, 0.05)",

    warning: "#000000",
    "warning-subtle": "rgba(0, 0, 0, 0.05)",

    error: "#ff0000",
    "error-subtle": "rgba(255, 0, 0, 0.1)",

    info: "#000000",
    "info-subtle": "rgba(0, 0, 0, 0.05)",

    "focus-ring": "#000000",
    "hover-overlay": "rgba(0, 0, 0, 0.05)",
    "active-overlay": "rgba(0, 0, 0, 0.1)",
    "disabled-bg": "#f5f5f5",
    "disabled-fg": "#999999",
    "disabled-border": "#cccccc",

    "selection-bg": "#000000",
    "selection-fg": "#ffffff",

    "overlay-heavy": "rgba(0, 0, 0, 0.9)",
    "overlay-medium": "rgba(0, 0, 0, 0.7)",
    "overlay-light": "rgba(0, 0, 0, 0.4)",
    "overlay-lightest": "rgba(0, 0, 0, 0.2)",
  },

  gradients: {
    ...baseTheme.gradients,
    primary: "linear-gradient(135deg, #000000 0%, #333333 100%)",
    secondary: "linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)",
    accent: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
    hero: "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
    card: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
    surface: "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
    "mesh-1": "radial-gradient(at 0% 0%, rgba(0, 0, 0, 0.08) 0px, transparent 50%)",
    "mesh-2": "radial-gradient(at 100% 0%, rgba(255, 0, 0, 0.05) 0px, transparent 50%)",
    "mesh-3": "radial-gradient(at 50% 100%, rgba(0, 0, 0, 0.03) 0px, transparent 50%)",
    "conic-1": "conic-gradient(from 0deg, #000000, #ffffff, #ff0000, #000000)",
    "conic-2": "conic-gradient(from 180deg, #ffffff, #ff0000, #000000, #ffffff)",
    "radial-1": "radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)",
    "radial-2": "radial-gradient(circle, rgba(255, 0, 0, 0.05) 0%, transparent 70%)",
  },

  typography: {
    ...baseTheme.typography,
    "font-sans": "'Space Mono', 'Courier New', monospace",
    "font-heading": "'Anton', 'Impact', sans-serif",
    "font-display": "'Anton', 'Impact', sans-serif",
    "font-mono": "'Courier Prime', 'Courier New', monospace",
    "font-serif": "'Space Mono', 'Courier New', monospace",

    "tracking-tight": "-0.05em",
    "tracking-tighter": "-0.08em",
    "tracking-normal": "0em",
    "tracking-wide": "0.05em",
    "tracking-wider": "0.1em",
    "tracking-widest": "0.2em",
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
    "shadow-inner": "none",
    "shadow-card": "none",
    "shadow-dropdown": "none",
    "shadow-modal": "none",
    "shadow-popover": "none",
    "shadow-toast": "none",
    "shadow-tooltip": "none",
    "shadow-sticky": "none",
    "shadow-glow-sm": "none",
    "shadow-glow-md": "none",
    "shadow-glow-lg": "none",
    "shadow-glow-xl": "none",
    "shadow-glow-primary": "none",
    "shadow-glow-accent": "none",
    "shadow-colored-sm": "none",
    "shadow-colored-md": "none",
    "shadow-colored-lg": "none",
  },

  glass: {
    "glass-bg": "rgba(255, 255, 255, 0.95)",
    "glass-bg-heavy": "rgba(255, 255, 255, 1)",
    "glass-bg-light": "rgba(255, 255, 255, 0.9)",
    "glass-border": "rgba(0, 0, 0, 1)",
    "glass-shadow": "none",
    "glass-blur": "0px",
    "glass-saturation": "100%",
  },

  animationPreset: "mechanical",
  motionIntensity: "reduced",

  motion: {
    ...baseTheme.motion,
    "ease-spring": "linear",
    "ease-bounce": "linear",
    "ease-elastic": "linear",
  },

  particles: {
    enabled: false,
    count: 0,
    type: "dots",
    color: "#000000",
    opacity: 0.5,
    size: { min: 2, max: 2 },
    speed: { min: 0, max: 0 },
    direction: 0,
    spread: 0,
    lifetime: 0,
    blendMode: "normal",
  },

  noise: {
    intensity: 0.2,
    opacity: 0.15,
    size: 50,
    blendMode: "multiply",
    type: "grain",
  },

  background: {
    ...baseTheme.background,
    color: "#ffffff",
    "color-subtle": "#f5f5f5",
    gradient: "none",
    "gradient-radial": "none",
    "gradient-mesh": "none",
    "gradient-conic": "none",
    pattern: "repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.03) 0px, rgba(0, 0, 0, 0.03) 1px, transparent 1px, transparent 20px)",
    "pattern-opacity": 1,
  },

  foreground: {
    color: "#000000",
    "color-subtle": "#333333",
    "color-muted": "#666666",
    "color-disabled": "#999999",
  },

  surface: {
    color: "#ffffff",
    "color-raised": "#ffffff",
    "color-overlay": "#ffffff",
    "color-sunken": "#f5f5f5",
    "color-inset": "#e5e5e5",
    "color-hover": "#f5f5f5",
    "color-active": "#e5e5e5",
    border: "#000000",
    "border-subtle": "#333333",
    shadow: "none",
    "backdrop-filter": "blur(0px)",
  },

  border: {
    ...baseTheme.border,
    color: "#000000",
    "color-strong": "#000000",
    "color-subtle": "#333333",
    "color-muted": "#666666",
    "color-focus": "#000000",
    "color-disabled": "#cccccc",
    width: "3px",
    "width-medium": "3px",
    "width-thick": "6px",
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
    "padding-y": "0.75rem",
    "font-size": "1rem",
    "font-weight": "700",
    "transition": "all 100ms linear",
    "shadow": "none",
    "shadow-hover": "none",
    "transform-hover": "none",
  },

  cardStyle: {
    ...baseTheme.cardStyle,
    "radius": "0px",
    "border": "3px solid #000000",
    "shadow": "none",
    "shadow-hover": "none",
    "transition": "none",
    "transform-hover": "none",
    "backdrop-filter": "blur(0px)",
  },

  inputStyle: {
    ...baseTheme.inputStyle,
    "radius": "0px",
    "padding-x": "1rem",
    "padding-y": "0.75rem",
    "font-size": "1rem",
    "background": "#ffffff",
    "border": "3px solid #000000",
    "border-focus": "3px solid #000000",
    "shadow-focus": "none",
    "placeholder-color": "#666666",
  },

  scrollbarStyle: {
    width: "16px",
    height: "16px",
    "track-bg": "#ffffff",
    "thumb-bg": "#000000",
    "thumb-bg-hover": "#333333",
    "thumb-radius": "0px",
    "thumb-border": "3px solid #ffffff",
  },

  selectionStyle: {
    bg: "#000000",
    fg: "#ffffff",
  },

  focusStyle: {
    ...baseTheme.focusStyle,
    "ring-color": "#000000",
    "ring-width": "3px",
    "ring-offset": "0px",
  },

  isDark: false,
  isHighContrast: true,
});

export default brutalistTheme;
