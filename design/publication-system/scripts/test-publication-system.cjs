#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const {
  renderPublication,
  validatePublication,
  buildHtml,
} = require("./render-publication.cjs");

const SYSTEM_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(SYSTEM_ROOT, "..", "..");
const OUTPUT_ROOT = path.join(REPO_ROOT, "output", "pdf");
const EVIDENCE_ROOT = path.join(
  REPO_ROOT,
  "design",
  "evidence",
  "publication-system",
);
const TMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "patchworks-publication-test-"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findTool(name) {
  const candidates = [
    `/opt/homebrew/bin/${name}`,
    `/usr/local/bin/${name}`,
    `/usr/bin/${name}`,
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error(`Required test tool not found: ${name}`);
  return found;
}

function runTool(name, args) {
  return execFileSync(findTool(name), args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function pngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  assert(buffer.subarray(1, 4).toString("ascii") === "PNG", `${filePath} is not PNG`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function inspectPdf(filePath, expectedPages, expectedTitle) {
  assert(fs.existsSync(filePath), `PDF was not created: ${filePath}`);
  assert(fs.statSync(filePath).size > 50000, `PDF is unexpectedly small: ${filePath}`);

  const info = runTool("pdfinfo", [filePath]);
  assert(info.includes(`Pages:           ${expectedPages}`), `Wrong page count in ${filePath}`);
  assert(info.includes("Page size:       594.96 x 841.92 pts (A4)"), `PDF is not A4: ${filePath}`);
  assert(info.includes("Tagged:          yes"), `PDF is not tagged: ${filePath}`);

  const fonts = runTool("pdffonts", [filePath]);
  assert(fonts.includes("SourceSans3"), `Source Sans 3 is not embedded: ${filePath}`);
  assert(fonts.includes("InstrumentSerif"), `Instrument Serif is not embedded: ${filePath}`);
  const fontRows = fonts
    .split("\n")
    .filter((line) => /SourceSans3|InstrumentSerif/u.test(line));
  assert(fontRows.length >= 2, `Expected brand font rows in ${filePath}`);
  fontRows.forEach((line) => {
    assert(
      /\syes\s+yes\s+yes\s+/u.test(line),
      `Font is not embedded/subset/Unicode: ${line}`,
    );
  });

  const text = runTool("pdftotext", [filePath, "-"]);
  const normalizedText = text.replace(/\s+/gu, " ").trim();
  assert(
    normalizedText.includes(expectedTitle),
    `Expected title is missing from PDF text: ${filePath}`,
  );

  const pngPrefix = path.join(TMP_ROOT, path.basename(filePath, ".pdf"));
  runTool("pdftoppm", ["-f", "1", "-singlefile", "-png", "-r", "110", filePath, pngPrefix]);
  const firstPagePng = `${pngPrefix}.png`;
  const dimensions = pngDimensions(firstPagePng);
  assert(dimensions.width >= 900 && dimensions.height >= 1280, `Rendered page is too small: ${filePath}`);
  assert(Math.abs(dimensions.width / dimensions.height - 210 / 297) < 0.005, `Rendered page is not A4: ${filePath}`);

  return {
    file: filePath,
    bytes: fs.statSync(filePath).size,
    pages: expectedPages,
    pageSize: "A4",
    tagged: true,
    embeddedFonts: ["Source Sans 3", "Instrument Serif"],
    firstPagePixels: dimensions,
  };
}

function expectFailure(name, action, expectedMessage) {
  let failure;
  try {
    action();
  } catch (error) {
    failure = error;
  }
  assert(failure, `${name} did not fail`);
  assert(
    String(failure.message).includes(expectedMessage),
    `${name} failed with an unexpected message: ${failure.message}`,
  );
  return { name, status: "passed", observed: failure.message.split("\n")[0] };
}

async function expectAsyncFailure(name, action, expectedMessage) {
  let failure;
  try {
    await action();
  } catch (error) {
    failure = error;
  }
  assert(failure, `${name} did not fail`);
  assert(
    String(failure.message).includes(expectedMessage),
    `${name} failed with an unexpected message: ${failure.message}`,
  );
  return { name, status: "passed", observed: failure.message.split("\n")[0] };
}

async function main() {
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  fs.mkdirSync(EVIDENCE_ROOT, { recursive: true });

  const whitePaperSource = path.join(SYSTEM_ROOT, "examples", "white-paper.json");
  const specimenSource = path.join(SYSTEM_ROOT, "examples", "system-specimen.json");
  const whitePaperOutput = path.join(OUTPUT_ROOT, "patchworks-white-paper-sample.pdf");
  const specimenOutput = path.join(
    OUTPUT_ROOT,
    "patchworks-publication-system-specimen.pdf",
  );

  const renderResults = [];
  renderResults.push(
    await renderPublication({
      sourcePath: whitePaperSource,
      outputPath: whitePaperOutput,
      htmlPath: path.join(TMP_ROOT, "white-paper.html"),
    }),
  );
  renderResults.push(
    await renderPublication({
      sourcePath: specimenSource,
      outputPath: specimenOutput,
      htmlPath: path.join(TMP_ROOT, "system-specimen.html"),
    }),
  );
  renderResults.forEach((result) => {
    assert(
      result.qa.assetIntegrity?.status === "passed" &&
        result.qa.assetIntegrity.fileCount === 6,
      "Bundled publication assets did not pass integrity validation",
    );
  });

  const pdfChecks = [
    inspectPdf(
      whitePaperOutput,
      7,
      "From AI experiments to governed capability",
    ),
    inspectPdf(specimenOutput, 8, "One visual language, many kinds of document"),
  ];

  const whitePaperRaw = fs.readFileSync(whitePaperSource, "utf8");
  const whitePaper = JSON.parse(whitePaperRaw);
  const validationFailures = [];

  const badBlock = structuredClone(whitePaper);
  badBlock.pages[1].blocks.push({ type: "decorative-swoosh", text: "No" });
  validationFailures.push(
    expectFailure(
      "unsupported block",
      () => validatePublication(badBlock, JSON.stringify(badBlock)),
      "unsupported",
    ),
  );

  const badDash = structuredClone(whitePaper);
  badDash.document.title = "Invalid - title".replace("-", "\u2014");
  validationFailures.push(
    expectFailure(
      "non-ASCII dash",
      () => validatePublication(badDash, JSON.stringify(badDash)),
      "non-ASCII dash",
    ),
  );

  const brand = JSON.parse(
    fs.readFileSync(path.join(SYSTEM_ROOT, "brand-system.json"), "utf8"),
  );
  const missingImage = structuredClone(whitePaper);
  missingImage.pages[1].blocks.push({
    type: "image",
    src: "missing-image.png",
    alt: "Missing",
  });
  validatePublication(missingImage, JSON.stringify(missingImage));
  validationFailures.push(
    expectFailure(
      "missing image",
      () => buildHtml(missingImage, brand, whitePaperSource),
      "Required asset is missing",
    ),
  );

  const overflow = structuredClone(whitePaper);
  overflow.pages = [
    {
      layout: "content",
      eyebrow: "Failure path",
      title: "This page must fail closed",
      blocks: Array.from({ length: 55 }, (_, index) => ({
        type: "paragraph",
        text: `Overflow test paragraph ${index + 1}. The renderer must report this content instead of clipping it.`,
      })),
    },
  ];
  const overflowSource = path.join(TMP_ROOT, "overflow.json");
  fs.writeFileSync(overflowSource, `${JSON.stringify(overflow, null, 2)}\n`, "utf8");
  validationFailures.push(
    await expectAsyncFailure(
      "page overflow",
      () =>
        renderPublication({
          sourcePath: overflowSource,
          outputPath: path.join(TMP_ROOT, "overflow.pdf"),
        }),
      "exceeds its printable height",
    ),
  );

  const results = {
    status: "passed",
    publicationSystem: brand.version,
    successfulRenders: renderResults.map((result) => result.qa),
    pdfChecks,
    failurePathChecks: validationFailures,
  };
  const resultsPath = path.join(EVIDENCE_ROOT, "test-results.json");
  fs.writeFileSync(resultsPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ resultsPath, ...results }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
