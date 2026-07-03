import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { LoadingSpinner } from "../../shared-icons";

type IconButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  icon: ReactNode;
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary:
    "bg-primary text-foreground-inverse hover:bg-primary-hover active:bg-primary-active focus-visible:ring-focus-ring",
  secondary:
    "bg-secondary text-foreground-inverse hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-focus-ring",
  outline:
    "border-2 border-border bg-transparent text-foreground hover:bg-hover-overlay active:bg-active-overlay focus-visible:ring-focus-ring",
  ghost:
    "bg-transparent text-foreground hover:bg-hover-overlay active:bg-active-overlay focus-visible:ring-focus-ring",
  danger:
    "bg-danger text-foreground-inverse hover:bg-danger-hover active:bg-danger-hover focus-visible:ring-danger",
};

const sizeStyles: Record<IconButtonSize, string> = {
  xs: "size-7 rounded-sm",
  sm: "size-8 rounded-md",
  md: "size-10 rounded-md",
  lg: "size-11 rounded-md",
  xl: "size-12 rounded-lg",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "ghost", size = "md", loading = false, disabled, className, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "select-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner className="size-4 shrink-0" />
        ) : (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
