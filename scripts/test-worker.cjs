const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const source = ts.transpileModule(fs.readFileSync("worker.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exportsObject = {};
let calls = 0;
const handler = {
  fetch: async () => { calls++; return new Response("page", { status: 404, headers: { "Cache-Control": "no-store" } }); },
};
vm.runInNewContext(source, {
  exports: exportsObject, URL, Response, Headers, console,
  require: (name) => name.includes(".open-next") ? { default: handler } : { cleanupExpiredContactSubmissions: async () => 0 },
});
(async () => {
  const worker = exportsObject.default;
  const redirected = await worker.fetch(new Request("http://www.patchworks.ai:8080/services?utm_source=a&tag=b%20c"), { ENVIRONMENT: "production" }, {});
  assert.equal(redirected.status, 308);
  assert.equal(redirected.headers.get("location"), "https://patchworks.ai/services?utm_source=a&tag=b%20c");
  assert.equal(calls, 0);
  for (const [url, environment, expected] of [
    ["https://patchworks-nextjs-preview.bryan-johnson.workers.dev/missing", "preview", "noindex, nofollow"],
    ["https://patchworks-nextjs.bryan-johnson.workers.dev/missing", "production", "noindex, nofollow"],
    ["https://patchworks.ai/missing", "production", null],
  ]) {
    const response = await worker.fetch(new Request(url), { ENVIRONMENT: environment }, {});
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("x-robots-tag"), expected);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(await response.text(), "page");
  }
  console.log("PASS canonical www redirect, path/query preservation, preview exclusion and retained response status/body.");
})().catch(error => { console.error(error); process.exitCode = 1; });
