/**
 * Spatial Object System — Validator
 *
 * Validates spatial object configurations before registration.
 * Catches errors at creation time, not at mount time.
 */

import type { SpatialObjectConfig } from "./types";

// ============================================================================
// Validator
// ============================================================================

const VALID_TYPES: ReadonlySet<string> = new Set([
  "static",
  "dynamic",
  "interactive",
  "background",
  "decoration",
  "particle",
  "npc",
  "physics",
]);

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function validateObjectConfig(config: SpatialObjectConfig): ValidationResult {
  const errors: string[] = [];

  if (!VALID_TYPES.has(config.type)) {
    errors.push(`Invalid object type: "${config.type}"`);
  }

  if (config.id !== undefined && (typeof config.id !== "string" || config.id.length === 0)) {
    errors.push("Object id must be a non-empty string");
  }

  if (config.layer !== undefined && (config.layer < 0 || config.layer > 31)) {
    errors.push(`Layer must be 0-31, got ${String(config.layer)}`);
  }

  if (config.priority !== undefined && (config.priority < 0 || config.priority > 1000)) {
    errors.push(`Priority must be 0-1000, got ${String(config.priority)}`);
  }

  if (config.position) {
    const p = config.position;
    if (p.x !== undefined && typeof p.x !== "number") errors.push("position.x must be a number");
    if (p.y !== undefined && typeof p.y !== "number") errors.push("position.y must be a number");
    if (p.z !== undefined && typeof p.z !== "number") errors.push("position.z must be a number");
  }

  if (config.rotation) {
    const r = config.rotation;
    if (r.x !== undefined && typeof r.x !== "number") errors.push("rotation.x must be a number");
    if (r.y !== undefined && typeof r.y !== "number") errors.push("rotation.y must be a number");
    if (r.z !== undefined && typeof r.z !== "number") errors.push("rotation.z must be a number");
  }

  if (config.scale) {
    const s = config.scale;
    if (s.x !== undefined && (typeof s.x !== "number" || s.x <= 0))
      errors.push("scale.x must be a positive number");
    if (s.y !== undefined && (typeof s.y !== "number" || s.y <= 0))
      errors.push("scale.y must be a positive number");
    if (s.z !== undefined && (typeof s.z !== "number" || s.z <= 0))
      errors.push("scale.z must be a positive number");
  }

  return { valid: errors.length === 0, errors };
}
