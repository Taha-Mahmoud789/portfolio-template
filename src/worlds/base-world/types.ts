/**
 * Base World Types
 *
 * Reusable type definitions for the Base World foundation.
 * Every world inherits from these types.
 */

import type { ReactNode } from "react";
import type { ThemeId } from "@/engine/theme/types";
import type {
  WorldId,
  WorldDefinition,
  WorldLayoutConfig,
  WorldBackground,
  WorldBackgroundType,
} from "@/engine/world/types";

// ============================================================================
// Base World Phase
// ============================================================================

export type BaseWorldPhase =
  | "idle"
  | "initializing"
  | "ready"
  | "active"
  | "transitioning-in"
  | "transitioning-out"
  | "suspended"
  | "destroying"
  | "error";

// ============================================================================
// Base World State (derived from phase only)
// ============================================================================

export interface BaseWorldState {
  phase: BaseWorldPhase;
  isMounted: boolean;
  isReady: boolean;
  isActive: boolean;
  isTransitioning: boolean;
  hasError: boolean;
  error: Error | null;
  theme: ThemeId;
  worldId: WorldId | null;
}

export interface BaseWorldActions {
  setPhase: (phase: BaseWorldPhase) => void;
  setError: (error: Error | null) => void;
  setTheme: (theme: ThemeId) => void;
  setWorldId: (worldId: WorldId | null) => void;
  reset: () => void;
}

export type BaseWorldStore = BaseWorldState & BaseWorldActions;

// ============================================================================
// Background Layer
// ============================================================================

export type BaseBackgroundVariant = WorldBackgroundType | "none";

export interface BaseBackgroundLayerProps {
  children?: ReactNode;
  className?: string;
  variant?: BaseBackgroundVariant;
  config?: Partial<WorldBackground>;
  parallax?: boolean;
}

export interface BaseBackgroundContextValue {
  variant: BaseBackgroundVariant;
  config: WorldBackground;
  isLoaded: boolean;
}

// ============================================================================
// Content Layer
// ============================================================================

export type BaseContentArea = "hero" | "sections" | "canvas" | "floating" | "overlay";

export interface BaseContentLayerProps {
  children?: ReactNode;
  className?: string;
  areas?: BaseContentArea[];
}

export interface BaseContentSlotProps {
  area: BaseContentArea;
  children?: ReactNode;
  className?: string;
}

// ============================================================================
// Overlay Layer
// ============================================================================

export type BaseOverlayType = "hud" | "dialog" | "notification" | "debug";

export interface BaseOverlayLayerProps {
  children?: ReactNode;
  className?: string;
}

export interface BaseOverlaySlotProps {
  type: BaseOverlayType;
  children?: ReactNode;
  className?: string;
  visible?: boolean;
}

export interface BaseOverlayContextValue {
  visibleOverlays: ReadonlySet<BaseOverlayType>;
  show: (type: BaseOverlayType) => void;
  hide: (type: BaseOverlayType) => void;
  toggle: (type: BaseOverlayType) => void;
}

// ============================================================================
// Transition Layer
// ============================================================================

export type BaseTransitionPhase = "none" | "entering" | "entered" | "exiting" | "exited";

export interface BaseTransitionLayerProps {
  children?: ReactNode;
  className?: string;
}

export interface BaseTransitionContextValue {
  phase: BaseTransitionPhase;
  enter: () => void;
  exit: () => Promise<void>;
}

// ============================================================================
// World Header
// ============================================================================

export interface BaseWorldHeaderProps {
  className?: string;
  showBack?: boolean;
  showTitle?: boolean;
  showControls?: boolean;
  onBack?: () => void;
}

// ============================================================================
// World Wrapper
// ============================================================================

export interface BaseWorldWrapperProps {
  children?: ReactNode;
  className?: string;
}

// ============================================================================
// World Layout
// ============================================================================

export interface BaseWorldLayoutProps {
  children?: ReactNode;
  className?: string;
  config?: WorldLayoutConfig;
  sidebar?: ReactNode;
}

// ============================================================================
// World Loader
// ============================================================================

export interface BaseWorldLoaderProps {
  children?: ReactNode;
  className?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// BaseWorld (Root)
// ============================================================================

export interface BaseWorldProps {
  children?: ReactNode;
  className?: string;
  worldId?: WorldId;
  theme?: ThemeId;
  definition?: WorldDefinition;
  showHeader?: boolean;
  showBackground?: boolean;
  showOverlays?: boolean;
  enableTransitions?: boolean;
  enableAccessibility?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Hook Returns
// ============================================================================

export interface UseBaseWorldReturn {
  state: BaseWorldState;
  actions: BaseWorldActions;
}

export interface UseBaseWorldBackgroundReturn {
  variant: BaseBackgroundVariant;
  config: WorldBackground;
  isLoaded: boolean;
}

export interface UseBaseWorldContentReturn {
  areas: readonly BaseContentArea[];
}

export interface UseBaseWorldOverlayReturn {
  visibleOverlays: ReadonlySet<BaseOverlayType>;
  show: (type: BaseOverlayType) => void;
  hide: (type: BaseOverlayType) => void;
  toggle: (type: BaseOverlayType) => void;
}

export interface UseBaseWorldTransitionReturn {
  phase: BaseTransitionPhase;
  enter: () => void;
  exit: () => Promise<void>;
}
