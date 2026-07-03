import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

type HeadingWeight = "light" | "regular" | "medium" | "semibold" | "bold";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  children: ReactNode;
  as?: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  className?: string;
}

const sizeStyles: Record<HeadingSize, string> = {
  xs: "text-xs leading-tight tracking-tight",
  sm: "text-sm leading-tight tracking-tight",
  md: "text-base leading-snug tracking-tight",
  lg: "text-lg leading-snug tracking-tight",
  xl: "text-xl leading-tight tracking-tighter",
  "2xl": "text-2xl leading-tight tracking-tighter",
  "3xl": "text-3xl leading-none tracking-tighter",
  "4xl": "text-4xl leading-none tracking-tighter",
};

const weightStyles: Record<HeadingWeight, string> = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const defaultLevels: Record<HeadingSize, HeadingLevel> = {
  xs: "h6",
  sm: "h5",
  md: "h4",
  lg: "h3",
  xl: "h2",
  "2xl": "h2",
  "3xl": "h1",
  "4xl": "h1",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, as, size = "md", weight = "bold", className, ...props }, ref) => {
    const Component = as || defaultLevels[size];

    return (
      <Component
        ref={ref}
        className={cn(
          "font-heading text-foreground",
          sizeStyles[size],
          weightStyles[weight],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Heading.displayName = "Heading";
