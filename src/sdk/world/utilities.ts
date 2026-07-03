/**
 * World Utilities
 *
 * Pure utility functions for working with worlds.
 */

import type { WorldId } from "@/engine/world/types";
import type { WorldContract } from "./types";

// ============================================================================
// ID / Slug Utilities
// ============================================================================

/**
 * Convert a world ID to a slug (e.g., "apple-world" → "apple").
 */
export function worldIdToSlug(worldId: WorldId): string {
  return worldId.replace("-world", "");
}

/**
 * Convert a slug to a world ID (e.g., "apple" → "apple-world").
 */
export function slugToWorldId(slug: string): WorldId {
  return slug.endsWith("-world") ? (slug as WorldId) : (`${slug}-world` as WorldId);
}

/**
 * Derive the route for a world from its ID.
 */
export function worldIdToRoute(worldId: WorldId): string {
  return `/worlds/${worldIdToSlug(worldId)}`;
}

/**
 * Extract the world ID from a route path.
 */
export function routeToWorldId(route: string): WorldId | null {
  const regex = /\/worlds\/([a-z-]+)/;
  const match = regex.exec(route);
  if (!match?.[1]) return null;
  return slugToWorldId(match[1]);
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Check if a string is a valid world ID.
 */
export function isValidWorldId(id: string): id is WorldId {
  return id.endsWith("-world") && id.length > 6;
}

/**
 * Check if two world IDs are the same world.
 */
export function isSameWorld(a: WorldId | null, b: WorldId | null): boolean {
  return a !== null && b !== null && a === b;
}

// ============================================================================
// Contract Utilities
// ============================================================================

/**
 * Extract the display name from a world contract.
 */
export function getWorldDisplayName(contract: WorldContract): string {
  return contract.name;
}

/**
 * Get the full route for a world contract.
 */
export function getWorldRoute(contract: WorldContract): string {
  return contract.route;
}

/**
 * Check if a world is featured.
 */
export function isWorldFeatured(contract: WorldContract): boolean {
  return contract.metadata.featured;
}

/**
 * Get the world category.
 */
export function getWorldCategory(contract: WorldContract): string {
  return contract.metadata.category;
}

/**
 * Get all unique categories from a list of contracts.
 */
export function getWorldCategories(contracts: WorldContract[]): string[] {
  const categories = new Set(contracts.map((c) => c.metadata.category));
  return Array.from(categories).sort();
}

/**
 * Filter contracts by category.
 */
export function filterByCategory(contracts: WorldContract[], category: string): WorldContract[] {
  return contracts.filter((c) => c.metadata.category === category);
}

/**
 * Sort contracts by name.
 */
export function sortByName(contracts: WorldContract[]): WorldContract[] {
  return [...contracts].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort contracts by creation date.
 */
export function sortByDate(contracts: WorldContract[]): WorldContract[] {
  return [...contracts].sort(
    (a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime(),
  );
}

/**
 * Search contracts by query string.
 */
export function searchContracts(contracts: WorldContract[], query: string): WorldContract[] {
  const lower = query.toLowerCase();
  return contracts.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.description.toLowerCase().includes(lower) ||
      c.metadata.tags.some((t) => t.toLowerCase().includes(lower)),
  );
}
