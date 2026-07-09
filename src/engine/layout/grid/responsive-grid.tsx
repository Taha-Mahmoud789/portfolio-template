/**
 * Responsive Grid Engine
 *
 * Enhanced grid with:
 * - Responsive column counts
 * - Named grid areas
 * - Auto-flow control
 * - Cell span overrides
 * - Gap tokens
 * - Alignment per axis
 */

import {
  forwardRef,
  type ReactNode,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";
import { useBreakpoint } from "../responsive/hooks";
import { resolveResponsive, type Responsive } from "../responsive/responsive-props";
import type {
  GridColumns,
  GridAutoFlow,
  GridAlign,
  GridJustify,
  GridSpan,
  SpacingToken,
} from "../types";

// ─── Types ───────────────────────────────────────────────────────

interface ResponsiveGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Responsive column count (1-12) */
  columns?: Responsive<GridColumns>;
  /** CSS grid-auto-flow */
  flow?: GridAutoFlow;
  /** Responsive gap */
  gap?: Responsive<SpacingToken>;
  /** Row gap (overrides gap for vertical) */
  rowGap?: Responsive<SpacingToken>;
  /** Column gap (overrides gap for horizontal) */
  columnGap?: Responsive<SpacingToken>;
  /** Vertical alignment of items */
  align?: GridAlign;
  /** Horizontal alignment of items */
  justify?: GridJustify;
  /** Minimum item width for auto-fill mode (disables columns) */
  minItemWidth?: string;
  /** Named grid template areas */
  areas?: Responsive<string[]>;
  /** Number of rows */
  rows?: number;
  /** Column sizes (e.g., "1fr 2fr 1fr") */
  columnSizes?: Responsive<string>;
  /** Row sizes */
  rowSizes?: Responsive<string>;
  /** Full width */
  fullWidth?: boolean;
  /** Center the grid */
  centered?: boolean;
  className?: string;
}

// ─── Gap Token Map ───────────────────────────────────────────────

const GAP_MAP: Record<SpacingToken, string> = {
  none: "0",
  "2xs": "0.125rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
};

// ─── Grid Component ──────────────────────────────────────────────

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    {
      children,
      columns = 12,
      flow = "row",
      gap = "md",
      rowGap,
      columnGap,
      align,
      justify,
      minItemWidth,
      areas,
      rows,
      columnSizes,
      rowSizes,
      fullWidth = false,
      centered = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedColumns = resolveResponsive(columns, bp);
    const resolvedGap = resolveResponsive(gap, bp);
    const resolvedRowGap = rowGap !== undefined ? resolveResponsive(rowGap, bp) : undefined;
    const resolvedColumnGap =
      columnGap !== undefined ? resolveResponsive(columnGap, bp) : undefined;
    const resolvedAreas = areas !== undefined ? resolveResponsive(areas, bp) : undefined;
    const resolvedColumnSizes =
      columnSizes !== undefined ? resolveResponsive(columnSizes, bp) : undefined;
    const resolvedRowSizes = rowSizes !== undefined ? resolveResponsive(rowSizes, bp) : undefined;

    // Auto-fill mode
    const isAutoFill = minItemWidth !== undefined;

    const gridStyle: CSSProperties = {
      display: "grid",
      gridAutoFlow: flow,
      ...(isAutoFill
        ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))` }
        : { gridTemplateColumns: `repeat(${String(resolvedColumns)}, 1fr)` }),
      ...(resolvedColumnSizes && !isAutoFill ? { gridTemplateColumns: resolvedColumnSizes } : {}),
      ...(resolvedRowSizes ? { gridTemplateRows: resolvedRowSizes } : {}),
      ...(resolvedAreas ? { gridTemplateAreas: resolvedAreas.join("\n") } : {}),
      ...(rows ? { gridTemplateRows: `repeat(${String(rows)}, 1fr)` } : {}),
      ...(resolvedColumnGap !== undefined
        ? { columnGap: GAP_MAP[resolvedColumnGap] }
        : { columnGap: GAP_MAP[resolvedGap] }),
      ...(resolvedRowGap !== undefined
        ? { rowGap: GAP_MAP[resolvedRowGap] }
        : { rowGap: GAP_MAP[resolvedGap] }),
      ...(align ? { alignItems: align } : {}),
      ...(justify ? { justifyItems: justify } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn("w-full", fullWidth && "max-w-none", centered && "mx-auto", className)}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ResponsiveGrid.displayName = "ResponsiveGrid";

// ─── Grid Cell ───────────────────────────────────────────────────

interface GridCellProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Column span (1-12, "full", "auto") */
  colSpan?: Responsive<GridSpan>;
  /** Row span */
  rowSpan?: Responsive<GridSpan>;
  /** Grid area name */
  area?: string;
  /** Column start position */
  colStart?: number;
  /** Column end position */
  colEnd?: number;
  /** Row start position */
  rowStart?: number;
  /** Row end position */
  rowEnd?: number;
  /** Vertical alignment override */
  align?: GridAlign;
  /** Horizontal alignment override */
  justify?: GridJustify;
  className?: string;
}

function spanToTailwind(span: GridSpan, axis: "col" | "row"): string {
  if (span === "full") return `${axis}-span-full`;
  if (span === "auto") return `${axis}-auto`;
  return `${axis}-span-${String(span)}`;
}

function startToTailwind(start: number, axis: "col" | "row"): string {
  return `${axis}-start-${String(start)}`;
}

function endToTailwind(end: number, axis: "col" | "row"): string {
  return `${axis}-end-${String(end)}`;
}

export const GridCell = forwardRef<HTMLDivElement, GridCellProps>(
  (
    {
      children,
      colSpan = "auto",
      rowSpan = "auto",
      area,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      align,
      justify,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedColSpan = resolveResponsive(colSpan, bp);
    const resolvedRowSpan = resolveResponsive(rowSpan, bp);

    const cellStyle: CSSProperties = {
      ...(area ? { gridArea: area } : {}),
      ...(colStart ? { gridColumnStart: colStart } : {}),
      ...(colEnd ? { gridColumnEnd: colEnd } : {}),
      ...(rowStart ? { gridRowStart: rowStart } : {}),
      ...(rowEnd ? { gridRowEnd: rowEnd } : {}),
      ...(align ? { alignSelf: align } : {}),
      ...(justify ? { justifySelf: justify } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          resolvedColSpan !== "auto" && spanToTailwind(resolvedColSpan, "col"),
          resolvedRowSpan !== "auto" && spanToTailwind(resolvedRowSpan, "row"),
          colStart !== undefined && startToTailwind(colStart, "col"),
          colEnd !== undefined && endToTailwind(colEnd, "col"),
          rowStart !== undefined && startToTailwind(rowStart, "row"),
          rowEnd !== undefined && endToTailwind(rowEnd, "row"),
          className,
        )}
        style={cellStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GridCell.displayName = "GridCell";
