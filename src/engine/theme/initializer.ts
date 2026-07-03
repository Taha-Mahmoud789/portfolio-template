/**
 * Theme Engine Initializer
 *
 * Initializes the Theme Engine by registering all built-in themes.
 * Call this once at application startup.
 */

import { ThemeRegistry } from "./registry";
import { ThemeLoader } from "./loader";
import { allThemes } from "./definitions";
import type { ThemeRegistryConfig } from "./types";

// ============================================================================
// Initialization
// ============================================================================

let initialized = false;

/**
 * Initialize the Theme Engine.
 * Registers all built-in themes and configures the registry.
 */
export function initializeThemeEngine(
  config?: Partial<ThemeRegistryConfig>
): void {
  if (initialized) {
    console.warn("Theme Engine already initialized");
    return;
  }

  // Apply custom configuration
  if (config) {
    ThemeRegistry.updateConfig(config);
  }

  // Register all built-in themes (lazy loaded)
  ThemeRegistry.registerAll(allThemes, true);

  // Mark the default theme as loaded
  const defaultTheme = ThemeRegistry.getDefaultTheme();
  ThemeRegistry.markLoaded(defaultTheme.id);

  initialized = true;

  console.log(
    `Theme Engine initialized with ${allThemes.length} themes`
  );
}

/**
 * Check if the Theme Engine is initialized.
 */
export function isThemeEngineInitialized(): boolean {
  return initialized;
}

/**
 * Reset the Theme Engine (for testing).
 */
export function resetThemeEngine(): void {
  ThemeRegistry.clear();
  ThemeLoader.clearCache();
  initialized = false;
}
