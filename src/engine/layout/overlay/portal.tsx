/**
 * Portal Layout
 *
 * Renders children into a React Portal for overlay use cases.
 * Wraps content in a layout container after portaling.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils";

interface PortalLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Portal target element or selector */
  target?: Element | string;
  /** Unique identifier for the portal */
  id?: string;
  /** Z-index */
  zIndex?: number;
  className?: string;
}

export const PortalLayout = forwardRef<HTMLDivElement, PortalLayoutProps>(
  (
    {
      children,
      target = "body",
      id,
      zIndex,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerRef = (element: HTMLDivElement | null) => {
      // Forward the ref
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const portalStyle: CSSProperties = {
      ...(zIndex !== undefined ? { zIndex } : {}),
      ...style,
    };

    // Resolve target element
    const targetElement =
      typeof target === "string" ? document.querySelector(target) ?? document.body : target;

    return createPortal(
      <div
        ref={containerRef}
        id={id}
        className={cn("layout-portal", className)}
        style={portalStyle}
        {...props}
      >
        {children}
      </div>,
      targetElement,
    );
  },
);

PortalLayout.displayName = "PortalLayout";
