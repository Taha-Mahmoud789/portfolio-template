/**
 * Centered Layout
 *
 * Content centered both horizontally and vertically.
 * Perfect for hero sections, error pages, and single-focus content.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

interface CenteredLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Maximum content width */
  maxWidth?: string;
  /** Full viewport height */
  fullscreen?: boolean;
  /** Minimum height */
  minHeight?: string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Gap between children */
  gap?: string;
  className?: string;
}

export const CenteredLayout = forwardRef<HTMLDivElement, CenteredLayoutProps>(
  (
    {
      children,
      maxWidth = "640px",
      fullscreen = false,
      minHeight,
      textAlign = "center",
      gap = "1.5rem",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerStyle: CSSProperties = {
      maxWidth,
      textAlign,
      gap,
      ...(fullscreen ? { minHeight: "100dvh" } : {}),
      ...(minHeight ? { minHeight } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8",
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

CenteredLayout.displayName = "CenteredLayout";
