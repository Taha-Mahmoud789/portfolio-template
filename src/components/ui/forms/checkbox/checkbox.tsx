import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils";
import { CheckIcon } from "../../shared-icons";

type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: CheckboxSize;
  label?: string;
  error?: string;
}

const sizeStyles: Record<CheckboxSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const iconSizeStyles: Record<CheckboxSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "md", label, error, disabled, id, checked, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            className={cn(
              "peer sr-only",
              className,
            )}
            {...props}
          />
          <div
            className={cn(
              "flex items-center justify-center rounded-sm border-2 border-border bg-surface",
              "transition-colors",
              "peer-checked:border-primary peer-checked:bg-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              sizeStyles[size],
            )}
            aria-hidden="true"
          >
            {checked && (
              <CheckIcon className={cn(iconSizeStyles[size], "text-foreground-inverse")} />
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "text-sm font-medium text-foreground leading-none",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p id={`${checkboxId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
