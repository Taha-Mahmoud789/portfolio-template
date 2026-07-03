import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { Spinner } from "../../feedback/spinner";

type LoadingSize = "sm" | "md" | "lg" | "fullscreen";

export interface LoadingStateProps extends ComponentPropsWithoutRef<"div"> {
  size?: LoadingSize;
  label?: string;
  fullPage?: boolean;
  className?: string;
}

const sizeStyles: Record<LoadingSize, string> = {
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  fullscreen: "min-h-screen",
};

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ size = "md", label = "Loading...", fullPage = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(
          "flex flex-col items-center justify-center",
          fullPage && sizeStyles.fullscreen,
          !fullPage && sizeStyles[size],
          className,
        )}
        {...props}
      >
        <Spinner size={size === "sm" ? "md" : "lg"} />
        {label && (
          <p className="mt-4 text-sm text-foreground-secondary">{label}</p>
        )}
      </div>
    );
  },
);

LoadingState.displayName = "LoadingState";
