import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export interface LazyComponent<T extends ComponentType = ComponentType> {
  component: LazyExoticComponent<T>;
  preload: () => Promise<T>;
}

/**
 * Creates a lazy component with a preload function.
 * Preload triggers the import without rendering — use for route hover prefetching.
 *
 * @example
 * ```ts
 * const LazyHome = createLazyComponent(() => import("@/pages/home"));
 * // On hover: LazyHome.preload()
 * // In JSX: <LazyHome.component />
 * ```
 */
export function createLazyComponent<T extends ComponentType>(
  factory: () => Promise<{ default: T }>,
): LazyComponent<T> {
  const component = lazy(factory);
  let promise: Promise<T> | null = null;

  const preload = (): Promise<T> => {
    promise ??= factory().then((m) => m.default);
    return promise;
  };

  return { component, preload };
}

export async function preloadAll(components: { preload: () => Promise<unknown> }[]): Promise<void> {
  await Promise.allSettled(components.map((c) => c.preload()));
}
