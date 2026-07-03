import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";

type BadgeSize = "xs" | "sm" | "md";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success-subtle text-success-foreground",
  warning: "bg-warning-subtle text-warning-foreground",
  danger: "bg-danger-subtle text-danger-foreground",
  info: "bg-info-subtle text-info-foreground",
  outline: "bg-transparent border border-border text-foreground-secondary",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "h-5 px-1.5 text-2xs",
  sm: "h-6 px-2 text-xs",
  md: "h-6 px-2.5 text-xs",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "default", size = "sm", dot = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-badge whitespace-nowrap",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "size-1.5 rounded-full shrink-0",
              variant === "success" && "bg-success",
              variant === "warning" && "bg-warning",
              variant === "danger" && "bg-danger",
              variant === "info" && "bg-info",
              variant === "primary" && "bg-primary",
              variant === "secondary" && "bg-secondary",
              variant === "default" && "bg-secondary",
              variant === "outline" && "bg-foreground-secondary",
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
