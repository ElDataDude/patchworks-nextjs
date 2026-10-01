#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const SYSTEM_ROOT = path.resolve(__dirname, "..");
const BRAND_PATH = path.join(SYSTEM_ROOT, "brand-system.json");
const STYLE_PATH = path.join(SYSTEM_ROOT, "styles", "publication.css");
const ASSET_MANIFEST_PATH = path.join(SYSTEM_ROOT, "assets", "manifest.json");
const ALLOWED_LAYOUTS = new Set([
  "cover",
  "section",
  "content",
  "columns",
  "data",
  "closing",
]);
const ALLOWED_BLOCKS = new Set([
  "lead",
  "paragraph",
  "heading",
  "bullets",
  "callout",
  "stats",
  "table",
  "quote",
  "steps",
  "references",
  "image",
  "rule",
  "spacer",
]);
const DISALLOWED_DASHES = /[\u2011\u2012\u2013\u2014\u2212]/u;

function fail(message) {
  throw new Error(message);
}

function readJson(filePath, label) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    fail(`${label} could not be read: ${filePath}`);
  }
  try {
    return { raw, value: JSON.parse(raw) };
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
}

function verifyAssetManifest() {
  const manifestSource = readJson(ASSET_MANIFEST_PATH, "Asset manifest");
  const manifest = manifestSource.value;
  if (!manifest || !Array.isArray(manifest.files) || manifest.files.length === 0) {
    fail("Asset manifest must contain at least one file");
  }
  for (const entry of manifest.files) {
    requiredString(entry.path, "asset manifest path");
    requiredString(entry.sha256, `asset manifest sha256 for ${entry.path}`);
    const filePath = path.resolve(SYSTEM_ROOT, "assets", entry.path);
    if (!fs.existsSync(filePath)) fail(`Manifest asset is missing: ${filePath}`);
    const actual = crypto
      .createHash("sha256")
      .update(fs.readFileSync(filePath))
      .digest("hex");
    if (actual !== entry.sha256) {
      fail(`Manifest asset hash mismatch: ${entry.path}`);
    }
  }
  return {
    status: "passed",
    fileCount: manifest.files.length,
    manifestSha256: crypto
      .createHash("sha256")
      .update(manifestSource.raw)
      .digest("hex"),
  };
}

