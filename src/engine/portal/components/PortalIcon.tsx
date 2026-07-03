import { forwardRef, useMemo } from "react";
import { cn } from "@/utils";
import type { PortalIconProps } from "../types";

/**
 * PortalIcon — renders a portal's icon.
 *
 * Supports component, emoji, and safe SVG rendering.
 * SVGs from untrusted sources should not use dangerouslySetInnerHTML.
 */
export const PortalIcon = forwardRef<HTMLDivElement, PortalIconProps>(
  ({ icon, size = 48, className, ...props }, ref) => {
    const iconContent = useMemo(() => {
      if (icon.type === "component" && icon.component) {
        const IconComponent = icon.component;
        return <IconComponent className={cn("w-full h-full", className)} size={size} />;
      }

      if (icon.type === "emoji" && icon.emoji) {
        return (
          <span
            className={cn("select-none", className)}
            style={{ fontSize: size }}
            role="img"
            aria-hidden="true"
          >
            {icon.emoji}
          </span>
        );
      }

      // For SVG type, render a safe fallback — no dangerouslySetInnerHTML
      // SVG content should be provided as a React component via the "component" type
      return (
        <svg
          className={cn("w-full h-full text-white/60", className)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015A3.001 3.001 0 0021 9.349m-18 0V6.75a3 3 0 013-3h9a3 3 0 013 3v2.593"
          />
        </svg>
      );
    }, [icon, size, className]);

    return (
      <div
        ref={ref}
        className={cn("flex-shrink-0", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        {iconContent}
      </div>
    );
  },
);

PortalIcon.displayName = "PortalIcon";
