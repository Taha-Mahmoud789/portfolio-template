import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import type { Responsive } from "@/engine/layout/responsive/responsive-props";
import { useResponsiveValue } from "../shared";

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "none";

type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface GridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  columns?: Responsive<GridColumns>;
  gap?: Responsive<GridGap>;
  rows?: number;
  minItemWidth?: string;
  className?: string;
}

const columnsStyles: Record<GridColumns, string> = {
  none: "",
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const gapStyles: Record<GridGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ children, columns = "none", gap = "md", minItemWidth, className, ...props }, ref) => {
    const resolvedColumns = useResponsiveValue(columns);
    const resolvedGap = useResponsiveValue(gap);
    const autoGrid = minItemWidth
      ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))` }
      : undefined;

    return (
      <div
        ref={ref}
        className={cn("grid", columnsStyles[resolvedColumns], gapStyles[resolvedGap], className)}
        style={autoGrid}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Grid.displayName = "Grid";
