import type { PortalDefinition } from "./types";
import { useNavigate } from "react-router";
import { useCallback, useMemo } from "react";
import { usePortalStore, selectPortals } from "./store";

export function usePortalNavigation() {
  const navigate = useNavigate();
  const portals = usePortalStore(selectPortals);
  const activatePortal = usePortalStore((s) => s.activatePortal);

  const navigateToPortal = useCallback(
    (portalId: string): boolean => {
      const portal = portals.find((p) => p.id === portalId);
      if (!portal) return false;

      activatePortal(portalId);
      void navigate(portal.destinationRoute);
      return true;
    },
    [portals, navigate, activatePortal],
  );

  const getPortalById = useCallback(
    (id: string): PortalDefinition | undefined => portals.find((p) => p.id === id),
    [portals],
  );

  return useMemo(() => ({ navigateToPortal, getPortalById }), [navigateToPortal, getPortalById]);
}
