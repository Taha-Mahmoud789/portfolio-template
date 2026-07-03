/**
 * Theme Registry
 *
 * Central registry for all theme definitions.
 * Manages theme registration, lookup, and lazy loading.
 */

import type {
  ThemeId,
  ThemeDefinition,
  ThemeCategory,
  ThemeRegistryEntry,
  ThemeRegistryConfig,
} from "./types";
import { THEME_REGISTRY_DEFAULTS } from "./constants";

class ThemeRegistryImpl {
  private registry = new Map<ThemeId, ThemeRegistryEntry>();
  private config: ThemeRegistryConfig;
  private listeners = new Set<(themeId: ThemeId) => void>();

  constructor(config: Partial<ThemeRegistryConfig> = {}) {
    this.config = { ...THEME_REGISTRY_DEFAULTS, ...config };
  }

  /**
   * Register a theme definition in the registry.
   */
  register(theme: ThemeDefinition, lazy = false): void {
    this.registry.set(theme.id, {
      id: theme.id,
      definition: theme,
      loaded: !lazy,
    });
  }

  /**
   * Register multiple themes at once.
   */
  registerAll(themes: ThemeDefinition[], lazy = false): void {
    for (const theme of themes) {
      this.register(theme, lazy);
    }
  }

  /**
   * Get a theme definition by ID.
   */
  get(themeId: ThemeId): ThemeDefinition | undefined {
    const entry = this.registry.get(themeId);
    return entry?.definition;
  }

  /**
   * Get a theme definition, throwing if not found.
   */
  getOrThrow(themeId: ThemeId): ThemeDefinition {
    const theme = this.get(themeId);
    if (!theme) {
      throw new Error(`Theme "${themeId}" not found in registry`);
    }
    return theme;
  }

  /**
   * Check if a theme is registered.
   */
  has(themeId: ThemeId): boolean {
    return this.registry.has(themeId);
  }

  /**
   * Check if a theme is loaded (not lazy or already loaded).
   */
  isLoaded(themeId: ThemeId): boolean {
    const entry = this.registry.get(themeId);
    return entry?.loaded ?? false;
  }

  /**
   * Mark a theme as loaded.
   */
  markLoaded(themeId: ThemeId): void {
    const entry = this.registry.get(themeId);
    if (entry) {
      entry.loaded = true;
      this.notifyListeners(themeId);
    }
  }

  /**
   * Get all registered theme IDs.
   */
  getIds(): ThemeId[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get all loaded theme IDs.
   */
  getLoadedIds(): ThemeId[] {
    return Array.from(this.registry.entries())
      .filter(([, entry]) => entry.loaded)
      .map(([id]) => id);
  }

  /**
   * Get all themes in a specific category.
   */
  getByCategory(category: ThemeCategory): ThemeDefinition[] {
    return Array.from(this.registry.values())
      .filter((entry) => entry.definition.category === category)
      .map((entry) => entry.definition);
  }

  /**
   * Get all loaded theme definitions.
   */
  getLoadedThemes(): ThemeDefinition[] {
    return Array.from(this.registry.values())
      .filter((entry) => entry.loaded)
      .map((entry) => entry.definition);
  }

  /**
   * Get all registered theme definitions.
   */
  getAllThemes(): ThemeDefinition[] {
    return Array.from(this.registry.values()).map((entry) => entry.definition);
  }

  /**
   * Get the default theme.
   */
  getDefaultTheme(): ThemeDefinition {
    return this.getOrThrow(this.config.defaultTheme);
  }

  /**
   * Get the fallback theme.
   */
  getFallbackTheme(): ThemeDefinition {
    return this.getOrThrow(this.config.fallbackTheme);
  }

  /**
   * Get registry configuration.
   */
  getConfig(): ThemeRegistryConfig {
    return { ...this.config };
  }

  /**
   * Update registry configuration.
   */
  updateConfig(config: Partial<ThemeRegistryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Subscribe to theme load events.
   */
  onThemeLoaded(listener: (themeId: ThemeId) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify listeners that a theme has been loaded.
   */
  private notifyListeners(themeId: ThemeId): void {
    for (const listener of this.listeners) {
      listener(themeId);
    }
  }

  /**
   * Get the registry entry for a theme.
   */
  getEntry(themeId: ThemeId): ThemeRegistryEntry | undefined {
    return this.registry.get(themeId);
  }

  /**
   * Get all entries.
   */
  getEntries(): ThemeRegistryEntry[] {
    return Array.from(this.registry.values());
  }

  /**
   * Clear the registry.
   */
  clear(): void {
    this.registry.clear();
    this.listeners.clear();
  }

  /**
   * Get the number of registered themes.
   */
  get size(): number {
    return this.registry.size;
  }

  /**
   * Get the number of loaded themes.
   */
  get loadedCount(): number {
    return Array.from(this.registry.values()).filter((e) => e.loaded).length;
  }
}

// Singleton instance
export const ThemeRegistry = new ThemeRegistryImpl();

// Factory function for creating custom registries
export function createThemeRegistry(config?: Partial<ThemeRegistryConfig>): ThemeRegistryImpl {
  return new ThemeRegistryImpl(config);
}
