/**
 * Scroll Restoration
 *
 * Single source of truth for scroll position management.
 * Uses a class-based manager for persistence + a hook for React integration.
 */

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import { useNavigationStore } from "./store";
import { SCROLL_RESTORATION_DEFAULTS } from "./constants";
import type { ScrollRestorationConfig } from "./types";

// ============================================================================
// Scroll Position Manager (singleton)
// ============================================================================

class ScrollPositionManager {
  private positions = new Map<string, number>();
  private maxPositions: number;

  constructor(maxPositions = SCROLL_RESTORATION_DEFAULTS.maxPositions) {
    this.maxPositions = maxPositions;
    this.loadFromStorage();
  }

  save(path: string, position: number): void {
    this.positions.set(path, position);
    this.prune();
    this.saveToStorage();
  }

  get(path: string): number {
    return this.positions.get(path) ?? 0;
  }

  remove(path: string): void {
    this.positions.delete(path);
    this.saveToStorage();
  }

  clear(): void {
    this.positions.clear();
    localStorage.removeItem(SCROLL_RESTORATION_DEFAULTS.storageKey);
  }

  private prune(): void {
    if (this.positions.size > this.maxPositions) {
      const entries = Array.from(this.positions.entries());
      const toRemove = entries.slice(0, entries.length - this.maxPositions);
      for (const [key] of toRemove) {
        this.positions.delete(key);
      }
    }
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.positions);
      localStorage.setItem(SCROLL_RESTORATION_DEFAULTS.storageKey, JSON.stringify(data));
    } catch {
      // localStorage full or unavailable
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(SCROLL_RESTORATION_DEFAULTS.storageKey);
      if (data) {
        this.positions = new Map(Object.entries(JSON.parse(data) as Record<string, number>));
      }
    } catch {
      // corrupt data
    }
  }
}

export const scrollPositionManager = new ScrollPositionManager();

// ============================================================================
// Scroll Restoration Hook
// ============================================================================

type UseScrollRestorationOptions = Partial<ScrollRestorationConfig>;

/**
 * Automatically saves and restores scroll position across route changes.
 * Single implementation - no duplicates.
 */
export function useScrollRestoration(options: UseScrollRestorationOptions = {}) {
  const configRef = useRef({ ...SCROLL_RESTORATION_DEFAULTS, ...options });
  const location = useLocation();
  const saveScrollPosition = useNavigationStore((s) => s.saveScrollPosition);
  const previousPathRef = useRef(location.pathname);
  const restoringRef = useRef(false);

  // Save scroll position when leaving a route
  useEffect(() => {
    const leavingPath = previousPathRef.current;
    return () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollPositionManager.save(leavingPath, scrollY);
      saveScrollPosition(leavingPath, scrollY);
    };
  }, [location.pathname, saveScrollPosition]);

  // Restore scroll position when arriving at a route
  useEffect(() => {
    const config = configRef.current;
    if (!config.restore) {
      previousPathRef.current = location.pathname;
      return;
    }

    // Skip the first render (no previous path to save)
    if (previousPathRef.current === location.pathname) return;

    const savedPosition = scrollPositionManager.get(location.pathname);

    restoringRef.current = true;
    const timer = setTimeout(() => {
      if (config.scrollToTop && !savedPosition) {
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (savedPosition) {
        window.scrollTo({ top: savedPosition, behavior: "instant" });
      }
      restoringRef.current = false;
      previousPathRef.current = location.pathname;
    }, config.restoreDelay);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const savePosition = useCallback(
    (position: number) => {
      scrollPositionManager.save(location.pathname, position);
      saveScrollPosition(location.pathname, position);
    },
    [location.pathname, saveScrollPosition],
  );

  const getPosition = useCallback(
    () => scrollPositionManager.get(location.pathname),
    [location.pathname],
  );

  const clearPositions = useCallback(() => {
    scrollPositionManager.clear();
  }, []);

  return useMemo(
    () => ({ savePosition, getPosition, clearPositions }),
    [savePosition, getPosition, clearPositions],
  );
}

// ============================================================================
// Utilities
// ============================================================================

export function scrollToTop(behavior: ScrollBehavior = "instant"): void {
  window.scrollTo({ top: 0, behavior });
}

export function scrollToElement(selector: string, behavior: ScrollBehavior = "instant"): void {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior, block: "start" });
  }
}
