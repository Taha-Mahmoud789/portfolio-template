/**
 * Animation Registry
 *
 * Central registry for all animations in the application.
 */

import type { AnimationPreset } from "../types/animation";

export interface AnimationRegistryEntry {
  name: string;
  preset: AnimationPreset;
  tags: string[];
  description?: string;
}

class AnimationRegistryClass {
  private presets = new Map<string, AnimationRegistryEntry>();

  /**
   * Register an animation preset.
   */
  register(entry: AnimationRegistryEntry): void {
    this.presets.set(entry.name, entry);
  }

  /**
   * Get a preset by name.
   */
  get(name: string): AnimationRegistryEntry | undefined {
    return this.presets.get(name);
  }

  /**
   * Check if a preset exists.
   */
  has(name: string): boolean {
    return this.presets.has(name);
  }

  /**
   * Get all presets.
   */
  getAll(): AnimationRegistryEntry[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get presets by tag.
   */
  getByTag(tag: string): AnimationRegistryEntry[] {
    return this.getAll().filter((entry) => entry.tags.includes(tag));
  }

  /**
   * Get all preset names.
   */
  getNames(): string[] {
    return Array.from(this.presets.keys());
  }

  /**
   * Unregister a preset.
   */
  unregister(name: string): boolean {
    return this.presets.delete(name);
  }

  /**
   * Clear all presets.
   */
  clear(): void {
    this.presets.clear();
  }

  /**
   * Get the number of registered presets.
   */
  size(): number {
    return this.presets.size;
  }
}

/** Singleton instance */
export const animationRegistry = new AnimationRegistryClass();
