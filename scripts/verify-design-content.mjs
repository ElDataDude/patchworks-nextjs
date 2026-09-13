import fs from "node:fs";
import crypto from "node:crypto";
const before = JSON.parse(
  fs.readFileSync("design/evidence/content-before.json", "utf8"),
);
const after = JSON.parse(
  fs.readFileSync("design/evidence/content-after.json", "utf8"),
);
const normalize = (text) =>
  text
    .replace(/[\u200b\u00ad]/g, "")
    .replace(/•/g, "")
    .replace(/[’‘]/g, "'")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
const results = {};
for (const [route, source] of Object.entries(before)) {
  const target = after[route];
  if (!target) {
    results[route] = { missingRoute: true };
    continue;
  }
  const current = normalize(target.text);
  const currentBlocks = target.blocks.map(normalize);
  const compact = (text) => normalize(text).replace(/\s/g, "");
  const compactBlocks = currentBlocks.map(compact);
  const missing = [...new Set(source.blocks)].filter((original) => {
    const text = normalize(original);
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const presentPhrase = new RegExp(
      "(?:^|[^a-z0-9])" + escaped + "(?=$|[^a-z0-9])",
    ).test(current);
    return (
      !presentPhrase &&
      !currentBlocks.includes(text) &&
      !compactBlocks.includes(compact(text)) &&
      !(text.length > 30 && compact(current).includes(compact(text))) &&
      !(text === "patchworksai" && compact(current).includes(text))
    );
  });
  const placeholders = (source.controls || [])
    .filter((c) => c.placeholder)
    .map((c) => c.placeholder);
  const missingPlaceholders = placeholders.filter(
    (p) => !target.controls.some((c) => c.placeholder === p),
  );
  results[route] = {
    checkedBlocks: source.blocks.length,
    missing,
    missingPlaceholders,
    metadataTitlePreserved: source.title === target.title,
  };
}
const dataBefore = JSON.parse(
  fs.readFileSync("design/evidence/data-before.json", "utf8"),
);
const availabilityHash = crypto
  .createHash("sha256")
  .update(fs.readFileSync("src/data/availability.json"))
  .digest("hex");
const report = {
  routes: results,
  availabilityDataUnchanged:
    availabilityHash === dataBefore.availability_sha256,
};
fs.writeFileSync(
  "design/evidence/content-check.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (
  !report.availabilityDataUnchanged ||
  Object.values(results).some(
    (r) =>
      r.missingRoute ||
      r.missing.length ||
      r.missingPlaceholders.length ||
      !r.metadataTitlePreserved,
  )
)
  process.exitCode = 1;
