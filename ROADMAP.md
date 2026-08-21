# Roadmap

The roadmap is capability-driven, not date-driven. We only advance when the previous layer is testable.

## v0.2 — Foundation (current)
- DesignIR v0.2, multipage-ready.
- Vendor-neutral core.
- HTML and SVG renderers.
- Exact recovery for Roundtrip-authored HTML.
- CLI boundary.
- MCP v2 stdio interface skeleton.
- Canva isolated as an integration.
- ADRs, versioning rules and migration registry.

**Exit criterion:** core roundtrip fixture passes deterministic smoke tests.

## v0.3 — Fidelity
- Text runs and richer typography.
- Gradients, borders, shadows and clipping primitives.
- Asset normalization.
- Visual regression fixtures.
- JSON Schema export for DesignIR.

**Exit criterion:** reproduce a representative VEIA post with high visual fidelity in HTML and SVG.

## v0.4 — Responsive transformations
- Constraints/anchors.
- 4:5 -> 9:16 transformation rules.
- Safe-area and overflow diagnostics.
- Layout scoring instead of naïve proportional scaling.

**Exit criterion:** one campaign source generates acceptable post and story layouts with minimal manual adjustment.

## v0.5 — Importers
- Structured SVG -> DesignIR.
- Restricted/known HTML -> DesignIR.
- Generic HTML importer remains explicitly heuristic.

## v0.6 — External adapters
- Canva integration proof of concept using only permitted official mechanisms.
- Evaluate other adapters independently (for example Figma/PPTX) without changing core contracts.

## v0.7 — Studio
- Web visual editor backed directly by DesignIR.
- Layer tree, inspector, undo/redo and history.

## v0.8 — AI
- Prompt -> DesignIR.
- Brand-constrained transformations.
- AI changes represented as structured diffs, not flattened images.

## v0.9 — Service/API
- Stateless rendering API.
- Remote MCP/HTTP interface.
- Job queues for bulk campaign generation.

## v1.0 — Public contract
- Stable DesignIR 1.x.
- Documented migration guarantees.
- Full AGPL license text and third-party review completed.
- Security, performance and compatibility test matrix.
