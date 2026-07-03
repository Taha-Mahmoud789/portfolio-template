/**
 * Focus Manager
 *
 * Manages focus state, focus traps, and focus restoration.
 * Integrates with the Experience Engine for accessible interactions.
 * Handles edge cases: empty containers, missing elements.
 */

import type { FocusManagerConfig } from "./types";
import { useExperienceStore } from "./store";
import { experienceEvents } from "./events";
import { FOCUS_DEFAULTS, FOCUSABLE_SELECTORS } from "./constants";

// ============================================================================
// Focus Manager
// ============================================================================

class FocusManagerImpl {
  private config: FocusManagerConfig = { ...FOCUS_DEFAULTS };
  private previousFocus: HTMLElement | null = null;
  private isTrapped = false;
  private trapContainer: HTMLElement | null = null;
  private cleanupFns: (() => void)[] = [];
  private isActive = false;

  init(config?: Partial<FocusManagerConfig>): void {
    if (this.isActive) return;
    this.config = { ...this.config, ...config };
    this.attachListeners();
    this.isActive = true;
  }

  destroy(): void {
    if (!this.isActive) return;
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
    this.releaseTrap();
    this.isActive = false;
  }

  updateConfig(config: Partial<FocusManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // --- Focus Trap ---

  trapFocus(container: HTMLElement): void {
    this.releaseTrap();
    this.previousFocus = document.activeElement as HTMLElement;
    this.trapContainer = container;
    this.isTrapped = true;

    const focusable = container.querySelectorAll(FOCUSABLE_SELECTORS);

    if (focusable.length === 0) {
      // No focusable elements — make container focusable and focus it
      container.setAttribute("tabindex", "-1");
      container.focus();
    } else {
      (focusable[0] as HTMLElement).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !this.isTrapped || !this.trapContainer) return;

      const elements = this.trapContainer.querySelectorAll(FOCUSABLE_SELECTORS);
      if (elements.length === 0) return;

      const first = elements[0] as HTMLElement;
      const last = elements[elements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    this.cleanupFns.push(() => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    });

    experienceEvents.emit("interaction:focus", { type: "trap-activated", container });
  }

  releaseTrap(): void {
    if (!this.isTrapped) return;
    this.isTrapped = false;
    this.trapContainer = null;

    if (this.previousFocus?.isConnected) {
      this.previousFocus.focus();
    }
    this.previousFocus = null;

    experienceEvents.emit("interaction:blur", { type: "trap-released" });
  }

  // --- Focus Management ---

  focusMainContent(): void {
    const el = document.querySelector(this.config.mainContentSelector);
    if (el) {
      (el as HTMLElement).focus();
    }
  }

  focusSkipLink(): void {
    const el = document.querySelector(this.config.skipLinkSelector);
    if (el) {
      (el as HTMLElement).focus();
    }
  }

  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));
  }

  // --- Listeners ---

  private attachListeners(): void {
    if (typeof window === "undefined") return;

    const onFocusIn = () => {
      useExperienceStore.getState().setInteractionState("focused");
    };

    const onFocusOut = () => {
      const store = useExperienceStore.getState();
      if (!this.isTrapped) {
        store.setInteractionState("idle");
      }
    };

    window.addEventListener("focusin", onFocusIn, { passive: true });
    window.addEventListener("focusout", onFocusOut, { passive: true });

    this.cleanupFns.push(
      () => window.removeEventListener("focusin", onFocusIn),
      () => window.removeEventListener("focusout", onFocusOut)
    );
  }
}

export const FocusManager = new FocusManagerImpl();

export function createFocusManager(): FocusManagerImpl {
  return new FocusManagerImpl();
}
