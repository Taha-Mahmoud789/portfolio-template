import {
  useState,
  useRef,
  useCallback,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/utils";
import { useId } from "../../shared-hooks";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  side: TooltipSide;
  contentId: string;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip provider");
  }
  return context;
}

export interface TooltipProps {
  children: ReactNode;
  side?: TooltipSide;
  delay?: number;
}

export function Tooltip({ children, side = "top", delay = 200 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const contentId = useId("tooltip");

  const handleOpen = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(true), delay);
  }, [delay]);

  const handleClose = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef, contentRef, side, contentId }}>
      <div className="relative inline-flex" onMouseEnter={handleOpen} onMouseLeave={handleClose} onFocus={handleOpen} onBlur={handleClose}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

Tooltip.displayName = "Tooltip";

export interface TooltipTriggerProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  asChild?: boolean;
}

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, ...props }, ref) => {
    const { contentId } = useTooltipContext();
    return (
      <button
        ref={ref}
        type="button"
        aria-describedby={contentId}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TooltipTrigger.displayName = "TooltipTrigger";

const sideStyles: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export interface TooltipContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, ...props }, ref) => {
    const { open, side, contentId } = useTooltipContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        id={contentId}
        role="tooltip"
        className={cn(
          "absolute z-50 px-3 py-1.5 text-xs font-medium text-foreground-inverse bg-foreground rounded-tooltip shadow-tooltip whitespace-nowrap pointer-events-none",
          sideStyles[side],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TooltipContent.displayName = "TooltipContent";
