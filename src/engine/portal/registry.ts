import type { PortalDefinition, PortalRegistryEntry, PortalRegistryConfig } from "./types";
import { validatePortal } from "./validation";

const DEFAULT_CONFIG: PortalRegistryConfig = {
  enableValidation: true,
  enableOrdering: true,
  defaultStatus: "active",
};

export class PortalRegistry {
  private entries: Map<string, PortalRegistryEntry> = new Map<string, PortalRegistryEntry>();
  private sortedCache: PortalDefinition[] | null = null;
  private config: PortalRegistryConfig;

  constructor(config?: Partial<PortalRegistryConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  register(portal: PortalDefinition): void {
    if (this.config.enableValidation) {
      const result = validatePortal(portal);
      if (!result.valid) {
        throw new Error(`Invalid portal "${portal.id}": ${result.errors.join(", ")}`);
      }
    }

    const index = this.config.enableOrdering
      ? this.getInsertionIndex(portal.order)
      : this.entries.size;

    this.entries.set(portal.id, { id: portal.id, definition: portal, index });
    this.sortedCache = null;
  }

  registerAll(portals: PortalDefinition[]): void {
    for (const portal of portals) {
      this.register(portal);
    }
  }

  get(id: string): PortalDefinition | undefined {
    return this.entries.get(id)?.definition;
  }

  getAll(): PortalDefinition[] {
    if (!this.sortedCache) {
      this.sortedCache = Array.from(this.entries.values())
        .sort((a, b) => a.index - b.index)
        .map((e) => e.definition);
    }
    return this.sortedCache;
  }

  getByTheme(themeId: string): PortalDefinition[] {
    return this.getAll().filter((p) => p.theme === themeId);
  }

  getByStatus(status: PortalDefinition["status"]): PortalDefinition[] {
    return this.getAll().filter((p) => p.status === status);
  }

  search(query: string): PortalDefinition[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.subtitle.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.metadata.tags.some((t) => t.toLowerCase().includes(lower)),
    );
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  remove(id: string): boolean {
    const removed = this.entries.delete(id);
    if (removed) this.sortedCache = null;
    return removed;
  }

  clear(): void {
    this.entries.clear();
    this.sortedCache = null;
  }

  get size(): number {
    return this.entries.size;
  }

  private getInsertionIndex(order: number): number {
    const entries = Array.from(this.entries.values());
    let insertAt = entries.length;
    for (let i = 0; i < entries.length; i++) {
      if (order < (entries[i]?.index ?? 0)) {
        insertAt = i;
        break;
      }
    }
    return insertAt;
  }
}
