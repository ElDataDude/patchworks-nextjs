# Enterprise repositioning — implementation and release record

This is the earlier pre-release check record. The user subsequently approved publication with new typography and branding, and deferred Resend to the next release. See [the final release record](release-2026-09-13.md) for the published state.

Checked 13 September 2026. Local production-build preview: http://127.0.0.1:3027.

## Implemented

- Revised Home, Services, Industries, About and Contact around the two approved pillars, with shared typed names, anchors and booking wording.
- Retained the visual identity, existing routes and historical article content. The drilling case study and use-case bodies remain unchanged inside accessible expandable sections below the new Industries content.
- Removed active packaged pricing, scarcity, newsletter signup and the technology-logo catalogue. Careers and Blog remain accessible from the footer.
- Added the shared accessible enquiry form and server endpoint with fixed recipient, validated Reply-To, bounded payloads, honeypot, Turnstile verification, provider idempotency and safe failure states.

## Passed checks

| Check | Result |
| --- | --- |
| TypeScript | `tsc --noEmit --incremental false` passed |
| Lint | `npm run lint` passed without warnings or errors |
| Production build | `npm run build` passed |
| Contact endpoint tests | 41 offline tests passed; provider responses are mocked |
| Booking tests | Helper and component harness passed |
| Content and retained routes | 141 checks across 12 routes passed against the production build |
| Patch formatting | `git diff --check` passed |

Content evidence: [content-verification.json](../design/enterprise-repositioning/content-verification.json). Re-run with `node scripts/verify-enterprise-content.mjs http://127.0.0.1:3027 <new-report-path>`; the report path is positional and must not already exist.

Browser inspection covered desktop (1440px), tablet (768px), mobile (390px) and narrow mobile (320px), with no horizontal page overflow observed. Checked heading structure, mobile menu opening, Escape and focus restoration, keyboard-operated expandable examples, native disclosure operation with scripts disabled, and reduced-motion scrolling. The form's required-field errors focus the error summary, and entered text survives a failed verification attempt.

The live Cal.com page showed available appointment slots. Booking links and the embed target Bryan's 30-minute calendar. In the final production-build browser check, the embed opened its loading panel but did not load; it then exposed the direct-booking fallback. The booking harness also covers script/iframe failure. A successful embedded-calendar render remains unverified in the test browser; the direct calendar was accessible. No appointment was submitted.

## Provider setup and outstanding acceptance

The managed Cloudflare Turnstile widget was created for `patchworks.ai`, `localhost` and `127.0.0.1`. Its secret is in the ignored local environment file, not source control. A dummy-token call established that the saved secret was accepted by Siteverify; it did not establish successful visitor verification. The test browser could not complete the real widget challenge, so real-token submission and replay checks remain open.

Resend was not authenticated and no sending credential was available. Sender verification for `forms.patchworks.ai`, Resend credentials, actual email acceptance, destination-inbox readback and Reply-To confirmation are therefore pending. No test email has been sent. The form remains visibly unavailable until its required configuration exists; booking and direct email remain usable.

Follow [contact-setup.md](contact-setup.md) to finish configuration and acceptance. Production settings must use `TURNSTILE_EXPECTED_HOSTNAMES=patchworks.ai` and `CONTACT_ALLOWED_ORIGINS=https://patchworks.ai`, rather than the local development values. Verify the sender `website@forms.patchworks.ai` without changing existing mailbox DNS. Public-sitekey changes require a fresh build.

## Release status

Production has not been deployed or changed. Vercel environment configuration is still pending. After the real form submission, inbox and Reply-To checks pass, prepare the Vercel preview with its exact hostname/origin and complete release review. Deploy to the existing Vercel project only when publication is authorised, preserving the prior deployment for rollback.
