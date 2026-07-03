/**
 * Layout Engine
 *
 * Complete layout system for the Frontend Multiverse application.
 * Provides responsive primitives, composition layouts, scroll layouts,
 * and overlay/portal/canvas support.
 *
 * @example
 * import { ResponsiveGrid, GridCell, Section, SidebarLayout } from "@/engine/layout";
 *
 * // Responsive grid
 * <ResponsiveGrid columns={{ sm: 1, md: 2, lg: 3 }} gap="md">
 *   <GridCell colSpan={{ sm: "full", lg: 2 }}>Featured</GridCell>
 *   <GridCell>Item</GridCell>
 * </ResponsiveGrid>
 *
 * // Section with background
 * <Section size="lg" background="surface" container="lg">
 *   <Content />
 * </Section>
 *
 * // Sidebar layout
 * <SidebarLayout sidebar={<Nav />}>
 *   <Main />
 * </SidebarLayout>
 */

// ─── Responsive Engine ───────────────────────────────────────────
export {
  BREAKPOINTS,
  BREAKPOINT_ORDER,
  VIEWPORT_RANGES,
  MEDIA_QUERIES,
  SAFE_AREAS,
  VIEWPORT_UNITS,
} from "./responsive/breakpoints";
export type { Breakpoint, ViewportRange } from "./responsive/breakpoints";

export {
  isResponsiveValue,
  resolveResponsive,
  resolveResponsiveMap,
} from "./responsive/responsive-props";
export type { Responsive } from "./responsive/responsive-props";

export {
  useBreakpoint,
  useMinBreakpoint,
  useWindowSize,
  useDevicePixelRatio,
  useOrientation,
  useResizeObserver,
  usePrefersReducedMotion,
  useSupportsHover,
  useScrollPosition,
  useScrollTo,
} from "./responsive/hooks";

// ─── Types ───────────────────────────────────────────────────────
export type {
  ContainerSize,
  SpacingToken,
  SectionSize,
  SectionBackground,
  GridColumns,
  GridAutoFlow,
  GridAlign,
  GridJustify,
  GridSpan,
  ResponsiveColumns,
  GridAreas,
  SplitRatio,
  SplitDirection,
  SplitDivider,
  SidebarPosition,
  SidebarWidth,
  SidebarCollapse,
  ScrollSnapType,
  ScrollSnapAxis,
  ScrollSnapAlign,
  LayoutSlot,
  LayoutConfig,
  LayoutPreset,
} from "./types";

// ─── Registry ────────────────────────────────────────────────────
export { layoutRegistry } from "./registry";

// ─── Grid Engine ─────────────────────────────────────────────────
export { ResponsiveGrid, GridCell } from "./grid";

// ─── Section Engine ──────────────────────────────────────────────
export { Section, sectionPresets } from "./section";

// ─── Layout Presets ──────────────────────────────────────────────
export {
  CenteredLayout,
  SidebarLayout,
  SplitLayout,
  FullscreenLayout,
  ImmersiveLayout,
  ImmersiveSection,
  BentoLayout,
  BentoCard,
  DashboardLayout,
} from "./presets";

// ─── Scroll Layouts ──────────────────────────────────────────────
export {
  ScrollSnapContainer,
  ScrollSnapItem,
  HorizontalScroll,
  HorizontalScrollItem,
  PinnedSection,
} from "./scroll";

// ─── Overlay / Portal / Canvas ───────────────────────────────────
export {
  OverlayLayout,
  PortalLayout,
  CanvasLayout,
  CanvasLayer,
} from "./overlay";

// ─── Safe Area ───────────────────────────────────────────────────
export {
  safeAreaInset,
  safeAreaPadding,
  safeAreaMargin,
  safeAreaClasses,
  viewportClasses,
} from "./safe-area";

// ─── Defaults ────────────────────────────────────────────────────
export { registerDefaultLayouts, getDefaultPresetIds } from "./defaults";

// ─── Container Queries ───────────────────────────────────────────
export {
  ContainerQueryProvider,
  useContainerQuery,
  useContainerSize,
  useContainerMatch,
  useContainerRange,
  containerQueryCSS,
} from "./container-query";
export type { ContainerQueryState, ContainerQueryProviderProps } from "./container-query";
