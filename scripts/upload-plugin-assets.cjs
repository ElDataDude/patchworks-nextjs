// Completes only the signed asset session created by the Cloudflare plugin.
// This deliberately has no Cloudflare account API credential or mutation access.
const fs = require("node:fs");
const directory = ".wrangler/plugin-payload";
const accountId = JSON.parse(fs.readFileSync("wrangler.jsonc")).account_id;
const session = JSON.parse(fs.readFileSync(`${directory}/asset-session.json`));
const assets = JSON.parse(fs.readFileSync(`${directory}/assets.json`));
(async () => {
  let completion;
  for (const [index, bucket] of session.buckets.entries()) {
    const body = new FormData();
    for (const hash of bucket) {
      const asset = assets[hash];
      body.append(hash, new Blob([fs.readFileSync(asset.file).toString("base64")], { type: asset.type }), hash);
    }
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/assets/upload?base64=true`, {
      method: "POST", headers: { Authorization: `Bearer ${session.jwt}` }, body,
    });
    const raw = await response.text();
    let result;
    try { result = JSON.parse(raw); } catch { throw new Error(`Asset upload returned HTTP ${response.status}`); }
    if (!response.ok || !result.success) throw new Error(`Asset upload failed: ${response.status} ${JSON.stringify(result.errors)}`);
    if (result.result?.jwt) completion = result.result.jwt;
    console.log(`Uploaded asset bucket ${index + 1}/${session.buckets.length} (${bucket.length} files)`);
  }
  if (!session.buckets.length) completion = session.jwt;
  if (!completion) throw new Error("No completion token received");
  fs.writeFileSync(`${directory}/asset-completion.json`, JSON.stringify({ jwt: completion }), { mode: 0o600 });
  fs.rmSync(`${directory}/asset-session.json`);
  console.log("Signed asset upload complete.");
})().catch(error => { console.error(error.message); process.exitCode = 1; });
