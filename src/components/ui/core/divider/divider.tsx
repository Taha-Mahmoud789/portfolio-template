import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type DividerOrientation = "horizontal" | "vertical";

type DividerSize = "thin" | "base" | "thick";

export interface DividerProps extends ComponentPropsWithoutRef<"hr"> {
  orientation?: DividerOrientation;
  size?: DividerSize;
  withLabel?: boolean;
  className?: string;
}

const sizeStyles: Record<DividerSize, string> = {
  thin: "border-t",
  base: "border-t-2",
  thick: "border-t-[3px]",
};

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", size = "thin", className, ...props }, ref) => {
    if (orientation === "vertical") {
      return (
        <div
          role="separator"
          aria-orientation="vertical"
          className={cn(
            "h-auto self-stretch border-l border-border",
            size === "base" && "border-l-2",
            size === "thick" && "border-l-[3px]",
            className,
          )}
        />
      );
    }

    return (
      <hr
        ref={ref}
        role="separator"
        className={cn("border-0 border-border", sizeStyles[size], className)}
        {...props}
      />
    );
  },
);

Divider.displayName = "Divider";
