import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils";

type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize;
  error?: string;
  fullWidth?: boolean;
  autoResize?: boolean;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: "min-h-[80px] text-xs px-2.5 py-2",
  md: "min-h-[100px] text-sm px-3 py-2.5",
  lg: "min-h-[120px] text-base px-4 py-3",
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = "md", error, fullWidth = true, disabled, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={cn(
            "flex w-full bg-surface text-foreground placeholder:text-foreground-muted",
            "border border-border focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/20",
            "transition-colors resize-y",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "rounded-input",
            sizeStyles[size],
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
