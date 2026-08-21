# Third-party boundaries

## Model Context Protocol

`interfaces/mcp` is an optional protocol interface. It uses the official MCP TypeScript server SDK at runtime. Roundtrip core does not depend on MCP.

## Canva

`integrations/canva` is an optional adapter boundary. Any implementation that uses Canva APIs or SDK components must comply with Canva's applicable developer terms and SDK licensing. Canva code must not be copied into the AGPL core.

The public product should not be positioned primarily as a Canva design exporter without confirming that the intended behavior is permitted by Canva's current terms or obtaining appropriate authorization.
