/**
 * World Registration Helper
 *
 * Simplified interface for registering worlds with the World Engine.
 * Handles validation, registration, and optional preloading.
 */

import type {
  WorldDefinition,
  WorldId,
  WorldAssets,
  WorldModuleLoader,
} from "@/engine/world/types";
import type { WorldRegistrationOptions } from "./types";
import type { WorldManager } from "@/engine/world/manager";

// ============================================================================
// registerWorld — register a single world
// ============================================================================

export function registerWorld(
  manager: WorldManager,
  definition: WorldDefinition,
  loader?: WorldModuleLoader,
  assets?: WorldAssets,
  options?: WorldRegistrationOptions,
): void {
  const { validate = true, override = false } = options ?? {};

  if (validate) {
    const existing = manager.getWorld(definition.id);
    if (existing && !override) {
      throw new Error(
        `World "${definition.id}" is already registered. Use override: true to replace.`,
      );
    }
  }

  if (override) {
    const existing = manager.getWorld(definition.id);
    if (existing) {
      manager.unregister(definition.id);
    }
  }

  manager.register(definition, loader, assets);
}

// ============================================================================
// registerWorlds — register multiple worlds
// ============================================================================

export function registerWorlds(
  manager: WorldManager,
  definitions: WorldDefinition[],
  loaders?: Map<WorldId, WorldModuleLoader>,
  assets?: Map<WorldId, WorldAssets>,
  options?: WorldRegistrationOptions,
): void {
  for (const definition of definitions) {
    registerWorld(
      manager,
      definition,
      loaders?.get(definition.id),
      assets?.get(definition.id),
      options,
    );
  }
}

// ============================================================================
// unregisterWorld — safely unregister a world
// ============================================================================

export function unregisterWorld(manager: WorldManager, worldId: WorldId): boolean {
  const existing = manager.getWorld(worldId);
  if (!existing) {
    return false;
  }

  manager.unregister(worldId);
  return true;
}
