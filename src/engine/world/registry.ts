/**
 * World Registry
 *
 * Central registry for world definitions. Provides registration,
 * lookup, query, and ordering capabilities.
 */

import type { WorldDefinition, WorldId, WorldRegistryEntry, WorldRegistryConfig } from "./types";
import { WORLD_REGISTRY_DEFAULTS } from "./constants";
import { validateWorld } from "./validation";

export class WorldRegistry {
  private entries = new Map<WorldId, WorldRegistryEntry>();
  private config: WorldRegistryConfig;
  private indexCounter = 0;
  private sortedCache: WorldDefinition[] | null = null;

  constructor(config?: Partial<WorldRegistryConfig>) {
    this.config = { ...WORLD_REGISTRY_DEFAULTS, ...config };
  }

  register(definition: WorldDefinition): void {
    if (this.config.enableValidation) {
      const result = validateWorld(definition);
      if (!result.valid) {
        throw new Error(`Invalid world definition: ${result.errors.join(", ")}`);
      }
    }

    if (this.entries.has(definition.id) && !this.config.allowOverride) {
      throw new Error(`World "${definition.id}" is already registered`);
    }

    if (this.entries.size >= this.config.maxWorlds) {
      throw new Error(`Maximum number of worlds (${String(this.config.maxWorlds)}) reached`);
    }

    this.entries.set(definition.id, {
      definition,
      registeredAt: Date.now(),
      index: this.indexCounter++,
    });

    this.sortedCache = null;
  }

  registerAll(definitions: WorldDefinition[]): void {
    for (const definition of definitions) {
      this.register(definition);
    }
  }

  get(worldId: WorldId): WorldDefinition | undefined {
    return this.entries.get(worldId)?.definition;
  }

  getEntry(worldId: WorldId): WorldRegistryEntry | undefined {
    return this.entries.get(worldId);
  }

  getAll(): WorldDefinition[] {
    this.sortedCache ??= Array.from(this.entries.values())
      .sort((a, b) => a.index - b.index)
      .map((entry) => entry.definition);
    return this.sortedCache;
  }

  getByStatus(status: WorldDefinition["status"]): WorldDefinition[] {
    return this.getAll().filter((w) => w.status === status);
  }

  getByTheme(themeId: string): WorldDefinition[] {
    return this.getAll().filter((w) => w.theme === themeId);
  }

  getByCategory(category: string): WorldDefinition[] {
    return this.getAll().filter((w) => w.metadata.category === category);
  }

  search(query: string): WorldDefinition[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(
      (w) =>
        w.name.toLowerCase().includes(lower) ||
        w.description.toLowerCase().includes(lower) ||
        w.metadata.tags.some((t) => t.toLowerCase().includes(lower)),
    );
  }

  has(worldId: WorldId): boolean {
    return this.entries.has(worldId);
  }

  remove(worldId: WorldId): boolean {
    const existed = this.entries.delete(worldId);
    if (existed) {
      this.sortedCache = null;
    }
    return existed;
  }

  clear(): void {
    this.entries.clear();
    this.sortedCache = null;
    this.indexCounter = 0;
  }

  get size(): number {
    return this.entries.size;
  }

  getIds(): WorldId[] {
    return Array.from(this.entries.keys());
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    for (const entry of this.entries.values()) {
      categories.add(entry.definition.metadata.category);
    }
    return Array.from(categories);
  }
}
