import {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog provider");
  }
  return context;
}

export interface DialogProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ children, defaultOpen = false, open: controlledOpen, onOpenChange }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

Dialog.displayName = "Dialog";

export interface DialogTriggerProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, onClick, ...props }, ref) => {
    const { open, setOpen } = useDialogContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(e) => {
          setOpen(!open);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

DialogTrigger.displayName = "DialogTrigger";

export interface DialogPortalProps {
  children: ReactNode;
}

export function DialogPortal({ children }: DialogPortalProps) {
  const { open } = useDialogContext();

  if (!open) return null;

  return <>{children}</>;
}

DialogPortal.displayName = "DialogPortal";

export interface DialogOverlayProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-overlay-heavy backdrop-blur-sm", className)}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...props }, _ref) => {
    const { setOpen } = useDialogContext();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }

      document.addEventListener("keydown", handleEscape);
      contentRef.current?.focus();

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [setOpen]);

    return (
      <div
        ref={contentRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "bg-surface rounded-modal shadow-modal border border-border",
          "p-6",
          "focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}>
        {children}
      </div>
    );
  },
);

DialogHeader.displayName = "DialogHeader";

export interface DialogTitleProps extends ComponentPropsWithoutRef<"h2"> {
  children: ReactNode;
  className?: string;
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)} {...props}>
        {children}
      </h2>
    );
  },
);

DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
  className?: string;
}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-sm text-foreground-secondary", className)} {...props}>
        {children}
      </p>
    );
  },
);

DialogDescription.displayName = "DialogDescription";

export interface DialogFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}>
        {children}
      </div>
    );
  },
);

DialogFooter.displayName = "DialogFooter";

export interface DialogCloseProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          setOpen(false);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

DialogClose.displayName = "DialogClose";
