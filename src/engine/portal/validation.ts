import type {
  PortalDefinition,
  PortalStatus,
  PortalAnimationPreset,
  PortalTransitionPreset,
} from "./types";
import { ALL_THEME_IDS } from "@/engine/theme/constants";
import { PORTAL_ANIMATION_PRESETS, PORTAL_TRANSITION_PRESETS } from "./constants";

const VALID_ANIMATION_PRESETS = Object.keys(PORTAL_ANIMATION_PRESETS) as PortalAnimationPreset[];
const VALID_TRANSITION_PRESETS = Object.keys(PORTAL_TRANSITION_PRESETS) as PortalTransitionPreset[];
const VALID_STATUSES: PortalStatus[] = ["active", "coming-soon", "disabled", "locked"];

export interface PortalValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePortal(portal: Partial<PortalDefinition>): PortalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!portal.id || typeof portal.id !== "string") {
    errors.push("Portal must have a string id");
  }
  if (!portal.worldId || typeof portal.worldId !== "string") {
    errors.push("Portal must have a worldId");
  }
  if (!portal.title || typeof portal.title !== "string") {
    errors.push("Portal must have a string title");
  }
  if (!portal.subtitle || typeof portal.subtitle !== "string") {
    errors.push("Portal must have a string subtitle");
  }
  if (!portal.description || typeof portal.description !== "string") {
    errors.push("Portal must have a string description");
  }
  if (!portal.theme || !(ALL_THEME_IDS as readonly string[]).includes(portal.theme)) {
    errors.push(`Portal theme must be one of: ${ALL_THEME_IDS.join(", ")}`);
  }
  if (!portal.destinationRoute || typeof portal.destinationRoute !== "string") {
    errors.push("Portal must have a destinationRoute");
  }
  if (portal.animationPreset && !VALID_ANIMATION_PRESETS.includes(portal.animationPreset)) {
    errors.push(`animationPreset must be one of: ${VALID_ANIMATION_PRESETS.join(", ")}`);
  }
  if (portal.transitionPreset && !VALID_TRANSITION_PRESETS.includes(portal.transitionPreset)) {
    errors.push(`transitionPreset must be one of: ${VALID_TRANSITION_PRESETS.join(", ")}`);
  }
  if (portal.status && !VALID_STATUSES.includes(portal.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  if (portal.order !== undefined && (typeof portal.order !== "number" || portal.order < 0)) {
    warnings.push("Portal order should be a non-negative number");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validatePortals(portals: Partial<PortalDefinition>[]): PortalValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const ids = new Set<string>();

  for (let i = 0; i < portals.length; i++) {
    const portal = portals[i];
    if (!portal) continue;
    const result = validatePortal(portal);
    const prefix = `Portal[${String(i)}]`;

    for (const error of result.errors) {
      allErrors.push(`${prefix}: ${error}`);
    }
    for (const warning of result.warnings) {
      allWarnings.push(`${prefix}: ${warning}`);
    }
    if (portal.id) {
      if (ids.has(portal.id)) {
        allErrors.push(`${prefix}: Duplicate portal id "${portal.id}"`);
      }
      ids.add(portal.id);
    }
  }

  return { valid: allErrors.length === 0, errors: allErrors, warnings: allWarnings };
}

export function isValidPortal(portal: Partial<PortalDefinition>): boolean {
  return validatePortal(portal).valid;
}

export function isValidPortalStatus(status: string): status is PortalStatus {
  return VALID_STATUSES.includes(status as PortalStatus);
}

export function isValidAnimationPreset(preset: string): preset is PortalAnimationPreset {
  return VALID_ANIMATION_PRESETS.includes(preset as PortalAnimationPreset);
}

export function isValidTransitionPreset(preset: string): preset is PortalTransitionPreset {
  return VALID_TRANSITION_PRESETS.includes(preset as PortalTransitionPreset);
}
