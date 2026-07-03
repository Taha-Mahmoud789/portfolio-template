import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type CardVariant = "default" | "interactive" | "selectable" | "outlined";

type CardPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  bordered?: boolean;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface shadow-card",
  interactive: "bg-surface shadow-card transition-all hover:shadow-elevation-3 hover:-translate-y-0.5 cursor-pointer",
  selectable: "bg-surface shadow-card transition-all hover:shadow-elevation-2 cursor-pointer",
  outlined: "bg-surface border border-border",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", padding = "md", bordered = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-card",
          variantStyles[variant],
          paddingStyles[padding],
          bordered && "border border-border",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends ComponentPropsWithoutRef<"h3"> {
  children: ReactNode;
  className?: string;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
        {...props}
      >
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
  className?: string;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-sm text-foreground-secondary", className)} {...props}>
        {children}
      </p>
    );
  },
);

CardDescription.displayName = "CardDescription";

export interface CardContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";
