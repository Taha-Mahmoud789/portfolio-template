import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-lg",
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "text", width, height, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(
          "bg-surface-inset animate-pulse",
          variantStyles[variant],
          className,
        )}
        style={{
          width: width ?? (variant === "circular" || variant === "rectangular" ? undefined : "100%"),
          height: height ?? (variant === "circular" ? 40 : undefined),
          aspectRatio: variant === "circular" ? "1" : undefined,
        }}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "80%" : "100%"}
        />
      ))}
    </div>
  );
}

SkeletonText.displayName = "SkeletonText";

export interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton variant="rounded" height={200} />
      <Skeleton variant="text" width="60%" height={20} />
      <SkeletonText lines={2} />
    </div>
  );
}

SkeletonCard.displayName = "SkeletonCard";
