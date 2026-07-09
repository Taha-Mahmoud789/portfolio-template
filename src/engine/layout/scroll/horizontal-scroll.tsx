/**
 * Horizontal Scroll Layout
 *
 * Horizontal scrolling container with vertical scroll triggering.
 * Commonly used for "scrollytelling" and horizontal galleries.
 */

import {
  forwardRef,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";

interface HorizontalScrollProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Pin the horizontal scroll section */
  pinned?: boolean;
  /** Height when pinned */
  pinHeight?: string;
  /** Gap between items */
  gap?: string;
  /** Item width */
  itemWidth?: string;
  /** Hide scrollbar */
  hideScrollbar?: boolean;
  className?: string;
}

export const HorizontalScroll = forwardRef<HTMLDivElement, HorizontalScrollProps>(
  (
    {
      children,
      pinned = false,
      pinHeight = "100dvh",
      gap = "1rem",
      itemWidth: _itemWidth = "80vw",
      hideScrollbar = true,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerStyle: CSSProperties = {
      ...(pinned
        ? {
            position: "sticky",
            top: 0,
            height: pinHeight,
          }
        : {}),
      overflowX: "auto",
      overflowY: "hidden",
      scrollSnapType: "x mandatory",
      whiteSpace: "nowrap",
      gap,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-stretch w-full",
          hideScrollbar &&
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          className,
        )}
        style={containerStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

HorizontalScroll.displayName = "HorizontalScroll";

// ─── Horizontal Scroll Item ──────────────────────────────────────

interface HorizontalScrollItemProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Item width */
  width?: string;
  /** Snap alignment */
  snap?: boolean;
  className?: string;
}

export const HorizontalScrollItem = forwardRef<HTMLDivElement, HorizontalScrollItemProps>(
  ({ children, width = "80vw", snap = true, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("shrink-0 h-full", snap && "snap-center", className)}
        style={{
          width,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

HorizontalScrollItem.displayName = "HorizontalScrollItem";
