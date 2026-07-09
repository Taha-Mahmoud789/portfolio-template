/**
 * Pinned Section
 *
 * Section that pins during scroll, then unpins.
 * Used for scroll-triggered animations and parallax.
 */

import {
  forwardRef,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";

interface PinnedSectionProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Pin position */
  pinTo?: "top" | "bottom";
  /** Pin offset */
  offset?: string | number;
  /** Height of the pinning container */
  height?: string;
  /** Z-index while pinned */
  zIndex?: number;
  className?: string;
}

export const PinnedSection = forwardRef<HTMLDivElement, PinnedSectionProps>(
  (
    {
      children,
      pinTo = "top",
      offset = "0",
      height = "100dvh",
      zIndex = 10,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const offsetValue = typeof offset === "number" ? `${String(offset)}px` : offset;

    const containerStyle: CSSProperties = {
      height,
      position: "relative",
      ...style,
    };

    const pinnedStyle: CSSProperties = {
      position: "sticky",
      [pinTo]: offsetValue,
      zIndex,
      height: "100dvh",
    };

    return (
      <div ref={ref} style={containerStyle} {...props}>
        <div className={cn("w-full h-full", className)} style={pinnedStyle}>
          {children}
        </div>
      </div>
    );
  },
);

PinnedSection.displayName = "PinnedSection";
