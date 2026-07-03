/**
 * World Factory
 *
 * Generates complete world scaffolding from a simplified SDK config.
 * Produces a WorldDefinition, WorldContract, and module loader.
 */

import type { ComponentType } from "react";
import type { ThemeId } from "@/engine/theme/types";
import type {
  WorldDefinition,
  WorldLayoutConfig,
  WorldAssets,
  WorldSequence,
  WorldBackground,
} from "@/engine/world/types";
import type {
  WorldSDKConfig,
  WorldFactoryOptions,
  WorldFactoryResult,
  WorldContract,
} from "./types";
import { WORLD_SDK_DEFAULTS, THEME_WORLD_MAP, WORLD_ROUTE_PREFIX } from "./constants";
import { validateWorldSDKConfig } from "./validation";

// ============================================================================
// Derive values from config
// ============================================================================

function deriveSlug(id: string): string {
  return id.replace("-world", "");
}

function deriveRoute(id: string): string {
  return `${WORLD_ROUTE_PREFIX}/${deriveSlug(id)}`;
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

function deriveBackground(theme: ThemeId, override?: Partial<WorldBackground>): WorldBackground {
  const themeDefaults = THEME_WORLD_MAP[theme];
  const themeBg = themeDefaults.background;
  const defaults = WORLD_SDK_DEFAULTS.background;
  const base: WorldBackground = {
    type: themeBg?.type ?? defaults.type,
    value: themeBg?.value ?? defaults.value,
    fallbackColor: themeBg?.fallbackColor ?? defaults.fallbackColor,
    overlay: themeBg?.overlay ?? defaults.overlay,
    parallax: themeBg?.parallax ?? defaults.parallax,
  };
  return {
    type: override?.type ?? base.type,
    value: override?.value ?? base.value,
    fallbackColor: override?.fallbackColor ?? base.fallbackColor,
    overlay: override?.overlay ?? base.overlay,
    parallax: override?.parallax ?? base.parallax,
  };
}

function deriveLayout(override?: WorldLayoutConfig): WorldLayoutConfig {
  return {
    ...WORLD_SDK_DEFAULTS.layout,
    ...override,
  };
}

// ============================================================================
// createWorld — main factory function
// ============================================================================

export function createWorld(options: WorldFactoryOptions): WorldFactoryResult {
  const { config, validate = true } = options;

  if (validate) {
    const result = validateWorldSDKConfig(config);
    if (!result.valid) {
      const errorMessages = result.errors.map((e) => `${e.field}: ${e.message}`).join("\n");
      throw new Error(`World SDK config validation failed:\n${errorMessages}`);
    }
  }

  const slug = config.slug ?? deriveSlug(config.id);
  const route = config.route ?? deriveRoute(config.id);
  const background = deriveBackground(config.theme, config.background);
  const layout = deriveLayout(config.layout);

  const definition: WorldDefinition = {
    id: config.id,
    slug,
    name: config.name,
    description: config.description,
    theme: config.theme,
    layout,
    animationPreset: config.animationPreset ?? WORLD_SDK_DEFAULTS.animationPreset,
    transitionPreset: config.transitionPreset ?? WORLD_SDK_DEFAULTS.transitionPreset,
    background,
    entrySequence: deriveDefaultSequence(),
    exitSequence: deriveDefaultSequence(),
    assets: deriveDefaultAssets(),
    status: config.status ?? "active",
    permissions: {
      ...WORLD_SDK_DEFAULTS.permissions,
      ...config.permissions,
    },
    metadata: {
      author: config.metadata?.author ?? "Frontend Multiverse",
      version: config.metadata?.version ?? "1.0.0",
      createdAt: config.metadata?.createdAt ?? new Date().toISOString().split("T")[0] ?? "",
      updatedAt: config.metadata?.updatedAt,
      tags: config.metadata?.tags ?? [],
      category: config.metadata?.category ?? "general",
      featured: config.metadata?.featured ?? false,
      thumbnail: config.metadata?.thumbnail,
      icon: config.metadata?.icon,
    },
  };

  const contract: WorldContract = {
    ...definition,
    route,
    components: {
      root: config.components?.root ?? EmptyComponent,
      layout: config.components?.layout,
      notFound: config.components?.notFound,
      error: config.components?.error,
    },
    routes: config.routes ?? [],
  };

  const moduleLoader = (): Promise<{ default: ComponentType }> =>
    Promise.resolve({ default: config.components?.root ?? EmptyComponent });

  return {
    definition,
    contract,
    moduleLoader,
  };
}

// ============================================================================
// createWorlds — batch factory
// ============================================================================

export function createWorlds(
  configs: WorldSDKConfig[],
  options?: Omit<WorldFactoryOptions, "config">,
): WorldFactoryResult[] {
  return configs.map((config) => createWorld({ ...options, config }));
}

// ============================================================================
// Placeholder component
// ============================================================================

function EmptyComponent() {
  return null;
}
