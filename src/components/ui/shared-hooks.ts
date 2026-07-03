import { useState, useCallback, useEffect, useRef } from "react";

interface UseControllableStateOptions<T> {
  defaultValue: T;
  value?: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  defaultValue,
  value: controlledValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (nextValue: T) => {
      setUncontrolledValue(nextValue);
      onChangeRef.current?.(nextValue);
    },
    [],
  );

  return [value, setValue];
}

export function useControllableBoolean({
  defaultValue = false,
  value: controlledValue,
  onChange,
}: {
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}): [boolean, (value: boolean) => void] {
  return useControllableState({
    defaultValue,
    value: controlledValue,
    onChange,
  });
}

export function useEscapeKey(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handler, enabled]);
}

export function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      const isInside = refs.some((ref) => ref.current?.contains(target));
      if (!isInside) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [refs, handler, enabled]);
}

export function useId(prefix = "ui") {
  const idRef = useRef(`${prefix}-${Math.random().toString(36).slice(2, 9)}`);
  return idRef.current;
}
