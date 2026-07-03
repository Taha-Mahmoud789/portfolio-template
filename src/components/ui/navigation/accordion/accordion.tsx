import { useState, useCallback, createContext, useContext, forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { ChevronDownIcon } from "../../shared-icons";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion provider");
  }
  return context;
}

export interface AccordionProps {
  children: ReactNode;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function Accordion({
  children,
  defaultExpanded = [],
  expanded: controlledExpanded,
  onExpandedChange,
  multiple = false,
  className,
}: AccordionProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const expanded = controlledExpanded ? new Set(controlledExpanded) : uncontrolledExpanded;

  const toggle = useCallback(
    (value: string) => {
      const newExpanded = new Set(expanded);

      if (newExpanded.has(value)) {
        newExpanded.delete(value);
      } else {
        if (!multiple) {
          newExpanded.clear();
        }
        newExpanded.add(value);
      }

      setUncontrolledExpanded(newExpanded);
      onExpandedChange?.(Array.from(newExpanded));
    },
    [expanded, multiple, onExpandedChange],
  );

  return (
    <AccordionContext.Provider value={{ expandedItems: expanded, toggle }}>
      <div className={cn("divide-y divide-border border border-border rounded-card", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.displayName = "Accordion";

export interface AccordionItemProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({ children, value, disabled = false, className }: AccordionItemProps) {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.has(value);

  return (
    <div data-state={isExpanded ? "open" : "closed"} className={cn(className)}>
      {typeof children === "function"
        ? (children as (props: { expanded: boolean; disabled: boolean }) => ReactNode)({
            expanded: isExpanded,
            disabled,
          })
        : children}
    </div>
  );
}

AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, value, disabled = false, className, ...props }, ref) => {
    const { expandedItems, toggle } = useAccordionContext();
    const isExpanded = expandedItems.has(value);

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isExpanded}
        disabled={disabled}
        onClick={() => toggle(value)}
        className={cn(
          "flex w-full items-center justify-between py-4 px-4 text-sm font-medium text-left",
          "text-foreground transition-colors",
          "hover:bg-hover-overlay",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-foreground-muted transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>
    );
  },
);

AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  value?: string;
  className?: string;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, value, className, ...props }, ref) => {
    const { expandedItems } = useAccordionContext();

    if (value && !expandedItems.has(value)) return null;

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden text-sm", className)}
        {...props}
      >
        <div className="px-4 pb-4 pt-0">{children}</div>
      </div>
    );
  },
);

AccordionContent.displayName = "AccordionContent";
