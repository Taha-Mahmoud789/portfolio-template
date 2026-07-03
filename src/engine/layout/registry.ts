/**
 * Layout Registry
 *
 * Central registry for layout presets.
 * Worlds and pages register their layouts here.
 * Components can query available layouts.
 */

import type { LayoutPreset } from "./types";

interface LayoutRegistryEntry {
  preset: LayoutPreset;
  registeredAt: number;
}

class LayoutRegistryImpl {
  private presets = new Map<string, LayoutRegistryEntry>();
  private listeners = new Set<() => void>();

  /**
   * Register a layout preset.
   */
  register(preset: LayoutPreset): void {
    this.presets.set(preset.id, {
      preset,
      registeredAt: Date.now(),
    });
    this.notify();
  }

  /**
   * Register multiple presets at once.
   */
  registerAll(presets: LayoutPreset[]): void {
    for (const preset of presets) {
      this.presets.set(preset.id, {
        preset,
        registeredAt: Date.now(),
      });
    }
    this.notify();
  }

  /**
   * Unregister a layout preset.
   */
  unregister(id: string): boolean {
    const deleted = this.presets.delete(id);
    if (deleted) this.notify();
    return deleted;
  }

  /**
   * Get a layout preset by ID.
   */
  get(id: string): LayoutPreset | undefined {
    return this.presets.get(id)?.preset;
  }

  /**
   * Get all registered presets.
   */
  getAll(): LayoutPreset[] {
    return Array.from(this.presets.values()).map((entry) => entry.preset);
  }

  /**
   * Get presets by category.
   */
  getByCategory(category: string): LayoutPreset[] {
    return this.getAll().filter((preset) => preset.category === category);
  }

  /**
   * Get all unique categories.
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const preset of this.presets.values()) {
      if (preset.preset.category) {
        categories.add(preset.preset.category);
      }
    }
    return Array.from(categories);
  }

  /**
   * Check if a preset is registered.
   */
  has(id: string): boolean {
    return this.presets.has(id);
  }

  /**
   * Get the number of registered presets.
   */
  get size(): number {
    return this.presets.size;
  }

  /**
   * Subscribe to registry changes.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

/** Singleton layout registry */
export const layoutRegistry = new LayoutRegistryImpl();
