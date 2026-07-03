/**
 * Default Layout Presets
 *
 * Registers all built-in layout presets with the registry.
 * Import this once at app startup.
 */

import { layoutRegistry } from "./registry";
import { CenteredLayout } from "./presets/centered";
import { SidebarLayout } from "./presets/sidebar";
import { SplitLayout } from "./presets/split";
import { FullscreenLayout } from "./presets/fullscreen";
import { ImmersiveLayout } from "./presets/immersive";
import { BentoLayout } from "./presets/bento";
import { DashboardLayout } from "./presets/dashboard";
import {
  ScrollSnapContainer,
  ScrollSnapItem,
} from "./presets/../scroll/scroll-snap";
import {
  HorizontalScroll,
  HorizontalScrollItem,
} from "./presets/../scroll/horizontal-scroll";
import { PinnedSection } from "./presets/../scroll/pinned-section";
import {
  OverlayLayout,
} from "./presets/../overlay/overlay";
import {
  PortalLayout,
} from "./presets/../overlay/portal";
import {
  CanvasLayout,
  CanvasLayer,
} from "./presets/../overlay/canvas";

import type { LayoutPreset } from "./types";

const DEFAULT_PRESETS: LayoutPreset[] = [
  {
    id: "centered",
    name: "Centered",
    description: "Content centered with constrained width",
    category: "basic",
    component: CenteredLayout,
    slots: ["children"],
  },
  {
    id: "sidebar-left",
    name: "Sidebar (Left)",
    description: "Left sidebar with main content area",
    category: "composite",
    component: SidebarLayout,
    slots: ["sidebar", "children"],
    defaults: { position: "left" },
  },
  {
    id: "sidebar-right",
    name: "Sidebar (Right)",
    description: "Right sidebar with main content area",
    category: "composite",
    component: SidebarLayout,
    slots: ["sidebar", "children"],
    defaults: { position: "right" },
  },
  {
    id: "split-horizontal",
    name: "Split (Horizontal)",
    description: "Two equal panes side by side",
    category: "composite",
    component: SplitLayout,
    slots: ["first", "second"],
    defaults: { direction: "horizontal" },
  },
  {
    id: "split-vertical",
    name: "Split (Vertical)",
    description: "Two equal panes stacked",
    category: "composite",
    component: SplitLayout,
    slots: ["first", "second"],
    defaults: { direction: "vertical" },
  },
  {
    id: "fullscreen",
    name: "Fullscreen",
    description: "Edge-to-edge with safe area support",
    category: "basic",
    component: FullscreenLayout,
    slots: ["children"],
  },
  {
    id: "immersive",
    name: "Immersive",
    description: "Scroll-driven storytelling layout",
    category: "scroll",
    component: ImmersiveLayout,
    slots: ["children"],
  },
  {
    id: "bento",
    name: "Bento",
    description: "Asymmetric card grid",
    category: "grid",
    component: BentoLayout,
    slots: ["children"],
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "App shell with header, sidebar, and content",
    category: "composite",
    component: DashboardLayout,
    slots: ["header", "sidebar", "children"],
  },
  {
    id: "scroll-snap",
    name: "Scroll Snap",
    description: "Snap scrolling container",
    category: "scroll",
    component: ScrollSnapContainer,
    slots: ["children"],
  },
  {
    id: "scroll-snap-item",
    name: "Scroll Snap Item",
    description: "Individual snap section",
    category: "scroll",
    component: ScrollSnapItem,
    slots: ["children"],
  },
  {
    id: "horizontal-scroll",
    name: "Horizontal Scroll",
    description: "Horizontal scroll container",
    category: "scroll",
    component: HorizontalScroll,
    slots: ["children"],
  },
  {
    id: "horizontal-scroll-item",
    name: "Horizontal Scroll Item",
    description: "Individual horizontal scroll panel",
    category: "scroll",
    component: HorizontalScrollItem,
    slots: ["children"],
  },
  {
    id: "pinned-section",
    name: "Pinned Section",
    description: "Section pinned during scroll",
    category: "scroll",
    component: PinnedSection,
    slots: ["children"],
  },
  {
    id: "overlay",
    name: "Overlay",
    description: "Positioned overlay container",
    category: "overlay",
    component: OverlayLayout,
    slots: ["children", "backdrop"],
  },
  {
    id: "portal",
    name: "Portal",
    description: "Renders children into a React Portal",
    category: "overlay",
    component: PortalLayout,
    slots: ["children"],
  },
  {
    id: "canvas",
    name: "Canvas",
    description: "Freeform absolute-positioned layout",
    category: "overlay",
    component: CanvasLayout,
    slots: ["children"],
  },
  {
    id: "canvas-layer",
    name: "Canvas Layer",
    description: "Layer within a canvas layout",
    category: "overlay",
    component: CanvasLayer,
    slots: ["children"],
  },
];

/** Register all default layout presets with the registry. */
export function registerDefaultLayouts(): void {
  layoutRegistry.registerAll(DEFAULT_PRESETS);
}

/** Get all default preset IDs. */
export function getDefaultPresetIds(): string[] {
  return DEFAULT_PRESETS.map((p) => p.id);
}
