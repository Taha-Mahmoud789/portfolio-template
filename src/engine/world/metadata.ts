/**
 * World Metadata Manager
 *
 * Generates and manages SEO metadata and structured data for worlds.
 * Includes an LRU-style cache to avoid redundant computations.
 */

import type { WorldDefinition, WorldMeta } from "./types";

const MAX_CACHE_SIZE = 50;

const metaCache = new Map<string, WorldMeta>();

export function getWorldMeta(world: WorldDefinition): WorldMeta {
  const cached = metaCache.get(world.id);
  if (cached) return cached;

  const meta: WorldMeta = {
    title: `${world.name} — Frontend Multiverse`,
    description: world.description,
    keywords: [
      world.name,
      world.theme,
      "frontend",
      "multiverse",
      "portfolio",
      ...world.metadata.tags,
    ],
    ogImage: world.background.value || undefined,
  };

  metaCache.set(world.id, meta);

  if (metaCache.size > MAX_CACHE_SIZE) {
    const firstKey = metaCache.keys().next().value;
    if (firstKey) {
      metaCache.delete(firstKey);
    }
  }

  return meta;
}

export function clearWorldMetaCache(): void {
  metaCache.clear();
}

export function generateWorldStructuredData(world: WorldDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: world.name,
    description: world.description,
    url: `/worlds/${world.slug}`,
    about: {
      "@type": "Thing",
      name: world.name,
      description: world.description,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Frontend Multiverse",
      url: "/",
    },
    author: {
      "@type": "Person",
      name: world.metadata.author,
    },
    dateCreated: world.metadata.createdAt,
    dateModified: world.metadata.updatedAt,
  };
}

export function applyWorldMeta(world: WorldDefinition): void {
  const meta = getWorldMeta(world);

  document.title = meta.title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", meta.description);
  }

  const metaOgTitle = document.querySelector('meta[property="og:title"]');
  if (metaOgTitle) {
    metaOgTitle.setAttribute("content", meta.title);
  }

  const metaOgDescription = document.querySelector('meta[property="og:description"]');
  if (metaOgDescription) {
    metaOgDescription.setAttribute("content", meta.description);
  }

  if (meta.ogImage) {
    const metaOgImage = document.querySelector('meta[property="og:image"]');
    if (metaOgImage) {
      metaOgImage.setAttribute("content", meta.ogImage);
    }
  }
}

export function resetWorldMeta(): void {
  document.title = "Frontend Multiverse";
}
