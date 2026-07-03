import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils";
import { useId } from "../../shared-hooks";

type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "type"> {
  size?: SwitchSize;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
}

const sizeStyles: Record<SwitchSize, string> = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-14",
};

const thumbSizeStyles: Record<SwitchSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const thumbTranslateStyles: Record<SwitchSize, string> = {
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-7",
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size = "md", checked = false, onCheckedChange, label, error, disabled, id, ...props }, ref) => {
    const fallbackId = useId("switch");
    const switchId = id || props.name || fallbackId;

    return (
      <div className="flex items-center gap-2">
        <button
          ref={ref}
          type="button"
          role="switch"
          id={switchId}
          aria-checked={checked}
          aria-invalid={!!error}
          aria-describedby={error ? `${switchId}-error` : undefined}
          disabled={disabled}
          onClick={() => onCheckedChange?.(!checked)}
          className={cn(
            "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            checked ? "bg-primary" : "bg-surface-inset border-border",
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none block rounded-full bg-foreground shadow-sm ring-0 transition-transform",
              checked ? thumbTranslateStyles[size] : "translate-x-0.5",
              thumbSizeStyles[size],
            )}
            aria-hidden="true"
          />
        </button>
        {label && (
          <label
            htmlFor={switchId}
            className={cn(
              "text-sm font-medium text-foreground leading-none",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p id={`${switchId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";
