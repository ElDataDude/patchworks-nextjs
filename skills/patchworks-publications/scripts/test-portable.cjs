#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const renderer = require("./render-publication.cjs");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  return {
    absolutePath,
    raw: fs.readFileSync(absolutePath, "utf8"),
  };
}

function assertExists(relativePath) {
  assert(fs.existsSync(path.join(ROOT, relativePath)), `Missing ${relativePath}`);
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
  });
}

for (const relativePath of [
  "SKILL.md",
  "INSTALL.md",
  "USAGE-LICENCE.md",
  "brand-system.json",
  "assets/manifest.json",
  "assets/fonts/source-sans-3-OFL.txt",
  "assets/fonts/instrument-serif-OFL.txt",
  "assets/editorial/home-systems.png",
  "examples/sample-output/patchworks-white-paper-sample.pdf",
  "examples/sample-output/patchworks-publication-system-specimen.pdf",
]) {
  assertExists(relativePath);
}

const textExtensions = new Set([".cjs", ".css", ".json", ".md", ".txt", ".yaml"]);
const packageText = listFiles(ROOT)
  .filter((filePath) => textExtensions.has(path.extname(filePath)))
  .map((filePath) => fs.readFileSync(filePath, "utf8"))
  .join("\n");
const machineSpecificPath = path.join("/", "Users", "bryanj");
assert(!packageText.includes(machineSpecificPath), "Package contains a machine-specific path");

const assetIntegrity = renderer.verifyAssetManifest();
assert(assetIntegrity.status === "passed", "Asset integrity did not pass");

for (const relativePath of ["examples/white-paper.json", "examples/system-specimen.json"]) {
  const source = readJson(relativePath);
  const publication = JSON.parse(source.raw);
  const brand = JSON.parse(readJson("brand-system.json").raw);
  renderer.validatePublication(publication, source.raw);
  const html = renderer.buildHtml(publication, brand, source.absolutePath);
  const pageCount = (html.match(/class="publication-page/g) || []).length;
  assert(pageCount === publication.pages.length, `${relativePath} page count mismatch`);
  assert(html.includes("data:font/woff2;base64,"), `${relativePath} does not embed fonts`);
  assert(html.includes("data:image/png;base64,"), `${relativePath} does not embed logos`);
  assert(!html.includes(machineSpecificPath), `${relativePath} generated a machine-specific path`);
}

console.log(
  JSON.stringify(
    {
      status: "passed",
      root: ROOT,
      checkedExamples: 2,
      verifiedBrandAssets: assetIntegrity.fileCount,
    },
    null,
    2,
  ),
);
