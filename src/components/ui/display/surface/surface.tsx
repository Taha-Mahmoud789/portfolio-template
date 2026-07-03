import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type SurfaceVariant = "default" | "raised" | "overlay" | "sunken" | "inset";

type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

type SurfaceRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface SurfaceProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  bordered?: boolean;
  interactive?: boolean;
  className?: string;
}

const variantStyles: Record<SurfaceVariant, string> = {
  default: "bg-surface",
  raised: "bg-surface-raised shadow-elevation-1",
  overlay: "bg-surface-overlay shadow-elevation-2",
  sunken: "bg-surface-sunken",
  inset: "bg-surface-inset",
};

const paddingStyles: Record<SurfacePadding, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const radiusStyles: Record<SurfaceRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      radius = "lg",
      bordered = false,
      interactive = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          radiusStyles[radius],
          bordered && "border border-border",
          interactive && "transition-colors hover:bg-hover-overlay cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Surface.displayName = "Surface";
