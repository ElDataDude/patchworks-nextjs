# Operating contract

## Portable paths

Resolve every system path relative to the directory containing `SKILL.md`, referred to below as `SKILL_ROOT`:

- Content model: `SKILL_ROOT/references/content-model.md`
- Brand tokens: `SKILL_ROOT/brand-system.json`
- Approved assets and integrity manifest: `SKILL_ROOT/assets/`
- Renderer: `SKILL_ROOT/scripts/render-publication.cjs`
- Portable checks: `SKILL_ROOT/scripts/test-portable.cjs`
- Examples: `SKILL_ROOT/examples/`
- Visual references: `SKILL_ROOT/examples/sample-output/`

Do not assume a particular username, home directory, repository, or operating system. Do not alter the installed skill while producing a publication; copy an example JSON file into the working project and edit the copy.

## Runtime

From `SKILL_ROOT`, first run the dependency-free portability checks:

```bash
npm test
```

For deterministic PDF rendering, Node.js 18+ and the `playwright` package are required. Install the optional renderer dependency once if it is not already available:

```bash
npm install
npx playwright install chromium
```

Then render a publication:

```bash
node scripts/render-publication.cjs \
  /absolute/path/to/source.json \
  /absolute/path/to/output.pdf \
  --html /absolute/path/to/temporary.html
```

The renderer writes `<output.pdf>.qa.json`. Require `status: passed`, the expected page count, both brand fonts, a passing asset-integrity result, and an empty `overflowIssues` array.

If Playwright is supplied elsewhere by the host, set `NODE_PATH` to that environment's `node_modules` directory instead of installing another copy.

## Acceptance gates

1. Source validation passes.
2. Every bundled logo and font matches the SHA-256 asset manifest.
3. The renderer or host confirms Source Sans 3 and Instrument Serif are used.
4. Every explicit A4 page passes the overflow checks.
5. The PDF reports the expected page count and A4 size.
6. Both brand fonts are embedded.
7. Extracted text contains the expected title and substantive body content.
8. Every page can be rendered to an image without an error.
9. Visual inspection finds no clipping, overlap, weak page break, damaged image, unreadable text, malformed table, inconsistent chrome, or unfinished placeholder.

If any gate fails, return to the JSON source, make the smallest correction, rerender, and repeat the affected checks.

## Output convention

Place final PDFs in the active project's normal output directory. Keep generated HTML and rendered page images in a temporary QA directory. Do not write generated work back into the installed skill.
