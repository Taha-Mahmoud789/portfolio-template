import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type ChipVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";

type ChipSize = "sm" | "md" | "lg";

export interface ChipProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  default: "bg-secondary/10 text-secondary border-secondary/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  success: "bg-success-subtle text-success-foreground border-success/20",
  warning: "bg-warning-subtle text-warning-foreground border-warning/20",
  danger: "bg-danger-subtle text-danger-foreground border-danger/20",
  info: "bg-info-subtle text-info-foreground border-info/20",
  outline: "bg-transparent text-foreground-secondary border-border",
};

const sizeStyles: Record<ChipSize, string> = {
  sm: "h-6 px-2 text-xs gap-1",
  md: "h-7 px-2.5 text-sm gap-1.5",
  lg: "h-8 px-3 text-sm gap-2",
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ children, variant = "default", size = "md", removable = false, onRemove, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full border whitespace-nowrap",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 size-3.5 rounded-full inline-flex items-center justify-center hover:bg-foreground/10 transition-colors"
            aria-label="Remove"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </span>
    );
  },
);

Chip.displayName = "Chip";
