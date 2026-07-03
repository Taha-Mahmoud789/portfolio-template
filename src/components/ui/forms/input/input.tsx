import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils";

type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  error?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 text-xs px-2.5",
  md: "h-10 text-sm px-3",
  lg: "h-12 text-base px-4",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size = "md", error, leftAddon, rightAddon, fullWidth = true, disabled, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        <div className="flex items-center">
          {leftAddon && (
            <span className="flex items-center justify-center h-10 px-3 bg-surface-inset border border-r-0 border-border rounded-l-input text-foreground-muted text-sm">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "flex w-full bg-surface text-foreground placeholder:text-foreground-muted",
              "border border-border focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/20",
              "transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              sizeStyles[size],
              leftAddon && "rounded-l-none",
              rightAddon && "rounded-r-none",
              !leftAddon && "rounded-l-input",
              !rightAddon && "rounded-r-input",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="flex items-center justify-center h-10 px-3 bg-surface-inset border border-l-0 border-border rounded-r-input text-foreground-muted text-sm">
              {rightAddon}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

interface InputGroupProps {
  children: ReactNode;
  className?: string;
}

export function InputGroup({ children, className }: InputGroupProps) {
  return <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>;
}

InputGroup.displayName = "InputGroup";

interface InputLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function InputLabel({ children, htmlFor, required = false, className }: InputLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-medium text-foreground", className)}
    >
      {children}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  );
}

InputLabel.displayName = "InputLabel";

interface InputHelperProps {
  children: ReactNode;
  className?: string;
}

export function InputHelper({ children, className }: InputHelperProps) {
  return (
    <p className={cn("text-xs text-foreground-muted", className)}>{children}</p>
  );
}

InputHelper.displayName = "InputHelper";
