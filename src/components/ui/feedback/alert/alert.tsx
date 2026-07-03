import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { CloseIcon } from "../../shared-icons";

type AlertVariant = "default" | "info" | "success" | "warning" | "danger";

export interface AlertProps extends ComponentPropsWithoutRef<"div"> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  default: "bg-surface border-border text-foreground",
  info: "bg-info-subtle border-info/20 text-info-foreground",
  success: "bg-success-subtle border-success/20 text-success-foreground",
  warning: "bg-warning-subtle border-warning/20 text-warning-foreground",
  danger: "bg-danger-subtle border-danger/20 text-danger-foreground",
};

const iconStyles: Record<AlertVariant, string> = {
  default: "text-foreground-secondary",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

function getDefaultIcon(variant: AlertVariant) {
  const iconClass = cn("size-5 shrink-0", iconStyles[variant]);

  if (variant === "info") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    );
  }

  if (variant === "success") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
    );
  }

  if (variant === "warning") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (variant === "danger") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "default", title, children, closable = false, onClose, icon, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex gap-3 p-4 rounded-lg border",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {icon ?? getDefaultIcon(variant)}
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
            <CloseIcon className="size-3.5" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
