import { forwardRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type AvatarShape = "circle" | "square" | "rounded";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size"> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "size-6 text-2xs",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
  "2xl": "size-20 text-xl",
};

const shapeStyles: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function generateColor(str: string): string {
  const colors = [
    "bg-primary/20 text-primary",
    "bg-secondary/20 text-secondary",
    "bg-success/20 text-success",
    "bg-warning/20 text-warning",
    "bg-danger/20 text-danger",
    "bg-info/20 text-info",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]!;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", fallback, size = "md", shape = "circle", className, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    const showImage = src && !hasError;
    const showFallback = !showImage;

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
          sizeStyles[size],
          shapeStyles[shape],
          showFallback && fallback && generateColor(fallback),
          showFallback && "bg-surface-inset text-foreground-muted font-medium",
          className,
        )}
        aria-label={alt}
        role="img"
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="size-full object-cover"
            {...props}
          />
        ) : (
          <span aria-hidden="true">{fallback ? getInitials(fallback) : null}</span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ children, max = 3, size = "md", className }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visible = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible}
      {remaining > 0 && (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-surface-inset text-foreground-muted font-medium border-2 border-background",
            sizeStyles[size],
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

AvatarGroup.displayName = "AvatarGroup";
