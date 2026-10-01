/* Offline tests of actual TypeScript sources. No provider credentials or network. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

require("../design/evidence/test-enquiry-form.cjs");
require("../design/evidence/test-turnstile-challenge.cjs");

const root = path.resolve(__dirname, "..");
const modules = new Map();
function loadSource(file, overrides = {}) {
  if (modules.has(file) && !Object.keys(overrides).length)
    return modules.get(file);
  const code = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const module = { exports: {} };
  const sourceRequire = (id) => {
    if (id in overrides) return overrides[id];
    if (id.startsWith("."))
      return loadSource(path.join(path.dirname(file), `${id}.ts`));
    return require(id);
  };
  new Function("require", "module", "exports", code)(
    sourceRequire,
    module,
    module.exports,
  );
  if (!Object.keys(overrides).length) modules.set(file, module.exports);
  return module.exports;
}

const { handleContactRequest } = loadSource("src/lib/contact-server.ts");
const {
  CONTACT_LEDGER_RETENTION_SECONDS,
  cleanupExpiredContactSubmissions,
  contactDedupeKey,
} = loadSource("src/lib/contact-ledger.ts");
const { validateContactFields } = loadSource("src/lib/contact.ts");
const { classifyContactResponse, CONTACT_UNEXPECTED_RESPONSE } = loadSource(
  "src/lib/contact-client.ts",
);

test("client classifies an HTML 429 without attempting JSON parsing", async () => {
  const outcome = await classifyContactResponse(
    new Response("<html>rate limited</html>", {
      status: 429,
      headers: { "Content-Type": "text/html" },
    }),
  );
  assert.deepEqual(outcome, { kind: "rate-limited", retrySeconds: 10 });
});

test("client safely handles other non-JSON and malformed JSON responses", async () => {
  for (const response of [
    new Response("<html>gateway failure</html>", {
      status: 502,
      headers: { "Content-Type": "text/html" },
    }),
    new Response("not-json", {
      status: 503,
      headers: { "Content-Type": "application/json" },
    }),
  ]) {
    assert.deepEqual(await classifyContactResponse(response), {
      kind: "error",
      error: CONTACT_UNEXPECTED_RESPONSE,
    });
  }
});

const endpoint = "https://patchworks.ai/api/contact";
const siteverify = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const nowMs = Date.UTC(2026, 8, 13, 12, 0, 0);
const valid = {
  name: "Test Visitor",
  email: "visitor@example.org",
  company: "Example Company",
  interest: "ai-counsel",
  message: "Please help review our AI programme.",
  website: "",
  submissionId: "cfd9786f-a8df-4a02-a27c-24ff9ac4a7ca",
  turnstileToken: "offline-fresh-token",
};

class FakeD1 {
  constructor() {
    this.rows = new Map();
    this.statements = [];
    this.fail = null;
  }

  prepare(sql) {
    const database = this;
    return {
      bind(...values) {
        return {
          run: () => database.run(sql, values),
          first: () => database.first(sql, values),
        };
      },
    };
  }

  async run(sql, values) {
    this.statements.push({ sql, values });
    if (this.fail && this.fail.test(sql)) throw new Error("Offline D1 failure");
    if (sql.includes("INSERT INTO contact_submission_ledger")) {
      const [key, createdAt, expiresAt] = values;
      const current = this.rows.get(key);
      if (!current || current.expiresAt <= createdAt) {
        this.rows.set(key, {
          status: "sending",
          messageId: null,
          createdAt,
          updatedAt: createdAt,
          expiresAt,
        });
        return result(1);
      }
      return result(0);
    }
    if (sql.includes("SET status = 'accepted'")) {
      const [key, messageId, updatedAt] = values;
      const row = this.rows.get(key);
      if (!row || row.status !== "sending") return result(0);
      Object.assign(row, { status: "accepted", messageId, updatedAt });
      return result(1);
    }
    if (sql.includes("SET status = 'ambiguous'")) {
      const [key, updatedAt] = values;
      const row = this.rows.get(key);
      if (!row || row.status !== "sending") return result(0);
      Object.assign(row, { status: "ambiguous", messageId: null, updatedAt });
      return result(1);
    }
    if (sql.includes("DELETE FROM contact_submission_ledger")) {
      const [cutoff] = values;
      let changes = 0;
      for (const [key, row] of this.rows) {
        if (row.expiresAt <= cutoff) {
          this.rows.delete(key);
          changes += 1;
        }
      }
      return result(changes);
    }
    throw new Error("Unexpected offline SQL");
  }

  async first(sql, values) {
    this.statements.push({ sql, values });
    if (this.fail && this.fail.test(sql)) throw new Error("Offline D1 failure");
    if (!sql.includes("SELECT status"))
      throw new Error("Unexpected offline SQL");
    const [key, now] = values;
    const row = this.rows.get(key);
    return row && row.expiresAt > now ? { status: row.status } : null;
  }
}

function result(changes) {
  return { success: true, meta: { changes }, results: [] };
}

function makeEmail(send) {
  const calls = [];
  return {
    calls,
    binding: {
      async send(message) {
        calls.push(message);
        return send ? send(message) : { messageId: "offline-email-id" };
      },
    },
  };
}

function makeRequest(payload = valid, options = {}) {
  const headers = new Headers({
    Origin: "https://patchworks.ai",
    "Content-Type": "application/json",
    ...options.headers,
  });
  for (const name of options.removeHeaders ?? []) headers.delete(name);
  return new Request(options.url ?? endpoint, {
    method: "POST",
    headers,
    body: options.rawBody ?? JSON.stringify(payload),
    duplex: "half",
  });
}

function makeRuntime(options = {}) {
  const database = options.database ?? new FakeD1();
  const email = options.email ?? makeEmail(options.send);
  const challengeCalls = [];
  const fetch = async (url, init) => {
    challengeCalls.push({ url, init });
    if (url !== siteverify)
      throw new Error("Unexpected outbound destination; no network allowed");
    if (options.challenge) return options.challenge(url, init);
    return Response.json({
      success: true,
      hostname: options.challengeHostname ?? "patchworks.ai",
      action: "contact",
    });
  };
  const env = {
    CONTACT_DB: database,
    EMAIL: email.binding,
    CONTACT_DEDUPE_SECRET: "offline-test-dedupe-secret-at-least-32-bytes",
    TURNSTILE_SECRET_KEY: "offline-test-turnstile-secret",
    TURNSTILE_EXPECTED_HOSTNAMES: "patchworks.ai",
    CONTACT_ALLOWED_ORIGINS: "https://patchworks.ai",
    ...options.env,
  };
  return { database, email, challengeCalls, fetch, env };
}

async function execute(payload = valid, options = {}) {
  const runtime = options.runtime ?? makeRuntime(options);
  const response = await handleContactRequest(makeRequest(payload, options), {
    env: runtime.env,
    fetch: runtime.fetch,
    timeoutMs: options.timeoutMs ?? 100,
    development: options.development ?? false,
    now: () => options.nowMs ?? nowMs,
    logger: { error() {} },
  });
  return { response, body: await response.json(), ...runtime };
}

function waitForAbort(_url, init) {
  return new Promise((_resolve, reject) => {
    if (init.signal.aborted) reject(new DOMException("Aborted", "AbortError"));
    else
      init.signal.addEventListener(
        "abort",
        () => reject(new DOMException("Aborted", "AbortError")),
        { once: true },
      );
  });
}

test("valid request verifies Turnstile, claims D1, then sends fixed plain text email", async () => {
  const result = await execute({
    ...valid,
    name: "  Test Visitor  ",
    email: "visitor@EXAMPLE.ORG",
    message: "  First line\r\n<script>untrusted text</script>  ",
    to: "attacker@example.net",
    from: "attacker@example.net",
    subject: "Untrusted subject",
  });
  assert.equal(result.response.status, 200);
  assert.deepEqual(result.body, { ok: true });
  assert.equal(result.response.headers.get("cache-control"), "no-store");
  assert.equal(result.challengeCalls.length, 1);
  const challengeBody = result.challengeCalls[0].init.body;
  assert.equal(challengeBody.get("secret"), result.env.TURNSTILE_SECRET_KEY);
  assert.equal(challengeBody.get("response"), valid.turnstileToken);
  assert.equal(result.email.calls.length, 1);
  const message = result.email.calls[0];
  assert.deepEqual(message.from, {
    email: "website@patchworks.ai",
    name: "Patchworks AI website",
  });
  assert.equal(message.to, "info@patchworks.ai");
  assert.equal(message.replyTo, "visitor@example.org");
  assert.equal(message.subject, "Patchworks AI website enquiry");
  assert(message.text.includes("Name: Test Visitor\n"));
  assert(message.text.includes("First line\n<script>untrusted text</script>"));
  assert.equal(message.html, undefined);
  assert.equal([...result.database.rows.values()][0].status, "accepted");
});

test("ledger persists only opaque hash, status, provider ID and timestamps", async () => {
  const result = await execute();
  const serialised = JSON.stringify([...result.database.rows.entries()]);
  assert(!serialised.includes(valid.name));
  assert(!serialised.includes(valid.email));
  assert(!serialised.includes(valid.company));
  assert(!serialised.includes(valid.message));
  const [key, row] = [...result.database.rows.entries()][0];
  assert.match(key, /^[a-f0-9]{64}$/);
  assert.equal(row.messageId, "offline-email-id");
  assert.equal(row.expiresAt - row.createdAt, CONTACT_LEDGER_RETENTION_SECONDS);
});

test("same normalized enquiry has stable HMAC; content and UUID changes differ", async () => {
  const validation = validateContactFields({
    ...valid,
    email: "visitor@EXAMPLE.ORG",
  });
  assert.equal(validation.ok, true);
  const key = await contactDedupeKey(
    "offline-test-dedupe-secret-at-least-32-bytes",
    valid.submissionId,
    validation.values,
  );
  const same = await contactDedupeKey(
    "offline-test-dedupe-secret-at-least-32-bytes",
    valid.submissionId.toUpperCase(),
    validation.values,
  );
  const changed = await contactDedupeKey(
    "offline-test-dedupe-secret-at-least-32-bytes",
    valid.submissionId,
    { ...validation.values, message: "Changed" },
  );
  assert.equal(key, same);
  assert.notEqual(key, changed);
});

test("accepted duplicate returns success without a second send", async () => {
  const runtime = makeRuntime();
  const first = await execute(valid, { runtime });
  const second = await execute(
    { ...valid, turnstileToken: "fresh-second-token" },
    { runtime },
  );
  assert.equal(first.response.status, 200);
  assert.equal(second.response.status, 200);
  assert.equal(runtime.email.calls.length, 1);
});

test("a duplicate while the first send is pending is suppressed", async () => {
  let release;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  const runtime = makeRuntime({ send: () => pending });
  const firstPromise = execute(valid, { runtime });
  while (runtime.email.calls.length === 0)
    await new Promise((resolve) => setImmediate(resolve));
  const second = await execute(
    { ...valid, turnstileToken: "fresh-second-token" },
    { runtime },
  );
  assert.equal(second.response.status, 409);
  assert.match(second.body.error, /do not resubmit/i);
  assert.equal(runtime.email.calls.length, 1);
  release({ messageId: "offline-email-id" });
  const first = await firstPromise;
  assert.equal(first.response.status, 200);
});

test("ambiguous send is retained and later retry is suppressed", async () => {
  const providerError = new Error("Sensitive provider detail");
  providerError.code = "E_INTERNAL_SERVER_ERROR";
  const runtime = makeRuntime({
    send: () => {
      throw providerError;
    },
  });
  const first = await execute(valid, { runtime });
  const second = await execute(
    { ...valid, turnstileToken: "fresh-second-token" },
    { runtime },
  );
  assert.equal(first.response.status, 502);
  assert.equal(second.response.status, 409);
  assert.match(second.body.error, /do not resubmit/i);
  assert.equal(runtime.email.calls.length, 1);
  assert.equal([...runtime.database.rows.values()][0].status, "ambiguous");
  assert(!JSON.stringify(first.body).includes("Sensitive provider detail"));
});

test("missing provider message ID is ambiguous and is never auto-retried", async () => {
  const runtime = makeRuntime({ send: () => ({}) });
  const first = await execute(valid, { runtime });
  const second = await execute(
    { ...valid, turnstileToken: "fresh-second-token" },
    { runtime },
  );
  assert.equal(first.response.status, 502);
  assert.equal(second.response.status, 409);
  assert.equal(runtime.email.calls.length, 1);
});

test("database claim failure prevents sending", async () => {
  const runtime = makeRuntime();
  runtime.database.fail = /INSERT INTO/;
  const result = await execute(valid, { runtime });
  assert.equal(result.response.status, 503);
  assert.equal(runtime.email.calls.length, 0);
});

test("known provider acceptance remains success if ledger finalization fails", async () => {
  const runtime = makeRuntime();
  runtime.database.fail = /SET status = 'accepted'/;
  const first = await execute(valid, { runtime });
  const second = await execute(
    { ...valid, turnstileToken: "fresh-second-token" },
    { runtime },
  );
  assert.equal(first.response.status, 200);
  assert.equal(second.response.status, 409);
  assert.equal(runtime.email.calls.length, 1);
  assert.equal([...runtime.database.rows.values()][0].status, "sending");
});

test("an expired key can be claimed again after the seven-day window", async () => {
  const runtime = makeRuntime();
  const first = await execute(valid, { runtime });
  const afterExpiry = nowMs + (CONTACT_LEDGER_RETENTION_SECONDS + 1) * 1000;
  const second = await execute(
    { ...valid, turnstileToken: "fresh-after-expiry" },
    { runtime, nowMs: afterExpiry },
  );
  assert.equal(first.response.status, 200);
  assert.equal(second.response.status, 200);
  assert.equal(runtime.email.calls.length, 2);
});

test("scheduled cleanup deletes only expired rows", async () => {
  const database = new FakeD1();
  database.rows.set("expired", { expiresAt: 99, status: "accepted" });
  database.rows.set("current", { expiresAt: 101, status: "ambiguous" });
  const deleted = await cleanupExpiredContactSubmissions(database, 100);
  assert.equal(deleted, 1);
  assert.deepEqual([...database.rows.keys()], ["current"]);
});

const invalidFields = [
  ["name", ""],
  ["name", 42],
  ["name", "a".repeat(101)],
  ["name", "Visitor\r\nBcc: injected@example.org"],
  ["email", "not-an-address"],
  ["email", "a@example.org\r\nBcc:x@example.org"],
  ["email", "a@example.org,b@example.org"],
  ["email", ".a@example.org"],
  ["email", "a..b@example.org"],
  ["email", "a".repeat(65) + "@example.org"],
  ["company", null],
  ["company", "a".repeat(151)],
  ["company", "Company\u0000"],
  ["message", {}],
  ["message", " \n "],
  ["message", "a".repeat(5001)],
  ["message", "Control\u0001character"],
  ["interest", "fractional-head-of-ai"],
  ["website", []],
];
for (const [field, value] of invalidFields) {
  test(`invalid ${field} is rejected before providers and storage`, async () => {
    const result = await execute({ ...valid, [field]: value });
    assert.equal(result.response.status, 400);
    assert.equal(result.body.ok, false);
    assert(result.body.fieldErrors[field]);
    assert.equal(result.challengeCalls.length, 0);
    assert.equal(result.database.statements.length, 0);
    assert.equal(result.email.calls.length, 0);
  });
}

test("honeypot, invalid UUID and invalid challenge never reach providers", async () => {
  for (const [patch, status] of [
    [{ website: "https://spam.example.org" }, 403],
    [{ submissionId: "not-a-uuid" }, 400],
    [{ submissionId: null }, 400],
    [{ turnstileToken: "" }, 403],
    [{ turnstileToken: 1 }, 403],
    [{ turnstileToken: "t".repeat(2049) }, 403],
    [{ turnstileToken: "contains space" }, 403],
  ]) {
    const result = await execute({ ...valid, ...patch });
    assert.equal(result.response.status, status);
    assert.equal(result.challengeCalls.length, 0);
    assert.equal(result.email.calls.length, 0);
  }
});

test("origin must be exact, allowlisted and equal to request URL origin", async () => {
  const cases = [
    { removeHeaders: ["origin"] },
    { headers: { Origin: "null" } },
    { headers: { Origin: "https://evil.example" } },
    { headers: { Origin: "https://patchworks.ai/with-path" } },
    { url: "https://evil.example/api/contact" },
    {
      url: "https://patchworks.ai.evil.example/api/contact",
      headers: { Origin: "https://patchworks.ai.evil.example" },
    },
    {
      url: "http://localhost:3000/api/contact",
      headers: { Origin: "http://localhost:3000" },
    },
  ];
  for (const options of cases) {
    const result = await execute(valid, options);
    assert.equal(result.response.status, 403);
    assert.equal(result.challengeCalls.length, 0);
  }
});

test("development permits an explicitly configured local origin and hostname", async () => {
  const result = await execute(valid, {
    url: "http://localhost:3017/api/contact",
    headers: { Origin: "http://localhost:3017" },
    development: true,
    challengeHostname: "localhost",
    env: {
      CONTACT_ALLOWED_ORIGINS: "http://localhost:3017",
      TURNSTILE_EXPECTED_HOSTNAMES: "localhost",
    },
  });
  assert.equal(result.response.status, 200);
});

test("development rejects a local origin that is not explicitly configured", async () => {
  const result = await execute(valid, {
    url: "http://localhost:3017/api/contact",
    headers: { Origin: "http://localhost:3017" },
    development: true,
    challengeHostname: "localhost",
    env: {
      CONTACT_ALLOWED_ORIGINS: "http://localhost:3000",
      TURNSTILE_EXPECTED_HOSTNAMES: "localhost",
    },
  });
  assert.equal(result.response.status, 403);
  assert.equal(result.challengeCalls.length, 0);
});

test("invalid or missing binding configuration fails closed", async () => {
  for (const patch of [
    { CONTACT_DB: undefined },
    { EMAIL: undefined },
    { CONTACT_DEDUPE_SECRET: "" },
    { CONTACT_DEDUPE_SECRET: "too-short" },
    { TURNSTILE_SECRET_KEY: "" },
    { TURNSTILE_EXPECTED_HOSTNAMES: "" },
    { TURNSTILE_EXPECTED_HOSTNAMES: "patchworks.ai,localhost" },
    { TURNSTILE_EXPECTED_HOSTNAMES: "*.patchworks.ai" },
    { TURNSTILE_EXPECTED_HOSTNAMES: "other.example" },
    { CONTACT_ALLOWED_ORIGINS: "not-a-url" },
    { CONTACT_ALLOWED_ORIGINS: "https://*.vercel.app" },
    { CONTACT_FROM_EMAIL: "sender@example.org\nBcc:x@example.org" },
  ]) {
    const result = await execute(valid, { env: patch });
    assert.equal(result.response.status, 503);
    assert.equal(result.challengeCalls.length, 0);
    assert.equal(result.email.calls.length, 0);
  }
});

test("unsupported media type and oversized bodies fail before providers", async () => {
  const media = await execute(valid, {
    headers: { "Content-Type": "text/plain" },
  });
  assert.equal(media.response.status, 415);
  const size = await execute(valid, {
    headers: { "Content-Length": "32769" },
  });
  assert.equal(size.response.status, 413);
  assert.equal(media.challengeCalls.length + size.challengeCalls.length, 0);
});

test("UTF-8 body parsing handles codepoints split across chunks", async () => {
  const bytes = new TextEncoder().encode(
    JSON.stringify({ ...valid, message: "你好\nA useful enquiry" }),
  );
  const stream = new ReadableStream({
    start(controller) {
      for (let index = 0; index < bytes.length; index++)
        controller.enqueue(bytes.slice(index, index + 1));
      controller.close();
    },
  });
  const result = await execute(valid, { rawBody: stream });
  assert.equal(result.response.status, 200);
  assert(result.email.calls[0].text.includes("你好\nA useful enquiry"));
});

test("Turnstile rejection and provider failures fail closed", async () => {
  for (const challenge of [
    () =>
      Response.json({
        success: false,
        hostname: "patchworks.ai",
        action: "contact",
      }),
    () =>
      Response.json({
        success: true,
        hostname: "other.example",
        action: "contact",
      }),
    () =>
      Response.json({
        success: true,
        hostname: "patchworks.ai",
        action: "signup",
      }),
  ]) {
    const result = await execute(valid, { challenge });
    assert.equal(result.response.status, 403);
    assert.equal(result.email.calls.length, 0);
  }
  for (const challenge of [
    () => Response.json({}, { status: 500 }),
    () => new Response("not JSON"),
    () => {
      throw new Error("Sensitive provider detail");
    },
    waitForAbort,
  ]) {
    const result = await execute(valid, { challenge, timeoutMs: 5 });
    assert.equal(result.response.status, 503);
    assert.equal(result.email.calls.length, 0);
    assert(!JSON.stringify(result.body).includes("Sensitive provider detail"));
  }
});

test("route returns safe no-store JSON when Cloudflare context is unavailable", async () => {
  const errors = [];
  const originalError = console.error;
  console.error = (value) => errors.push(value);
  try {
    const contactServer = loadSource("src/lib/contact-server.ts");
    const { POST } = loadSource("src/app/api/contact/route.ts", {
      "@opennextjs/cloudflare": {
        getCloudflareContext() {
          throw new Error("Sensitive local context detail");
        },
      },
      "@/lib/contact-server": contactServer,
    });
    const response = await POST(makeRequest());
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("content-type"), "application/json");
    assert.equal(body.ok, false);
    assert(!JSON.stringify(body).includes("Sensitive local context detail"));
    assert.deepEqual(errors, [
      JSON.stringify({ event: "contact_route_unavailable" }),
    ]);
  } finally {
    console.error = originalError;
  }
});
