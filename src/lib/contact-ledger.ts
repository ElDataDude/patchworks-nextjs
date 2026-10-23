import type { ContactFormValues } from "./contact";

export const CONTACT_LEDGER_RETENTION_SECONDS = 7 * 24 * 60 * 60;

export type ContactLedgerStatus = "sending" | "accepted" | "ambiguous";

export type ContactClaim =
  | { claimed: true }
  | { claimed: false; status: ContactLedgerStatus };

type LedgerRow = { status: ContactLedgerStatus };

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Produces an opaque, deterministic key without retaining the visitor's details.
 * The secret prevents offline guessing if the ledger is ever exposed.
 */
export async function contactDedupeKey(
  secret: string,
  submissionId: string,
  values: ContactFormValues,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  // Catalogue context joins the key only when present, so keys for
  // enquiries without it are unchanged from earlier releases.
  const canonical = JSON.stringify({
    version: 1,
    submissionId: submissionId.toLowerCase(),
    name: values.name,
    email: values.email,
    company: values.company,
    interest: values.interest,
    message: values.message,
    ...(values.industry ? { industry: values.industry } : {}),
    ...(values.useCase ? { useCase: values.useCase } : {}),
    ...(values.app ? { app: values.app } : {}),
  });
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(canonical),
  );
  return bytesToHex(new Uint8Array(signature));
}

/** Atomically claims a new or expired key before any email is attempted. */
export async function claimContactSubmission(
  database: D1Database,
  dedupeKey: string,
  nowSeconds: number,
): Promise<ContactClaim> {
  const expiresAt = nowSeconds + CONTACT_LEDGER_RETENTION_SECONDS;
  const result = await database
    .prepare(
      `INSERT INTO contact_submission_ledger
        (dedupe_key, status, message_id, created_at, updated_at, expires_at)
       VALUES (?1, 'sending', NULL, ?2, ?2, ?3)
       ON CONFLICT(dedupe_key) DO UPDATE SET
         status = 'sending',
         message_id = NULL,
         created_at = excluded.created_at,
         updated_at = excluded.updated_at,
         expires_at = excluded.expires_at
       WHERE contact_submission_ledger.expires_at <= excluded.created_at`,
    )
    .bind(dedupeKey, nowSeconds, expiresAt)
    .run();

  if (!result.success) throw new Error("Contact ledger claim failed");
  if (result.meta.changes === 1) return { claimed: true };

  const existing = await database
    .prepare(
      `SELECT status
       FROM contact_submission_ledger
       WHERE dedupe_key = ?1 AND expires_at > ?2
       LIMIT 1`,
    )
    .bind(dedupeKey, nowSeconds)
    .first<LedgerRow>();

  if (
    !existing ||
    !["sending", "accepted", "ambiguous"].includes(existing.status)
  ) {
    throw new Error("Contact ledger state is unavailable");
  }
  return { claimed: false, status: existing.status };
}

export async function markContactAccepted(
  database: D1Database,
  dedupeKey: string,
  messageId: string,
  nowSeconds: number,
): Promise<void> {
  const result = await database
    .prepare(
      `UPDATE contact_submission_ledger
       SET status = 'accepted', message_id = ?2, updated_at = ?3
       WHERE dedupe_key = ?1 AND status = 'sending'`,
    )
    .bind(dedupeKey, messageId, nowSeconds)
    .run();
  if (!result.success || result.meta.changes !== 1)
    throw new Error("Contact ledger acceptance update failed");
}

export async function markContactAmbiguous(
  database: D1Database,
  dedupeKey: string,
  nowSeconds: number,
): Promise<void> {
  const result = await database
    .prepare(
      `UPDATE contact_submission_ledger
       SET status = 'ambiguous', message_id = NULL, updated_at = ?2
       WHERE dedupe_key = ?1 AND status = 'sending'`,
    )
    .bind(dedupeKey, nowSeconds)
    .run();
  if (!result.success || result.meta.changes !== 1)
    throw new Error("Contact ledger ambiguity update failed");
}

export async function cleanupExpiredContactSubmissions(
  database: D1Database,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<number> {
  const result = await database
    .prepare(
      `DELETE FROM contact_submission_ledger
       WHERE expires_at <= ?1`,
    )
    .bind(nowSeconds)
    .run();
  if (!result.success) throw new Error("Contact ledger cleanup failed");
  return result.meta.changes;
}
