import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import type { Responsive } from "@/engine/layout/responsive/responsive-props";
import { useResponsiveProps } from "../shared";

type StackDirection = "row" | "col" | "row-reverse" | "col-reverse";

type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";

type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface StackProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  direction?: Responsive<StackDirection>;
  gap?: Responsive<StackGap>;
  align?: Responsive<StackAlign>;
  justify?: Responsive<StackJustify>;
  wrap?: Responsive<boolean>;
  className?: string;
}

const directionStyles: Record<StackDirection, string> = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
};

const gapStyles: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const alignStyles: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyStyles: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = "col",
      gap = "md",
      align = "stretch",
      justify = "start",
      wrap = false,
      className,
      ...props
    },
    ref,
  ) => {
    const resolved = useResponsiveProps({ direction, gap, align, justify, wrap });

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionStyles[resolved.direction],
          gapStyles[resolved.gap],
          alignStyles[resolved.align],
          justifyStyles[resolved.justify],
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

Stack.displayName = "Stack";
