import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { Spinner } from "../spinner";

type LoaderSize = "sm" | "md" | "lg";

type LoaderVariant = "spinner" | "dots" | "bar";

export interface LoaderProps extends ComponentPropsWithoutRef<"div"> {
  size?: LoaderSize;
  variant?: LoaderVariant;
  label?: string;
  className?: string;
}

const sizeStyles: Record<LoaderSize, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ size = "md", variant = "spinner", label = "Loading", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn("flex flex-col items-center justify-center", sizeStyles[size], className)}
        {...props}
      >
        {variant === "spinner" && (
          <Spinner size={size === "sm" ? "sm" : size === "md" ? "md" : "lg"} />
        )}
        {variant === "dots" && <LoadingDots size={size} />}
        {variant === "bar" && <LoadingBar />}
      </div>
    );
  },
);

Loader.displayName = "Loader";

function LoadingDots({ size }: { size: LoaderSize }) {
  const dotSize = size === "sm" ? "size-1" : size === "md" ? "size-1.5" : "size-2";

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(dotSize, "rounded-full bg-current animate-bounce")}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function LoadingBar() {
  return (
    <div className="w-48 h-1 bg-surface-inset rounded-full overflow-hidden" aria-hidden="true">
      <div className="h-full bg-primary rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
    </div>
  );
}
