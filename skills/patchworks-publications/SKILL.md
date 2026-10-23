---
name: patchworks-publications
description: Create, edit, render, and quality-check branded Patchworks AI PDF publications, including white papers, reports, briefs, points of view, case studies, playbooks, and proposals. Use when the requested deliverable is a Patchworks-branded paginated PDF; do not use for websites, slide decks, or unbranded PDFs.
license: Proprietary brand materials; bundled fonts are licensed separately under SIL OFL 1.1.
metadata:
  version: "1.0.0"
  author: Patchworks AI
---

# Patchworks Publications

This folder is the complete, portable publication system. Treat the folder containing this `SKILL.md` as `SKILL_ROOT`. It owns the brand tokens, approved logos and fonts, page layouts, content components, examples, renderer, and acceptance tests. Never recreate those elements from memory or substitute generic Patchworks artwork.

## Start

Read `references/content-model.md`, `brand-system.json`, and `references/operating-contract.md` from `SKILL_ROOT`. Inspect the two example JSON files only when a realistic composition example is useful. `INSTALL.md` is for setup, not document content.

For an edit, locate the source JSON and change that rather than editing the PDF. Preserve supplied copy, evidence, citations, and commercial details unless the user asked to revise them.

## Compose

Choose the document kind and page sequence from the reader's job. A proposal, white paper, report, brief, case study, and playbook should not share a forced outline merely because they use the same design system.

Build pages only from the supported layouts and blocks. Split content at an editorially sensible boundary when it does not fit. Never shrink the base type, alter the A4 canvas, bypass validation, or clip content to force a page through.

Use the approved logo files in `assets/logos/` unchanged. Use editorial images only when they clarify the argument or establish meaningful context. Resolve every image to a local file so the renderer can embed it; generated PDFs must not depend on network assets. The bundled editorial image is an example and may be reused when it genuinely fits the subject.

## Evidence and claims

Do not invent facts, quotations, client results, sources, pricing, or credentials. For research-led publications, keep verified facts, attributed statements, assumptions or inferences, and unknowns distinct while drafting. Convert source citations into human-readable references before rendering; never expose internal tool tokens.

## Render

Prefer the deterministic renderer in `scripts/render-publication.cjs` when Node.js and Playwright are available. Run it from `SKILL_ROOT` as described in `references/operating-contract.md`. Its validation is mandatory. A successful render must report both brand fonts loaded and zero overflow issues.

If the host cannot run Playwright, use its native document or PDF tooling with the bundled `brand-system.json`, CSS, fonts, logos, schema, and sample PDFs as the visual contract. Do not silently replace the typefaces, colours, logo variants, A4 dimensions, margins, headers, footers, or page-number treatment. Apply the same acceptance gates manually.

## Verify

Render the final PDF pages to images and visually inspect every page. Also confirm the PDF page count, A4 dimensions, embedded fonts, extractable text, headers, footers, page numbering, links, section transitions, tables, image quality, and source references. Fix the source and rerender after any defect.

Deliver the source JSON with the final PDF unless the user explicitly wants PDF only. Keep generated HTML snapshots and page images as temporary QA files rather than final deliverables.

The PDFs in `examples/sample-output/` are finished visual references, not templates whose wording should be copied into a client publication.
