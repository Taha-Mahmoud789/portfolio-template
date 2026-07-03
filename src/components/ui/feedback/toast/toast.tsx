import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { CloseIcon } from "../../shared-icons";

type ToastVariant = "default" | "info" | "success" | "warning" | "danger";

type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

export interface ToastProps extends ComponentPropsWithoutRef<"div"> {
  variant?: ToastVariant;
  title?: string;
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-surface border-border text-foreground shadow-toast",
  info: "bg-info-subtle border-info/20 text-info-foreground shadow-toast",
  success: "bg-success-subtle border-success/20 text-success-foreground shadow-toast",
  warning: "bg-warning-subtle border-warning/20 text-warning-foreground shadow-toast",
  danger: "bg-danger-subtle border-danger/20 text-danger-foreground shadow-toast",
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = "default", title, children, closable = true, onClose, icon, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "relative flex gap-3 p-4 rounded-lg border min-w-[300px] max-w-[420px]",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className="font-medium text-sm mb-1">{title}</h5>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-foreground/10 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="size-3" />
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";

export interface ToastContainerProps {
  children: ReactNode;
  position?: ToastPosition;
  className?: string;
}

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export function ToastContainer({ children, position = "bottom-right", className }: ToastContainerProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed z-[100] flex flex-col gap-2",
        positionStyles[position],
        className,
      )}
    >
      {children}
    </div>
  );
}

ToastContainer.displayName = "ToastContainer";
