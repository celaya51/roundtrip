# ADR-002: The core never depends on Canva

**Status:** Accepted — 2026-08-20

## Decision
No package under `packages/` may import Canva SDK modules or require Canva credentials. Canva-specific code belongs under `integrations/canva`.

## Consequence
Removing the Canva integration must leave validation, transforms, renderers and other interfaces operational.
