# Patchworks AI — Lowercase Continuum logo pack

The selected Lowercase Continuum artwork, extracted directly from the approved design board after user approval. The custom joined wo and lowercase ai lettering is preserved. This pack contains 33 PNG files: 29 with genuine alpha transparency and 4 with solid backgrounds. It also contains a PNG-backed, multi-size ICO favicon.

## Choose a file

| Folder   | Contents                                                                                                     | Sizes                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| wordmark | Full colour for light backgrounds; white/orange for dark backgrounds; single-colour ink; single-colour white | 2400, 1200, 600 and 300 pixels wide                        |
| mark     | Compact wo mark in orange, ink and white, centered on a transparent square                                   | 1024, 512 and 256 pixels square                            |
| icons    | Orange wo mark on a transparent square, plus `patchworks-wo.ico`                                             | 180, 64, 32 and 16 pixels square; ICO embeds 64, 32 and 16 |
| social   | Orange wo avatars on light and dark solid backgrounds                                                        | 1024 pixels square                                         |
| preview  | Full wordmark on light and dark solid backgrounds                                                            | 1200 pixels wide                                           |

For a website header around 300 CSS pixels wide, use the 600-pixel PNG for a 2x display. Use the full-colour version on a light background and the dark-background version on a dark background. White versions are transparent and may be invisible in a white preview window.

The multi-size ICO and individual 16-pixel favicon are included, although the wide wo mark is clearer at 32 pixels or larger. Social avatars have solid backgrounds for predictable appearance across platforms. Run `node scripts/generate-favicons.cjs` from the repository root to recreate the ICO and copy the approved web icon assets into `public` without changing the artwork.

## Colour and source

- Brand orange: #d16013.
- Brand navy: #090e34.
- Reversed lettering: #ffffff.
- Solid preview/avatar backgrounds: #fcfcfc and #121723.
- Approved source: ../logo-joined-wordmark-iterations-2026-09-13/03-lowercase-continuum.png.

The selected source board is a raster image. The main artwork is about 1321 x 194 pixels and the compact mark about 241 x 98 pixels before padding. Larger exports are upscaled from those approved pixels; they are not new vector artwork. Lettering was not regenerated. Flat colour normalisation removes the generated texture, and transparency removes the presentation background.

## Verification

All PNGs were decoded and checked for their stated dimensions. Transparent files contain both fully transparent background pixels and fully opaque logo pixels. Opaque previews contain no alpha channel. Light and dark wordmark previews and 16/32/64-pixel icon rendering were visually inspected. File hashes and dimensions are recorded in manifest.json. The favicon generator validates each source PNG and embeds its bytes unchanged in the ICO.
