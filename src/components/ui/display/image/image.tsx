import { forwardRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/utils";
import { ImageIcon } from "../../shared-icons";

type ImageRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

type ImageObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "radius"> {
  src: string;
  alt: string;
  radius?: ImageRadius;
  objectFit?: ImageObjectFit;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  fallback?: React.ReactNode;
  skeleton?: boolean;
  className?: string;
}

const radiusStyles: Record<ImageRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const Image = forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      src,
      alt,
      radius = "md",
      objectFit = "cover",
      width,
      height,
      aspectRatio,
      fallback,
      skeleton = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", radiusStyles[radius], className)}
        style={{
          width,
          height,
          aspectRatio,
        }}
      >
        {!isLoaded && skeleton && (
          <div className="absolute inset-0 bg-surface-inset animate-pulse" aria-hidden="true" />
        )}
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-inset text-foreground-muted">
            {fallback || <ImageIcon className="size-6" />}
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "size-full transition-opacity",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
            style={{ objectFit }}
            {...props}
          />
        )}
      </div>
    );
  },
);

Image.displayName = "Image";
