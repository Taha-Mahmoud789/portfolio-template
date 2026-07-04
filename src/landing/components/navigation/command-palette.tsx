/**
 * CommandPalette — CTRL+K quick navigation
 *
 * Opens a centered overlay with search and quick actions.
 * Staggered item entrance. SVG icons. Dramatic hover effects.
 * Keyboard: arrow keys, enter, escape. Focus trap. ARIA.
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ANIMATION_EASINGS } from "@/animation/constants";

// ============================================================================
// Types
// ============================================================================

interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

// ============================================================================
// SVG Icons
// ============================================================================

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ExpertiseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ============================================================================
// Props
// ============================================================================

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const actions: CommandAction[] = useMemo(
    () => [
      {
        id: "home",
        label: "Go Home",
        description: "Return to the landing page",
        icon: <HomeIcon />,
        shortcut: "H",
        action: () => {
          onNavigate("/");
          onClose();
        },
      },
      {
        id: "projects",
        label: "View Projects",
        description: "Browse all case studies",
        icon: <ProjectsIcon />,
        shortcut: "P",
        action: () => {
          onNavigate("/#projects");
          onClose();
        },
      },
      {
        id: "contact",
        label: "Open Contact",
        description: "Get in touch",
        icon: <ContactIcon />,
        shortcut: "C",
        action: () => {
          onNavigate("/#contact");
          onClose();
        },
      },
      {
        id: "about",
        label: "About",
        description: "Learn about the developer",
        icon: <AboutIcon />,
        action: () => {
          onNavigate("/#about");
          onClose();
        },
      },
      {
        id: "expertise",
        label: "Expertise",
        description: "View skills and capabilities",
        icon: <ExpertiseIcon />,
        action: () => {
          onNavigate("/#expertise");
          onClose();
        },
      },
    ],
    [onNavigate, onClose],
  );

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase()),
  );

  // Scroll lock when open
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    };
  }, [isOpen]);

  // Animation — staggered item entrance
  useEffect(() => {
    if (!overlayRef.current) return;
    const overlay = overlayRef.current;
    const panel = overlay.querySelector("[data-cmd-panel]");
    const items = itemsRef.current.filter(Boolean) as HTMLElement[];

    if (isOpen && panel) {
      const tl = gsap.timeline({
        defaults: { ease: ANIMATION_EASINGS.expoOut },
      });

      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(
          panel,
          { opacity: 0, y: -16, scale: 0.96, clipPath: "inset(8% 0% 0% 0)" },
          { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0)", duration: 0.4 },
          "-=0.15",
        )
        .fromTo(
          items,
          { y: 8, opacity: 0, clipPath: "inset(0 0% 100% 0)" },
          { y: 0, opacity: 1, clipPath: "inset(0 0% 0% 0)", duration: 0.35, stagger: 0.04 },
          "-=0.25",
        );
    } else if (!isOpen) {
      gsap.to(overlay, { opacity: 0, duration: 0.15 });
    }
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
      }
      // Focus trap — cycle Tab within palette
      if (e.key === "Tab") {
        const focusable = [inputRef.current, ...itemsRef.current.filter(Boolean)] as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, activeIndex, onClose]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector("[data-cmd-active]");
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div
      ref={overlayRef}
      className="cmd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ opacity: 0, pointerEvents: isOpen ? "auto" : "none" }}
    >
      <div data-cmd-panel className="cmd-panel" style={{ opacity: 0 }}>
        {/* Search input */}
        <div className="cmd-search">
          <svg
            className="cmd-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            className="cmd-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search commands"
          />
          <kbd className="cmd-kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="cmd-list" role="listbox">
          {filtered.length === 0 ? (
            <div className="cmd-empty">No results found</div>
          ) : (
            filtered.map((action, i) => (
              <button
                key={action.id}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                type="button"
                className={`cmd-item ${i === activeIndex ? "cmd-item--active" : ""}`}
                data-cmd-active={i === activeIndex ? "" : undefined}
                onClick={action.action}
                onMouseEnter={() => setActiveIndex(i)}
                role="option"
                aria-selected={i === activeIndex}
              >
                <span className="cmd-item-icon">{action.icon}</span>
                <div className="cmd-item-text">
                  <span className="cmd-item-label">{action.label}</span>
                  <span className="cmd-item-desc">{action.description}</span>
                </div>
                {action.shortcut && <kbd className="cmd-item-shortcut">{action.shortcut}</kbd>}
                {/* Hover accent bar */}
                <span className="cmd-item-accent" aria-hidden="true" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cmd-footer">
          <span className="cmd-footer-hint">
            <kbd className="cmd-kbd-sm">↑↓</kbd> navigate
          </span>
          <span className="cmd-footer-hint">
            <kbd className="cmd-kbd-sm">↵</kbd> select
          </span>
          <span className="cmd-footer-hint">
            <kbd className="cmd-kbd-sm">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Hook — global CTRL+K listener
// ============================================================================

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
