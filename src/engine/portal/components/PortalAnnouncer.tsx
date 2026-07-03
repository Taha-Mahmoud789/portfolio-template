import { useEffect, useRef } from "react";
import { usePortalStore, selectActivationPhase, selectSelectedPortalId } from "../store";
import { PORTAL_A11Y } from "../constants";

/**
 * PortalAnnouncer — renders an aria-live region that announces
 * portal selection and activation events to screen readers.
 *
 * Mount this once at the top level (e.g., inside the portal grid).
 */
export function PortalAnnouncer() {
  const phase = usePortalStore(selectActivationPhase);
  const selectedId = usePortalStore(selectSelectedPortalId);
  const portals = usePortalStore((s) => s.portals);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const portal = portals.find((p) => p.id === selectedId);
    if (!portal) {
      ref.current.textContent = "";
      return;
    }

    let message = "";
    switch (phase) {
      case "selected":
        message = PORTAL_A11Y.SELECTION_ANNOUNCE.replace("{title}", portal.title);
        break;
      case "expanding":
      case "transitioning":
      case "loading":
      case "entering":
        message = PORTAL_A11Y.ACTIVATION_ANNOUNCE.replace("{title}", portal.title);
        break;
      case "entered":
        message = `Entered ${portal.title} world`;
        break;
      case "idle":
        message = "";
        break;
    }

    ref.current.textContent = message;
  }, [phase, selectedId, portals]);

  return (
    <div
      ref={ref}
      id="portal-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
