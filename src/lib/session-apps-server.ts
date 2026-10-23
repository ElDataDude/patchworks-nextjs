/**
 * Server side of the website's "Open app" island. Asks Patchworks ID which
 * apps the visitor may open, forwarding only the Patchworks ID session
 * cookies. Always answers 200 with a private, uncacheable body; the page's
 * static calls to action never depend on it. Relative imports only: offline
 * tests load this source directly.
 */
import { isAppSlug, openableAppSlugs, type AppSlug } from "../data/apps";

export const SESSION_APPS_TIMEOUT_MS = 1_500;
const ME_APPS_PATH = "/api/v1/me/apps";
const COOKIE_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

export type SessionAppsStatus = "signed-in" | "signed-out" | "unavailable";

export interface SessionAppsBody {
  status: SessionAppsStatus;
  apps: AppSlug[];
}

/** Minimal service-binding shape; the website may later bind identity as `ID`. */
interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface SessionAppsEnv {
  ID_API_ORIGIN?: string;
  ID_SESSION_COOKIE_NAMES?: string;
  ID?: Fetcher;
}

interface SessionAppsDependencies {
  env: SessionAppsEnv;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  logger?: Pick<Console, "error">;
}

export const SESSION_APPS_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
  "X-Content-Type-Options": "nosniff",
} as const;

export function sessionAppsResponse(body: SessionAppsBody): Response {
  return Response.json(body, { status: 200, headers: SESSION_APPS_HEADERS });
}

const signedOut = () => sessionAppsResponse({ status: "signed-out", apps: [] });
const unavailable = () =>
  sessionAppsResponse({ status: "unavailable", apps: [] });

function configuredNames(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((name) => name.trim())
      .filter((name) => COOKIE_NAME.test(name)),
  );
}

/** Rebuilds a Cookie header containing only the named session cookies. */
export function forwardableCookies(
  header: string | null,
  names: ReadonlySet<string>,
): string {
  if (!header || !names.size) return "";
  return header
    .split(";")
    .map((part) => part.trim())
    .filter((part) => {
      const separator = part.indexOf("=");
      return separator > 0 && names.has(part.slice(0, separator).trim());
    })
    .join("; ");
}

function identityOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

function log(logger: Pick<Console, "error">, reason: string): void {
  // Never include cookies, headers or upstream bodies.
  logger.error(JSON.stringify({ event: "session_apps_unavailable", reason }));
}

function grantedApps(body: unknown): AppSlug[] | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const list = (body as { apps?: unknown }).apps;
  if (!Array.isArray(list)) return null;
  const openable = new Set<AppSlug>(openableAppSlugs());
  const granted = new Set<AppSlug>();
  for (const entry of list) {
    const slug =
      entry && typeof entry === "object"
        ? (entry as { slug?: unknown }).slug
        : undefined;
    if (isAppSlug(slug) && openable.has(slug)) granted.add(slug);
  }
  return [...granted];
}

export async function handleSessionAppsRequest(
  request: Request,
  dependencies: SessionAppsDependencies,
): Promise<Response> {
  const { env } = dependencies;
  const logger = dependencies.logger ?? console;
  const timeoutMs = dependencies.timeoutMs ?? SESSION_APPS_TIMEOUT_MS;
  const cookie = forwardableCookies(
    request.headers.get("cookie"),
    configuredNames(env.ID_SESSION_COOKIE_NAMES),
  );
  // No Patchworks ID cookie: nothing to ask, and no outbound call.
  if (!cookie) return signedOut();
  const origin = identityOrigin(env.ID_API_ORIGIN);
  if (!origin) {
    log(logger, "not_configured");
    return unavailable();
  }

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, timeoutMs);
  });
  try {
    const upstream = new Request(`${origin}${ME_APPS_PATH}`, {
      method: "GET",
      headers: { cookie, accept: "application/json" },
      redirect: "manual",
      signal: controller.signal,
    });
    const call = env.ID
      ? env.ID.fetch(upstream)
      : (dependencies.fetch ?? globalThis.fetch)(upstream);
    const response = await Promise.race([call, timeout]);
    if (response.status === 401) return signedOut();
    if (!response.ok) {
      log(logger, `status_${response.status}`);
      return unavailable();
    }
    let body: unknown;
    try {
      body = await Promise.race([response.json(), timeout]);
    } catch (error) {
      if (controller.signal.aborted) throw error;
      log(logger, "malformed");
      return unavailable();
    }
    const apps = grantedApps(body);
    if (!apps) {
      log(logger, "malformed");
      return unavailable();
    }
    return sessionAppsResponse({ status: "signed-in", apps });
  } catch {
    log(logger, controller.signal.aborted ? "timeout" : "error");
    return unavailable();
  } finally {
    clearTimeout(timer);
  }
}
