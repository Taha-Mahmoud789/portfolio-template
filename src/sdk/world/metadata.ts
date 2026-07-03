/**
 * World SDK Metadata
 *
 * Generates comprehensive SEO metadata, Open Graph data, and structured data
 * for individual worlds. Extends the engine-level metadata with SDK-specific fields.
 */

import type { WorldDefinition } from "@/engine/world/types";
import type { WorldSDKMeta, WorldContract } from "./types";

const SITE_NAME = "Frontend Multiverse";
const SITE_URL = "https://frontendmultiverse.dev";

// ============================================================================
// generateWorldSDKMeta — full metadata for a world
// ============================================================================

export function generateWorldSDKMeta(world: WorldDefinition | WorldContract): WorldSDKMeta {
  const slug = "route" in world ? world.slug : world.id.replace("-world", "");
  const route = "route" in world ? world.route : `/worlds/${slug}`;

  const title = `${world.name} — ${SITE_NAME}`;
  const description = world.description;

  const keywords = [
    world.name,
    world.theme,
    world.metadata.category,
    ...world.metadata.tags,
    "portfolio",
    "frontend",
    "multiverse",
  ];

  const canonical = `${SITE_URL}${route}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: world.name,
    description,
    url: canonical,
    about: {
      "@type": "Thing",
      name: world.name,
      description,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Person",
      name: world.metadata.author,
    },
    dateCreated: world.metadata.createdAt,
    dateModified: world.metadata.updatedAt,
    keywords: keywords.join(", "),
  };

  return {
    title,
    description,
    ogImage: world.metadata.thumbnail ?? world.background.value ?? "",
    ogTitle: title,
    ogDescription: description,
    keywords,
    canonical,
    structuredData,
  };
}

// ============================================================================
// generateWorldTitle — title tag for a world
// ============================================================================

export function generateWorldTitle(world: WorldDefinition | WorldContract): string {
  return `${world.name} — ${SITE_NAME}`;
}

// ============================================================================
// generateWorldDescription — meta description for a world
// ============================================================================

export function generateWorldDescription(world: WorldDefinition | WorldContract): string {
  return world.description;
}

// ============================================================================
// generateWorldOGTags — Open Graph meta tags as an object
// ============================================================================

export function generateWorldOGTags(
  world: WorldDefinition | WorldContract,
): Record<string, string> {
  const meta = generateWorldSDKMeta(world);
  return {
    "og:title": meta.ogTitle,
    "og:description": meta.ogDescription,
    "og:image": meta.ogImage,
    "og:url": meta.canonical,
    "og:type": "website",
    "og:site_name": SITE_NAME,
    "twitter:card": "summary_large_image",
    "twitter:title": meta.ogTitle,
    "twitter:description": meta.ogDescription,
    "twitter:image": meta.ogImage,
  };
}
