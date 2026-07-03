import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

export interface ErrorStateProps extends ComponentPropsWithoutRef<"div"> {
  icon?: ReactNode;
  title?: string;
  description?: string;
  error?: Error | string;
  retry?: () => void;
  className?: string;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ icon, title = "Something went wrong", description, error, retry, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className,
        )}
        {...props}
      >
        <div className="mb-4 text-danger">
          {icon || (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-foreground-secondary max-w-sm mb-2">{description}</p>
        )}
        {error && (
          <p className="text-xs text-foreground-muted max-w-sm mb-4 font-mono">
            {typeof error === "string" ? error : error.message}
          </p>
        )}
        {retry && (
          <button
            type="button"
            onClick={retry}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md",
              "bg-primary text-foreground-inverse hover:bg-primary-hover",
              "transition-colors",
            )}
          >
            Try again
          </button>
        )}
      </div>
    );
  },
);

ErrorState.displayName = "ErrorState";