function requiredString(value, fieldPath) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${fieldPath} must be a non-empty string`);
  }
}

function optionalString(value, fieldPath) {
  if (value !== undefined && typeof value !== "string") {
    fail(`${fieldPath} must be a string when supplied`);
  }
}

function validateBlock(block, fieldPath) {
  if (!block || typeof block !== "object" || Array.isArray(block)) {
    fail(`${fieldPath} must be an object`);
  }
  if (!ALLOWED_BLOCKS.has(block.type)) {
    fail(`${fieldPath}.type is unsupported: ${String(block.type)}`);
  }

  if (["lead", "paragraph", "heading"].includes(block.type)) {
    requiredString(block.text, `${fieldPath}.text`);
  }

  if (block.type === "bullets") {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      fail(`${fieldPath}.items must contain at least one bullet`);
    }
    block.items.forEach((item, index) =>
      requiredString(item, `${fieldPath}.items[${index}]`),
    );
  }

  if (block.type === "callout") {
    requiredString(block.title, `${fieldPath}.title`);
    optionalString(block.label, `${fieldPath}.label`);
    optionalString(block.body, `${fieldPath}.body`);
    if (
      block.tone !== undefined &&
      !["orange", "ink", "neutral"].includes(block.tone)
    ) {
      fail(`${fieldPath}.tone must be orange, ink or neutral`);
    }
  }

  if (block.type === "stats") {
    if (
      !Array.isArray(block.items) ||
      block.items.length < 2 ||
      block.items.length > 4
    ) {
      fail(`${fieldPath}.items must contain two to four statistics`);
    }
    block.items.forEach((item, index) => {
      requiredString(item.value, `${fieldPath}.items[${index}].value`);
      requiredString(item.label, `${fieldPath}.items[${index}].label`);
      optionalString(item.note, `${fieldPath}.items[${index}].note`);
    });
  }

  if (block.type === "table") {
    if (
      !Array.isArray(block.columns) ||
      block.columns.length < 2 ||
      block.columns.length > 6
    ) {
      fail(`${fieldPath}.columns must contain two to six headings`);
    }
    if (!Array.isArray(block.rows) || block.rows.length === 0) {
      fail(`${fieldPath}.rows must contain at least one row`);
    }
    block.columns.forEach((item, index) =>
      requiredString(item, `${fieldPath}.columns[${index}]`),
    );
    block.rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row) || row.length !== block.columns.length) {
        fail(
          `${fieldPath}.rows[${rowIndex}] must have ${block.columns.length} cells`,
        );
      }
      row.forEach((cell, cellIndex) =>
        requiredString(cell, `${fieldPath}.rows[${rowIndex}][${cellIndex}]`),
      );
    });
    optionalString(block.caption, `${fieldPath}.caption`);
  }

  if (block.type === "quote") {
    requiredString(block.text, `${fieldPath}.text`);
    optionalString(block.attribution, `${fieldPath}.attribution`);
  }

  if (block.type === "steps") {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      fail(`${fieldPath}.items must contain at least one step`);
    }
    block.items.forEach((item, index) => {
      requiredString(item.title, `${fieldPath}.items[${index}].title`);
      requiredString(item.body, `${fieldPath}.items[${index}].body`);
    });
  }

  if (block.type === "references") {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      fail(`${fieldPath}.items must contain at least one reference`);
    }
    block.items.forEach((item, index) => {
      requiredString(item.id, `${fieldPath}.items[${index}].id`);
      requiredString(item.text, `${fieldPath}.items[${index}].text`);
      optionalString(item.url, `${fieldPath}.items[${index}].url`);
    });
  }

  if (block.type === "image") {
    requiredString(block.src, `${fieldPath}.src`);
    optionalString(block.alt, `${fieldPath}.alt`);
    optionalString(block.caption, `${fieldPath}.caption`);
    if (block.fit !== undefined && !["cover", "contain"].includes(block.fit)) {
      fail(`${fieldPath}.fit must be cover or contain`);
    }
  }

  if (block.type === "spacer") {
    if (
      block.size !== undefined &&
      !["small", "medium", "large"].includes(block.size)
    ) {
      fail(`${fieldPath}.size must be small, medium or large`);
    }
  }
}

function validatePublication(publication, sourceRaw) {
  if (!publication || typeof publication !== "object" || Array.isArray(publication)) {
    fail("Publication root must be an object");
  }
  if (publication.schemaVersion !== "1.0") {
    fail('schemaVersion must be "1.0"');
  }
  if (!publication.document || typeof publication.document !== "object") {
    fail("document must be an object");
  }
  for (const field of ["kind", "title", "date", "documentId", "version"]) {
    requiredString(publication.document[field], `document.${field}`);
  }
  for (const field of [
    "subtitle",
    "audience",
    "confidentiality",
    "author",
    "contact",
    "url",
    "footerNote",
  ]) {
    optionalString(publication.document[field], `document.${field}`);
  }
  if (!Array.isArray(publication.pages) || publication.pages.length === 0) {
    fail("pages must contain at least one page");
  }

  publication.pages.forEach((page, pageIndex) => {
    const pagePath = `pages[${pageIndex}]`;
    if (!page || typeof page !== "object" || Array.isArray(page)) {
      fail(`${pagePath} must be an object`);
    }
    if (!ALLOWED_LAYOUTS.has(page.layout)) {
      fail(`${pagePath}.layout is unsupported: ${String(page.layout)}`);
    }
    if (page.theme !== undefined && !["light", "dark"].includes(page.theme)) {
      fail(`${pagePath}.theme must be light or dark`);
    }
    for (const field of [
      "eyebrow",
      "section",
      "number",
      "title",
      "subtitle",
      "dek",
      "summary",
      "accent",
      "preparedFor",
      "note",
      "body",
      "cta",
      "contact",
    ]) {
      optionalString(page[field], `${pagePath}.${field}`);
    }

    if (page.clientLogo !== undefined) {
      if (
        !page.clientLogo ||
        typeof page.clientLogo !== "object" ||
        Array.isArray(page.clientLogo)
      ) {
        fail(`${pagePath}.clientLogo must be an object when supplied`);
      }
      if (page.layout !== "cover") {
        fail(`${pagePath}.clientLogo is only supported on cover pages`);
      }
      requiredString(page.clientLogo.src, `${pagePath}.clientLogo.src`);
      optionalString(page.clientLogo.alt, `${pagePath}.clientLogo.alt`);
    }

    if (page.layout === "section") {
      requiredString(page.number, `${pagePath}.number`);
      requiredString(page.title, `${pagePath}.title`);
    }
    if (["content", "data"].includes(page.layout)) {
      requiredString(page.title, `${pagePath}.title`);
      if (!Array.isArray(page.blocks)) {
        fail(`${pagePath}.blocks must be an array`);
      }
      page.blocks.forEach((block, blockIndex) =>
        validateBlock(block, `${pagePath}.blocks[${blockIndex}]`),
      );
    }
    if (page.layout === "columns") {
      requiredString(page.title, `${pagePath}.title`);
      if (!Array.isArray(page.columns) || page.columns.length !== 2) {
        fail(`${pagePath}.columns must contain exactly two block arrays`);
      }
      page.columns.forEach((column, columnIndex) => {
        if (!Array.isArray(column)) {
          fail(`${pagePath}.columns[${columnIndex}] must be an array`);
        }
        column.forEach((block, blockIndex) =>
          validateBlock(
            block,
            `${pagePath}.columns[${columnIndex}][${blockIndex}]`,
          ),
        );
      });
    }
    if (page.layout === "closing") {
      requiredString(page.title, `${pagePath}.title`);
    }
  });

  if (DISALLOWED_DASHES.test(sourceRaw)) {
    fail("Source contains a non-ASCII dash. Replace it with an ASCII hyphen.");
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function mimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
  };
  if (!types[extension]) {
    fail(`Unsupported embedded asset type: ${extension}`);
  }
  return types[extension];
}

function dataUri(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Required asset is missing: ${filePath}`);
  }
  const contents = fs.readFileSync(filePath);
  return `data:${mimeType(filePath)};base64,${contents.toString("base64")}`;
}

