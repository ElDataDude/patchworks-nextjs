import type { ContactFieldErrors, ContactResponse } from "./contact";

export const CONTACT_RATE_LIMIT_SECONDS = 10;
export const CONTACT_UNEXPECTED_RESPONSE =
  "The enquiry service returned an unexpected response. Your details are still here; please retry, email us or book a conversation.";

export type ContactOutcome =
  | { kind: "success" }
  | { kind: "rate-limited"; retrySeconds: number }
  | { kind: "error"; error: string; fieldErrors?: ContactFieldErrors };

function isContactResponse(value: unknown): value is ContactResponse {
  if (!value || typeof value !== "object" || !("ok" in value)) return false;
  const response = value as Record<string, unknown>;
  return (
    response.ok === true ||
    (response.ok === false && typeof response.error === "string")
  );
}

export async function classifyContactResponse(
  response: Response,
): Promise<ContactOutcome> {
  if (response.status === 429) {
    return {
      kind: "rate-limited",
      retrySeconds: CONTACT_RATE_LIMIT_SECONDS,
    };
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return { kind: "error", error: CONTACT_UNEXPECTED_RESPONSE };
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    return { kind: "error", error: CONTACT_UNEXPECTED_RESPONSE };
  }

  if (!isContactResponse(result)) {
    return { kind: "error", error: CONTACT_UNEXPECTED_RESPONSE };
  }
  if (response.ok && result.ok === true) return { kind: "success" };
  if (result.ok === false) {
    return {
      kind: "error",
      error: result.error,
      fieldErrors: result.fieldErrors,
    };
  }
  return { kind: "error", error: CONTACT_UNEXPECTED_RESPONSE };
}
