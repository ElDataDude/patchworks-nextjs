/* Isolated Turnstile UI-state tests. No provider credentials or network. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "../..");
const source = ts.transpileModule(
  fs.readFileSync(
    path.join(root, "src/components/Contact/TurnstileChallenge.tsx"),
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

function createHarness({ width = 360 } = {}) {
  const hooks = [];
  const timers = new Map();
  const module = { exports: {} };
  const tokens = [];
  const errors = [];
  const widgetOptionsHistory = [];
  let currentTree;
  let currentWidth = width;
  let dirty = false;
  let hookIndex = 0;
  let pendingEffects = [];
  let nextTimer = 0;
  let observedElement;
  let observerCallback;
  let removals = 0;
  let refreshes = 0;
  let resolveLoader;
  const loader = new Promise((resolve) => {
    resolveLoader = resolve;
  });
  function useState(initial) {
    const index = hookIndex++;
    if (!(index in hooks))
      hooks[index] = typeof initial === "function" ? initial() : initial;
    return [
      hooks[index],
      (next) => {
        const value = typeof next === "function" ? next(hooks[index]) : next;
        if (Object.is(value, hooks[index])) return;
        hooks[index] = value;
        dirty = true;
      },
    ];
  }
  function useRef(initial) {
    const index = hookIndex++;
    if (!(index in hooks)) hooks[index] = { current: initial };
    return hooks[index];
  }
  function useEffect(callback, dependencies) {
    const index = hookIndex++;
    const previous = hooks[index];
    const changed =
      !previous ||
      dependencies === undefined ||
      dependencies.some(
        (dependency, dependencyIndex) =>
          !Object.is(dependency, previous.dependencies[dependencyIndex]),
      );
    hooks[index] = {
      cleanup: previous?.cleanup,
      dependencies,
    };
    if (changed) pendingEffects.push({ callback, index });
  }
  class TestResizeObserver {
    constructor(callback) {
      observerCallback = callback;
    }
    observe(element) {
      observedElement = element;
    }
    disconnect() {
      observedElement = undefined;
    }
  }
  const window = {
    clearTimeout(id) {
      timers.delete(id);
    },
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      timers.set(id, { callback, delay });
      return id;
    },
    turnstile: {
      remove() {
        removals++;
      },
    },
  };
  const context = {
    exports: module.exports,
    module,
    ResizeObserver: TestResizeObserver,
    window,
    require(id) {
      if (id === "react")
        return {
          useEffect,
          useRef,
          useState,
        };
      if (id === "react/jsx-runtime") return require("react/jsx-runtime");
      if (id === "@/lib/turnstile") return { loadTurnstile: () => loader };
      return require(id);
    },
  };
  vm.runInNewContext(source, context);
  const Component = module.exports.default;
  const onToken = (token) => tokens.push(token);
  const onError = (message) => errors.push(message);
  const onRefresh = () => refreshes++;
  function render() {
    dirty = false;
    hookIndex = 0;
    pendingEffects = [];
    currentTree = Component({
      siteKey: "site-key",
      resetKey: 0,
      onToken,
      onError,
      onRefresh,
    });
    return currentTree;
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
    return visit(node.props?.children, predicate);
  }
  const containerElement = {
    getBoundingClientRect: () => ({ width: currentWidth }),
  };
  function commit(tree) {
    const container = visit(
      tree,
      (node) => node.props?.className === "contact-verification",
    );
    container.props.ref.current = containerElement;
    const effects = pendingEffects;
    pendingEffects = [];
    for (const { callback, index } of effects) {
      hooks[index].cleanup?.();
      hooks[index].cleanup = callback();
    }
  }
  function flush() {
    let renders = 0;
    while (dirty) {
      assert(++renders < 10, "state updates must settle");
      const tree = render();
      commit(tree);
    }
    return currentTree;
  }
  function mount(tree) {
    commit(tree);
    return flush();
  }
  function message(tree) {
    return visit(tree, (node) =>
      String(node.props?.className ?? "").includes("challenge-status"),
    ).props.children;
  }
  function completeLoader() {
    resolveLoader({
      render(_container, options) {
        widgetOptionsHistory.push(options);
        return "widget-id";
      },
    });
  }
  return {
    completeLoader,
    errors,
    expireWatchdog() {
      const watchdog = [...timers.values()].find(
        ({ delay }) => delay === 10_000,
      );
      assert(watchdog);
      watchdog.callback();
    },
    get refreshes() {
      return refreshes;
    },
    get removals() {
      return removals;
    },
    get widgetOptions() {
      return widgetOptionsHistory.at(-1);
    },
    get widgetOptionsHistory() {
      return widgetOptionsHistory;
    },
    message,
    mount,
    render,
    resize(nextWidth) {
      currentWidth = nextWidth;
      assert(observedElement, "verification container must be observed");
      observerCallback([{ contentRect: { width: nextWidth } }]);
      return flush();
    },
    tokens,
    visit,
  };
}

test("Turnstile exposes loading, ready and refreshable error states", async () => {
  const harness = createHarness();
  let tree = harness.render();
  assert.match(
    JSON.stringify(harness.message(tree)),
    /Loading secure verification/,
  );
  harness.mount(tree);
  harness.completeLoader();
  await Promise.resolve();
  assert.equal(harness.widgetOptions.size, "flexible");
  tree = harness.render();
  assert.match(JSON.stringify(harness.message(tree)), /verification is ready/);
  harness.widgetOptions["error-callback"]();
  tree = harness.render();
  assert.match(JSON.stringify(harness.message(tree)), /unavailable/);
  const refresh = harness.visit(
    tree,
    (node) => node.type === "button" && node.props.type === "button",
  );
  refresh.props.onClick();
  assert.equal(harness.refreshes, 1);
  assert.equal(harness.tokens.at(-1), "");
  assert.match(harness.errors.at(-1), /unavailable/);
});

test("Turnstile recreates only when its container crosses 300px", async () => {
  const harness = createHarness({ width: 320 });
  const tree = harness.render();
  harness.mount(tree);
  harness.completeLoader();
  await Promise.resolve();
  assert.equal(harness.widgetOptions.size, "flexible");
  harness.resize(299);
  await Promise.resolve();
  assert.equal(harness.widgetOptions.size, "compact");
  assert.equal(harness.removals, 1);
  assert.equal(harness.tokens.at(-1), "");
  harness.resize(280);
  await Promise.resolve();
  assert.equal(harness.widgetOptionsHistory.length, 2);
  assert.equal(harness.removals, 1);
  harness.resize(300);
  await Promise.resolve();
  assert.equal(harness.widgetOptions.size, "flexible");
  assert.equal(harness.widgetOptionsHistory.length, 3);
  assert.equal(harness.removals, 2);
});

test("Turnstile watchdog replaces an indefinitely blank challenge", () => {
  const harness = createHarness();
  let tree = harness.render();
  harness.mount(tree);
  harness.expireWatchdog();
  tree = harness.render();
  assert.match(JSON.stringify(harness.message(tree)), /too long to load/);
  assert(
    harness.visit(tree, (node) => node.type === "button"),
    "watchdog failure exposes refresh",
  );
});
