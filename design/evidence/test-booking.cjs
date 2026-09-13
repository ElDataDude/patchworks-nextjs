/*
 * Reproducible isolated booking verification. Run from the repository root:
 *   node design/evidence/test-booking.cjs
 * Uses actual TS/TSX sources, a fake browser event surface and a simulated Cal
 * queue consumer. It does not establish live provider availability or bookings.
 * Contracts checked against official sources on 2026-09-13:
 * https://cal.com/help/embedding/embed-events
 * https://github.com/calcom/cal.com/blob/main/packages/embeds/embed-snippet/src/index.ts
 * https://github.com/calcom/cal.com/blob/main/packages/embeds/embed-core/src/ModalBox/ModalBox.ts
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
function harness({ existing = false } = {}) {
  const timers = new Map();
  const events = new Map();
  const calls = [];
  let next = 0;
  let appended = 0;
  const script = Object.assign(new EventTarget(), { dataset: {} });
  const window = new EventTarget();
  const document = Object.assign(new EventTarget(), {
    querySelector: () => (existing ? script : null),
    createElement: () => script,
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
  });
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
  h.events.get("linkReady")();
  assert.equal(h.timers.size, 0, "booker readiness clears its watchdog");
  h.api.openCalBooking();
  h.document.dispatchEvent(new Event("close"));
  assert.equal(h.timers.size, 0, "native modal dismissal clears its watchdog");
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
    "PASS helper: queue ordering, shared load, pending fallback, modal config, native dismissal, provider error, script/evaluation errors, late load, existing script, both watchdogs.",
  );
}
function testAnchor() {
  let shouldOpen = false;
  let calls = 0;
  const context = {
    exports: {},
    require(id) {
      if (id === "react")
        return { useState: () => [false, () => {}], useEffect: () => {} };
      if (id === "lucide-react") return { ArrowUpRight: () => null };
      if (id.includes("cal-embed"))
        return {
          BOOKING_URL: "https://cal.com/bryanj/30min",
          openCalBooking: () => {
            calls++;
            return shouldOpen;
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
    anchor.props["data-cal-link"],
    undefined,
    "prevent duplicate Cal click handlers",
  );
  let prevented = false;
  const click = {
    button: 0,
    preventDefault() {
      prevented = true;
    },
  };
  anchor.props.onClick(click);
  assert.equal(prevented, false);
  shouldOpen = true;
  anchor.props.onClick(click);
  assert.equal(prevented, true);
  for (const modifier of [
    { metaKey: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    prevented = false;
    const previous = calls;
    anchor.props.onClick({ ...click, ...modifier });
    assert.equal(prevented, false);
    assert.equal(calls, previous);
  }
  console.log(
    "PASS component: real secure booking anchor, editorial label, no duplicate handler, readiness-only interception, modified/middle clicks.",
  );
}
(async () => {
  await testHelper();
  testAnchor();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
