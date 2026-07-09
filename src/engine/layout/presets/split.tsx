/**
 * Split Layout
 *
 * Two-pane split layout with configurable ratio and direction.
 * Supports vertical stacking on mobile.
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
import type { SplitDirection as SplitDir } from "../types";

type SplitRatioValue = string;

interface SplitLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Second pane content */
  second: ReactNode;
  /** Split direction */
  direction?: Responsive<SplitDir>;
  /** Size ratio as CSS values (e.g., "1fr 2fr", "50% 50%", "1fr 3fr") */
  ratio?: Responsive<SplitRatioValue>;
  /** Gap between panes */
  gap?: string;
  /** Alignment along cross axis */
  align?: "start" | "center" | "end" | "stretch";
  /** Stack direction on mobile */
  mobileStack?: SplitDir;
  /** Gap when stacked on mobile */
  mobileGap?: string;
  /** Full height */
  fullHeight?: boolean;
  /** Divider between panes */
  divider?: boolean;
  className?: string;
  firstClassName?: string;
  secondClassName?: string;
}

export const SplitLayout = forwardRef<HTMLDivElement, SplitLayoutProps>(
  (
    {
      children,
      second,
      direction = "horizontal",
      ratio = "1fr 1fr",
      gap = "2rem",
      align = "stretch",
      mobileStack: _mobileStack = "vertical",
      mobileGap,
      fullHeight = false,
      divider = false,
      className,
      firstClassName,
      secondClassName,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedDirection = resolveResponsive(direction, bp);
    const resolvedRatio = resolveResponsive(ratio, bp);
    const isMobile = bp === "xs" || bp === "sm";
    const isHorizontal = !isMobile && resolvedDirection === "horizontal";

    const containerStyle: CSSProperties = {
      display: "grid",
      gridTemplateColumns: isHorizontal ? resolvedRatio : "1fr",
      gridTemplateRows: isHorizontal ? "1fr" : "auto auto",
      gap: isMobile ? (mobileGap ?? "1.5rem") : gap,
      alignItems: align,
      ...(fullHeight ? { minHeight: "100%" } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          isHorizontal &&
            divider &&
            "[&>section:not(:last-child)]:border-r [&>section:not(:last-child)]:border-border",
          className,
        )}
        style={containerStyle}
        role="group"
        {...props}
      >
        <section className={cn("min-w-0", firstClassName)}>{children}</section>
        <section className={cn("min-w-0", secondClassName)}>{second}</section>
      </div>
    );
  },
);

SplitLayout.displayName = "SplitLayout";
