import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import type { Responsive } from "@/engine/layout/responsive/responsive-props";
import { useResponsiveValue } from "../shared";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "prose" | "full";

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  size?: Responsive<ContainerSize>;
  padded?: boolean;
  centered?: boolean;
  className?: string;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "3xl": "max-w-[1800px]",
  prose: "max-w-prose",
  full: "max-w-full",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size = "lg", padded = true, centered = true, className, ...props }, ref) => {
    const resolvedSize = useResponsiveValue(size);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          sizeStyles[resolvedSize],
          padded && "px-4 sm:px-6 lg:px-8",
          centered && "mx-auto",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";
