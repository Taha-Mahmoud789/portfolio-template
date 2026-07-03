/**
 * Navigation Breadcrumbs
 *
 * Breadcrumb navigation component with accessibility support.
 * Automatically generates breadcrumbs from the current route path.
 */

import { Link } from "react-router";
import { useBreadcrumbs } from "./hooks";
import type { BreadcrumbItem } from "./types";

// ============================================================================
// Breadcrumb Component
// ============================================================================

interface BreadcrumbsProps {
  /** Custom breadcrumb items (overrides auto-generation) */
  items?: BreadcrumbItem[];
  /** Separator character */
  separator?: string;
  /** Custom className */
  className?: string;
  /** Whether to show home icon */
  showHome?: boolean;
  /** Home label */
  homeLabel?: string;
  /** Home path */
  homePath?: string;
}

/**
 * Accessible breadcrumb navigation.
 */
export function Breadcrumbs({
  items,
  separator = "/",
  className,
  showHome = true,
  homeLabel = "Home",
  homePath = "/",
}: BreadcrumbsProps) {
  const autoBreadcrumbs = useBreadcrumbs();
  const breadcrumbItems = items ?? autoBreadcrumbs;

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: homeLabel, path: homePath }, ...breadcrumbItems]
    : breadcrumbItems;

  if (allItems.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-foreground-muted)]">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li
              key={item.path}
              className="flex items-center gap-1"
            >
              {index > 0 && (
                <span
                  className="text-[var(--color-foreground-disabled)] select-none"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-[var(--color-foreground)]"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="transition-colors hover:text-[var(--color-foreground)] hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ============================================================================
// Breadcrumb Item Component (for custom rendering)
// ============================================================================

interface BreadcrumbItemProps {
  item: BreadcrumbItem;
  isLast: boolean;
  separator?: string;
}

/**
 * Individual breadcrumb item with proper accessibility.
 */
export function BreadcrumbItemComponent({
  item,
  isLast,
  separator = "/",
}: BreadcrumbItemProps) {
  return (
    <li className="flex items-center gap-1">
      <span
        className="text-[var(--color-foreground-disabled)] select-none"
        aria-hidden="true"
      >
        {separator}
      </span>
      {isLast ? (
        <span
          aria-current="page"
          className="font-medium text-[var(--color-foreground)]"
        >
          {item.label}
        </span>
      ) : (
        <Link
          to={item.path}
          className="transition-colors hover:text-[var(--color-foreground)] hover:underline"
        >
          {item.label}
        </Link>
      )}
    </li>
  );
}
