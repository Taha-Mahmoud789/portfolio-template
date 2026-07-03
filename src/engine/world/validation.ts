/**
 * World Validator
 *
 * Validates world definitions against required fields and constraints.
 */

import type { WorldDefinition, WorldValidationResult, WorldId } from "./types";
import { ALL_THEME_IDS } from "@/engine/theme/constants";

const VALID_WORLD_IDS: readonly string[] = [
  "apple-world",
  "cyberpunk-world",
  "space-world",
  "gaming-world",
  "ai-world",
  "editorial-world",
  "liquid-world",
  "brutalist-world",
  "retro-world",
  "experimental-world",
] as const;

const VALID_STATUSES = new Set(["active", "coming-soon", "disabled", "maintenance"]);
const VALID_LAYOUTS = new Set([
  "centered",
  "sidebar",
  "split",
  "fullscreen",
  "immersive",
  "bento",
  "dashboard",
  "custom",
]);
const VALID_ANIMATION_PRESETS = new Set([
  "fade",
  "slide",
  "scale",
  "rotate",
  "morph",
  "glitch",
  "bloom",
  "wave",
  "cinematic",
  "none",
]);
const VALID_TRANSITION_PRESETS = new Set([
  "zoom-in",
  "slide-up",
  "morph-expand",
  "dissolve",
  "iris",
  "page-turn",
  "particle-burst",
  "crossfade",
  "none",
]);
const VALID_BACKGROUND_TYPES = new Set([
  "gradient",
  "image",
  "video",
  "mesh",
  "particle",
  "canvas",
  "three",
  "none",
]);

export function validateWorld(world: Partial<WorldDefinition>): WorldValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!world.id) {
    errors.push("World id is required");
  } else if (!VALID_WORLD_IDS.includes(world.id)) {
    warnings.push(`World id "${world.id}" is not in the standard world IDs list`);
  }

  if (!world.slug) {
    errors.push("World slug is required");
  }

  if (!world.name) {
    errors.push("World name is required");
  }

  if (!world.description) {
    errors.push("World description is required");
  }

  if (!world.theme) {
    errors.push("World theme is required");
  } else if (!ALL_THEME_IDS.includes(world.theme)) {
    errors.push(`Invalid theme id "${world.theme}"`);
  }

  if (!world.layout) {
    warnings.push("World layout is not defined, using default");
  } else if (!VALID_LAYOUTS.has(world.layout.type)) {
    errors.push(`Invalid layout type "${world.layout.type}"`);
  }

  if (world.animationPreset && !VALID_ANIMATION_PRESETS.has(world.animationPreset)) {
    errors.push(`Invalid animation preset "${world.animationPreset}"`);
  }

  if (world.transitionPreset && !VALID_TRANSITION_PRESETS.has(world.transitionPreset)) {
    errors.push(`Invalid transition preset "${world.transitionPreset}"`);
  }

  if (world.background && !VALID_BACKGROUND_TYPES.has(world.background.type)) {
    errors.push(`Invalid background type "${world.background.type}"`);
  }

  if (world.status && !VALID_STATUSES.has(world.status)) {
    errors.push(`Invalid status "${world.status}"`);
  }

  if (!world.metadata) {
    warnings.push("World metadata is not defined");
  } else {
    if (!world.metadata.author) {
      warnings.push("World metadata.author is missing");
    }
    if (!world.metadata.version) {
      warnings.push("World metadata.version is missing");
    }
  }

  if (!world.assets) {
    warnings.push("World assets are not defined");
  }

  if (!world.entrySequence) {
    warnings.push("World entry sequence is not defined");
  }

  if (!world.exitSequence) {
    warnings.push("World exit sequence is not defined");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateWorlds(worlds: Partial<WorldDefinition>[]): WorldValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();

  for (let i = 0; i < worlds.length; i++) {
    const world = worlds[i];
    if (!world) continue;
    const result = validateWorld(world);
    const prefix = `World[${String(i)}]`;

    for (const error of result.errors) {
      errors.push(`${prefix}: ${error}`);
    }
    for (const warning of result.warnings) {
      warnings.push(`${prefix}: ${warning}`);
    }

    if (worlds[i]?.id) {
      const worldId = worlds[i]!.id!;
      if (ids.has(worldId)) {
        errors.push(`${prefix}: Duplicate world id "${worldId}"`);
      }
      ids.add(worldId);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function isValidWorldId(id: string): id is WorldId {
  return VALID_WORLD_IDS.includes(id);
}

export function isValidWorldStatus(status: string): boolean {
  return VALID_STATUSES.has(status);
}

export function isValidAnimationPreset(preset: string): boolean {
  return VALID_ANIMATION_PRESETS.has(preset);
}

export function isValidTransitionPreset(preset: string): boolean {
  return VALID_TRANSITION_PRESETS.has(preset);
}
