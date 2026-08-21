# Architecture

## Layers

```text
                   +-----------------------+
                   |      Interfaces       |
                   | CLI | MCP | REST | UI |
                   +-----------+-----------+
                               |
                               v
+----------------+     +-------+--------+      +-----------------+
|    Adapters    |<--->|      Core      |<---->|    Renderers    |
| HTML / Canva   |     | DesignIR       |      | HTML / SVG      |
| future formats |     | validation     |      | future outputs  |
+----------------+     | transforms     |      +-----------------+
                       | migrations     |
                       +----------------+
```

### Packages
- `design-ir`: data contract only.
- `core`: deterministic operations on DesignIR.
- `renderer-*`: pure output generation.
- `importer-*`: input translation/recovery.

### Integrations
Third-party platform code and credentials live here. An integration may depend on the core; the core may not depend on an integration.

### Interfaces
Ways to invoke the product. Interfaces can be removed without changing the design model.

## Roundtrip-authored HTML

The HTML renderer embeds the originating DesignIR as a JSON script tag. This gives us an exact, lossless return path for HTML produced by Roundtrip while generic HTML parsing remains a separate, harder problem.
