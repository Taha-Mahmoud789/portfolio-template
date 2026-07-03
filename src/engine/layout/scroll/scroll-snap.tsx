/**
 * Scroll Snap Layout
 *
 * Container with snap scrolling and configurable snap points.
 * Used for scroll storytelling and section-based navigation.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type SnapType = "none" | "mandatory" | "proximity";
type SnapAxis = "x" | "y" | "both";
type SnapAlign = "start" | "center" | "end";

interface ScrollSnapContainerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Snap type */
  type?: SnapType;
  /** Snap axis */
  axis?: SnapAxis;
  /** Hide scrollbar */
  hideScrollbar?: boolean;
  /** Full height */
  fullHeight?: boolean;
  /** Background */
  background?: string;
  className?: string;
}

export const ScrollSnapContainer = forwardRef<HTMLDivElement, ScrollSnapContainerProps>(
  (
    {
      children,
      type = "mandatory",
      axis = "y",
      hideScrollbar = false,
      fullHeight = true,
      background,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerStyle: CSSProperties = {
      scrollSnapType: `${axis} ${type}`,
      overflowX: axis === "x" || axis === "both" ? "auto" : "hidden",
      overflowY: axis === "y" || axis === "both" ? "auto" : "hidden",
      ...(fullHeight ? { height: "100dvh" } : {}),
      ...(background ? { background } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          hideScrollbar && "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
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

ScrollSnapContainer.displayName = "ScrollSnapContainer";

// ─── Scroll Snap Item ────────────────────────────────────────────

interface ScrollSnapItemProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Snap alignment */
  align?: SnapAlign;
  /** Full viewport height */
  fullscreen?: boolean;
  /** Minimum height */
  minHeight?: string;
  className?: string;
}

const ALIGN_MAP: Record<SnapAlign, string> = {
  start: "snap-start",
  center: "snap-center",
  end: "snap-end",
};

export const ScrollSnapItem = forwardRef<HTMLDivElement, ScrollSnapItemProps>(
  (
    {
      children,
      align = "start",
      fullscreen = true,
      minHeight,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          ALIGN_MAP[align],
          fullscreen && "min-h-dvh",
          className,
        )}
        style={{
          ...(minHeight ? { minHeight } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ScrollSnapItem.displayName = "ScrollSnapItem";
