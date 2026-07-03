import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

type SpinnerColor = "primary" | "secondary" | "current";

export interface SpinnerProps extends ComponentPropsWithoutRef<"svg"> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-12",
};

const colorStyles: Record<SpinnerColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  current: "text-current",
};

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", color = "current", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn("animate-spin", sizeStyles[size], colorStyles[color], className)}
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Loading"
        {...props}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  },
);

Spinner.displayName = "Spinner";
