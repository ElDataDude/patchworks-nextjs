# Enquiry form setup

`POST /api/contact` validates the enquiry, verifies Cloudflare Turnstile, atomically claims a privacy-minimal D1 deduplication record, and sends one plain-text message through a restricted Cloudflare Email Service Worker binding. The recipient is fixed in server code to `info@patchworks.ai`; request data and environment variables cannot redirect it. The visitor's validated address is used only as Reply-To.

The D1 ledger stores an HMAC key, status, Cloudflare message ID and timestamps for seven days. It does not store the visitor's name, email address, company, message, Turnstile token or IP address.

## Cloudflare bindings and variables

Generate `CloudflareEnv` from `wrangler.jsonc`; do not hand-maintain binding types:

```bash
npx wrangler types --env-interface CloudflareEnv
```

Required bindings:

| Binding      | Configuration                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `CONTACT_DB` | D1 database containing `contact_submission_ledger`.                                                     |
| `EMAIL`      | `send_email` binding restricted to destination `info@patchworks.ai` and sender `website@patchworks.ai`. |

The `EMAIL` binding should have both `allowed_destination_addresses: ["info@patchworks.ai"]` and `allowed_sender_addresses: ["website@patchworks.ai"]`. Before release, create the Google Workspace alias and complete Cloudflare's destination verification message through that alias. Keep the existing Google Workspace MX records. Cloudflare Email Routing is not part of this design.

Required secrets, set with `wrangler secret put`:

| Secret                  | Purpose                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `TURNSTILE_SECRET_KEY`  | Private secret for the production Turnstile widget.                         |
| `CONTACT_DEDUPE_SECRET` | At least 32 random bytes, used only as the HMAC key for opaque ledger keys. |

Keep `CONTACT_DEDUPE_SECRET` stable for at least the seven-day retention window. Rotating it immediately makes existing ledger keys undiscoverable and permits a matching browser retry to create a new claim.

Required or supported variables:

| Variable                         | Value                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public production widget sitekey, available to the client at build time.                                                      |
| `TURNSTILE_EXPECTED_HOSTNAMES`   | Comma-separated exact hostnames. Production: `patchworks.ai`.                                                                 |
| `CONTACT_ALLOWED_ORIGINS`        | Comma-separated exact origins. Production: `https://patchworks.ai`.                                                           |
| `CONTACT_FROM_EMAIL`             | Optional plain sender address. Defaults to `website@patchworks.ai`; any change must also update the binding sender allowlist. |

Use a separate Turnstile widget and secret for local development. Local HTTP requests work only in development and only when the exact origin and hostname are explicitly configured. Production rejects local hostnames and wildcard hostnames.

## Database migration and cleanup

Apply the migration locally, to preview, and to production using the binding name:

```bash
npx wrangler d1 migrations apply CONTACT_DB --local
npx wrangler d1 migrations apply CONTACT_DB --remote
npx wrangler d1 migrations apply CONTACT_DB --env production --remote
```

Configure `worker.ts` as the OpenNext Worker entrypoint and add the daily UTC cron `0 3 * * *`. Its scheduled handler deletes rows whose seven-day retention has expired. The custom entrypoint also re-exports OpenNext's cache Durable Objects.

## Request and delivery behavior

JSON fields are `name`, `email`, `company`, `interest`, `message`, `website` (empty honeypot), `submissionId` (UUID), and `turnstileToken`. Name, email, company and message are required and limited to 100, 254, 150 and 5,000 characters. Interest is optional: `ai-counsel`, `review-delivery`, `both`, `unsure`, or empty. The streaming body limit is 32 KiB.

The endpoint checks the exact request origin, rejects the honeypot, validates fields, verifies the token's success, hostname and `contact` action, and then claims D1 before calling the email binding. A D1 failure before the claim prevents any send.

Cloudflare's Email Service binding does not expose an idempotency-key input. The endpoint therefore never automatically resends an outcome it cannot prove. A successful binding result must contain a non-empty `messageId`; the ledger becomes `accepted` and the endpoint returns `200`. Repeating the same normalized enquiry and UUID during the seven-day window returns the prior success without sending again.

If the binding throws or resolves without a message ID, the ledger becomes `ambiguous`, the endpoint returns `502`, and later matching attempts return `409` without sending. The visitor is told not to resubmit and to use `info@patchworks.ai` if needed. If Cloudflare returns a message ID but the final D1 update fails, the endpoint returns `200`; the original `sending` claim remains and suppresses retries. These choices avoid duplicate mail after uncertain network or storage outcomes.

Turnstile tokens are single-use. The browser must reset its widget after every attempt. Keep the submission UUID for the same enquiry; changing the normalized content creates a distinct HMAC key.

The endpoint does not send automatic replies or log form content, addresses, tokens or secrets. Add the zone rate-limiting rule for `/api/contact` so abusive requests are rejected before the Worker runs; the application-level D1 ledger handles duplicate delivery, not traffic throttling.

Response meanings:

| Status | Meaning                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `200`  | Cloudflare returned a message ID, or the ledger already records that acceptance. This is provider acceptance, not inbox delivery. |
| `400`  | Invalid data or malformed JSON.                                                                                                   |
| `403`  | Origin, honeypot or Turnstile rejection.                                                                                          |
| `409`  | A matching send is already `sending` or `ambiguous`; no resend occurred.                                                          |
| `413`  | Body exceeds 32 KiB.                                                                                                              |
| `415`  | Unsupported media type.                                                                                                           |
| `502`  | The email outcome is ambiguous; no automatic retry is allowed.                                                                    |
| `503`  | Missing configuration, Turnstile failure or D1 claim failure.                                                                     |

## Verification and release

Run the offline endpoint suite, generated binding type check, lint and OpenNext production build:

```bash
npm run test:contact
npx tsc --noEmit
npm run lint
npm run cf:build
```

The offline tests use fake D1, Turnstile and Email bindings and cannot send email. Before calling the form live, verify the `info@patchworks.ai` Workspace alias and Cloudflare destination, onboard `patchworks.ai` for Email Sending, apply the remote D1 migration, set both secrets, and attach the restricted bindings.

Production acceptance requires one explicitly approved end-to-end submission with a fresh token, readback in the Workspace inbox, verification of Reply-To, confirmation that a matching retry does not send a second message, and a check that the scheduled cleanup succeeds. Provider acknowledgement and inbox delivery should be recorded separately.

References: [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Email Service Workers API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/), [Email binding restrictions](https://developers.cloudflare.com/email-service/configuration/send-bindings/), [D1 Workers API](https://developers.cloudflare.com/d1/worker-api/), and [OpenNext custom Worker](https://opennext.js.org/cloudflare/howtos/custom-worker).
