/**
 * World SDK Types
 *
 * Contract definitions and SDK-specific types for world development.
 * Extends World Engine types with stricter constraints and developer ergonomics.
 */

import type { ComponentType, ReactNode, LazyExoticComponent } from "react";
import type { ThemeId } from "@/engine/theme/types";
import type {
  WorldId,
  WorldDefinition,
  WorldLayoutConfig,
  WorldAnimationPreset,
  WorldTransitionPreset,
  WorldBackground,
  WorldSequence,
  WorldAssets,
  WorldPermissions,
  WorldMetadata,
  WorldStatus,
} from "@/engine/world/types";

// ============================================================================
// World Contract — strict interface every world must satisfy
// ============================================================================

export interface WorldContract {
  id: WorldId;
  slug: string;
  name: string;
  description: string;
  route: string;
  theme: ThemeId;
  layout: WorldLayoutConfig;
  animationPreset: WorldAnimationPreset;
  transitionPreset: WorldTransitionPreset;
  background: WorldBackground;
  entrySequence: WorldSequence;
  exitSequence: WorldSequence;
  assets: WorldAssets;
  status: WorldStatus;
  permissions: WorldPermissions;
  metadata: WorldMetadata & { category: string; featured: boolean };
  components: WorldComponentSet;
  routes: WorldRouteConfig[];
}

// ============================================================================
// World Components — what every world must export
// ============================================================================

export interface WorldComponentSet {
  root: ComponentType | LazyExoticComponent<ComponentType>;
  layout?: ComponentType<{ children: ReactNode }>;
  notFound?: ComponentType;
  error?: ComponentType<{ error: Error; reset: () => void }>;
}

// ============================================================================
// World Routes — route configuration per world
// ============================================================================

export interface WorldRouteConfig {
  path: string;
  component: ComponentType | LazyExoticComponent<ComponentType>;
  name: string;
  description?: string;
  exact?: boolean;
}

// ============================================================================
// SDK Config — simplified input for createWorld
// ============================================================================

export interface WorldSDKConfig {
  id: WorldId;
  name: string;
  description: string;
  theme: ThemeId;
  route?: string;
  slug?: string;
  layout?: WorldLayoutConfig;
  animationPreset?: WorldAnimationPreset;
  transitionPreset?: WorldTransitionPreset;
  background?: Partial<WorldBackground>;
  status?: WorldStatus;
  permissions?: Partial<WorldPermissions>;
  metadata?: Partial<WorldMetadata & { category: string; featured: boolean }>;
  components?: Partial<WorldComponentSet>;
  routes?: WorldRouteConfig[];
}

// ============================================================================
// Factory
// ============================================================================

export interface WorldFactoryOptions {
  config: WorldSDKConfig;
  validate?: boolean;
  autoRegister?: boolean;
}

export interface WorldFactoryResult {
  definition: WorldDefinition;
  contract: WorldContract;
  moduleLoader: () => Promise<{ default: ComponentType }>;
}

// ============================================================================
// Validation
// ============================================================================

export interface WorldContractValidationResult {
  valid: boolean;
  errors: WorldContractError[];
  warnings: string[];
}

export interface WorldContractError {
  field: string;
  message: string;
  severity: "error" | "warning";
}

// ============================================================================
// Registration Helper
// ============================================================================

export interface WorldRegistrationOptions {
  validate?: boolean;
  override?: boolean;
  preload?: boolean;
}

// ============================================================================
// Loader Helper
// ============================================================================

export interface WorldLoaderHelperOptions {
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

// ============================================================================
// Metadata
// ============================================================================

export interface WorldSDKMeta {
  title: string;
  description: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  canonical: string;
  structuredData: Record<string, unknown>;
}

// ============================================================================
// Configuration
// ============================================================================

export interface WorldDefaultConfig {
  layout: WorldLayoutConfig;
  animationPreset: WorldAnimationPreset;
  transitionPreset: WorldTransitionPreset;
  background: WorldBackground;
  permissions: WorldPermissions;
}
