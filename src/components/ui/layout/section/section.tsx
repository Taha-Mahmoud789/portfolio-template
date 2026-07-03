import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import type { Responsive } from "@/engine/layout/responsive/responsive-props";
import { useResponsiveValue } from "../shared";

type SectionSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  size?: Responsive<SectionSize>;
  padded?: boolean;
  className?: string;
}

const sizeStyles: Record<SectionSize, string> = {
  xs: "py-8",
  sm: "py-12",
  md: "py-16",
  lg: "py-24",
  xl: "py-32",
  "2xl": "py-48",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, size = "md", padded = true, className, ...props }, ref) => {
    const resolvedSize = useResponsiveValue(size);

    return (
      <section
        ref={ref}
        className={cn(sizeStyles[resolvedSize], padded && "px-4 sm:px-6 lg:px-8", className)}
        {...props}
      >
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";
