import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";
import { useId } from "../../shared-hooks";

type DrawerSide = "left" | "right" | "top" | "bottom";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: DrawerSide;
  contentId: string;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within a Drawer provider");
  }
  return context;
}

export interface DrawerProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
}

export function Drawer({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  side = "right",
}: DrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const contentId = useId("drawer");

  const setOpen = useCallback(
    (value: boolean) => {
      setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return <DrawerContext.Provider value={{ open, setOpen, side, contentId }}>{children}</DrawerContext.Provider>;
}

Drawer.displayName = "Drawer";

export interface DrawerTriggerProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
}

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ children, onClick, ...props }, ref) => {
    const { open, setOpen, contentId } = useDrawerContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
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

DrawerTrigger.displayName = "DrawerTrigger";

export interface DrawerOverlayProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useDrawerContext();

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-overlay-medium", className)}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

DrawerOverlay.displayName = "DrawerOverlay";

const sideStyles: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0 w-3/4 max-w-sm",
  right: "inset-y-0 right-0 w-3/4 max-w-sm",
  top: "inset-x-0 top-0 h-3/4 max-h-screen",
  bottom: "inset-x-0 bottom-0 h-3/4 max-h-screen",
};

const slideStyles: Record<DrawerSide, string> = {
  left: "-translate-x-full data-[state=open]:translate-x-0",
  right: "translate-x-full data-[state=open]:translate-x-0",
  top: "-translate-y-full data-[state=open]:translate-y-0",
  bottom: "translate-y-full data-[state=open]:translate-y-0",
};

export interface DrawerContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open, setOpen, side, contentId } = useDrawerContext();

    useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <>
        <DrawerOverlay />
        <div
          ref={ref}
          id={contentId}
          role="dialog"
          aria-modal="true"
          data-state={open ? "open" : "closed"}
          className={cn(
            "fixed z-50 bg-surface shadow-drawer border-border",
            "transition-transform duration-300 ease-in-out",
            sideStyles[side],
            slideStyles[side],
            side === "left" && "border-r",
            side === "right" && "border-l",
            side === "top" && "border-b",
            side === "bottom" && "border-t",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </>
    );
  },
);

DrawerContent.displayName = "DrawerContent";

export interface DrawerHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
        {children}
      </div>
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

export interface DrawerTitleProps extends ComponentPropsWithoutRef<"h2"> {
  children: ReactNode;
  className?: string;
}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props}>
        {children}
      </h2>
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps extends ComponentPropsWithoutRef<"p"> {
  children: ReactNode;
  className?: string;
}

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-sm text-foreground-secondary", className)} {...props}>
        {children}
      </p>
    );
  },
);

DrawerDescription.displayName = "DrawerDescription";

export interface DrawerBodyProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-y-auto p-6", className)} {...props}>
        {children}
      </div>
    );
  },
);

DrawerBody.displayName = "DrawerBody";

export interface DrawerFooterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center justify-end gap-2 p-6 border-t border-border", className)} {...props}>
        {children}
      </div>
    );
  },
);

DrawerFooter.displayName = "DrawerFooter";

export interface DrawerCloseProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
}

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ children, onClick, ...props }, ref) => {
    const { setOpen } = useDrawerContext();

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

DrawerClose.displayName = "DrawerClose";
