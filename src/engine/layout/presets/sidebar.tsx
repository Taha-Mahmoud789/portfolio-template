/**
 * Sidebar Layout
 *
 * Two-column layout with main content and sidebar.
 * Sidebar can be fixed-width or flexible, left or right positioned.
 * Responsive: sidebar collapses on mobile.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { useBreakpoint } from "../responsive/hooks";
import { resolveResponsive, type Responsive } from "../responsive/responsive-props";
import type { SidebarPosition as SidebarPos, SidebarCollapse } from "../types";

type SidebarWidthValue = string | number;

interface SidebarLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Sidebar content */
  sidebar: ReactNode;
  /** Sidebar position */
  position?: Responsive<SidebarPos>;
  /** Sidebar width */
  width?: Responsive<SidebarWidthValue>;
  /** Collapse behavior at mobile breakpoints */
  collapse?: SidebarCollapse;
  /** Gap between sidebar and main */
  gap?: string;
  /** Make sidebar sticky */
  sticky?: boolean;
  /** Sidebar padding */
  sidebarPadding?: string;
  /** Main content padding */
  mainPadding?: string;
  /** Sidebar background */
  sidebarBackground?: string;
  /** Full height */
  fullHeight?: boolean;
  className?: string;
  sidebarClassName?: string;
  mainClassName?: string;
}

const POSITION_MAP: Record<SidebarPos, string> = {
  left: "flex-row",
  right: "flex-row-reverse",
};

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  (
    {
      children,
      sidebar,
      position = "left",
      width = "280px",
      collapse = "stack",
      gap = "2rem",
      sticky = false,
      sidebarPadding = "1.5rem",
      mainPadding = "2rem",
      sidebarBackground,
      fullHeight = true,
      className,
      sidebarClassName,
      mainClassName,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedPosition = resolveResponsive(position, bp);
    const resolvedWidth = resolveResponsive(width, bp);
    const isMobile = bp === "xs" || bp === "sm";
    const isStack = isMobile && collapse === "stack";
    const isOverlay = isMobile && collapse === "overlay";

    const containerStyle: CSSProperties = {
      gap: isStack ? "1.5rem" : gap,
      ...(fullHeight ? { minHeight: "100%" } : {}),
      ...style,
    };

    const sidebarStyle: CSSProperties = {
      width: isStack ? "100%" : resolvedWidth,
      minWidth: isStack ? "100%" : resolvedWidth,
      flexShrink: 0,
      ...(sticky && !isStack ? { position: "sticky", top: 0, alignSelf: "flex-start" } : {}),
      ...(sidebarBackground ? { background: sidebarBackground } : {}),
    };

    const mainStyle: CSSProperties = {
      flex: 1,
      minWidth: 0,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          isStack ? "flex-col" : POSITION_MAP[resolvedPosition],
          isOverlay && "relative",
          className,
        )}
        style={containerStyle}
        {...props}
      >
        <aside
          className={cn(
            "shrink-0",
            isOverlay && "absolute inset-y-0 left-0 z-20 shadow-lg",
            sidebarClassName,
          )}
          style={sidebarStyle}
        >
          <div style={{ padding: sidebarPadding }}>{sidebar}</div>
        </aside>

        <main
          className={cn("flex-1 min-w-0", mainClassName)}
          style={{ ...mainStyle, padding: mainPadding }}
        >
          {children}
        </main>
      </div>
    );
  },
);

SidebarLayout.displayName = "SidebarLayout";
