// Packages an existing Wrangler dry-run for upload through the Cloudflare plugin.
// All generated payloads stay in the ignored .wrangler directory. No secrets read.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const blake3 = require("blake3-wasm");

const output = ".wrangler/plugin-payload";
const moduleDirectory = process.argv[2] ?? ".wrangler/plugin-upload";
fs.mkdirSync(output, { recursive: true });
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? files(location) : [location];
  });
}
const contentTypes = {
  css: "text/css; charset=utf-8", js: "application/javascript; charset=utf-8",
  json: "application/json", html: "text/html; charset=utf-8", txt: "text/plain; charset=utf-8",
  xml: "application/xml", svg: "image/svg+xml", png: "image/png", webp: "image/webp",
  jpg: "image/jpeg", jpeg: "image/jpeg", ico: "image/x-icon", woff2: "font/woff2",
  woff: "font/woff", ttf: "font/ttf", wasm: "application/wasm", gif: "image/gif",
};
const manifest = {};
const assets = {};
for (const file of files(".open-next/assets")) {
  const bytes = fs.readFileSync(file);
  const extension = path.extname(file).slice(1);
  const hash = blake3.hash(bytes.toString("base64") + extension).toString("hex").slice(0, 32);
  manifest["/" + path.relative(".open-next/assets", file)] = { hash, size: bytes.length };
  assets[hash] = { file, type: contentTypes[extension] ?? "application/octet-stream" };
}
fs.writeFileSync(`${output}/manifest.json`, JSON.stringify(manifest));
fs.writeFileSync(`${output}/assets.json`, JSON.stringify(assets));
const modules = files(moduleDirectory).filter(file => !file.endsWith(".map") && !file.endsWith("README.md")).map(file => {
  const extension = path.extname(file).slice(1);
  return {
    name: path.relative(moduleDirectory, file),
    type: extension === "js" ? "application/javascript+module" : contentTypes[extension] ?? "application/octet-stream",
    data: fs.readFileSync(file).toString("base64"),
  };
});
fs.writeFileSync(`${output}/modules.json.gz.b64`, zlib.gzipSync(JSON.stringify(modules)).toString("base64"));
console.log(JSON.stringify({ assetPaths: Object.keys(manifest).length, uniqueAssets: Object.keys(assets).length, modules: modules.map(({name,type}) => ({name,type})), payloadBytes: fs.statSync(`${output}/modules.json.gz.b64`).size }, null, 2));
