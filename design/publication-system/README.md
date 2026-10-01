# Patchworks AI publication system

This is the canonical design and rendering system for Patchworks AI PDFs. It is intentionally broader than proposal writing: it supports white papers, reports, briefs, points of view, case studies, playbooks and proposals.

## Source of truth

- `brand-system.json` records the approved brand tokens and asset paths.
- `assets/` contains the exact logo and font files used by the renderer, with SHA-256 integrity checks in `assets/manifest.json`.
- `styles/publication.css` contains the A4 page and component system.
- `references/content-model.md` documents the input format.
- `examples/` contains realistic, non-client test publications.
- `scripts/render-publication.cjs` validates an input JSON file and renders a PDF.
- `scripts/test-publication-system.cjs` exercises successful and failure paths and records the evidence.

The renderer creates fixed A4 page canvases. Content is composed from approved page layouts and blocks. If any page overflows its printable region, rendering fails rather than silently clipping content.

## Render

Use the Node.js runtime and packages returned by the Codex workspace dependency loader:

```bash
NODE_PATH="<workspace-node-modules>" "<workspace-node>" \
  design/publication-system/scripts/render-publication.cjs \
  design/publication-system/examples/white-paper.json \
  output/pdf/patchworks-white-paper-sample.pdf
```

Add `--html <path>` when an inspectable HTML snapshot is useful. The HTML is self-contained: fonts, logos and supplied images are embedded as data URLs.

## Acceptance standard

A publication is complete only when:

1. Input validation passes.
2. Every bundled logo and font matches the SHA-256 asset manifest.
3. The browser confirms both brand fonts are available.
4. Every page passes the renderer's overflow check.
5. The PDF page count and A4 dimensions match the input.
6. The expected fonts are embedded.
7. Page PNGs have been rendered and visually inspected.

The approved visual baseline is the latest tested output from the examples, not an improvised recreation of the website.
