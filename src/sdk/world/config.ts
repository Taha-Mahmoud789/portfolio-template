/**
 * World Configuration
 *
 * Default configurations and deep-merge utilities for world configs.
 */

import type {
  WorldDefinition,
  WorldBackground,
  WorldLayoutConfig,
  WorldSequence,
  WorldAssets,
} from "@/engine/world/types";
import type { WorldPermissions, WorldMetadata } from "@/engine/world/types";
import type { WorldSDKConfig } from "./types";
import { WORLD_SDK_DEFAULTS, THEME_WORLD_MAP } from "./constants";

// ============================================================================
// mergeWorldConfig — deep merge SDK configs
// ============================================================================

export function mergeWorldConfig(
  base: WorldSDKConfig,
  override: Partial<WorldSDKConfig>,
): WorldSDKConfig {
  return {
    ...base,
    ...override,
    background: mergeBackground(base.background, override.background),
    layout: mergeLayout(base.layout, override.layout),
    permissions: mergePermissions(base.permissions, override.permissions),
    metadata: mergeMetadata(base.metadata, override.metadata),
  };
}

// ============================================================================
// mergeWorldDefaults — apply theme defaults to a config
// ============================================================================

export function mergeWorldDefaults(config: WorldSDKConfig): WorldSDKConfig {
  const themeDefaults = THEME_WORLD_MAP[config.theme] ?? {};
  return mergeWorldConfig(
    {
      ...config,
      ...themeDefaults,
    },
    config,
  );
}

// ============================================================================
// buildWorldDefinition — create a full WorldDefinition from minimal input
// ============================================================================

export function buildWorldDefinition(config: WorldSDKConfig): WorldDefinition {
  const merged = mergeWorldDefaults(config);
  const slug = merged.slug ?? merged.id.replace("-world", "");

  return {
    id: merged.id,
    slug,
    name: merged.name,
    description: merged.description,
    theme: merged.theme,
    layout: merged.layout ?? WORLD_SDK_DEFAULTS.layout,
    animationPreset: merged.animationPreset ?? WORLD_SDK_DEFAULTS.animationPreset,
    transitionPreset: merged.transitionPreset ?? WORLD_SDK_DEFAULTS.transitionPreset,
    background: mergeBackground(undefined, merged.background),
    entrySequence: deriveDefaultSequence(),
    exitSequence: deriveDefaultSequence(),
    assets: deriveDefaultAssets(),
    status: merged.status ?? "active",
    permissions: {
      ...WORLD_SDK_DEFAULTS.permissions,
      ...merged.permissions,
    },
    metadata: {
      author: merged.metadata?.author ?? "Frontend Multiverse",
      version: merged.metadata?.version ?? "1.0.0",
      createdAt: merged.metadata?.createdAt ?? new Date().toISOString().split("T")[0] ?? "",
      updatedAt: merged.metadata?.updatedAt,
      tags: merged.metadata?.tags ?? [],
      category: merged.metadata?.category ?? "general",
      featured: merged.metadata?.featured ?? false,
      thumbnail: merged.metadata?.thumbnail,
      icon: merged.metadata?.icon,
    },
  };
}

// ============================================================================
// Private merge helpers
// ============================================================================

function mergeBackground(
  base?: Partial<WorldBackground>,
  override?: Partial<WorldBackground>,
): WorldBackground {
  const defaults = WORLD_SDK_DEFAULTS.background;
  const b = base ?? {};
  const o = override ?? {};
  return {
    type: o.type ?? b.type ?? defaults.type,
    value: o.value ?? b.value ?? defaults.value,
    fallbackColor: o.fallbackColor ?? b.fallbackColor ?? defaults.fallbackColor,
    overlay: o.overlay ?? b.overlay ?? defaults.overlay,
    parallax: o.parallax ?? b.parallax ?? defaults.parallax,
  };
}

function mergeLayout(
  base?: WorldLayoutConfig,
  override?: Partial<WorldLayoutConfig>,
): WorldLayoutConfig {
  return {
    ...WORLD_SDK_DEFAULTS.layout,
    ...base,
    ...override,
  };
}

function mergePermissions(
  base?: Partial<WorldPermissions>,
  override?: Partial<WorldPermissions>,
): WorldPermissions {
  return {
    ...WORLD_SDK_DEFAULTS.permissions,
    ...base,
    ...override,
  };
}

function mergeMetadata(
  base?: Partial<WorldMetadata & { category: string; featured: boolean }>,
  override?: Partial<WorldMetadata & { category: string; featured: boolean }>,
): Partial<WorldMetadata & { category: string; featured: boolean }> {
  return {
    ...base,
    ...override,
  };
}

function deriveDefaultSequence(): WorldSequence {
  return {
    steps: [
      {
        id: "fade-in",
        type: "fade",
        from: { opacity: 0 },
        to: { opacity: 1 },
        duration: 500,
        delay: 0,
      },
    ],
    duration: 500,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    interruptible: true,
  };
}

function deriveDefaultAssets(): WorldAssets {
  return {
    images: [],
    fonts: [],
    scripts: [],
    styles: [],
    models: [],
    audio: [],
    video: [],
  };
}
