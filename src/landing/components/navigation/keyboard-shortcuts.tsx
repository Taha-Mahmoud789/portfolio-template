/**
 * KeyboardShortcuts — Press ? to reveal keyboard shortcuts
 *
 * Minimal overlay showing available shortcuts.
 * ESC closes. Respects reduced motion.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";

const SHORTCUTS = [
  { key: "K", label: "Command menu" },
  { key: "?", label: "Show shortcuts" },
  { key: "ESC", label: "Close overlay" },
  { key: "↑", label: "Back to top" },
] as const;

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Listen for ? key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Animation
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -12, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: ANIMATION_EASINGS.expoOut,
          delay: 0.05,
        },
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.15 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="kb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{ opacity: 0 }}
    >
      <div ref={panelRef} className="kb-panel" style={{ opacity: 0 }}>
        <div className="kb-header">
          <span className="kb-title">Keyboard Shortcuts</span>
          <button
            type="button"
            onClick={handleClose}
            className="kb-close"
            aria-label="Close shortcuts"
          >
            <kbd>ESC</kbd>
          </button>
        </div>
        <div className="kb-list">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.key} className="kb-item">
              <kbd className="kb-key">{shortcut.key}</kbd>
              <span className="kb-label">{shortcut.label}</span>
            </div>
          ))}
        </div>
        <div className="kb-footer">
          Press <kbd>?</kbd> to toggle
        </div>
      </div>
    </div>
  );
}
