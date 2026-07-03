import type { PortalDefinition } from "./types";

const MAX_CACHE_SIZE = 50;

export interface PortalMeta {
  title: string;
  description: string;
  ogImage: string;
  keywords: string[];
}

const portalMetaCache = new Map<string, PortalMeta>();

function evictCache(): void {
  if (portalMetaCache.size > MAX_CACHE_SIZE) {
    const firstKey = portalMetaCache.keys().next().value;
    if (firstKey) portalMetaCache.delete(firstKey);
  }
}

export function getPortalMeta(portal: PortalDefinition): PortalMeta {
  const cached = portalMetaCache.get(portal.id);
  if (cached) return cached;

  evictCache();

  const meta: PortalMeta = {
    title: `${portal.title} - Frontend Multiverse`,
    description: portal.description,
    ogImage: portal.background.value,
    keywords: [
      portal.title.toLowerCase(),
      portal.theme,
      "frontend",
      "multiverse",
      "world",
      ...portal.metadata.tags,
    ],
  };

  portalMetaCache.set(portal.id, meta);
  return meta;
}

export function clearPortalMetaCache(): void {
  portalMetaCache.clear();
}

export function generatePortalStructuredData(portal: PortalDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: portal.title,
    description: portal.description,
    url: portal.destinationRoute,
    about: {
      "@type": "Thing",
      name: portal.title,
      description: portal.description,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Frontend Multiverse",
    },
  };
}
