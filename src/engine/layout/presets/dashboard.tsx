/**
 * Dashboard Layout
 *
 * Application shell layout with sidebar, header, and content area.
 * Responsive: sidebar collapses on mobile.
 */

import {
  forwardRef,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";
import { useBreakpoint } from "../responsive/hooks";
import { resolveResponsive, type Responsive } from "../responsive/responsive-props";

type DashboardCollapse = "none" | "hidden" | "overlay";

interface DashboardLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Sidebar content */
  sidebar: ReactNode;
  /** Header content */
  header?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Sidebar collapse behavior on mobile */
  collapse?: DashboardCollapse;
  /** Sidebar width */
  sidebarWidth?: Responsive<string | number>;
  /** Header height */
  headerHeight?: string;
  /** Sidebar background */
  sidebarBackground?: string;
  /** Header background */
  headerBackground?: string;
  /** Main content background */
  contentBackground?: string;
  className?: string;
}

export const DashboardLayout = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      sidebar,
      header,
      footer,
      collapse = "overlay",
      sidebarWidth = "260px",
      headerHeight = "64px",
      sidebarBackground = "var(--color-surface)",
      headerBackground = "var(--color-surface)",
      contentBackground,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedWidth = resolveResponsive(sidebarWidth, bp);
    const isMobile = bp === "xs" || bp === "sm";
    const sidebarHidden = isMobile && collapse === "hidden";

    const containerStyle: CSSProperties = {
      display: "grid",
      gridTemplateColumns: sidebarHidden ? "1fr" : `${String(resolvedWidth)} 1fr`,
      gridTemplateRows: header ? `${headerHeight} 1fr` : "1fr",
      gridTemplateAreas: header
        ? sidebarHidden
          ? `"header" "main"`
          : `"sidebar header" "sidebar main"`
        : sidebarHidden
          ? `"main"`
          : `"sidebar main"`,
      minHeight: "100dvh",
      ...style,
    };

    const sidebarStyle: CSSProperties = {
      background: sidebarBackground,
      ...(isMobile && collapse === "overlay"
        ? { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30 }
        : {}),
    };

    const headerStyle: CSSProperties = {
      height: headerHeight,
      background: headerBackground,
    };

    const contentStyle: CSSProperties = {
      background: contentBackground,
      overflow: "auto",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} style={containerStyle} {...props}>
        {/* Sidebar */}
        {!sidebarHidden && (
          <aside className="overflow-y-auto" style={sidebarStyle}>
            {sidebar}
          </aside>
        )}

        {/* Header */}
        {header && (
          <header
            className="flex items-center px-4 sm:px-6 border-b border-border"
            style={headerStyle}
          >
            {header}
          </header>
        )}

        {/* Main Content */}
        <main className="min-w-0 overflow-auto" style={contentStyle}>
          {children}
        </main>

        {/* Footer */}
        {footer && <footer className="border-t border-border">{footer}</footer>}
      </div>
    );
  },
);

DashboardLayout.displayName = "DashboardLayout";
