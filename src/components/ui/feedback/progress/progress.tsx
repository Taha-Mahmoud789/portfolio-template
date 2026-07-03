import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type ProgressSize = "xs" | "sm" | "md" | "lg";

type ProgressVariant = "default" | "success" | "warning" | "danger" | "info";

export interface ProgressProps extends ComponentPropsWithoutRef<"div"> {
  value?: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  striped?: boolean;
  className?: string;
}

const sizeStyles: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantStyles: Record<ProgressVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = "md",
      variant = "default",
      label,
      showValue = false,
      indeterminate = false,
      striped = false,
      className,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className={cn("w-full", className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <span className="text-sm font-medium text-foreground">{label}</span>
            )}
            {showValue && !indeterminate && (
              <span className="text-sm text-foreground-secondary">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          className={cn("w-full bg-surface-inset rounded-full overflow-hidden", sizeStyles[size])}
          ref={ref}
          {...props}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              variantStyles[variant],
              striped && "bg-stripes",
              indeterminate && "animate-[progress-indeterminate_2s_ease-in-out_infinite] w-2/3",
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
