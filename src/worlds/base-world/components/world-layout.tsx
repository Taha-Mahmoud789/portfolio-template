/**
 * World Layout
 *
 * Provides the layout structure for a world.
 * Supports centered, sidebar, split, fullscreen, immersive, bento, dashboard layouts.
 * Zero world-specific styling — layout structure only.
 */

import type { BaseWorldLayoutProps } from "../types";
import type { WorldLayoutType } from "@/engine/world/types";

// ============================================================================
// Layout Variants
// ============================================================================

const LAYOUT_CLASSES: Record<WorldLayoutType, string> = {
  centered: "flex items-center justify-center min-h-screen",
  sidebar: "flex min-h-screen",
  split: "grid grid-cols-2 min-h-screen",
  fullscreen: "relative w-full h-full min-h-screen",
  immersive: "relative w-full h-full min-h-screen overflow-hidden",
  bento: "grid grid-cols-3 grid-rows-3 gap-4 p-4 min-h-screen",
  dashboard: "grid grid-cols-[240px_1fr] grid-rows-[60px_1fr] min-h-screen",
  custom: "relative w-full h-full",
};

// ============================================================================
// Component
// ============================================================================

export function BaseWorldLayout({
  children,
  className = "",
  config,
  sidebar,
}: BaseWorldLayoutProps) {
  const layoutType: WorldLayoutType = config?.type ?? "fullscreen";

  if (layoutType === "sidebar" && config?.sidebar) {
    const { position, width } = config.sidebar;
    return (
      <div className={`base-world__layout flex min-h-screen ${className}`} data-layout={layoutType}>
        <aside
          className="base-world__sidebar shrink-0 h-screen sticky top-0 overflow-y-auto"
          style={{
            width,
            order: position === "right" ? 1 : -1,
          }}
          aria-label="World sidebar"
        >
          {sidebar}
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    );
  }

  return (
    <div
      className={`base-world__layout ${LAYOUT_CLASSES[layoutType]} ${className}`}
      data-layout={layoutType}
    >
      {children}
    </div>
  );
}
