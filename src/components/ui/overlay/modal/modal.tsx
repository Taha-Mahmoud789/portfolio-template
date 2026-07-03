import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { CloseIcon } from "../../shared-icons";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: ModalSize;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, open = false, onClose, closeOnOverlayClick = true, size = "md", className, ...props }, ref) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-overlay-heavy backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-50 w-full mx-4 bg-surface rounded-modal shadow-modal border border-border p-6",
            "focus:outline-none",
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export interface ModalHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
        {children}
      </div>
    );
  },
);

ModalHeader.displayName = "ModalHeader";

export interface ModalTitleProps extends ComponentPropsWithoutRef<"h2"> {
  children: React.ReactNode;
  className?: string;
}

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props}>
        {children}
      </h2>
    );
  },
);

ModalTitle.displayName = "ModalTitle";

export interface ModalDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: React.ReactNode;
  className?: string;
}

export const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-sm text-foreground-secondary", className)} {...props}>
        {children}
      </p>
    );
  },
);

ModalDescription.displayName = "ModalDescription";

export interface ModalBodyProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-4", className)} {...props}>
        {children}
      </div>
    );
  },
);

ModalBody.displayName = "ModalBody";

export interface ModalFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center justify-end gap-2", className)} {...props}>
        {children}
      </div>
    );
  },
);

ModalFooter.displayName = "ModalFooter";

export interface ModalCloseProps extends ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
}

export const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ children, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        onClick={onClick}
        {...props}
      >
        {children || (
          <CloseIcon />
        )}
        <span className="sr-only">Close</span>
      </button>
    );
  },
);

ModalClose.displayName = "ModalClose";
