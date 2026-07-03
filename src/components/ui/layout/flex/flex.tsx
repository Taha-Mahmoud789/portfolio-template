import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import type { Responsive } from "@/engine/layout/responsive/responsive-props";
import { useResponsiveProps } from "../shared";

type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";

type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

type FlexGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface FlexProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  align?: Responsive<FlexAlign>;
  justify?: Responsive<FlexJustify>;
  gap?: Responsive<FlexGap>;
  wrap?: Responsive<boolean>;
  inline?: boolean;
  className?: string;
}

const alignStyles: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyStyles: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const gapStyles: Record<FlexGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ children, align = "center", justify = "start", gap = "md", wrap = false, inline = false, className, ...props }, ref) => {
    const resolved = useResponsiveProps({ align, justify, gap, wrap });

    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          alignStyles[resolved.align],
          justifyStyles[resolved.justify],
          gapStyles[resolved.gap],
          resolved.wrap && "flex-wrap",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Flex.displayName = "Flex";
