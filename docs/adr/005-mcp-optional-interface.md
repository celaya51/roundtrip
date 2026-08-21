# ADR-005: MCP is an optional interface

**Status:** Accepted — 2026-08-20

## Decision
MCP lives under `interfaces/mcp` and calls public core functions. No core package imports MCP libraries.

## Initial transport
Use stdio for the first local proof of concept. Add remote HTTP later as a transport concern.

## Consequence
Roundtrip remains usable via library APIs, CLI, REST or a future UI even if MCP changes or disappears.
