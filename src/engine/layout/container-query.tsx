/**
 * Container Query Support
 *
 * Component-level responsiveness based on parent container width.
 * Uses CSS container queries where available, with ResizeObserver fallback.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";

// ─── Types ───────────────────────────────────────────────────────

export interface ContainerQueryState {
  width: number;
  height: number;
  query: Record<string, boolean>;
}

export interface ContainerContextValue {
  name: string;
  widths: Record<string, number>;
  state: ContainerQueryState;
}

// ─── Context ─────────────────────────────────────────────────────

const ContainerContext = createContext<ContainerContextValue | null>(null);

// ─── Shared Utilities ────────────────────────────────────────────

function sortWidths(widths: Record<string, number>) {
  return Object.entries(widths)
    .sort(([, a], [, b]) => a - b)
    .map(([key, w]) => ({ key, width: w }));
}

function evaluateWidth(widths: { key: string; width: number }[], containerWidth: number) {
  const query: Record<string, boolean> = {};
  for (const { key, width } of widths) {
    query[key] = containerWidth >= width;
  }
  return query;
}

let _cssContainerQuerySupported: boolean | null = null;
function cssContainerQuerySupported(): boolean {
  if (_cssContainerQuerySupported !== null) return _cssContainerQuerySupported;
  _cssContainerQuerySupported =
    typeof window !== "undefined" &&
    typeof CSS !== "undefined" &&
    CSS.supports("container-type", "inline-size");
  return _cssContainerQuerySupported;
}

// ─── Provider ────────────────────────────────────────────────────

export interface ContainerQueryProviderProps {
  children: ReactNode;
  name: string;
  widths: Record<string, number>;
  className?: string;
}

export function ContainerQueryProvider({
  children,
  name,
  widths,
  className,
}: ContainerQueryProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ContainerQueryState>({
    width: 0,
    height: 0,
    query: {},
  });

  const sortedWidths = useMemo(() => sortWidths(widths), [widths]);

  const evaluateQueries = useCallback(
    (containerWidth: number, containerHeight: number) => {
      const query = evaluateWidth(sortedWidths, containerWidth);
      setState((prev) =>
        prev.width === containerWidth && prev.height === containerHeight
          ? prev
          : { width: containerWidth, height: containerHeight, query },
      );
    },
    [sortedWidths],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        evaluateQueries(width, height);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [evaluateQueries]);

  const value = useMemo<ContainerContextValue>(
    () => ({ name, widths, state }),
    [name, widths, state],
  );

  const style = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const { key, width } of sortedWidths) {
      vars[`--cq-${key}`] = `${String(width)}px`;
    }
    return vars;
  }, [sortedWidths]);

  const useCSS = cssContainerQuerySupported();

  return (
    <ContainerContext.Provider value={value}>
      {useCSS ? (
        <div
          ref={containerRef}
          className={className}
          style={{
            containerType: "inline-size",
            containerName: name,
            ...style,
          }}
        >
          {children}
        </div>
      ) : (
        <div ref={containerRef} className={className} style={style}>
          {children}
        </div>
      )}
    </ContainerContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────

export function useContainerQuery(name: string): ContainerQueryState {
  const ctx = useContext(ContainerContext);
  if (ctx?.name !== name) {
    return { width: 0, height: 0, query: {} };
  }
  return ctx.state;
}

export function useContainerSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  widths: Record<string, number> = {},
): ContainerQueryState {
  const [state, setState] = useState<ContainerQueryState>({
    width: 0,
    height: 0,
    query: {},
  });

  const sortedWidths = useMemo(() => sortWidths(widths), [widths]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const query = evaluateWidth(sortedWidths, width);
        setState((prev) =>
          prev.width === width && prev.height === height ? prev : { width, height, query },
        );
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, sortedWidths]);

  return state;
}

export function useContainerMatch(name: string, breakpoint: string): boolean {
  const { query } = useContainerQuery(name);
  return query[breakpoint] ?? false;
}

export function useContainerRange(
  name: string,
  widths: Record<string, number>,
): string | undefined {
  const { width } = useContainerQuery(name);
  const sorted = useMemo(() => Object.entries(widths).sort(([, a], [, b]) => b - a), [widths]);

  for (const [key, w] of sorted) {
    if (width >= w) return key;
  }
  return undefined;
}

// ─── CSS Utilities ───────────────────────────────────────────────

export function containerQueryCSS(name: string, widths: Record<string, number>): string {
  return Object.entries(widths)
    .sort(([, a], [, b]) => a - b)
    .map(([, w]) => `@container ${name} (min-width: ${String(w)}px)`)
    .join("\n");
}
