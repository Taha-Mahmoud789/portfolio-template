import type { ComponentType, ReactNode } from "react";
import type { ThemeId } from "@/engine/theme/types";
import type { WorldId } from "@/types/world";
import type { TransitionType } from "@/engine/navigation/types";

// ============================================================================
// Portal Identity
// ============================================================================

export type PortalStatus = "active" | "coming-soon" | "disabled" | "locked";

export type PortalActivationPhase =
  "idle" | "selected" | "expanding" | "transitioning" | "loading" | "entering" | "entered";

// ============================================================================
// Portal Definition
// ============================================================================

export interface PortalDefinition {
  id: string;
  worldId: WorldId;
  title: string;
  subtitle: string;
  description: string;
  theme: ThemeId;
  background: PortalBackground;
  icon: PortalIcon;
  accent: PortalAccent;
  animationPreset: PortalAnimationPreset;
  transitionPreset: PortalTransitionPreset;
  destinationRoute: string;
  status: PortalStatus;
  order: number;
  metadata: PortalMetadata;
}

// ============================================================================
// Portal Background
// ============================================================================

export interface PortalBackground {
  type: "gradient" | "image" | "video" | "mesh" | "particle";
  value: string;
  fallbackColor: string;
  overlay?: PortalBackgroundOverlay;
}

export interface PortalBackgroundOverlay {
  color: string;
  opacity: number;
  blendMode?: string;
}

// ============================================================================
// Portal Icon
// ============================================================================

export interface PortalIcon {
  type: "component" | "emoji" | "svg";
  component?: ComponentType<{ className?: string; size?: number }>;
  emoji?: string;
  svg?: string;
  size?: number;
}

// ============================================================================
// Portal Accent
// ============================================================================

export interface PortalAccent {
  color: string;
  glow: string;
  gradient: string;
  shadow: string;
}

// ============================================================================
// Portal Animation Presets
// ============================================================================

export type PortalAnimationPreset =
  "fade" | "slide" | "scale" | "rotate" | "morph" | "glitch" | "bloom" | "wave";

// ============================================================================
// Portal Transition Presets
// ============================================================================

export type PortalTransitionPreset =
  | "zoom-in"
  | "slide-up"
  | "morph-expand"
  | "dissolve"
  | "iris"
  | "page-turn"
  | "particle-burst"
  | "none";

// ============================================================================
// Portal Grid
// ============================================================================

export type PortalGridColumns = 1 | 2 | 3 | 4 | 6 | 10 | "auto";

export interface PortalGridConfig {
  columns: PortalGridColumns;
  gap: string;
  minCardWidth: string;
  maxCardWidth: string;
  aspectRatio: string;
  responsive: {
    mobile: Partial<PortalGridConfig>;
    tablet: Partial<PortalGridConfig>;
    desktop: Partial<PortalGridConfig>;
    ultraWide: Partial<PortalGridConfig>;
  };
}

// ============================================================================
// Portal Interaction
// ============================================================================

export interface PortalInteractionConfig {
  hover: {
    enabled: boolean;
    scale: number;
    lift: number;
    duration: number;
  };
  focus: {
    enabled: boolean;
    ringColor: string;
    ringWidth: number;
    ringOffset: number;
  };
  magnetic: {
    enabled: boolean;
    strength: number;
    range: number;
  };
  depth: {
    enabled: boolean;
    perspective: number;
    maxRotate: number;
  };
  glow: {
    enabled: boolean;
    spread: number;
    intensity: number;
  };
}

// ============================================================================
// Portal State
// ============================================================================

export interface PortalState {
  selectedPortalId: string | null;
  activationPhase: PortalActivationPhase;
  hoveredPortalId: string | null;
  focusedPortalId: string | null;
  isGridReady: boolean;
  portals: PortalDefinition[];
  visiblePortals: string[];
}

export interface PortalActions {
  selectPortal: (portalId: string) => void;
  clearSelection: () => void;
  setHoveredPortal: (portalId: string | null) => void;
  setFocusedPortal: (portalId: string | null) => void;
  activatePortal: (portalId: string) => void;
  cancelActivation: () => void;
  setGridReady: (ready: boolean) => void;
  registerPortals: (portals: PortalDefinition[]) => void;
  setVisiblePortals: (portalIds: string[]) => void;
}

export type PortalStore = PortalState & PortalActions;

// ============================================================================
// Portal Config
// ============================================================================

export interface PortalConfig {
  grid: PortalGridConfig;
  interaction: PortalInteractionConfig;
  transition: {
    type: TransitionType;
    duration: number;
    easing: string;
  };
  performance: {
    lazyRender: boolean;
    memoizePortals: boolean;
    gpuAnimations: boolean;
    preventLayoutShift: boolean;
  };
  accessibility: {
    keyboardNavigation: boolean;
    ariaLabels: boolean;
    focusRings: boolean;
    screenReader: boolean;
    reducedMotion: boolean;
  };
}

// ============================================================================
// Portal Registry
// ============================================================================

export interface PortalRegistryEntry {
  id: string;
  definition: PortalDefinition;
  index: number;
}

export interface PortalRegistryConfig {
  enableValidation: boolean;
  enableOrdering: boolean;
  defaultStatus: PortalStatus;
}

// ============================================================================
// Portal Metadata
// ============================================================================

export interface PortalMetadata {
  author: string;
  version: string;
  createdAt: string;
  tags: string[];
  category: string;
  featured: boolean;
}

// ============================================================================
// Portal Hook Types
// ============================================================================

export interface UsePortalReturn {
  portal: PortalDefinition | undefined;
  isSelected: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
  select: () => void;
  activate: () => void;
}

export interface UsePortalTransitionReturn {
  transition: (portalId: string) => boolean;
  isTransitioning: boolean;
  phase: PortalActivationPhase;
  cancel: () => void;
}

// ============================================================================
// Portal Component Props
// ============================================================================

export interface PortalCardProps {
  portal: PortalDefinition;
  index: number;
  isSelected?: boolean;
  onSelect?: (portalId: string) => void;
  onActivate?: (portalId: string) => void;
  className?: string;
  children?: ReactNode;
}

export interface PortalGridProps {
  portals: PortalDefinition[];
  columns?: PortalGridColumns;
  gap?: string;
  onSelect?: (portalId: string) => void;
  onActivate?: (portalId: string) => void;
  className?: string;
}

export interface PortalIconProps {
  icon: PortalIcon;
  size?: number;
  className?: string;
}

export interface PortalGlowProps {
  color: string;
  intensity?: number;
  spread?: number;
  className?: string;
}
