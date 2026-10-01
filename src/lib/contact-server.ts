import {
  CONTACT_INTEREST_OPTIONS,
  isValidContactEmail,
  validateContactFields,
  type ContactFormValues,
  type ContactResponse,
} from "./contact";
import {
  claimContactSubmission,
  contactDedupeKey,
  markContactAccepted,
  markContactAmbiguous,
} from "./contact-ledger";

const MAX_BODY_BYTES = 32 * 1024;
const PROVIDER_TIMEOUT_MS = 10_000;
const CONTACT_RECIPIENT = "info@patchworks.ai";
const DEFAULT_SENDER = "website@patchworks.ai";
const CONTACT_SUBJECT = "Patchworks AI website enquiry";
const TURNSTILE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const UNAVAILABLE =
  "Enquiries are temporarily unavailable. Please try again or email info@patchworks.ai.";
const CHALLENGE_ERROR =
  "Please complete the security check again and retry your enquiry.";
const DELIVERY_UNCERTAIN =
  "We could not confirm this enquiry. Please do not resubmit it; email info@patchworks.ai if you do not hear from us.";
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ContactBindings = Pick<
  CloudflareEnv,
  | "CONTACT_ALLOWED_ORIGINS"
  | "CONTACT_DB"
  | "CONTACT_DEDUPE_SECRET"
  | "CONTACT_FROM_EMAIL"
  | "EMAIL"
  | "TURNSTILE_EXPECTED_HOSTNAMES"
  | "TURNSTILE_SECRET_KEY"
>;

interface ContactServerDependencies {
  env: ContactBindings;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  development?: boolean;
  now?: () => number;
  logger?: Pick<Console, "error">;
}

function json(body: ContactResponse, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function contactUnavailableResponse(): Response {
  return json({ ok: false, error: UNAVAILABLE }, 503);
}

function logContactError(
  logger: Pick<Console, "error">,
  event: string,
  detail?: string,
): void {
  logger.error(JSON.stringify({ event, ...(detail ? { detail } : {}) }));
}

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function csv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function configuredOrigin(value: string, development: boolean): string {
  const url = new URL(value);
  const local = isLocalHostname(url.hostname);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.hostname.includes("*") ||
    url.pathname !== "/" ||
    (url.protocol !== "https:" &&
      !(development && local && url.protocol === "http:")) ||
    (local && !development)
  ) {
    throw new Error("Invalid contact origin configuration");
  }
  return url.origin;
}

function allowedOrigin(
  request: Request,
  env: ContactBindings,
  development: boolean,
): URL | null {
  const allowed = new Set([
    "https://patchworks.ai",
    ...csv(env.CONTACT_ALLOWED_ORIGINS).map((value) =>
      configuredOrigin(value, development),
    ),
  ]);
  const rawOrigin = request.headers.get("origin");
  if (!rawOrigin || rawOrigin === "null") return null;
  let origin: URL;
  let target: URL;
  try {
    origin = new URL(rawOrigin);
    target = new URL(request.url);
  } catch {
    return null;
  }
  // Never trust Host/X-Forwarded-Host to expand the configured allowlist.
  if (rawOrigin !== origin.origin || origin.origin !== target.origin)
    return null;
  return allowed.has(origin.origin) ? origin : null;
}

function configuration(
  env: ContactBindings,
  origin: URL,
  development: boolean,
) {
  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
  const dedupeSecret = env.CONTACT_DEDUPE_SECRET?.trim();
  const sender = env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_SENDER;
  const hostnames = csv(env.TURNSTILE_EXPECTED_HOSTNAMES);
  if (
    !env.CONTACT_DB ||
    !env.EMAIL ||
    !turnstileSecret ||
    /\s/.test(turnstileSecret) ||
    !dedupeSecret ||
    dedupeSecret.length < 32 ||
    /\s/.test(dedupeSecret) ||
    !isValidContactEmail(sender) ||
    !hostnames.length
  ) {
    throw new Error("Contact delivery is not configured");
  }
  for (const hostname of hostnames) {
    const parsed = new URL(`https://${hostname}`);
    if (
      parsed.hostname !== hostname ||
      parsed.host !== hostname ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash ||
      parsed.username ||
      parsed.password ||
      hostname.includes("*") ||
      (isLocalHostname(hostname) && !development)
    ) {
      throw new Error("Invalid Turnstile hostname configuration");
    }
  }
  if (!hostnames.includes(origin.hostname))
    throw new Error("Turnstile is not configured for this origin");
  return {
    database: env.CONTACT_DB,
    dedupeSecret,
    email: env.EMAIL,
    sender,
    turnstileSecret,
    hostnames: new Set(hostnames),
  };
}

class BodyTooLarge extends Error {}

async function readJsonBody(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > MAX_BODY_BYTES)
    throw new BodyTooLarge();
  if (!request.body) throw new SyntaxError("Missing body");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The size violation remains the response even if cancellation fails.
        }
        throw new BodyTooLarge();
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return JSON.parse(body);
  } finally {
    reader.releaseLock();
  }
}

async function providerJson(
  url: string,
  init: RequestInit,
  fetcher: typeof globalThis.fetch,
  timeoutMs: number,
): Promise<{ ok: boolean; body: Record<string, unknown> | null }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
    const value: unknown = await response.json();
    const body =
      value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
    return { ok: response.ok, body };
  } finally {
    clearTimeout(timer);
  }
}

