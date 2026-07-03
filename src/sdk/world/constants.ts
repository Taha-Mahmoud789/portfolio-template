/**
 * World SDK Constants
 *
 * Default values, presets, and configuration for the World SDK.
 */

import type { WorldDefaultConfig, WorldSDKConfig } from "./types";
import type { ThemeId } from "@/engine/theme/types";

// ============================================================================
// Default World Configuration
// ============================================================================

export const WORLD_SDK_DEFAULTS: WorldDefaultConfig = {
  layout: {
    type: "centered",
  },
  animationPreset: "fade",
  transitionPreset: "crossfade",
  background: {
    type: "gradient",
    value: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    fallbackColor: "#0a0a0a",
  },
  permissions: {
    requiresAuth: false,
    requiresConsent: false,
    allowedRoles: [],
    geoRestrictions: [],
  },
};

// ============================================================================
// Theme to World Mapping
// ============================================================================

export const THEME_WORLD_MAP: Record<ThemeId, Partial<WorldSDKConfig>> = {
  apple: {
    animationPreset: "fade",
    transitionPreset: "crossfade",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #fafafa 0%, #f5f5f7 100%)",
      fallbackColor: "#fafafa",
    },
  },
  cyberpunk: {
    animationPreset: "glitch",
    transitionPreset: "morph-expand",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)",
      fallbackColor: "#0a0015",
    },
  },
  space: {
    animationPreset: "bloom",
    transitionPreset: "iris",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #000011 0%, #000033 100%)",
      fallbackColor: "#000011",
    },
  },
  gaming: {
    animationPreset: "scale",
    transitionPreset: "zoom-in",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      fallbackColor: "#1a1a2e",
    },
  },
  ai: {
    animationPreset: "morph",
    transitionPreset: "dissolve",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)",
      fallbackColor: "#0a0a1a",
    },
  },
  editorial: {
    animationPreset: "slide",
    transitionPreset: "page-turn",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #fafaf9 0%, #f5f5f0 100%)",
      fallbackColor: "#fafaf9",
    },
  },
  liquid: {
    animationPreset: "wave",
    transitionPreset: "morph-expand",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      fallbackColor: "#e0f2fe",
    },
  },
  retro: {
    animationPreset: "scale",
    transitionPreset: "slide-up",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      fallbackColor: "#fef3c7",
    },
  },
  brutalist: {
    animationPreset: "none",
    transitionPreset: "none",
    background: {
      type: "none",
      value: "",
      fallbackColor: "#ffffff",
    },
  },
  experimental: {
    animationPreset: "cinematic",
    transitionPreset: "particle-burst",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #0a0a0a 0%, #2a0a3a 50%, #0a0a0a 100%)",
      fallbackColor: "#0a0a0a",
    },
  },
};

// ============================================================================
// Required Contract Fields
// ============================================================================

export const REQUIRED_CONTRACT_FIELDS: readonly string[] = [
  "id",
  "slug",
  "name",
  "description",
  "route",
  "theme",
  "layout",
  "animationPreset",
  "transitionPreset",
  "background",
  "entrySequence",
  "exitSequence",
  "assets",
  "status",
  "permissions",
  "metadata",
  "components",
] as const;

// ============================================================================
// SDK Metadata
// ============================================================================

export const SDK_VERSION = "1.0.0";

export const SDK_NAME = "Frontend Multiverse World SDK";

export const WORLD_ROUTE_PREFIX = "/worlds";
