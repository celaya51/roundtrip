# Roundtrip

[![smoke](https://github.com/celaya51/roundtrip/actions/workflows/smoke.yml/badge.svg)](https://github.com/celaya51/roundtrip/actions/workflows/smoke.yml)

**Portable, editable design infrastructure.**

Roundtrip treats visual design as structured data instead of locking the source of truth inside a single editor or output format.

```text
Sources / platforms            Roundtrip core                 Destinations
-------------------       --------------------------       -----------------
HTML  ------------------->  DesignIR + transforms  ------> HTML
SVG   ------------------->  validation + migrations ------> SVG
future adapters ---------->  assets + layout model  ------> future adapters
                                  ^
                                  |
                           CLI / MCP / REST / UI
```

## Architecture rule

**DesignIR is the source of truth.** Adapters translate formats/platforms. Interfaces let humans, programs and agents operate the core. The core must not depend on Canva, MCP, or another vendor.

## v0.2 contents

- `packages/design-ir`: versioned DesignIR types.
- `packages/core`: validation and deterministic mutations.
- `packages/renderer-html`: DesignIR → editable HTML/CSS.
- `packages/renderer-svg`: DesignIR → SVG.
- `packages/importer-html`: exact recovery for Roundtrip-authored HTML, plus a boundary for future generic HTML import.
- `interfaces/cli`: local interface skeleton.
- `interfaces/mcp`: optional MCP v2 stdio server.
- `integrations/canva`: isolated Canva integration boundary and policy notes.
- `docs/adr`: architecture decision records.
- `examples/veia`: first real design fixture.

## Try the zero-dependency core

Node 22+ can run the TypeScript source directly with type stripping:

```bash
npm run smoke
npm run render:example
```

The smoke test validates the DesignIR example, applies a deterministic mutation,
resizes a page, renders HTML and checks that the result roundtrips back to the
original document exactly. It runs on every push via GitHub Actions
(`.github/workflows/smoke.yml`) on Node 22 and 24.

Generated artifacts land in `dist/`.

## MCP

The MCP interface is deliberately optional. After installing dependencies:

```bash
npm install
npm run mcp
```

The server uses stdio first. A remote HTTP transport can be added later without changing DesignIR or the core.

## Licensing

Our code is intended to be licensed under **GNU AGPL-3.0-or-later**. Third-party integrations remain subject to their own terms. See `LICENSE`, `NOTICE.md`, and `THIRD_PARTY.md`.

## Status

Experimental `0.x`. Breaking schema changes are allowed while the model is still being proven, but each schema generation carries an explicit version and migrations are first-class.
