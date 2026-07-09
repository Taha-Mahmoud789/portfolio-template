/**
 * Theme Loader
 *
 * Handles lazy loading, preloading, and caching of theme definitions.
 * Supports dynamic imports for code splitting.
 */

import type { ThemeId, ThemeDefinition, ThemeLoaderConfig, ThemeLoaderInterface } from "./types";
import { ThemeRegistry } from "./registry";
import { PERFORMANCE_CONFIG } from "./constants";

// Theme import map for lazy loading
const THEME_IMPORTS: Record<ThemeId, () => Promise<{ default: ThemeDefinition }>> = {
  apple: () => import("./definitions/apple"),
  cyberpunk: () => import("./definitions/cyberpunk"),
  space: () => import("./definitions/space"),
  gaming: () => import("./definitions/gaming"),
  ai: () => import("./definitions/ai"),
  editorial: () => import("./definitions/editorial"),
  liquid: () => import("./definitions/liquid"),
  retro: () => import("./definitions/retro"),
  brutalist: () => import("./definitions/brutalist"),
  experimental: () => import("./definitions/experimental"),
};

// Cache for loaded themes
const themeCache = new Map<ThemeId, ThemeDefinition>();

// Loading state tracking
const loadingPromises = new Map<ThemeId, Promise<ThemeDefinition>>();

class ThemeLoaderImpl implements ThemeLoaderInterface {
  private config: ThemeLoaderConfig;

  constructor(config?: Partial<ThemeLoaderConfig>) {
    this.config = {
      registry: ThemeRegistry.getConfig(),
      ...config,
    };
  }

  /**
   * Load a theme definition by ID.
   * Uses cache if available, otherwise imports dynamically.
   */
  async loadTheme(themeId: ThemeId): Promise<ThemeDefinition> {
    // Check cache first
    if (this.config.registry.enableCaching && themeCache.has(themeId)) {
      return themeCache.get(themeId)!;
    }

    // Check if already loading
    const existingPromise = loadingPromises.get(themeId);
    if (existingPromise) {
      return existingPromise;
    }

    // Start loading
    const loadPromise = this.doLoadTheme(themeId);
    loadingPromises.set(themeId, loadPromise);

    try {
      const theme = await loadPromise;

      // Cache the loaded theme
      if (this.config.registry.enableCaching) {
        this.cacheTheme(themeId, theme);
      }

      // Mark as loaded in registry
      ThemeRegistry.markLoaded(themeId);

      return theme;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      throw err;
    } finally {
      loadingPromises.delete(themeId);
    }
  }

  /**
   * Internal theme loading logic.
   */
  private async doLoadTheme(themeId: ThemeId): Promise<ThemeDefinition> {
    const importer = THEME_IMPORTS[themeId];

    // Add a small delay for smooth transitions
    const [module] = await Promise.all([
      importer(),
      new Promise((resolve) => setTimeout(resolve, 50)),
    ]);

    return module.default;
  }

  /**
   * Preload a theme without applying it.
   */
  async preloadTheme(themeId: ThemeId): Promise<void> {
    if (ThemeRegistry.isLoaded(themeId)) {
      return;
    }

    await this.loadTheme(themeId);
  }

  /**
   * Preload all themes.
   */
  async preloadAllThemes(): Promise<void> {
    const allIds = ThemeRegistry.getIds();
    const loadPromises = allIds.map((id) => this.preloadTheme(id));
    await Promise.allSettled(loadPromises);
  }

  /**
   * Get all loaded theme IDs.
   */
  getLoadedThemes(): ThemeId[] {
    return Array.from(themeCache.keys());
  }

  /**
   * Check if a theme is loaded.
   */
  isThemeLoaded(themeId: ThemeId): boolean {
    return themeCache.has(themeId);
  }

  /**
   * Cache a theme definition.
   */
  private cacheTheme(themeId: ThemeId, theme: ThemeDefinition): void {
    // Implement LRU-like cache with max size
    if (themeCache.size >= PERFORMANCE_CONFIG.maxCacheSize) {
      const firstKey = themeCache.keys().next().value;
      if (firstKey !== undefined) {
        themeCache.delete(firstKey);
      }
    }
    themeCache.set(themeId, theme);
  }

  /**
   * Clear the theme cache.
   */
  clearCache(): void {
    themeCache.clear();
  }

  /**
   * Get cache size.
   */
  getCacheSize(): number {
    return themeCache.size;
  }

  /**
   * Update loader configuration.
   */
  updateConfig(config: Partial<ThemeLoaderConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
export const ThemeLoader = new ThemeLoaderImpl();

// Factory function for creating custom loaders
export function createThemeLoader(config?: Partial<ThemeLoaderConfig>): ThemeLoaderImpl {
  return new ThemeLoaderImpl(config);
}
