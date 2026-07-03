import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { ChevronRightIcon } from "../../shared-icons";

export interface PaginationProps extends ComponentPropsWithoutRef<"nav"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function generatePagination(currentPage: number, totalPages: number, siblingCount: number) {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "dots-right", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
    return [1, "dots-left", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, "dots-left", ...middleRange, "dots-right", totalPages];
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, siblingCount = 1, className, ...props }, ref) => {
    const pages = generatePagination(currentPage, totalPages, siblingCount);

    return (
      <nav ref={ref} aria-label="Pagination" className={cn("flex items-center gap-1", className)} {...props}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={cn(
            "size-9 inline-flex items-center justify-center rounded-md text-sm font-medium",
            "text-foreground hover:bg-hover-overlay transition-colors",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <ChevronRightIcon className="size-4 rotate-180" />
        </button>

        {pages.map((page) => {
          if (typeof page === "string") {
            return (
              <span key={page} className="size-9 inline-flex items-center justify-center text-foreground-muted">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "size-9 inline-flex items-center justify-center rounded-md text-sm font-medium",
                "transition-colors",
                page === currentPage
                  ? "bg-primary text-foreground-inverse"
                  : "text-foreground hover:bg-hover-overlay",
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={cn(
            "size-9 inline-flex items-center justify-center rounded-md text-sm font-medium",
            "text-foreground hover:bg-hover-overlay transition-colors",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";
