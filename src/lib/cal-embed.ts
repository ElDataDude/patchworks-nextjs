export const BOOKING_URL = "https://cal.com/bryanj/30min";

type CalCallback = () => void;
type CalApi = ((...args: unknown[]) => void) & {
  q: unknown[][];
  ns: Record<string, unknown>;
};

const SCRIPT_URL = "https://app.cal.com/embed/embed.js";
const LOAD_TIMEOUT = 10_000;
const BOOKING_TIMEOUT = 15_000;
let loading: Promise<void> | undefined;
let ready = false;
let failed = false;
let bookingTimer: ReturnType<typeof setTimeout> | undefined;
const failureListeners = new Set<CalCallback>();
const closeListeners = new Set<CalCallback>();

function calWindow() {
  return window as Window & { Cal?: CalApi };
}

function clearBookingTimer() {
  clearTimeout(bookingTimer);
  bookingTimer = undefined;
}

function failBooking() {
  clearBookingTimer();
  failed = true;
  ready = false;
  try {
    calWindow().Cal?.("closeModal");
  } catch {
    // The real booking link remains usable even if the embed cannot close.
  }
  failureListeners.forEach((listener) => listener());
}

export function subscribeCalFailure(listener: CalCallback) {
  failureListeners.add(listener);
  return () => {
    failureListeners.delete(listener);
  };
}

export function subscribeCalClose(listener: CalCallback) {
  closeListeners.add(listener);
  return () => {
    closeListeners.delete(listener);
  };
}

function handleCalModalClose(event: Event) {
  // Cal registers its modal as <cal-modal-box> and dispatches a native `close`
  // event from that host for its close button, backdrop and Escape paths.
  const target = event.target as (EventTarget & { localName?: string }) | null;
  if (target?.localName !== "cal-modal-box") return;
  clearBookingTimer();
  closeListeners.forEach((listener) => listener());
}

export function loadCalEmbed(): Promise<void> {
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const host = calWindow();
    // Cal's runtime consumes this queue; loading embed.js alone is insufficient.
    if (!host.Cal) {
      const queue: unknown[][] = [];
      host.Cal = Object.assign(
        (...args: unknown[]) => {
          queue.push(args);
        },
        {
          q: queue,
          ns: {},
        },
      );
    }
    const cal = host.Cal;
    cal("init", { origin: "https://cal.com" });
    cal("on", { action: "linkReady", callback: clearBookingTimer });
    cal("on", { action: "linkFailed", callback: failBooking });
    // Cal's modal host emits this native close event for button and Escape
    // dismissal; capture is needed because the event itself does not bubble.
    document.addEventListener("close", handleCalModalClose, true);

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_URL}"]`,
    );
    const script = existing ?? document.createElement("script");
    let settled = false;
    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      window.removeEventListener("error", onRuntimeError);
      ready = success;
      failed = !success;
      script.dataset.patchworksCalLoaded = success ? "true" : "false";
      if (success) resolve();
      else reject(new Error("The booking embed could not initialize."));
    };
    // Download/evaluation readiness only; linkReady separately confirms the booker.
    const onLoad = () => finish(typeof host.Cal === "function");
    const onError = () => finish(false);
    const onRuntimeError = (event: ErrorEvent) => {
      if (event.filename === SCRIPT_URL || event.message === "Script error.")
        onError();
    };
    const timer = setTimeout(onError, LOAD_TIMEOUT);
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    window.addEventListener("error", onRuntimeError);
    if (script.dataset.patchworksCalLoaded === "true") finish(true);
    else if (!existing) {
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return loading;
}

/** False means the caller should retain normal anchor navigation. */
export function openCalBooking(): boolean {
  const cal = calWindow().Cal;
  if (!ready || failed || typeof cal !== "function") return false;
  try {
    clearBookingTimer();
    bookingTimer = setTimeout(failBooking, BOOKING_TIMEOUT);
    cal("modal", {
      calLink: "bryanj/30min",
      config: { layout: "month_view", theme: "light" },
    });
    return true;
  } catch {
    failBooking();
    return false;
  }
}
