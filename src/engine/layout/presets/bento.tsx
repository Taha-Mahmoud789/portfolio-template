/**
 * Bento Layout
 *
 * Asymmetric grid layout with mixed-size cards.
 * Commonly used for feature showcases and dashboards.
 */

import { forwardRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { useBreakpoint } from "../responsive/hooks";
import { resolveResponsive, type Responsive } from "../responsive/responsive-props";

type BentoColumns = 2 | 3 | 4;

interface BentoLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Number of columns */
  columns?: Responsive<BentoColumns>;
  /** Gap between items */
  gap?: string;
  /** Minimum item height */
  minItemHeight?: string;
  /** Full width */
  fullWidth?: boolean;
  className?: string;
}

export const BentoLayout = forwardRef<HTMLDivElement, BentoLayoutProps>(
  (
    {
      children,
      columns = 3,
      gap = "1rem",
      minItemHeight = "200px",
      fullWidth = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const bp = useBreakpoint();
    const resolvedColumns = resolveResponsive(columns, bp);

    const containerStyle: CSSProperties = {
      display: "grid",
      gridTemplateColumns: `repeat(${resolvedColumns}, 1fr)`,
      gridAutoRows: `minmax(${minItemHeight}, auto)`,
      gap,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          fullWidth && "max-w-none",
          className,
        )}
        style={containerStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

BentoLayout.displayName = "BentoLayout";

// ─── Bento Card ──────────────────────────────────────────────────

interface BentoCardProps extends ComponentPropsWithoutRef<"article"> {
  children: ReactNode;
  /** Column span */
  colSpan?: 1 | 2 | 3;
  /** Row span */
  rowSpan?: 1 | 2 | 3;
  /** Background */
  background?: string;
  /** Border radius */
  radius?: string;
  /** Padding */
  padding?: string;
  className?: string;
}

export const BentoCard = forwardRef<HTMLElement, BentoCardProps>(
  (
    {
      children,
      colSpan = 1,
      rowSpan = 1,
      background,
      radius = "1rem",
      padding = "1.5rem",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const cardStyle: CSSProperties = {
      gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
      gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined,
      borderRadius: radius,
      padding,
      ...(background ? { background } : {}),
      ...style,
    };

    return (
      <article
        ref={ref}
        className={cn(
          "bg-surface overflow-hidden transition-all",
          className,
        )}
        style={cardStyle}
        {...props}
      >
        {children}
      </article>
    );
  },
);

BentoCard.displayName = "BentoCard";