function emailPayload(values: ContactFormValues, sender: string) {
  const interest =
    CONTACT_INTEREST_OPTIONS.find(({ value }) => value === values.interest)
      ?.label ?? "Not specified";
  return {
    from: { email: sender, name: "Patchworks AI website" },
    to: CONTACT_RECIPIENT,
    subject: CONTACT_SUBJECT,
    replyTo: values.email,
    text: [
      "New enquiry from the Patchworks AI website",
      "",
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Company: ${values.company}`,
      `Interest: ${interest}`,
      "",
      "Message:",
      values.message,
    ].join("\n"),
  };
}

/** Server-only orchestration; injected bindings keep provider tests offline. */
export async function handleContactRequest(
  request: Request,
  dependencies: ContactServerDependencies,
): Promise<Response> {
  const { env } = dependencies;
  const fetcher = dependencies.fetch ?? globalThis.fetch;
  const timeoutMs = dependencies.timeoutMs ?? PROVIDER_TIMEOUT_MS;
  const development = dependencies.development ?? false;
  const logger = dependencies.logger ?? console;
  const nowSeconds = Math.floor((dependencies.now?.() ?? Date.now()) / 1000);
  let origin: URL | null;
  try {
    origin = allowedOrigin(request, env, development);
  } catch {
    return json({ ok: false, error: UNAVAILABLE }, 503);
  }
  if (!origin)
    return json({ ok: false, error: "This request is not allowed." }, 403);
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json"
  ) {
    return json(
      { ok: false, error: "Please submit the enquiry using the form." },
      415,
    );
  }

  let input: unknown;
  try {
    input = await readJsonBody(request);
  } catch (error) {
    return error instanceof BodyTooLarge
      ? json(
          { ok: false, error: "Your enquiry is too long. Please shorten it." },
          413,
        )
      : json(
          {
            ok: false,
            error: "We could not read this enquiry. Please try again.",
          },
          400,
        );
  }
  const validation = validateContactFields(input);
  if (validation.ok === false) return json(validation, 400);
  const { values } = validation;
  if (values.website) return json({ ok: false, error: CHALLENGE_ERROR }, 403);
  const source = input as Record<string, unknown>;
  if (
    typeof source.submissionId !== "string" ||
    !UUID.test(source.submissionId)
  ) {
    return json(
      { ok: false, error: "Please reload the form and try again." },
      400,
    );
  }
  if (
    typeof source.turnstileToken !== "string" ||
    !source.turnstileToken ||
    source.turnstileToken.length > 2048 ||
    /\s/.test(source.turnstileToken)
  ) {
    return json({ ok: false, error: CHALLENGE_ERROR }, 403);
  }

  let config: ReturnType<typeof configuration>;
  try {
    config = configuration(env, origin, development);
  } catch {
    return json({ ok: false, error: UNAVAILABLE }, 503);
  }

  try {
    const verification = await providerJson(
      TURNSTILE_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: config.turnstileSecret,
          response: source.turnstileToken,
        }),
      },
      fetcher,
      timeoutMs,
    );
    if (!verification.ok || !verification.body)
      return json({ ok: false, error: UNAVAILABLE }, 503);
    if (
      verification.body.success !== true ||
      verification.body.action !== "contact" ||
      verification.body.hostname !== origin.hostname ||
      !config.hostnames.has(verification.body.hostname as string)
    ) {
      return json({ ok: false, error: CHALLENGE_ERROR }, 403);
    }
  } catch {
    return json({ ok: false, error: UNAVAILABLE }, 503);
  }

  let dedupeKey: string;
  try {
    dedupeKey = await contactDedupeKey(
      config.dedupeSecret,
      source.submissionId,
      values,
    );
    const claim = await claimContactSubmission(
      config.database,
      dedupeKey,
      nowSeconds,
    );
    if ("status" in claim) {
      return claim.status === "accepted"
        ? json({ ok: true }, 200)
        : json({ ok: false, error: DELIVERY_UNCERTAIN }, 409);
    }
  } catch {
    logContactError(logger, "contact_ledger_claim_failed");
    return json({ ok: false, error: UNAVAILABLE }, 503);
  }

  let messageId: string;
  try {
    const delivery = await config.email.send(
      emailPayload(values, config.sender),
    );
    if (
      !delivery ||
      typeof delivery.messageId !== "string" ||
      !delivery.messageId.trim()
    ) {
      throw new Error("Email binding returned no message ID");
    }
    messageId = delivery.messageId.trim().slice(0, 256);
  } catch (error) {
    try {
      await markContactAmbiguous(config.database, dedupeKey, nowSeconds);
    } catch {
      // The original 'sending' row still suppresses retries if this update fails.
      logContactError(logger, "contact_ledger_ambiguity_update_failed");
    }
    const providerCode =
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined;
    logContactError(logger, "contact_email_send_ambiguous", providerCode);
    return json({ ok: false, error: DELIVERY_UNCERTAIN }, 502);
  }

  try {
    await markContactAccepted(
      config.database,
      dedupeKey,
      messageId,
      nowSeconds,
    );
  } catch {
    // A concrete acceptance ID is success. The existing claim suppresses retries.
    logContactError(logger, "contact_ledger_acceptance_update_failed");
  }
  return json({ ok: true }, 200);
}
