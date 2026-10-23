/*
 * Reproducible isolated booking verification. Run from the repository root:
 *   node design/evidence/test-booking.cjs
 * Uses actual TS/TSX sources, a fake browser event surface and a simulated Cal
 * queue consumer. It does not establish live provider availability or bookings.
 * Contracts checked against official sources on 2026-09-13:
 * https://cal.com/help/embedding/embed-events
 * https://github.com/calcom/cal.com/blob/main/packages/embeds/embed-snippet/src/index.ts
 * https://github.com/calcom/cal.com/blob/main/packages/embeds/embed-core/src/ModalBox/ModalBox.ts
 * https://github.com/calcom/cal.com/blob/main/packages/embeds/embed-core/src/embed.ts
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "../..");
function compile(file) {
  return ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
}
const helperSource = compile("src/lib/cal-embed.ts");
const privacySource = compile("src/lib/privacy-preferences.ts");
const analyticsSource = compile(
  "src/components/Common/CloudflareWebAnalytics.tsx",
);

function testAnalyticsBoundary() {
  const context = {
    exports: {},
    require(id) {
      if (id === "react")
        return { useEffect() {}, useState: () => ["", () => {}] };
      if (id === "next/script") return () => null;
      return require(id);
    },
    process: { env: {} },
  };
  vm.runInNewContext(analyticsSource, context);
  const allows = (overrides = {}) =>
    context.exports.shouldLoadCloudflareAnalytics({
      nodeEnvironment: "production",
      siteEnvironment: "production",
      token: "public-token",
      hostname: "patchworks.ai",
      ...overrides,
    });
  assert.equal(allows(), true);
  assert.equal(allows({ hostname: "preview.example.workers.dev" }), false);
  assert.equal(allows({ hostname: "localhost" }), false);
  assert.equal(allows({ hostname: "www.patchworks.ai" }), false);
  assert.equal(allows({ siteEnvironment: "preview" }), false);
  assert.equal(allows({ nodeEnvironment: "development" }), false);
  assert.equal(allows({ token: "" }), false);
  console.log(
    "PASS analytics boundary: one manual beacon is eligible only on the exact production hostname with its configured token.",
  );
}

function testPrivacyPreference() {
  let stored = "";
  let serialized = "";
  let notified = null;
  const window = Object.assign(new EventTarget(), {
    location: { protocol: "https:" },
  });
  const document = {
    get cookie() {
      return stored;
    },
    set cookie(value) {
      serialized = value;
      stored = value.split(";", 1)[0];
    },
  };
  class TestCustomEvent extends Event {
    constructor(type, options) {
      super(type);
      this.detail = options.detail;
    }
  }
  const context = {
    exports: {},
    window,
    document,
    CustomEvent: TestCustomEvent,
  };
  vm.runInNewContext(privacySource, context);
  window.addEventListener(context.exports.PRIVACY_PREFERENCE_EVENT, (event) => {
    notified = event.detail;
  });
  assert.equal(context.exports.readPrivacyPreference(), null);
  context.exports.writePrivacyPreference("booking");
  assert.equal(context.exports.readPrivacyPreference(), "booking");
  assert.equal(notified, "booking");
  assert.match(serialized, /Max-Age=15811200/);
  assert.match(serialized, /SameSite=Lax/);
  assert.match(serialized, /Secure/);
  window.location.protocol = "http:";
  context.exports.writePrivacyPreference("essential");
  assert.equal(context.exports.readPrivacyPreference(), "essential");
  assert.doesNotMatch(serialized, /Secure/);
  console.log(
    "PASS privacy choice: versioned preference, six-month expiry, event notification, secure production cookie and local test support.",
  );
}

function harness({ existing = false } = {}) {
  const timers = new Map();
  const events = new Map();
  const calls = [];
  let next = 0;
  let appended = 0;
  const script = Object.assign(new EventTarget(), { dataset: {} });
  const window = new EventTarget();
  const documentEvents = new Map();
  const document = {
    querySelector: () => (existing ? script : null),
    createElement: () => script,
    addEventListener(type, listener) {
      const listeners = documentEvents.get(type) ?? new Set();
      listeners.add(listener);
      documentEvents.set(type, listeners);
    },
    removeEventListener(type, listener) {
      documentEvents.get(type)?.delete(listener);
    },
    dispatchEvent(event) {
      documentEvents.get(event.type)?.forEach((listener) => listener(event));
      return true;
    },
    head: {
      appendChild() {
        appended++;
        assert.equal(
          window.Cal.q[0][0],
          "init",
          "init must be queued before fetching the runtime",
        );
        assert.equal(window.Cal.q[0][1].origin, "https://cal.com");
      },
    },
  };
  const context = {
    exports: {},
    window,
    document,
    setTimeout(fn, delay) {
      const id = ++next;
      timers.set(id, { fn, delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  vm.runInNewContext(helperSource, context);
  function activate() {
    const process = (args) => {
      calls.push(args);
      if (args[0] === "on") events.set(args[1].action, args[1].callback);
    };
    const queue = window.Cal.q;
    queue.forEach(process);
    queue.length = 0;
    queue.push = process;
    // Deliberately no undocumented Cal.instance property.
    script.dispatchEvent(new Event("load"));
  }
  function expire(delay) {
    const timer = [...timers.values()].find((item) => item.delay === delay);
    assert(timer, `Expected a ${delay}ms watchdog`);
    timer.fn();
  }
  function dismissModal(localName = "cal-modal-box") {
    document.dispatchEvent({ type: "close", target: { localName } });
  }
  return {
    api: context.exports,
    timers,
    events,
    calls,
    script,
    window,
    document,
    activate,
    expire,
    dismissModal,
    count: () => appended,
  };
}
async function testHelper() {
  let h = harness();
  let pending = h.api.loadCalEmbed();
  assert.equal(
    pending,
    h.api.loadCalEmbed(),
    "widgets must share one load promise",
  );
  assert.equal(h.count(), 1);
  assert.equal(
    h.api.openCalBooking(),
    false,
    "pending API must preserve native navigation",
  );
  h.activate();
  await pending;
  assert.equal(h.api.openCalBooking(), true);
  const modal = h.calls.find((call) => call[0] === "modal");
  assert.equal(modal[1].calLink, "bryanj/30min");
  assert.equal(modal[1].config.theme, "light");
  assert.equal(modal[1].config.layout, "month_view");
  assert(!h.events.has("__closeIframe"), "no internal SDK dismissal event");
  let closeNotices = 0;
  const unsubscribeClose = h.api.subscribeCalClose(() => closeNotices++);
  h.events.get("linkReady")();
  assert.equal(h.timers.size, 0, "booker readiness clears its watchdog");
  h.api.openCalBooking();
  h.dismissModal("dialog");
  assert.equal(h.timers.size, 1, "unrelated close events are ignored");
  assert.equal(closeNotices, 0);
  h.dismissModal();
  assert.equal(h.timers.size, 0, "native modal dismissal clears its watchdog");
  assert.equal(closeNotices, 1, "native Cal modal close is published once");
  unsubscribeClose();
  h.dismissModal();
  assert.equal(closeNotices, 1, "Cal close subscription can be removed");
  let notices = 0;
  const unsubscribe = h.api.subscribeCalFailure(() => notices++);
  h.events.get("linkFailed")();
  assert.equal(notices, 1);
  assert.equal(h.api.openCalBooking(), false);
  assert(h.calls.some((call) => call[0] === "closeModal"));
  unsubscribe();
  h.events.get("linkFailed")();
  assert.equal(notices, 1);

  h = harness();
  pending = h.api.loadCalEmbed();
  h.script.dispatchEvent(new Event("error"));
  await assert.rejects(pending);
  assert.equal(h.api.openCalBooking(), false);
  assert.equal(h.timers.size, 0);

  h = harness();
  pending = h.api.loadCalEmbed();
  const runtimeError = Object.assign(new Event("error"), {
    filename: "https://app.cal.com/embed/embed.js",
    message: "Runtime failed",
  });
  h.window.dispatchEvent(runtimeError);
  h.script.dispatchEvent(new Event("load"));
  await assert.rejects(pending);
  assert.equal(
    h.api.openCalBooking(),
    false,
    "load after evaluation error must not revive the embed",
  );

  h = harness();
  pending = h.api.loadCalEmbed();
  h.expire(10000);
  await assert.rejects(pending);
  h.activate();
  assert.equal(
    h.api.openCalBooking(),
    false,
    "late script load after timeout retains fallback",
  );

  h = harness({ existing: true });
  pending = h.api.loadCalEmbed();
  assert.equal(h.count(), 0);
  assert.equal(
    h.api.openCalBooking(),
    false,
    "existing script does not imply readiness",
  );
  h.activate();
  await pending;
  assert.equal(h.api.openCalBooking(), true);
  h.expire(15000);
  assert.equal(h.api.openCalBooking(), false);
  console.log(
    "PASS helper: queue ordering, shared load, pending fallback, modal config, documented native Cal dismissal, provider error, script/evaluation errors, late load, existing script, both watchdogs.",
  );
}
async function testAnchor() {
  let preference = null;
  let loadCalls = 0;
  let openCalls = 0;
  let failureListener;
  let closeListener;
  let cleanup;
  let failureUnsubscribed = false;
  let closeUnsubscribed = false;
  const anchorElement = {
    focusCalls: 0,
    isConnected: true,
    focus() {
      this.focusCalls++;
    },
  };
  const context = {
    exports: {},
    requestAnimationFrame(callback) {
      callback();
    },
    require(id) {
      if (id === "react")
        return {
          useState: (initial) => [initial, () => {}],
          useEffect: (effect) => {
            cleanup = effect();
            assert.equal(typeof cleanup, "function");
          },
          useId: () => "booking-status",
          useRef: () => ({ current: anchorElement }),
        };
      if (id === "lucide-react") return { ArrowUpRight: () => null };
      if (id === "@/data/positioning") {
        const content = { exports: {} };
        vm.runInNewContext(compile("src/data/positioning.ts"), content);
        return content.exports;
      }
      if (id.includes("privacy-preferences"))
        return {
          readPrivacyPreference: () => preference,
        };
      if (id.includes("cal-embed"))
        return {
          BOOKING_URL: "https://cal.com/bryanj/30min",
          loadCalEmbed: async () => {
            loadCalls++;
          },
          openCalBooking: () => {
            openCalls++;
            return true;
          },
          subscribeCalFailure: (listener) => {
            failureListener = listener;
            return () => {
              failureUnsubscribed = true;
            };
          },
          subscribeCalClose: (listener) => {
            closeListener = listener;
            return () => {
              closeUnsubscribed = true;
            };
          },
        };
      return require(id);
    },
  };
  vm.runInNewContext(
    compile("src/components/Common/BookingWidget.tsx"),
    context,
  );
  const element = context.exports.default({ className: "hero-booking" });
  const anchor = element.props.children[0];
  assert.equal(anchor.type, "a");
  assert.equal(anchor.props.href, "https://cal.com/bryanj/30min");
  assert.equal(anchor.props.target, "_blank");
  assert.equal(anchor.props.rel, "noopener noreferrer");
  assert.equal(anchor.props.children[0].props.className, "hero-booking-label");
  assert.equal(
    anchor.props.children[0].props.children,
    "Book a partner conversation",
  );
  assert.equal(
    anchor.props["data-cal-link"],
    undefined,
    "prevent duplicate Cal click handlers",
  );
  assert.equal(loadCalls, 0, "render must not request Cal");
  let prevented = false;
  const click = {
    button: 0,
    preventDefault() {
      prevented = true;
    },
  };
  await anchor.props.onClick(click);
  assert.equal(prevented, false);
  assert.equal(loadCalls, 0, "no choice preserves direct navigation");
  preference = "essential";
  await anchor.props.onClick(click);
  assert.equal(prevented, false);
  assert.equal(loadCalls, 0, "essential choice preserves direct navigation");
  preference = "booking";
  await anchor.props.onClick(click);
  assert.equal(prevented, true);
  assert.equal(loadCalls, 1, "consent plus click requests Cal once");
  assert.equal(openCalls, 1, "embed opens after the runtime loads");
  closeListener();
  assert.equal(
    anchorElement.focusCalls,
    1,
    "native Cal close restores focus to the originating anchor",
  );
  prevented = false;
  await anchor.props.onClick(click);
  assert.equal(openCalls, 2);
  closeListener();
  assert.equal(
    anchorElement.focusCalls,
    2,
    "Cal's Escape dismissal close restores the same originating anchor",
  );
  for (const modifier of [
    { metaKey: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    prevented = false;
    const previousLoads = loadCalls;
    const previousOpens = openCalls;
    await anchor.props.onClick({ ...click, ...modifier });
    assert.equal(prevented, false);
    assert.equal(loadCalls, previousLoads);
    assert.equal(openCalls, previousOpens);
  }
  assert.equal(failureUnsubscribed, false);
  assert.equal(closeUnsubscribed, false);
  prevented = false;
  await anchor.props.onClick(click);
  failureListener();
  assert.equal(
    anchorElement.focusCalls,
    3,
    "embed failure continues to restore focus",
  );
  cleanup();
  assert.equal(failureUnsubscribed, true);
  assert.equal(closeUnsubscribed, true);
  console.log(
    "PASS component: real secure anchor, zero Cal requests on render or essential choice, consent-plus-click loading, modified/middle-click fallback, and originating-anchor focus restoration for native close and Escape dismissal.",
  );
}
(async () => {
  testAnalyticsBoundary();
  testPrivacyPreference();
  await testHelper();
  await testAnchor();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
