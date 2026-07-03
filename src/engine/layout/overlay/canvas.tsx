/**
 * Canvas Layout
 *
 * Absolute-positioned container for freeform layouts.
 * Used for hero sections, interactive canvases, and layered compositions.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

interface CanvasLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Full viewport */
  fullscreen?: boolean;
  /** Height */
  height?: string;
  /** Background */
  background?: string;
  /** Overflow behavior */
  overflow?: "visible" | "hidden" | "clip";
  /** Pointer events */
  pointerEvents?: "none" | "auto";
  className?: string;
}

export const CanvasLayout = forwardRef<HTMLDivElement, CanvasLayoutProps>(
  (
    {
      children,
      fullscreen = false,
      height,
      background,
      overflow = "hidden",
      pointerEvents = "auto",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const canvasStyle: CSSProperties = {
      position: "relative",
      ...(fullscreen
        ? { width: "100%", height: "100dvh" }
        : height
          ? { width: "100%", height }
          : { width: "100%" }),
      overflow,
      pointerEvents,
      ...(background ? { background } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={canvasStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CanvasLayout.displayName = "CanvasLayout";

// ─── Canvas Layer ────────────────────────────────────────────────

interface CanvasLayerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** CSS position */
  position?: CSSProperties["position"];
  /** Inset values */
  inset?: string;
  /** Z-index */
  zIndex?: number;
  /** Pointer events override */
  pointerEvents?: "none" | "auto";
  className?: string;
}

export const CanvasLayer = forwardRef<HTMLDivElement, CanvasLayerProps>(
  (
    {
      children,
      position = "absolute",
      inset = "0",
      zIndex = 1,
      pointerEvents = "auto",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("w-full h-full", className)}
        style={{
          position,
          inset,
          zIndex,
          pointerEvents,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CanvasLayer.displayName = "CanvasLayer";
