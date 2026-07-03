import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type LabelSize = "xs" | "sm" | "base";

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  children: ReactNode;
  size?: LabelSize;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeStyles: Record<LabelSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, size = "sm", required = false, disabled = false, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "font-medium text-foreground",
          sizeStyles[size],
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = "Label";
