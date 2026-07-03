/**
 * Section Engine
 *
 * Semantic <section> with responsive padding, background, container, and sticky support.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { useBreakpoint } from "../responsive/hooks";
import { resolveResponsive, type Responsive } from "../responsive/responsive-props";
import type { SectionSize, SectionBackground, ContainerSize, SpacingToken } from "../types";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  size?: Responsive<SectionSize>;
  padding?: Responsive<SpacingToken>;
  margin?: Responsive<SpacingToken>;
  background?: SectionBackground;
  backgroundColor?: string;
  container?: ContainerSize | "full" | "none";
  sticky?: boolean | "top" | "bottom";
  stickyOffset?: string | number;
  fullscreen?: boolean;
  minHeight?: string;
  snap?: "none" | "start" | "center" | "end";
  overflow?: "visible" | "hidden" | "auto" | "scroll";
  clip?: boolean;
  border?: "none" | "top" | "bottom" | "both";
  className?: string;
}

const SECTION_PADDING: Record<SectionSize, string> = {
  xs: "py-8",
  sm: "py-12",
  md: "py-16",
  lg: "py-24",
  xl: "py-32",
  "2xl": "py-48",
};

const SECTION_PADDING_X: Record<SectionSize, string> = {
  xs: "px-4 sm:px-6",
  sm: "px-4 sm:px-6 lg:px-8",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-6 sm:px-8 lg:px-12",
  xl: "px-8 sm:px-12 lg:px-16",
  "2xl": "px-8 sm:px-12 lg:px-20",
};

const BACKGROUND_MAP: Record<SectionBackground, string> = {
  none: "",
  "surface": "bg-surface",
  "surface-raised": "bg-surface-raised",
  "surface-overlay": "bg-surface-overlay",
  "surface-sunken": "bg-surface-sunken",
  "surface-inset": "bg-surface-inset",
  "primary": "bg-primary text-foreground-inverse",
  "primary-subtle": "bg-primary-subtle",
  "secondary": "bg-secondary text-foreground-inverse",
  "foreground": "bg-foreground text-foreground-inverse",
  "custom": "",
};

const CONTAINER_WIDTH: Record<string, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "3xl": "max-w-[1800px]",
  prose: "max-w-prose",
  full: "max-w-full",
  none: "",
};

function getStickyStyles(sticky: boolean | "top" | "bottom", offset?: string | number): CSSProperties {
  const offsetValue = typeof offset === "number" ? `${offset}px` : offset;
  if (sticky === true || sticky === "top") {
    return { position: "sticky", top: offsetValue ?? "0", zIndex: 10 };
  }
  if (sticky === "bottom") {
    return { position: "sticky", bottom: offsetValue ?? "0", zIndex: 10 };
  }
  return {};
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      size = "md",
      padding,
      margin,
      background = "none",
      backgroundColor,
      container = "none",
      sticky,
      stickyOffset,
      fullscreen = false,
      minHeight,
      snap = "none",
      overflow = "visible",
      clip = false,
      border = "none",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedSize = resolveResponsive(size, bp);
    const resolvedPadding = padding !== undefined ? resolveResponsive(padding, bp) : undefined;
    const resolvedMargin = margin !== undefined ? resolveResponsive(margin, bp) : undefined;

    const sectionStyle: CSSProperties = {
      ...(fullscreen ? { minHeight: "100dvh" } : minHeight ? { minHeight } : {}),
      ...(sticky ? getStickyStyles(sticky, stickyOffset) : {}),
      ...(snap !== "none" ? { scrollSnapAlign: snap } : {}),
      ...(overflow !== "visible" ? { overflow } : {}),
      ...(clip ? { overflow: "hidden" } : {}),
      ...(resolvedMargin !== undefined
        ? { marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }
        : {}),
      ...(backgroundColor ? { backgroundColor } : {}),
      ...style,
    };

    const innerClassName = cn(
      container !== "none" && CONTAINER_WIDTH[container],
      container !== "none" && "mx-auto",
    );

    const hasInner = container !== "none";

    return (
      <section
        ref={ref}
        className={cn(
          SECTION_PADDING[resolvedSize],
          resolvedPadding !== undefined
            ? `px-[var(--section-px)]`
            : SECTION_PADDING_X[resolvedSize],
          BACKGROUND_MAP[background],
          border === "top" && "border-t border-border",
          border === "bottom" && "border-b border-border",
          border === "both" && "border-y border-border",
          className,
        )}
        style={{
          ...sectionStyle,
          ...(resolvedMargin !== undefined
            ? { "--section-px": `var(--spacing-${resolvedPadding ?? resolvedSize})` } as CSSProperties
            : {}),
        }}
        {...props}
      >
        {hasInner ? <div className={innerClassName}>{children}</div> : children}
      </section>
    );
  },
);

Section.displayName = "Section";

export const sectionPresets = {
  hero: { size: "xl" as const, background: "surface" as const, fullscreen: true },
  feature: { size: "lg" as const, background: "surface" as const },
  narrow: { size: "md" as const, container: "prose" as const },
  wide: { size: "lg" as const, container: "xl" as const },
  fullscreen: { size: "md" as const, fullscreen: true },
} as const;
