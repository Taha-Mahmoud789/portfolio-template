import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { LoadingSpinner } from "../../shared-icons";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
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
  link: "bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-focus-ring p-0 h-auto",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs rounded-sm gap-1.5",
  sm: "h-8 px-3 text-sm rounded-md gap-2",
  md: "h-10 px-4 text-sm rounded-md gap-2",
  lg: "h-11 px-6 text-base rounded-md gap-2.5",
  xl: "h-12 px-8 text-base rounded-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      type,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "select-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner className="size-4 shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
