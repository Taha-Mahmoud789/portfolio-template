/**
 * Overlay Layout
 *
 * Fixed/sticky overlay containers for notifications, toasts, and modals.
 * Manages z-index layering and positioning.
 */

import { forwardRef, useEffect, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type OverlayPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right"
  | "center"
  | "full";

interface OverlayLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Overlay position */
  position?: OverlayPosition;
  /** Z-index layer */
  zIndex?: number;
  /** Backdrop overlay */
  backdrop?: boolean;
  /** Backdrop click handler */
  onBackdropClick?: () => void;
  /** Safe area insets */
  safeArea?: boolean;
  /** Fixed positioning (vs absolute) */
  fixed?: boolean;
  /** Padding from edges */
  padding?: string;
  /** Accessible label for the overlay */
  ariaLabel?: string;
  className?: string;
}

const POSITION_MAP: Record<OverlayPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  full: "inset-0",
};

export const OverlayLayout = forwardRef<HTMLDivElement, OverlayLayoutProps>(
  (
    {
      children,
      position = "center",
      zIndex = 50,
      backdrop = false,
      onBackdropClick,
      safeArea = false,
      fixed = true,
      padding = "1rem",
      ariaLabel,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // Keyboard escape support
    useEffect(() => {
      if (!onBackdropClick) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") onBackdropClick?.();
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onBackdropClick]);

    const overlayStyle: CSSProperties = {
      position: fixed ? "fixed" : "absolute",
      zIndex,
      padding,
      ...(safeArea
        ? {
            top: `max(${POSITION_MAP[position].includes("top") ? "1rem" : "auto"}, env(safe-area-inset-top))`,
            bottom: `max(${POSITION_MAP[position].includes("bottom") ? "1rem" : "auto"}, env(safe-area-inset-bottom))`,
          }
        : {}),
      ...style,
    };

    return (
      <>
        {backdrop && (
          <div
            className="fixed inset-0 bg-overlay-heavy z-[calc(var(--overlay-z)_-1)]"
            style={{ "--overlay-z": zIndex } as CSSProperties}
            onClick={onBackdropClick}
            aria-hidden="true"
          />
        )}
        <div
          ref={ref}
          role="dialog"
          aria-label={ariaLabel}
          className={cn(POSITION_MAP[position], className)}
          style={overlayStyle}
          {...props}
        >
          {children}
        </div>
      </>
    );
  },
);

OverlayLayout.displayName = "OverlayLayout";
