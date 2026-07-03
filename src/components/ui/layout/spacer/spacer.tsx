import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import type { Responsive } from "@/engine/layout/responsive/responsive-props";
import { useResponsiveValue } from "../shared";

type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export interface SpacerProps extends ComponentPropsWithoutRef<"div"> {
  size?: Responsive<SpacerSize>;
  axis?: "vertical" | "horizontal" | "both";
  className?: string;
}

const sizeStyles: Record<SpacerSize, string> = {
  xs: "size-1",
  sm: "size-2",
  md: "size-4",
  lg: "size-6",
  xl: "size-8",
  "2xl": "size-12",
  "3xl": "size-16",
  "4xl": "size-24",
};

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = "md", axis = "vertical", className, ...props }, ref) => {
    const resolvedSize = useResponsiveValue(size);

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "shrink-0",
          axis === "vertical" && "h-4",
          axis === "horizontal" && "w-4",
          axis === "both" && sizeStyles[resolvedSize],
          className,
        )}
        style={
          axis === "vertical"
            ? { height: `var(--spacer-${resolvedSize}, 1rem)` }
            : axis === "horizontal"
              ? { width: `var(--spacer-${resolvedSize}, 1rem)` }
              : undefined
        }
        {...props}
      />
    );
  },
);

Spacer.displayName = "Spacer";
