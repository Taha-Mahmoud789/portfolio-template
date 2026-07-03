/**
 * Layout Type Definitions
 *
 * Core types for the Layout Engine.
 * All layout presets, components, and configurations use these types.
 */

import type { ReactNode, CSSProperties } from "react";
import type { Responsive } from "./responsive/responsive-props";

// ─── Container Sizes ─────────────────────────────────────────────

export type ContainerSize =
  | "sm"    // 640px
  | "md"    // 768px
  | "lg"    // 1024px
  | "xl"    // 1280px
  | "2xl"   // 1536px
  | "3xl"   // 1728px
  | "prose" // 65ch
  | "full"; // 100%

// ─── Spacing Tokens ──────────────────────────────────────────────

export type SpacingToken = "none" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

// ─── Section Variants ────────────────────────────────────────────

export type SectionSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type SectionBackground =
  | "none"
  | "surface"
  | "surface-raised"
  | "surface-overlay"
  | "surface-sunken"
  | "surface-inset"
  | "primary"
  | "primary-subtle"
  | "secondary"
  | "foreground"
  | "custom";

// ─── Grid Types ──────────────────────────────────────────────────

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GridAutoFlow = "row" | "column" | "dense" | "row-dense" | "column-dense";

export type GridAlign = "start" | "end" | "center" | "stretch";

export type GridJustify = "start" | "end" | "center" | "stretch" | "between" | "around" | "evenly";

export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full" | "auto";

/**
 * Responsive column definition.
 * Can be a static number or breakpoint-specific.
 *
 * @example
 * columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
 */
export type ResponsiveColumns = Responsive<GridColumns>;

/**
 * Named grid area for template-based layouts.
 *
 * @example
 * areas: {
 *   sm: ["header", "main", "footer"],
 *   lg: ["header header", "sidebar main", "footer footer"],
 * }
 */
export type GridAreas = Responsive<string[]>;

// ─── Split Layout Types ──────────────────────────────────────────

export type SplitRatio = "equal" | "1/3" | "2/3" | "1/4" | "3/4" | "auto";

export type SplitDirection = "horizontal" | "vertical";

export type SplitDivider = "line" | "space" | "none";

// ─── Sidebar Layout Types ────────────────────────────────────────

export type SidebarPosition = "left" | "right";

export type SidebarWidth = "narrow" | "default" | "wide" | Responsive<string | number>;

export type SidebarCollapse = "none" | "stack" | "overlay";

// ─── Scroll Layout Types ─────────────────────────────────────────

export type ScrollSnapType = "none" | "mandatory" | "proximity";

export type ScrollSnapAxis = "x" | "y" | "both";

export type ScrollSnapAlign = "start" | "center" | "end";

// ─── Layout Composition ──────────────────────────────────────────

export interface LayoutSlot {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface LayoutConfig {
  /** Unique layout identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Layout description */
  description?: string;
  /** Layout category for grouping in UI */
  category?: string;
  /** Default props for the layout */
  defaults?: Record<string, unknown>;
}

/**
 * A layout preset defines a complete page/section structure.
 */
export interface LayoutPreset extends LayoutConfig {
  /** The component to render */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  /** Available slots for content injection */
  slots: string[];
  /** Supported responsive breakpoints */
  breakpoints?: string[];
}
