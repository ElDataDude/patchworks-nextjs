type WidgetOptions = {
  sitekey: string;
  action: string;
  theme: "light";
  size: "flexible" | "compact";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => boolean;
  "response-field": false;
};
type Turnstile = {
  render: (container: HTMLElement, options: WidgetOptions) => string;
  remove: (widget: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let loading: Promise<Turnstile> | undefined;
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loading) return loading;
  loading = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    const finish = (success: boolean) => {
      clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      if (success && window.turnstile) resolve(window.turnstile);
      else {
        script.remove();
        reject(new Error("Verification could not load."));
      }
    };
    const timer = setTimeout(() => finish(false), 10_000);
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => finish(true);
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
