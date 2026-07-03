import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils";

type RadioSize = "sm" | "md" | "lg";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: RadioSize;
  label?: string;
  error?: string;
}

const sizeStyles: Record<RadioSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const dotSizeStyles: Record<RadioSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size = "md", label, error, disabled, id, checked, ...props }, ref) => {
    const radioId = id || props.name;

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            checked={checked}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${radioId}-error` : undefined}
            className={cn("peer sr-only", className)}
            {...props}
          />
          <div
            className={cn(
              "flex items-center justify-center rounded-full border-2 border-border bg-surface",
              "transition-colors",
              "peer-checked:border-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              sizeStyles[size],
            )}
            aria-hidden="true"
          >
            {checked && (
              <div
                className={cn("rounded-full bg-primary", dotSizeStyles[size])}
              />
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={radioId}
            className={cn(
              "text-sm font-medium text-foreground leading-none",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p id={`${radioId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Radio.displayName = "Radio";

export interface RadioGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

export function RadioGroup({ children, label, error, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} aria-invalid={!!error} className={cn("flex flex-col gap-2", className)}>
      {label && <p className="text-sm font-medium text-foreground mb-1">{label}</p>}
      {children}
      {error && (
        <p className="text-xs text-danger" role="alert">{error}</p>
      )}
    </div>
  );
}

RadioGroup.displayName = "RadioGroup";
