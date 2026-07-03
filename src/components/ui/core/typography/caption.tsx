import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type CaptionSize = "2xs" | "xs" | "sm";

type CaptionColor = "default" | "muted" | "subtle";

export interface CaptionProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
  size?: CaptionSize;
  color?: CaptionColor;
  className?: string;
}

const sizeStyles: Record<CaptionSize, string> = {
  "2xs": "text-2xs leading-normal",
  xs: "text-xs leading-normal",
  sm: "text-sm leading-normal",
};

const colorStyles: Record<CaptionColor, string> = {
  default: "text-foreground-secondary",
  muted: "text-foreground-muted",
  subtle: "text-foreground-subtle",
};

export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({ children, size = "xs", color = "default", className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-sans", sizeStyles[size], colorStyles[color], className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Caption.displayName = "Caption";
