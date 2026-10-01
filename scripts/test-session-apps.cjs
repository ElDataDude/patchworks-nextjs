/* Offline tests of the "Open app" session lookup. No network or credentials. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { loadSource } = require("./lib/load-ts.cjs");

const {
  handleSessionAppsRequest,
  forwardableCookies,
  SESSION_APPS_TIMEOUT_MS,
} = loadSource("src/lib/session-apps-server.ts");

const SESSION = "__Secure-pw.session_token";
const env = {
  ID_API_ORIGIN: "https://id.patchworks.ai",
  ID_SESSION_COOKIE_NAMES: SESSION,
};

function makeRequest(cookie) {
  return new Request("https://patchworks.ai/api/session-apps", {
    headers: cookie ? { cookie } : {},
  });
}

async function run({ cookie, upstream, options = {} }) {
  const calls = [];
  const logs = [];
  const fetch = async (request) => {
    calls.push(request);
    return upstream(request);
  };
  const response = await handleSessionAppsRequest(makeRequest(cookie), {
    env: { ...env, ...options.env },
    fetch,
    timeoutMs: options.timeoutMs ?? 50,
    logger: { error: (line) => logs.push(line) },
  });
  return { response, body: await response.json(), calls, logs };
}

const granted =
  (...slugs) =>
  () =>
    Response.json({
      apps: slugs.map((slug) => ({
        slug,
        title: slug,
        url: "https://x",
        role: "member",
      })),
    });

function assertHeaders(response) {
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("vary"), "Cookie");
  assert.equal(response.headers.get("set-cookie"), null);
}

test("default timeout is 1.5 seconds", () => {
  assert.equal(SESSION_APPS_TIMEOUT_MS, 1500);
});

test("signed-in visitor gets the granted, openable apps", async () => {
  const result = await run({
    cookie: `${SESSION}=abc.def`,
    upstream: granted("decisions", "funds"),
  });
  assertHeaders(result.response);
  assert.deepEqual(result.body, {
    status: "signed-in",
    apps: ["decisions", "funds"],
  });
  assert.equal(result.calls.length, 1);
  assert.equal(result.calls[0].url, "https://id.patchworks.ai/api/v1/me/apps");
  assert.equal(result.calls[0].method, "GET");
});

test("no session cookie answers signed-out without calling identity", async () => {
  for (const cookie of [undefined, "", "theme=dark; analytics=1"]) {
    const result = await run({ cookie, upstream: granted("decisions") });
    assertHeaders(result.response);
    assert.deepEqual(result.body, { status: "signed-out", apps: [] });
    assert.equal(result.calls.length, 0);
  }
});

test("identity 401 means signed-out", async () => {
  const result = await run({
    cookie: `${SESSION}=expired`,
    upstream: () =>
      Response.json({ error: "UNAUTHENTICATED" }, { status: 401 }),
  });
  assertHeaders(result.response);
  assert.deepEqual(result.body, { status: "signed-out", apps: [] });
});

test("identity 5xx, malformed JSON and wrong shapes are unavailable", async () => {
  for (const upstream of [
    () => new Response("upstream failure", { status: 502 }),
    () =>
      new Response("{not json", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    () => Response.json(["decisions"]),
    () => Response.json({ apps: "decisions" }),
    () => {
      throw new Error("connection reset");
    },
  ]) {
    const result = await run({ cookie: `${SESSION}=abc`, upstream });
    assertHeaders(result.response);
    assert.deepEqual(result.body, { status: "unavailable", apps: [] });
  }
});

test("a slow identity times out as unavailable", async () => {
  const started = Date.now();
  const result = await run({
    cookie: `${SESSION}=abc`,
    upstream: (request) =>
      new Promise((_, reject) =>
        request.signal.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        ),
      ),
    options: { timeoutMs: 20 },
  });
  assertHeaders(result.response);
  assert.deepEqual(result.body, { status: "unavailable", apps: [] });
  assert(Date.now() - started < 1000);
  assert(result.logs.some((line) => line.includes('"timeout"')));
});

test("a slow body after headers also times out", async () => {
  const result = await run({
    cookie: `${SESSION}=abc`,
    upstream: () =>
      new Response(new ReadableStream({ start() {} }), { status: 200 }),
    options: { timeoutMs: 20 },
  });
  assert.deepEqual(result.body, { status: "unavailable", apps: [] });
});

test("foreign, planned and Access-protected slugs are never returned", async () => {
  const result = await run({
    cookie: `${SESSION}=abc`,
    upstream: () =>
      Response.json({
        apps: [
          { slug: "grants" },
          { slug: "folio" },
          { slug: "pci" },
          { slug: "os" },
          { slug: "hello" },
          { slug: "grants" },
          { slug: "https://evil.example" },
          null,
          "decisions",
        ],
      }),
  });
  assert.deepEqual(result.body, { status: "signed-in", apps: ["grants"] });
});

test("only the configured session cookies are forwarded", async () => {
  const result = await run({
    cookie: `theme=dark; ${SESSION}=abc.def; __Secure-pw-staging.session_token=stg; tracking=1; ${SESSION}x=no`,
    upstream: granted("funds"),
  });
  assert.equal(result.calls.length, 1);
  assert.equal(result.calls[0].headers.get("cookie"), `${SESSION}=abc.def`);
  assert.deepEqual([...result.calls[0].headers.keys()].sort(), [
    "accept",
    "cookie",
  ]);
  assert.equal(
    forwardableCookies("a=1; b=2; c=3", new Set(["b", "c"])),
    "b=2; c=3",
  );
  assert.equal(forwardableCookies("a=1", new Set()), "");
});

test("upstream Set-Cookie is never passed to the browser and cookies are never logged", async () => {
  const result = await run({
    cookie: `${SESSION}=secret-session-value`,
    upstream: () =>
      new Response("oops", {
        status: 500,
        headers: { "set-cookie": `${SESSION}=rotated; Domain=patchworks.ai` },
      }),
  });
  assert.equal(result.response.headers.get("set-cookie"), null);
  assert(result.logs.length > 0);
  for (const line of result.logs)
    assert(!line.includes("secret-session-value"));
});

test("misconfigured identity origin fails closed without a call", async () => {
  for (const origin of [
    undefined,
    "",
    "http://id.patchworks.ai",
    "https://id.patchworks.ai/path",
    "not a url",
  ]) {
    const result = await run({
      cookie: `${SESSION}=abc`,
      upstream: granted("decisions"),
      options: { env: { ID_API_ORIGIN: origin } },
    });
    assert.deepEqual(result.body, { status: "unavailable", apps: [] });
    assert.equal(result.calls.length, 0);
  }
});

test("a service binding is preferred over public fetch when present", async () => {
  const bound = [];
  const response = await handleSessionAppsRequest(
    makeRequest(`${SESSION}=abc`),
    {
      env: {
        ...env,
        ID: {
          fetch: async (request) => {
            bound.push(request);
            return granted("decisions")();
          },
        },
      },
      fetch: async () => {
        throw new Error("public fetch must not be used");
      },
      logger: { error() {} },
    },
  );
  assert.deepEqual(await response.json(), {
    status: "signed-in",
    apps: ["decisions"],
  });
  assert.equal(bound.length, 1);
});

test("route answers unavailable with no-store when Cloudflare context is missing", async () => {
  const lib = loadSource("src/lib/session-apps-server.ts");
  const originalError = console.error;
  console.error = () => {};
  try {
    const { GET, dynamic } = loadSource("src/app/api/session-apps/route.ts", {
      "@opennextjs/cloudflare": {
        getCloudflareContext() {
          throw new Error("no context");
        },
      },
      "@/lib/session-apps-server": lib,
    });
    assert.equal(dynamic, "force-dynamic");
    const response = await GET(makeRequest(`${SESSION}=abc`));
    assertHeaders(response);
    assert.deepEqual(await response.json(), {
      status: "unavailable",
      apps: [],
    });
  } finally {
    console.error = originalError;
  }
});
