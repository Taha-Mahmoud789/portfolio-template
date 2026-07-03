import { forwardRef, useState, useCallback, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { cn } from "@/utils";
import { LoadingSpinner, SearchIcon } from "../../shared-icons";

export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  error?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "h-8 text-xs pl-8 pr-8",
  md: "h-10 text-sm pl-10 pr-10",
  lg: "h-12 text-base pl-12 pr-12",
};

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ className, size = "md", loading = false, onSearch, onClear, value: controlledValue, error, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(controlledValue || "");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        props.onChange?.({
          target: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>);
      },
      [props.onChange],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          onSearch?.(String(value));
        }
      },
      [onSearch, value],
    );

    const handleClear = useCallback(() => {
      setInternalValue("");
      onClear?.();
      onSearch?.("");
    }, [onClear, onSearch]);

    const iconSizes: Record<string, string> = {
      sm: "size-4 left-2.5",
      md: "size-5 left-3",
      lg: "size-5 left-4",
    };

    const clearSizes: Record<string, string> = {
      sm: "size-3.5 right-2.5",
      md: "size-4 right-3",
      lg: "size-4 right-4",
    };

    return (
      <div className="relative w-full">
        <div className={cn("absolute inset-y-0 left-0 flex items-center pointer-events-none", iconSizes[size])}>
          {loading ? (
            <LoadingSpinner className={cn("text-foreground-muted", size === "sm" ? "size-3.5" : "size-4")} />
          ) : (
            <SearchIcon className="text-foreground-muted" />
          )}
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id || "search"}-error` : undefined}
          className={cn(
            "w-full bg-surface text-foreground placeholder:text-foreground-muted",
            "border border-border focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/20",
            "transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "rounded-input",
            sizeStyles[size],
            className,
          )}
          {...props}
        />
        {String(value).length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute inset-y-0 right-0 flex items-center justify-center text-foreground-muted hover:text-foreground",
              "transition-colors",
              clearSizes[size],
            )}
            aria-label="Clear search"
          >
            <svg
              className={size === "sm" ? "size-3" : "size-3.5"}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 3L3 9M3 3l6 6" />
            </svg>
          </button>
        )}
        {error && (
          <p id={`${props.id || "search"}-error`} className="text-xs text-danger mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Search.displayName = "Search";
