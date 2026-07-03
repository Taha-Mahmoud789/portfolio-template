/**
 * Root Layout
 *
 * Semantic shell for the entire application. Provides the document
 * structure and composable slots for future UI layers.
 *
 * Slot system (all optional, render nothing by default):
 * - navbar: Top navigation
 * - footer: Site footer
 * - sidebar-left / sidebar-right: Side navigation
 * - floating: Floating UI (cursors, back-to-top)
 * - modals: Modal portal target
 * - notifications: Toast/notification portal target
 */

import type { CSSProperties, ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  navbar?: ReactNode;
  footer?: ReactNode;
  sidebarLeft?: ReactNode;
  sidebarRight?: ReactNode;
  floating?: ReactNode;
  modals?: ReactNode;
  notifications?: ReactNode;
}

const floatingStyle: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  inset: 0,
  zIndex: 80,
};

const modalsStyle: CSSProperties = {
  position: "relative",
  zIndex: 50,
};

const notificationsStyle: CSSProperties = {
  position: "relative",
  zIndex: 60,
};

export function RootLayout({
  children,
  navbar,
  footer,
  sidebarLeft,
  sidebarRight,
  floating,
  modals,
  notifications,
}: RootLayoutProps) {
  return (
    <div className="root-layout">
      {navbar && <header role="banner">{navbar}</header>}

      <div className="root-layout__body flex min-h-[100dvh] flex-col">
        {sidebarLeft && (
          <aside role="complementary" aria-label="Left sidebar">
            {sidebarLeft}
          </aside>
        )}

        <main id="main-content" className="root-layout__main flex-1">
          {children}
        </main>

        {sidebarRight && (
          <aside role="complementary" aria-label="Right sidebar">
            {sidebarRight}
          </aside>
        )}
      </div>

      {footer && footer}

      {floating && (
        <div className="root-layout__floating" style={floatingStyle} aria-hidden="true">
          {floating}
        </div>
      )}

      {modals && (
        <div className="root-layout__modals" style={modalsStyle}>
          {modals}
        </div>
      )}

      {notifications && (
        <div
          className="root-layout__notifications"
          role="status"
          aria-live="polite"
          aria-label="Notifications"
          style={notificationsStyle}
        >
          {notifications}
        </div>
      )}
    </div>
  );
}
