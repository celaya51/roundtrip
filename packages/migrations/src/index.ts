import type { DesignDocument } from "../../design-ir/src/index.ts";

export type Migration = (input: Record<string, unknown>) => Record<string, unknown>;

type Edge = { from: string; to: string; migrate: Migration };
const registry: Edge[] = [];

/** Register migrations explicitly. Core rendering code must never hide migrations. */
export function registerMigration(from: string, to: string, migrate: Migration): void {
  if (from === to) throw new Error("Migration versions must differ");
  if (registry.some(m => m.from === from && m.to === to)) throw new Error(`Migration already registered: ${from} -> ${to}`);
  registry.push({ from, to, migrate });
}

/**
 * Migrate a document through an explicit chain. v0.2 ships with no historical
 * schema yet, so a current-version document is returned unchanged.
 */
export function migrateDesign(input: Record<string, unknown>, targetVersion: string): DesignDocument {
  let current = structuredClone(input);
  let version = String(current.version ?? "");
  if (!version) throw new Error("Document has no version");
  const visited = new Set<string>();
  while (version !== targetVersion) {
    if (visited.has(version)) throw new Error(`Migration cycle detected at ${version}`);
    visited.add(version);
    const edge = registry.find(m => m.from === version);
    if (!edge) throw new Error(`No migration path from ${version} to ${targetVersion}`);
    current = edge.migrate(current);
    current.version = edge.to;
    version = edge.to;
  }
  return current as unknown as DesignDocument;
}

export function listMigrations(): ReadonlyArray<{from:string;to:string}> {
  return registry.map(({from,to})=>({from,to}));
}
