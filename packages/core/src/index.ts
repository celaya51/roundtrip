import type { DesignDocument, DesignElement, DesignPage, TextElement } from "../../design-ir/src/index.ts";

export interface ValidationIssue { path: string; message: string; }
export interface ValidationResult { ok: boolean; issues: ValidationIssue[]; }

export function validateDesign(doc: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  const d = doc as Partial<DesignDocument> | null;
  if (!d || typeof d !== "object") return { ok: false, issues: [{ path: "$", message: "Document must be an object" }] };
  if (d.schema !== "roundtrip.design") issues.push({ path: "$.schema", message: "Expected roundtrip.design" });
  if (typeof d.version !== "string") issues.push({ path: "$.version", message: "version must be a string" });
  if (!Array.isArray(d.pages) || d.pages.length === 0) issues.push({ path: "$.pages", message: "At least one page is required" });
  for (const [pi, p] of (d.pages ?? []).entries()) {
    if (!(p.width > 0) || !(p.height > 0)) issues.push({ path: `$.pages[${pi}]`, message: "Page dimensions must be positive" });
    if (!Array.isArray(p.elements)) issues.push({ path: `$.pages[${pi}].elements`, message: "elements must be an array" });
    const ids = new Set<string>();
    walkElements(p.elements ?? [], (el, path) => {
      if (!el.id) issues.push({ path: `${path}.id`, message: "Element id is required" });
      if (ids.has(el.id)) issues.push({ path: `${path}.id`, message: `Duplicate element id: ${el.id}` });
      ids.add(el.id);
      for (const key of ["x", "y", "width", "height"] as const) if (!Number.isFinite(el[key])) issues.push({ path: `${path}.${key}`, message: `${key} must be finite` });
    }, `$.pages[${pi}].elements`);
  }
  return { ok: issues.length === 0, issues };
}

function walkElements(elements: DesignElement[], fn: (el: DesignElement, path: string) => void, base = "elements") {
  elements.forEach((el, i) => {
    const path = `${base}[${i}]`; fn(el, path);
    if (el.type === "group") walkElements(el.children, fn, `${path}.children`);
  });
}

export function cloneDesign<T extends DesignDocument>(doc: T): T { return structuredClone(doc); }

export function setText(doc: DesignDocument, elementId: string, text: string): DesignDocument {
  const out = cloneDesign(doc); let found = false;
  for (const page of out.pages) walkElements(page.elements, (el) => {
    if (el.id === elementId && el.type === "text") { (el as TextElement).text = text; found = true; }
  });
  if (!found) throw new Error(`Text element not found: ${elementId}`);
  return out;
}

export function resizePage(doc: DesignDocument, pageId: string, width: number, height: number, mode: "scale" | "canvas" = "scale"): DesignDocument {
  if (!(width > 0 && height > 0)) throw new Error("Target dimensions must be positive");
  const out = cloneDesign(doc);
  const page = out.pages.find(p => p.id === pageId); if (!page) throw new Error(`Page not found: ${pageId}`);
  if (mode === "scale") {
    const sx = width / page.width, sy = height / page.height;
    scaleElements(page.elements, sx, sy);
  }
  page.width = width; page.height = height;
  return out;
}

function scaleElements(elements: DesignElement[], sx: number, sy: number) {
  for (const el of elements) {
    el.x *= sx; el.y *= sy; el.width *= sx; el.height *= sy;
    if (el.type === "text" && el.style?.fontSize) el.style.fontSize *= Math.min(sx, sy);
    if (el.type === "shape") { if (el.borderRadius) el.borderRadius *= Math.min(sx, sy); if (el.strokeWidth) el.strokeWidth *= Math.min(sx, sy); }
    if (el.type === "group") scaleElements(el.children, sx, sy);
  }
}

export function getPage(doc: DesignDocument, pageId?: string): DesignPage {
  const p = pageId ? doc.pages.find(p => p.id === pageId) : doc.pages[0];
  if (!p) throw new Error("Page not found"); return p;
}
