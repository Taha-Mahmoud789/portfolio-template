/**
 * World Contract Validator
 *
 * Validates world SDK configs against the strict WorldContract.
 * More thorough than the engine-level validator — enforces SDK-specific rules.
 */

import type {
  WorldSDKConfig,
  WorldContract,
  WorldContractValidationResult,
  WorldContractError,
} from "./types";
import { REQUIRED_CONTRACT_FIELDS } from "./constants";

// ============================================================================
// Validate SDK Config
// ============================================================================

export function validateWorldSDKConfig(
  config: Partial<WorldSDKConfig>,
): WorldContractValidationResult {
  const errors: WorldContractError[] = [];
  const warnings: string[] = [];

  if (!config.id) {
    errors.push({ field: "id", message: "World id is required", severity: "error" });
  }

  if (!config.name) {
    errors.push({ field: "name", message: "World name is required", severity: "error" });
  }

  if (!config.description) {
    errors.push({
      field: "description",
      message: "World description is required",
      severity: "error",
    });
  }

  if (!config.theme) {
    errors.push({ field: "theme", message: "World theme is required", severity: "error" });
  }

  if (!config.route) {
    warnings.push("Route not specified — will be derived from id");
  }

  if (!config.slug) {
    warnings.push("Slug not specified — will be derived from id");
  }

  if (!config.metadata) {
    warnings.push("Metadata not specified — defaults will be used");
  }

  if (!config.components) {
    warnings.push("Components not specified — world will need components added manually");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Validate World Contract (full validation)
// ============================================================================

export function validateWorldContract(
  contract: Partial<WorldContract>,
): WorldContractValidationResult {
  const errors: WorldContractError[] = [];
  const warnings: string[] = [];

  for (const field of REQUIRED_CONTRACT_FIELDS) {
    if (!contract[field as keyof WorldContract]) {
      errors.push({
        field,
        message: `Required field "${field}" is missing`,
        severity: "error",
      });
    }
  }

  if (contract.id) {
    const id = contract.id;
    if (!id.endsWith("-world")) {
      warnings.push(`World id "${id}" does not follow the "-world" suffix convention`);
    }
  }

  if (contract.slug) {
    if (contract.slug.startsWith("/") || contract.slug.endsWith("/")) {
      errors.push({
        field: "slug",
        message: "Slug must not start or end with a slash",
        severity: "error",
      });
    }
  }

  if (contract.route) {
    if (!contract.route.startsWith("/")) {
      errors.push({
        field: "route",
        message: "Route must start with a slash",
        severity: "error",
      });
    }
  }

  if (contract.metadata) {
    if (!contract.metadata.author) {
      warnings.push("metadata.author is missing");
    }
    if (!contract.metadata.version) {
      warnings.push("metadata.version is missing");
    }
    if (!contract.metadata.createdAt) {
      warnings.push("metadata.createdAt is missing");
    }
    if (!contract.metadata.category) {
      warnings.push("metadata.category is missing — categorization recommended");
    }
  }

  if (contract.background) {
    if (contract.background.type === "none" && !contract.background.fallbackColor) {
      warnings.push("Background type is 'none' but no fallbackColor is set");
    }
  }

  if (contract.components) {
    if (!contract.components.root) {
      errors.push({
        field: "components.root",
        message: "Root component is required",
        severity: "error",
      });
    }
  }

  if (contract.routes) {
    for (const route of contract.routes) {
      if (!route.path) {
        errors.push({
          field: "routes",
          message: "Route path is required",
          severity: "error",
        });
      }
      if (!route.component) {
        errors.push({
          field: "routes",
          message: `Route "${route.path}" has no component`,
          severity: "error",
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Validate all world contracts
// ============================================================================

export function validateWorldContracts(
  contracts: Partial<WorldContract>[],
): WorldContractValidationResult {
  const allErrors: WorldContractError[] = [];
  const allWarnings: string[] = [];
  const ids = new Set<string>();

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    if (!contract) continue;

    const result = validateWorldContract(contract);
    const prefix = `World[${String(i)}]`;

    for (const error of result.errors) {
      allErrors.push({
        ...error,
        field: `${prefix}.${error.field}`,
      });
    }
    for (const warning of result.warnings) {
      allWarnings.push(`${prefix}: ${warning}`);
    }

    if (contract.id) {
      if (ids.has(contract.id)) {
        allErrors.push({
          field: `${prefix}.id`,
          message: `Duplicate world id "${contract.id}"`,
          severity: "error",
        });
      }
      ids.add(contract.id);
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}
