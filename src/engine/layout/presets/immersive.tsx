/**
 * Immersive Layout
 *
 * Fullscreen with scroll-based reveal sections.
 * Designed for scroll storytelling experiences.
 */

import {
  forwardRef,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";
import { usePrefersReducedMotion } from "../responsive/hooks";
import { safeAreaPadding } from "../safe-area";

interface ImmersiveLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Background color or gradient */
  background?: string;
  /** Enable scroll snap */
  snap?: boolean;
  /** Snap type */
  snapType?: "mandatory" | "proximity";
  /** Safe area support */
  safeArea?: boolean;
  /** Show scroll indicator */
  showScrollIndicator?: boolean;
  className?: string;
}

export const ImmersiveLayout = forwardRef<HTMLDivElement, ImmersiveLayoutProps>(
  (
    {
      children,
      background,
      snap = true,
      snapType = "mandatory",
      safeArea = false,
      showScrollIndicator = true,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerStyle: CSSProperties = {
      height: "100dvh",
      overflowY: "auto",
      scrollSnapType: snap ? `${snapType} y` : "none",
      ...(background ? { background } : {}),
      ...(safeArea ? safeAreaPadding("vertical") : {}),
      ...style,
    };

    const prefersReducedMotion = usePrefersReducedMotion();

    return (
      <div ref={ref} className={cn("w-full", className)} style={containerStyle} {...props}>
        {children}
        {showScrollIndicator && !prefersReducedMotion && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
            aria-hidden="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground-muted opacity-60"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        )}
      </div>
    );
  },
);

ImmersiveLayout.displayName = "ImmersiveLayout";

// ─── Immersive Section ───────────────────────────────────────────

interface ImmersiveSectionProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Snap alignment */
  snapAlign?: "start" | "center" | "end";
  /** Full viewport height */
  fullscreen?: boolean;
  /** Vertical alignment of content */
  align?: "start" | "center" | "end";
  /** Background */
  background?: string;
  /** Background opacity */
  backgroundOpacity?: number;
  className?: string;
}

export const ImmersiveSection = forwardRef<HTMLDivElement, ImmersiveSectionProps>(
  (
    {
      children,
      snapAlign: _snapAlign = "start",
      fullscreen = true,
      align = "center",
      background,
      backgroundOpacity = 1,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const alignMap = {
      start: "items-start pt-24",
      center: "items-center",
      end: "items-end pb-24",
    };

    const sectionStyle: CSSProperties = {
      ...(fullscreen ? { minHeight: "100dvh" } : {}),
      ...(background
        ? {
            background:
              backgroundOpacity < 1
                ? `${background}${Math.round(backgroundOpacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`
                : background,
          }
        : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col justify-center w-full px-6 sm:px-8 lg:px-12 snap-start",
          alignMap[align],
          className,
        )}
        style={sectionStyle}
        {...props}
      >
        <div className="w-full max-w-screen-xl mx-auto">{children}</div>
      </div>
    );
  },
);

ImmersiveSection.displayName = "ImmersiveSection";