function resolveAsset(systemRoot, assetPath) {
  return path.resolve(systemRoot, assetPath);
}

function titleCaseKind(kind) {
  return kind
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderBlock(block, sourceDir) {
  switch (block.type) {
    case "lead":
      return `<p class="block block-lead">${escapeHtml(block.text)}</p>`;
    case "paragraph":
      return `<p class="block block-paragraph">${escapeHtml(block.text)}</p>`;
    case "heading":
      return `<h3 class="block block-heading">${escapeHtml(block.text)}</h3>`;
    case "bullets":
      return `<ul class="block block-bullets">${block.items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`;
    case "callout": {
      const tone = block.tone || "orange";
      return `<aside class="block block-callout tone-${escapeHtml(tone)}">
        ${block.label ? `<p class="callout-label">${escapeHtml(block.label)}</p>` : ""}
        <h3 class="callout-title">${escapeHtml(block.title)}</h3>
        ${block.body ? `<p class="callout-body">${escapeHtml(block.body)}</p>` : ""}
      </aside>`;
    }
    case "stats":
      return `<div class="block stats-grid" style="--stats-count:${block.items.length}">
        ${block.items
          .map(
            (item) => `<div class="stat">
              <div class="stat-value">${escapeHtml(item.value)}</div>
              <div class="stat-label">${escapeHtml(item.label)}</div>
              ${item.note ? `<div class="stat-note">${escapeHtml(item.note)}</div>` : ""}
            </div>`,
          )
          .join("")}
      </div>`;
    case "table":
      return `<div class="block block-table">
        <table class="publication-table">
          <thead><tr>${block.columns
            .map((column) => `<th>${escapeHtml(column)}</th>`)
            .join("")}</tr></thead>
          <tbody>${block.rows
            .map(
              (row) => `<tr>${row
                .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                .join("")}</tr>`,
            )
            .join("")}</tbody>
        </table>
        ${block.caption ? `<p class="table-caption">${escapeHtml(block.caption)}</p>` : ""}
      </div>`;
    case "quote":
      return `<blockquote class="block block-quote">
        <p class="quote-text">${escapeHtml(block.text)}</p>
        ${block.attribution ? `<footer class="quote-attribution">${escapeHtml(block.attribution)}</footer>` : ""}
      </blockquote>`;
    case "steps":
      return `<div class="block steps">${block.items
        .map(
          (item) => `<div class="step"><div>
            <p class="step-title">${escapeHtml(item.title)}</p>
            <p class="step-body">${escapeHtml(item.body)}</p>
          </div></div>`,
        )
        .join("")}</div>`;
    case "references":
      return `<ol class="block references">${block.items
        .map((item) => {
          const text = escapeHtml(item.text);
          const linked = item.url
            ? `<a href="${escapeHtml(item.url)}">${text}</a>`
            : text;
          return `<li class="reference"><span class="reference-id">${escapeHtml(item.id)}</span><span>${linked}</span></li>`;
        })
        .join("")}</ol>`;
    case "image": {
      const imagePath = path.isAbsolute(block.src)
        ? block.src
        : path.resolve(sourceDir, block.src);
      const embedded = dataUri(imagePath);
      return `<figure class="block block-image" style="--image-fit:${escapeHtml(block.fit || "cover")}">
        <img src="${embedded}" alt="${escapeHtml(block.alt || "")}" />
        ${block.caption ? `<figcaption class="image-caption">${escapeHtml(block.caption)}</figcaption>` : ""}
      </figure>`;
    }
    case "rule":
      return '<div class="block block-rule" aria-hidden="true"></div>';
    case "spacer":
      return `<div class="block block-spacer size-${escapeHtml(block.size || "medium")}" aria-hidden="true"></div>`;
    default:
      fail(`Unhandled block type: ${block.type}`);
  }
}

function renderBlocks(blocks, sourceDir) {
  return blocks.map((block) => renderBlock(block, sourceDir)).join("\n");
}

function pageChrome(page, document, pageNumber, logos) {
  const dark = page.theme === "dark";
  const logo = dark ? logos.dark : logos.light;
  const headerMeta = page.section || titleCaseKind(document.kind);
  const confidentiality = document.confidentiality || document.footerNote || "";
  return `<header class="page-header">
      <img class="page-header__logo" src="${logo}" alt="Patchworks AI" />
      <div class="page-header__meta">${escapeHtml(headerMeta)}</div>
    </header>
    <footer class="page-footer">
      <div>${escapeHtml(document.documentId)} / v${escapeHtml(document.version)}</div>
      <div class="page-footer__centre">${escapeHtml(confidentiality)}</div>
      <div class="page-footer__right">Patchworks AI&nbsp;&nbsp;<span class="page-number">${pageNumber}</span></div>
    </footer>`;
}

function pageHeading(page) {
  return `${page.eyebrow ? `<p class="eyebrow">${escapeHtml(page.eyebrow)}</p>` : ""}
    <h2 class="page-title">${escapeHtml(page.title)}</h2>
    ${page.dek ? `<p class="page-dek">${escapeHtml(page.dek)}</p>` : ""}
    <div class="title-rule" aria-hidden="true"></div>`;
}

function renderPage(page, document, pageIndex, logos, sourceDir) {
  const theme = page.theme || (page.layout === "closing" ? "dark" : "light");
  const pageClass = `publication-page theme-${theme}`;
  const pageNumber = pageIndex + 1;

  if (page.layout === "cover") {
    const title = page.title || document.title;
    const subtitle = page.subtitle || document.subtitle || "";
    const logo = theme === "dark" ? logos.dark : logos.light;
    const clientLogo = page.clientLogo
      ? dataUri(
          path.isAbsolute(page.clientLogo.src)
            ? page.clientLogo.src
            : path.resolve(sourceDir, page.clientLogo.src),
        )
      : "";
    const leftFooter = page.preparedFor || document.audience || document.author || "Patchworks AI";
    const rightFooter = [document.date, document.confidentiality, document.documentId]
      .filter(Boolean)
      .join(" / ");
    return `<section class="${pageClass} cover-page" data-page-index="${pageIndex}">
      <div class="page-accent" aria-hidden="true"></div>
      <div class="cover-brand-row">
        <img class="cover-logo" src="${logo}" alt="Patchworks AI" />
        ${clientLogo ? `<img class="cover-client-logo" src="${clientLogo}" alt="${escapeHtml(page.clientLogo.alt || "Client logo")}" />` : ""}
      </div>
      <div class="cover-content" data-overflow-check="cover">
        <p class="cover-eyebrow">${escapeHtml(page.eyebrow || titleCaseKind(document.kind))}</p>
        <h1 class="cover-title">${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="cover-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      </div>
      <div class="cover-footer">
        <div>${escapeHtml(leftFooter)}${page.note ? `<br />${escapeHtml(page.note)}` : ""}</div>
        <div class="cover-footer__right">${escapeHtml(rightFooter)}</div>
      </div>
    </section>`;
  }

  if (page.layout === "closing") {
    return `<section class="${pageClass} closing-page" data-page-index="${pageIndex}">
      <div class="page-accent" aria-hidden="true"></div>
      <img class="closing-logo" src="${logos.dark}" alt="Patchworks AI" />
      <div class="closing-content" data-overflow-check="closing">
        ${page.eyebrow ? `<p class="eyebrow">${escapeHtml(page.eyebrow)}</p>` : ""}
        <h2 class="closing-title">${escapeHtml(page.title)}</h2>
        ${page.body ? `<p class="closing-body">${escapeHtml(page.body)}</p>` : ""}
        ${page.cta ? `<span class="closing-cta">${escapeHtml(page.cta)}</span>` : ""}
      </div>
      <div class="closing-contact"><span>${escapeHtml(page.contact || document.contact || "info@patchworks.ai")}</span><span>${escapeHtml(document.url || "patchworks.ai")}</span></div>
    </section>`;
  }

  const chrome = pageChrome({ ...page, theme }, document, pageNumber, logos);

  if (page.layout === "section") {
    return `<section class="${pageClass} section-page" data-page-index="${pageIndex}">
      <div class="page-accent" aria-hidden="true"></div>
      ${chrome}
      <div class="page-content" data-overflow-check="content">
        ${page.eyebrow ? `<p class="eyebrow">${escapeHtml(page.eyebrow)}</p>` : ""}
        <p class="section-number">${escapeHtml(page.number)}</p>
        <h2 class="section-title">${escapeHtml(page.title)}</h2>
        ${page.summary ? `<p class="section-summary">${escapeHtml(page.summary)}</p>` : ""}
      </div>
    </section>`;
  }

  if (page.layout === "columns") {
    return `<section class="${pageClass}" data-page-index="${pageIndex}">
      ${chrome}
      <div class="page-content" data-overflow-check="content">
        ${pageHeading(page)}
        <div class="columns-grid">
          <div class="body-stack">${renderBlocks(page.columns[0], sourceDir)}</div>
          <div class="body-stack">${renderBlocks(page.columns[1], sourceDir)}</div>
        </div>
      </div>
    </section>`;
  }

  return `<section class="${pageClass} ${page.layout === "data" ? "data-page" : "content-page"}" data-page-index="${pageIndex}">
    ${chrome}
    <div class="page-content" data-overflow-check="content">
      ${pageHeading(page)}
      <div class="body-stack">${renderBlocks(page.blocks, sourceDir)}</div>
    </div>
  </section>`;
}

function embeddedStyles(brand) {
  const replacements = {
    __SOURCE_SANS__: dataUri(
      resolveAsset(SYSTEM_ROOT, brand.typography.body.regular),
    ),
    __INSTRUMENT_SERIF__: dataUri(
      resolveAsset(SYSTEM_ROOT, brand.typography.display.regular),
    ),
    __INSTRUMENT_SERIF_ITALIC__: dataUri(
      resolveAsset(SYSTEM_ROOT, brand.typography.display.italic),
    ),
    __COLOR_PAPER__: brand.colour.paper,
    __COLOR_WHITE__: brand.colour.white,
    __COLOR_INK__: brand.colour.ink,
    __COLOR_NAVY__: brand.colour.navy,
    __COLOR_ORANGE__: brand.colour.orange,
    __COLOR_ORANGE_DARK__: brand.colour.orangeDark,
    __COLOR_BODY__: brand.colour.body,
    __COLOR_MUTED__: brand.colour.muted,
    __COLOR_LINE__: brand.colour.line,
    __COLOR_WASH__: brand.colour.wash,
    __COLOR_ORANGE_WASH__: brand.colour.orangeWash,
  };
  let styles = fs.readFileSync(STYLE_PATH, "utf8");
  for (const [token, value] of Object.entries(replacements)) {
    styles = styles.replaceAll(token, value);
  }
  return styles;
}

function buildHtml(publication, brand, sourcePath) {
  const logos = {
    light: dataUri(resolveAsset(SYSTEM_ROOT, brand.logo.light)),
    dark: dataUri(resolveAsset(SYSTEM_ROOT, brand.logo.dark)),
    mark: dataUri(resolveAsset(SYSTEM_ROOT, brand.logo.mark)),
  };
  const styles = embeddedStyles(brand);
  const sourceDir = path.dirname(sourcePath);
  const pages = publication.pages
    .map((page, pageIndex) =>
      renderPage(page, publication.document, pageIndex, logos, sourceDir),
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(publication.document.title)}</title>
  <style>${styles}</style>
</head>
<body>
  <main aria-label="${escapeHtml(publication.document.title)}">${pages}</main>
</body>
</html>`;
}

async function inspectRenderedPage(page, expectedPages) {
  return page.evaluate((expectedPageCount) => {
    const pages = Array.from(document.querySelectorAll(".publication-page"));
    const issues = [];
    if (pages.length !== expectedPageCount) {
      issues.push(
        `Expected ${expectedPageCount} pages in the DOM, found ${pages.length}`,
      );
    }

    for (const pageElement of pages) {
      const pageIndex = Number(pageElement.dataset.pageIndex);
      const pageRect = pageElement.getBoundingClientRect();
      if (Math.abs(pageRect.width / pageRect.height - 210 / 297) > 0.001) {
        issues.push(`Page ${pageIndex + 1} does not have the A4 aspect ratio`);
      }
      if (pageElement.scrollWidth > pageElement.clientWidth + 1) {
        issues.push(`Page ${pageIndex + 1} has horizontal overflow`);
      }
      if (pageElement.scrollHeight > pageElement.clientHeight + 1) {
        issues.push(`Page ${pageIndex + 1} has vertical overflow`);
      }

      const checked = pageElement.querySelector("[data-overflow-check]");
      if (!checked) continue;
      const kind = checked.dataset.overflowCheck;
      const checkedRect = checked.getBoundingClientRect();
      if (checked.scrollWidth > checked.clientWidth + 1) {
        issues.push(`Page ${pageIndex + 1} content has horizontal overflow`);
      }
      if (kind === "content" && checked.scrollHeight > checked.clientHeight + 1) {
        issues.push(`Page ${pageIndex + 1} content exceeds its printable height`);
      }
      if (kind === "cover") {
        const footer = pageElement.querySelector(".cover-footer");
        const footerTop = footer.getBoundingClientRect().top;
        if (checkedRect.bottom > footerTop - 20) {
          issues.push(`Page ${pageIndex + 1} cover content collides with the footer`);
        }
      }
      if (kind === "closing") {
        const contact = pageElement.querySelector(".closing-contact");
        const contactTop = contact.getBoundingClientRect().top;
        if (checkedRect.bottom > contactTop - 20) {
          issues.push(`Page ${pageIndex + 1} closing content collides with contact details`);
        }
      }
    }

    const images = Array.from(document.images);
    images.forEach((image, index) => {
      if (!image.complete || image.naturalWidth === 0) {
        issues.push(`Image ${index + 1} failed to load`);
      }
    });

    const loadedFonts = [];
    document.fonts.forEach((font) => {
      if (font.status === "loaded") loadedFonts.push(`${font.family} ${font.style}`);
    });
    const hasBody = loadedFonts.some((font) => font.includes("Source Sans 3"));
    const hasDisplay = loadedFonts.some((font) => font.includes("Instrument Serif"));
    if (!hasBody) issues.push("Source Sans 3 did not load");
    if (!hasDisplay) issues.push("Instrument Serif did not load");

    return {
      issues,
      pageCount: pages.length,
      imageCount: images.length,
      loadedFonts: Array.from(new Set(loadedFonts)).sort(),
    };
  }, expectedPages);
}

async function launchBrowser() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    fail(
      "Playwright is required for PDF rendering. From the skill folder, run `npm install` and `npx playwright install chromium`, or provide Playwright through NODE_PATH.",
    );
  }
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    if (fs.existsSync(chromePath)) {
      return chromium.launch({ executablePath: chromePath, headless: true });
    }
    throw error;
  }
}

async function renderPublication({ sourcePath, outputPath, htmlPath }) {
  const source = readJson(sourcePath, "Publication source");
  const brand = readJson(BRAND_PATH, "Brand system").value;
  const assetIntegrity = verifyAssetManifest();
  validatePublication(source.value, source.raw);
  const html = buildHtml(source.value, brand, sourcePath);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (htmlPath) {
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, html, "utf8");
  }

  const browser = await launchBrowser();
  let renderInspection;
  try {
    const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    renderInspection = await inspectRenderedPage(page, source.value.pages.length);
    if (renderInspection.issues.length > 0) {
      fail(`Render validation failed:\n- ${renderInspection.issues.join("\n- ")}`);
    }
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      tagged: true,
      outline: true,
    });
  } finally {
    await browser.close();
  }

  const qaPath = `${outputPath}.qa.json`;
  const qa = {
    status: "passed",
    publicationSystem: brand.version,
    assetIntegrity,
    source: path.resolve(sourcePath),
    sourceSha256: crypto.createHash("sha256").update(source.raw).digest("hex"),
    output: path.resolve(outputPath),
    pageCount: renderInspection.pageCount,
    imageCount: renderInspection.imageCount,
    loadedFonts: renderInspection.loadedFonts,
    overflowIssues: renderInspection.issues,
  };
  fs.writeFileSync(qaPath, `${JSON.stringify(qa, null, 2)}\n`, "utf8");
  return { outputPath, qaPath, htmlPath, qa };
}

function parseArguments(argv) {
  if (argv.length < 2) {
    fail(
      "Usage: render-publication.cjs <source.json> <output.pdf> [--html <snapshot.html>]",
    );
  }
  const sourcePath = path.resolve(argv[0]);
  const outputPath = path.resolve(argv[1]);
  if (path.extname(outputPath).toLowerCase() !== ".pdf") {
    fail("Output path must end in .pdf");
  }
  let htmlPath;
  for (let index = 2; index < argv.length; index += 1) {
    if (argv[index] === "--html") {
      if (!argv[index + 1]) fail("--html requires a path");
      htmlPath = path.resolve(argv[index + 1]);
      index += 1;
    } else {
      fail(`Unknown argument: ${argv[index]}`);
    }
  }
  return { sourcePath, outputPath, htmlPath };
}

if (require.main === module) {
  renderPublication(parseArguments(process.argv.slice(2)))
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error.stack || error.message);
      process.exit(1);
    });
}

module.exports = {
  renderPublication,
  validatePublication,
  buildHtml,
  verifyAssetManifest,
};
