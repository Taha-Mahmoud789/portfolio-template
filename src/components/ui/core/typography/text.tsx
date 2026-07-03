import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

type TextSize = "2xs" | "xs" | "sm" | "base" | "lg" | "xl" | "2xl";

type TextWeight = "light" | "regular" | "medium" | "semibold" | "bold";

type TextColor = "default" | "secondary" | "muted" | "subtle" | "inverse";

export interface TextProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
  as?: "p" | "span" | "div";
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  className?: string;
}

const sizeStyles: Record<TextSize, string> = {
  "2xs": "text-2xs leading-normal",
  xs: "text-xs leading-normal",
  sm: "text-sm leading-normal",
  base: "text-base leading-normal",
  lg: "text-lg leading-normal",
  xl: "text-xl leading-snug",
  "2xl": "text-2xl leading-snug",
};

const weightStyles: Record<TextWeight, string> = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorStyles: Record<TextColor, string> = {
  default: "text-foreground",
  secondary: "text-foreground-secondary",
  muted: "text-foreground-muted",
  subtle: "text-foreground-subtle",
  inverse: "text-foreground-inverse",
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      children,
      as: Component = "p",
      size = "base",
      weight = "regular",
      color = "default",
      italic = false,
      underline = false,
      strikethrough = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "font-sans",
          sizeStyles[size],
          weightStyles[weight],
          colorStyles[color],
          italic && "italic",
          underline && "underline",
          strikethrough && "line-through",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
