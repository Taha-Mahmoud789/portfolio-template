import { useState, useRef, useEffect, useCallback, forwardRef, type KeyboardEvent } from "react";
import { cn } from "@/utils";
import { CheckIcon, ChevronDownIcon } from "../../shared-icons";

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue = "",
      onChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found",
      error,
      disabled = false,
      id,
      className,
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = controlledValue ?? uncontrolledValue;
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );

    const selectedOption = options.find((option) => option.value === value);

    const handleChange = useCallback(
      (newValue: string) => {
        setUncontrolledValue(newValue);
        onChange?.(newValue);
        setOpen(false);
        setSearch("");
        setActiveIndex(-1);
      },
      [onChange],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setOpen(true);
            setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
            break;
          case "Enter":
            e.preventDefault();
            if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
              handleChange(filteredOptions[activeIndex].value);
            }
            break;
          case "Escape":
            setOpen(false);
            setSearch("");
            setActiveIndex(-1);
            break;
          case "Tab":
            setOpen(false);
            break;
        }
      },
      [open, activeIndex, filteredOptions, handleChange],
    );

    useEffect(() => {
      if (open && activeIndex >= 0 && listboxRef.current) {
        const activeItem = listboxRef.current.children[activeIndex] as HTMLElement;
        activeItem?.scrollIntoView({ block: "nearest" });
      }
    }, [activeIndex, open]);

    return (
      <div ref={ref} className={cn("relative flex flex-col gap-1.5 w-full", className)}>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={!!error}
          disabled={disabled}
          onClick={() => {
            setOpen(!open);
            inputRef.current?.focus();
          }}
          className={cn(
            "flex items-center justify-between w-full h-10 px-3 text-sm bg-surface text-foreground",
            "border border-border rounded-input",
            "focus:border-focus-ring focus:outline-none focus:ring-2 focus:ring-focus-ring/20",
            "transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selectedOption && "text-foreground-muted",
            error && "border-danger focus:border-danger focus:ring-danger/20",
          )}
        >
          <span className="truncate">{selectedOption?.label || placeholder}</span>
          <ChevronDownIcon
            className={cn("size-4 text-foreground-muted transition-transform shrink-0", open && "rotate-180")}
          />
        </button>

        {open && (
          <div
            ref={listboxRef}
            role="listbox"
            className={cn(
              "absolute z-50 w-full mt-1 bg-surface border border-border rounded-card shadow-dropdown",
              "max-h-60 overflow-auto",
            )}
          >
            <div className="p-1.5">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                aria-activedescendant={activeIndex >= 0 ? `combobox-option-${filteredOptions[activeIndex]?.value}` : undefined}
                className={cn(
                  "w-full h-8 px-2.5 text-sm bg-surface-inset text-foreground placeholder:text-foreground-muted",
                  "border-0 rounded-md focus:outline-none",
                )}
              />
            </div>
            <div className="p-1.5">
              {filteredOptions.length === 0 ? (
                <p className="py-2 px-2.5 text-sm text-foreground-muted">{emptyMessage}</p>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    id={`combobox-option-${option.value}`}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => !option.disabled && handleChange(option.value)}
                    className={cn(
                      "flex items-center px-2.5 py-1.5 text-sm rounded-md cursor-pointer",
                      "transition-colors",
                      option.value === value && "bg-primary/10 text-primary",
                      activeIndex === index && option.value !== value && "bg-hover-overlay",
                      option.disabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <CheckIcon className="size-4 ml-auto text-primary shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-danger" role="alert">{error}</p>
        )}
      </div>
    );
  },
);

Combobox.displayName = "Combobox";
