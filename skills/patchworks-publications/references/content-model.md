# Publication content model

## Root object

Every source file is UTF-8 JSON with:

- `schemaVersion`: currently `1.0`.
- `document`: publication metadata.
- `pages`: an ordered list of explicit A4 pages.

Required document fields are `kind`, `title`, `date`, `documentId` and `version`. Optional fields include `subtitle`, `audience`, `confidentiality`, `author`, `contact`, `url` and `footerNote`.

The renderer is a layout engine, not a factuality engine. Confirm claims and citations before rendering. Never leave model citations, tool tokens, internal comments or placeholder strings in a final source file.

## Page layouts

### `cover`

Required: `title`. Optional: `eyebrow`, `subtitle`, `theme` (`light` or `dark`), `accent`, `preparedFor`, `note`, `clientLogo`.

`clientLogo` is an optional cover-only co-branding asset: `{ "src": "relative/or/absolute/path.png", "alt": "Client name" }`. Use approved client artwork with transparency; the renderer places it at the top right in a size balanced with the Patchworks logo.

### `section`

Required: `number`, `title`. Optional: `eyebrow`, `summary`, `theme`.

### `content`

Required: `title`, `blocks`. Optional: `eyebrow`, `dek`, `section`, `theme`.

### `columns`

Required: `title`, `columns` containing exactly two block arrays. Optional: `eyebrow`, `dek`, `section`, `theme`.

### `data`

Required: `title`, `blocks`. Optional: `eyebrow`, `dek`, `section`, `theme`. This layout gives tables and data components slightly more usable width.

### `closing`

Required: `title`. Optional: `eyebrow`, `body`, `cta`, `contact`, `theme` (`dark` is the default).

## Blocks

- `lead`: `{ "type": "lead", "text": "..." }`
- `paragraph`: `{ "type": "paragraph", "text": "..." }`
- `heading`: `{ "type": "heading", "text": "..." }`
- `bullets`: `{ "type": "bullets", "items": ["...", "..."] }`
- `callout`: `{ "type": "callout", "label": "...", "title": "...", "body": "...", "tone": "orange|ink|neutral" }`
- `stats`: `{ "type": "stats", "items": [{ "value": "...", "label": "...", "note": "..." }] }`
- `table`: `{ "type": "table", "columns": ["..."], "rows": [["..."], ["..."]], "caption": "..." }`
- `quote`: `{ "type": "quote", "text": "...", "attribution": "..." }`
- `steps`: `{ "type": "steps", "items": [{ "title": "...", "body": "..." }] }`
- `references`: `{ "type": "references", "items": [{ "id": "1", "text": "...", "url": "https://..." }] }`
- `image`: `{ "type": "image", "src": "relative/or/absolute/path.png", "alt": "...", "caption": "...", "fit": "cover|contain" }`
- `rule`: `{ "type": "rule" }`
- `spacer`: `{ "type": "spacer", "size": "small|medium|large" }`

All ordinary text is escaped. URLs in `references` are emitted as links. Use the dedicated components instead of embedding HTML.

## Pagination

Each page is an explicit canvas. Split content deliberately at editorially sensible boundaries. The renderer rejects overflow; it never shrinks type or clips excess content automatically.

Use a section page only when a major transition benefits from one. A short publication should not contain decorative pages merely to reach a target page count.

## Themes

Light pages use the paper background and full-colour logo. Dark pages use the ink background and reversed logo. Orange is an accent, not a large body-copy colour.
