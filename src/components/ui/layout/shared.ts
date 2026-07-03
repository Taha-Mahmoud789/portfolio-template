import { useBreakpoint } from "@/engine/layout/responsive/hooks";
import { resolveResponsive, type Responsive } from "@/engine/layout/responsive/responsive-props";

/**
 * Resolves a Responsive<T> prop to its value for the current breakpoint.
 *
 * @example
 * const size = useResponsiveValue(props.size); // { sm: "sm", lg: "xl" } => "lg" at lg breakpoint
 */
export function useResponsiveValue<T>(value: Responsive<T>): T {
  const bp = useBreakpoint();
  return resolveResponsive(value, bp);
}

/**
 * Resolves multiple Responsive<T> props at once.
 *
 * @example
 * const { align, gap } = useResponsiveProps({ align: { sm: "start", lg: "center" }, gap: "md" });
 */
export function useResponsiveProps<T extends Record<string, Responsive<unknown>>>(
  props: T,
): { [K in keyof T]: T[K] extends Responsive<infer V> ? V : never } {
  const bp = useBreakpoint();
  const result = {} as Record<string, unknown>;

  for (const key of Object.keys(props)) {
    result[key] = resolveResponsive(props[key] as Responsive<unknown>, bp);
  }

  return result as { [K in keyof T]: T[K] extends Responsive<infer V> ? V : never };
}
