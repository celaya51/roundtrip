# Canva integration boundary

This directory is intentionally isolated from Roundtrip core.

## v0.2 policy

- Do not copy Canva SDK source into core packages.
- Do not make the core require a Canva account or token.
- Treat Canva terms and SDK licensing as an independent compliance boundary.
- Before shipping any Canva -> external-design workflow publicly, review the then-current developer terms and obtain authorization where required.

## Product direction

The first safe integration target is **Roundtrip-authored design -> Canva-editable design** where supported by official import/app mechanisms. Reverse extraction remains experimental/legal-review territory rather than a core promise.
