/* Isolated frontend state tests. No provider credentials or network. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "../..");
const source = ts.transpileModule(
  fs.readFileSync(
    path.join(root, "src/components/Contact/EnquiryForm.tsx"),
    "utf8",
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  },
).outputText;

function responseOutcome(response) {
  if (response.status === 429)
    return Promise.resolve({ kind: "rate-limited", retrySeconds: 10 });
  if (!response.headers.get("content-type")?.includes("application/json")) {
    return Promise.resolve({
      kind: "error",
      error:
        "The enquiry service returned an unexpected response. Your details are still here; please retry, email us or book a conversation.",
    });
  }
  return response
    .json()
    .then((body) =>
      response.ok && body.ok
        ? { kind: "success" }
        : { kind: "error", error: body.error, fieldErrors: body.fieldErrors },
    );
}

function createHarness() {
  const hooks = [];
  const animationFrames = [];
  const fetches = [];
  const module = { exports: {} };
  let hookIndex = 0;
  let nextId = 0;

  function useState(initial) {
    const index = hookIndex++;
    if (!(index in hooks))
      hooks[index] = typeof initial === "function" ? initial() : initial;
    return [
      hooks[index],
      (next) => {
        hooks[index] = typeof next === "function" ? next(hooks[index]) : next;
      },
    ];
  }
  function useRef(initial) {
    const index = hookIndex++;
    if (!(index in hooks)) hooks[index] = { current: initial };
    return hooks[index];
  }
  const react = {
    useCallback: (callback) => callback,
    useEffect: () => {},
    useId: () => "enquiry",
    useRef,
    useState,
  };
  const Turnstile = () => null;
  let pendingFetch;
  const context = {
    exports: module.exports,
    module,
    AbortController,
    clearTimeout,
    crypto: {
      randomUUID: () =>
        `00000000-0000-4000-8000-${String(++nextId).padStart(12, "0")}`,
    },
    fetch(url, init) {
      fetches.push({ url, init });
      return new Promise((resolve) => {
        pendingFetch = resolve;
      });
    },
    requestAnimationFrame(callback) {
      animationFrames.push(callback);
    },
    require(id) {
      if (id === "react") return react;
      if (id === "react/jsx-runtime") return require("react/jsx-runtime");
      if (id === "lucide-react") return { ArrowUpRight: () => null };
      if (id === "next/link") return { default: "a" };
      if (id === "@/data/positioning")
        return { CONTACT_EMAIL: "info@patchworks.ai" };
      if (id === "@/lib/contact-client")
        return { classifyContactResponse: responseOutcome };
      if (id === "@/lib/contact")
        return {
          CONTACT_INTEREST_OPTIONS: [],
          describeContactContext: () => ({}),
          parseContactPrefill: () => ({}),
          CONTACT_LIMITS: {
            name: 100,
            email: 254,
            company: 150,
            message: 5000,
          },
          validateContactFields(values) {
            const missing = ["name", "email", "company", "message"].filter(
              (field) => !values[field]?.trim(),
            );
            if (missing.length) {
              return {
                ok: false,
                error: "Please check the highlighted fields.",
                fieldErrors: Object.fromEntries(
                  missing.map((field) => [
                    field,
                    `Please enter your ${field}.`,
                  ]),
                ),
              };
            }
            return { ok: true, values: { ...values } };
          },
        };
      if (id === "./TurnstileChallenge") return { default: Turnstile };
      return require(id);
    },
    setTimeout,
  };
  vm.runInNewContext(source, context);
  const Component = module.exports.default;

  function render() {
    hookIndex = 0;
    return Component({ siteKey: "test-site-key", enabled: true });
  }
  function visit(node, predicate) {
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = visit(child, predicate);
        if (found) return found;
      }
      return undefined;
    }
    if (!node || typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) {
      const found = visit(child, predicate);
      if (found) return found;
    }
    return undefined;
  }
  function input(tree, name) {
    return visit(
      tree,
      (node) => node.type === "input" && node.props.name === name,
    );
  }
  function fill(tree) {
    const values = {
      name: "Test Visitor",
      email: "visitor@example.org",
      company: "Example Company",
    };
    for (const [name, value] of Object.entries(values))
      input(tree, name).props.onChange({ target: { value } });
    visit(tree, (node) => node.type === "textarea").props.onChange({
      target: { value: "Please review our AI programme." },
    });
    tree = render();
    visit(tree, (node) => node.type === Turnstile).props.onToken("test-token");
    return render();
  }
  function submit(tree) {
    const form = visit(tree, (node) => node.type === "form");
    return form.props.onSubmit({ preventDefault() {} });
  }
  function resolve(response) {
    pendingFetch(response);
  }
  function flushFocus(tree) {
    let focused = 0;
    const alert = visit(tree, (node) => node.props?.role === "alert");
    if (alert?.props.ref) alert.props.ref.current = { focus: () => focused++ };
    animationFrames.splice(0).forEach((callback) => callback());
    return focused;
  }
  return { fetches, fill, flushFocus, input, render, resolve, submit, visit };
}

test("HTML 429 blocks duplicates, preserves fields, focuses feedback and starts ten-second recovery", async () => {
  const harness = createHarness();
  let tree = harness.fill(harness.render());
  const first = harness.submit(tree);
  await harness.submit(tree);
  assert.equal(
    harness.fetches.length,
    1,
    "a pending submit suppresses duplicates",
  );
  harness.resolve(
    new Response("<html>rate limited</html>", {
      status: 429,
      headers: { "Content-Type": "text/html" },
    }),
  );
  await first;
  tree = harness.render();
  assert.equal(harness.input(tree, "name").props.value, "Test Visitor");
  assert.equal(
    harness.visit(tree, (node) => node.type === "textarea").props.value,
    "Please review our AI programme.",
  );
  assert.equal(harness.flushFocus(tree), 1);
  const submit = harness.visit(
    tree,
    (node) => node.type === "button" && node.props.type === "submit",
  );
  assert.equal(submit.props.disabled, true);
  assert.match(String(submit.props.children[0]), /Try again in 10s/);
});

test("other HTML failures use safe feedback while preserving entered values and focus", async () => {
  const harness = createHarness();
  let tree = harness.fill(harness.render());
  const pending = harness.submit(tree);
  harness.resolve(
    new Response("<html>sensitive gateway output</html>", {
      status: 502,
      headers: { "Content-Type": "text/html" },
    }),
  );
  await pending;
  tree = harness.render();
  assert.equal(harness.input(tree, "email").props.value, "visitor@example.org");
  assert.equal(harness.flushFocus(tree), 1);
  const alert = harness.visit(tree, (node) => node.props?.role === "alert");
  assert.match(JSON.stringify(alert.props.children), /unexpected response/);
  assert.doesNotMatch(
    JSON.stringify(alert.props.children),
    /sensitive gateway/,
  );
});

test("local validation resets the challenge before focusing field feedback", async () => {
  const harness = createHarness();
  let tree = harness.render();
  const before = harness.visit(tree, (node) => typeof node.type === "function");
  await harness.submit(tree);
  tree = harness.render();
  const after = harness.visit(tree, (node) => typeof node.type === "function");
  assert.equal(before.props.resetKey, 0);
  assert.equal(after.props.resetKey, 1);
  assert.equal(harness.fetches.length, 0);
  assert.equal(harness.flushFocus(tree), 1);
});
