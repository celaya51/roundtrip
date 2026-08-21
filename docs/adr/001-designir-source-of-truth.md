# ADR-001: DesignIR is the source of truth

**Status:** Accepted — 2026-08-20

## Decision
Roundtrip stores a design in a vendor-neutral, versioned intermediate representation named **DesignIR**. HTML, SVG, Canva and future formats are adapters, not canonical storage.

## Why
A neutral model enables deterministic rendering, diffs, migrations, multi-format generation and independence from any one vendor.

## Consequence
If a platform concept cannot be represented directly, the adapter must map, approximate or annotate it; the core must not acquire vendor-specific types merely to mirror one platform.
