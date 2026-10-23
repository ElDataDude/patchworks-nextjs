# Package contents

This is version 1.0.0 of the portable Patchworks Publications skill.

## Core skill

- `SKILL.md` - instructions used by ChatGPT, Codex, Claude, and Claude Code.
- `agents/openai.yaml` - OpenAI/Codex display metadata and icons.
- `INSTALL.md` - platform-specific installation and invocation instructions.
- `USAGE-LICENCE.md` - Patchworks usage terms and third-party licence notes.

## Design system

- `brand-system.json` - colours, typography, logo paths, page geometry, and component tokens.
- `styles/publication.css` - the fixed A4 page and component system.
- `schema/publication.schema.json` - machine-readable publication source schema.
- `references/content-model.md` - authoring model for layouts and content blocks.
- `references/operating-contract.md` - rendering and acceptance requirements.

## Assets

- `assets/logos/` - approved full-colour, reversed, and mark-only Patchworks logos.
- `assets/fonts/` - Source Sans 3 and Instrument Serif webfonts plus complete SIL OFL 1.1 texts.
- `assets/editorial/` - a bundled editorial image used by the specimen.
- `assets/manifest.json` - SHA-256 integrity hashes for the renderer's required logos and fonts.

## Runtime and examples

- `scripts/render-publication.cjs` - deterministic JSON-to-PDF renderer with validation and QA output.
- `scripts/test-portable.cjs` - dependency-free portability, asset, example, and HTML checks.
- `package.json` - Node.js metadata and the optional pinned Playwright renderer dependency.
- `examples/*.json` - editable white-paper and full-system source examples.
- `examples/sample-output/*.pdf` - finished seven-page and eight-page visual references.

No client data, passwords, API keys, browser profiles, or machine-specific file paths are included.
