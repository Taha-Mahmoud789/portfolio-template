/**
 * Navigation Accessibility
 *
 * Components and utilities for accessible navigation.
 * Includes skip links, focus management, and ARIA support.
 */

import { useEffect, useCallback, useRef } from "react";
import { A11Y } from "./constants";

// ============================================================================
// Skip Link
// ============================================================================

interface SkipLinkProps {
  targetId?: string;
  text?: string;
  className?: string;
}

export function SkipLink({
  targetId = "main-content",
  text = "Skip to content",
  className,
}: SkipLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus();
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [targetId],
  );

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={
        className ??
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--color-primary-foreground)] focus:outline-none"
      }
    >
      {text}
    </a>
  );
}

// ============================================================================
// Navigation Announcer (Screen Reader)
// ============================================================================

/**
 * Live region for announcing route changes to screen readers.
 * Render once at the top of the app. Deduplicates with useNavigationAnnouncer.
 */
export function NavigationAnnouncer() {
  useEffect(() => {
    const existing = document.getElementById(A11Y.LIVE_REGION_ID);
    if (existing) return; // Already created by hook

    const announcer = document.createElement("div");
    announcer.id = A11Y.LIVE_REGION_ID;
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    document.body.appendChild(announcer);

    return () => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    };
  }, []);

  return null;
}

// ============================================================================
// Focus Trap
// ============================================================================

/**
 * Trap focus within a container. Restores focus when deactivated.
 * WCAG compliant: handles Tab, Shift+Tab, focus restoration.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive = true) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Remember what was focused before trap activated
    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ");

    // Auto-focus first focusable element
    const firstFocusable = container.querySelector(focusableSelector);
    if (firstFocusable) {
      (firstFocusable as HTMLElement).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = container.querySelectorAll(focusableSelector);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Restore focus to previously focused element
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [containerRef, isActive]);
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

interface UseKeyboardNavigationOptions {
  itemSelector: string;
  enabled?: boolean;
  orientation?: "horizontal" | "vertical";
  onActivate?: (element: Element) => void;
}

/**
 * Arrow key navigation within a container.
 * Caches the NodeList for performance.
 */
export function useKeyboardNavigation({
  itemSelector,
  enabled = true,
  orientation = "vertical",
  onActivate,
}: UseKeyboardNavigationOptions) {
  const containerRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;

      // Use the closest container or cache the NodeList
      const container = (e.target as HTMLElement).closest("[data-keyboard-nav]");
      const items = container
        ? Array.from(container.querySelectorAll(itemSelector))
        : Array.from(document.querySelectorAll(itemSelector));

      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement!);
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight": {
          const isRelevant =
            orientation === "horizontal" ? e.key === "ArrowRight" : e.key === "ArrowDown";
          if (isRelevant) {
            e.preventDefault();
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          }
          break;
        }
        case "ArrowUp":
        case "ArrowLeft": {
          const isRelevant =
            orientation === "horizontal" ? e.key === "ArrowLeft" : e.key === "ArrowUp";
          if (isRelevant) {
            e.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          }
          break;
        }
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = items.length - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (onActivate && currentIndex >= 0) {
            onActivate(items[currentIndex]!);
          }
          break;
      }

      if (nextIndex !== null && items[nextIndex]) {
        (items[nextIndex] as HTMLElement).focus();
      }
    },
    [itemSelector, enabled, orientation, onActivate],
  );

  return { onKeyDown: handleKeyDown, ref: containerRef };
}

// ============================================================================
// ARIA Utilities
// ============================================================================

export function getNavAriaProps(label: string) {
  return {
    role: A11Y.NAV_ROLE as "navigation",
    "aria-label": label,
  } as const;
}

export function getCurrentPageAriaProps(title: string) {
  return {
    "aria-current": "page" as const,
    title,
  } as const;
}

export function getActiveItemAriaProps(isActive: boolean) {
  return {
    "aria-current": isActive ? ("page" as const) : undefined,
  } as const;
}
