/**
 * Fullscreen Layout
 *
 * Full viewport layout with optional safe area support.
 * Used for immersive experiences, splash screens, and canvas layouts.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { safeAreaPadding } from "../safe-area";

type FullscreenAlignment = "center" | "start" | "end" | "stretch";

interface FullscreenLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Vertical alignment */
  align?: FullscreenAlignment;
  /** Horizontal alignment */
  justify?: FullscreenAlignment;
  /** Include safe area insets */
  safeArea?: boolean;
  /** Background color */
  background?: string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Minimum height (default: 100dvh) */
  minHeight?: string;
  /** Scrollable content */
  scrollable?: boolean;
  /** Center content */
  centered?: boolean;
  /** Gap between children */
  gap?: string;
  className?: string;
}

const ALIGN_MAP: Record<FullscreenAlignment, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const JUSTIFY_MAP: Record<FullscreenAlignment, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-stretch",
};

export const FullscreenLayout = forwardRef<HTMLDivElement, FullscreenLayoutProps>(
  (
    {
      children,
      align = "center",
      justify = "center",
      safeArea = false,
      background,
      textAlign = "center",
      minHeight = "100dvh",
      scrollable = false,
      centered = false,
      gap = "1.5rem",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerStyle: CSSProperties = {
      minHeight,
      textAlign,
      gap,
      ...(background ? { background } : {}),
      ...(safeArea ? safeAreaPadding("all") : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col w-full",
          centered && "items-center justify-center",
          !centered && ALIGN_MAP[align],
          !centered && JUSTIFY_MAP[justify],
          scrollable ? "overflow-auto" : "overflow-hidden",
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

FullscreenLayout.displayName = "FullscreenLayout";
