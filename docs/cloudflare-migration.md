# Cloudflare migration

## Release status — 14 September 2026

The Cloudflare/OpenNext release is live on `patchworks.ai`. The apex route `f6fe05c2b67d4778aa8887f43e497b68` and `www` route `cb57b22324264d5e8c23aa80cb66ab22` both send traffic to `patchworks-nextjs`. All 25 DNS records remain unchanged, including the five root Google MX records. The retained Vercel origin remains available for route-removal rollback.

Production deployment and the checks recorded below are complete. Browser zoom at 200% was not separately tested.

The 06:00 UTC follow-up explicitly advertises the approved logomark ICO at `/images/brand/patchworks-favicon-lowercase-continuum.ico`, while retaining `/favicon.ico` and the PNG/Apple assets. The ICO contains the unchanged 16/32/64px images from the design pack. “Allow embedded booking” now appears first and is highlighted in orange in both the banner and preferences dialog, as requested. Selecting it still requires a click, and Cal.com loads after a subsequent booking click. Production checks at 320px and 1440px passed; both preview and production passed 167 SEO/asset checks, including exact served ICO bytes. See `design/evidence/cloudflare/favicon-cookie-release.json` for the deployment identifiers and readback.

- Final preview: https://patchworks-nextjs-preview.bryan-johnson.workers.dev
- Production: https://patchworks.ai
- Preview and live production: 166/166 SEO checks and 149/149 content checks passed across 13 page routes.
- TypeScript, lint, both OpenNext builds, 47 contact tests, booking/privacy harness, Worker wrapper tests and diff checks passed.
- Real WAF enforcement passed at the fifth-request threshold; blocked responses were HTML 429.
- Browser observations covered widths 320, 390, 430, 768, 1024 and 1440. On the final production home page, document width matched viewport width at all six sizes. The sticky menu opened with focus on Services and Escape restored the menu trigger. Real Cal loaded only after consent plus a booking click; withdrawing consent reloaded the page and removed its script and iframe. These observations led to explicit banner-heading contrast, equal consent choices, 44px mobile CTA, and booking-close focus fixes.
- Final live checks at 320px confirmed the white banner heading, equally weighted decision buttons and 44px sticky CTA. Cal loaded only after Allow plus a booking click, closing it restored focus to the header CTA, and switching back to Essential reloaded with zero Cal scripts and frames. The secure `v1.essential` preference cookie used SameSite Lax and a 183-day lifetime.
- Landscape checks passed at 640×360 with all menu links visible, focus entering on Services and Escape restoring the open-menu trigger. At 844×390 the desktop header CTA remained visible and unobstructed.

Cloudflare verified `info@patchworks.ai` at `2026-09-14T04:54:57.325176Z`. Real preview and production enquiries each returned HTTP 200 and reached an `accepted` D1 ledger state. Replaying either Turnstile token returned HTTP 403. The accepted Cloudflare message IDs were `<JTdPRd7Kd5AG63TNlReEgMhul3UsAIo4hS2z@patchworks.ai>` in preview and `<eLgPthz8guDjULY57efm8V3R22Nbn6jxyTgs@patchworks.ai>` in production. Both messages arrived in Bryan's Patchworks Google Workspace mailbox through the `info@patchworks.ai` alias and were read back in Safari.

The production message used `website@patchworks.ai` as From, `bryan.johnson@patchworks.ai` as Reply-To, and `info@patchworks.ai` as the site mail link and delivery alias. SPF, DKIM and DMARC all passed and transport used TLS. A live 320px check initially found 354px document width caused by contact-grid intrinsic sizing. The final production deployment fixed it: document width remained 320px with a 246px Turnstile container and completed secure verification, and resizing from 320px to 768px and back produced no overflow. The page retained exactly one manual analytics beacon and loaded no Cal script before consent and a booking click. Analytics acceptance passed after an exact-apex Configuration Rule disabled the existing zone RUM injection while retaining that manual beacon.

The existing working tree was preserved before implementation in `/private/tmp/patchworks-before-cloudflare-20260913-213407.tar.gz`. No Git commit or push is required by this release. The existing Vercel deployment remains available for rollback; see `release-2026-09-13.md`.

## Build and release commands

Use Node with `npm ci`, then `npm run cf:typegen`, `npm run typecheck`, `npm run lint`, `npm run test:catalogue`, `npm run test:contact`, `npm run test:session`, `npm run test:booking`, and `npm run test:worker`. After a build, run `npm run test:content -- <url>` and `npm run test:seo -- <url>` against the local preview or a deployed host.

- `npm run cf:build`: production Next/OpenNext compilation with isolated preview public settings.
- `npm run cf:preview -- --port 3037`: local Workers runtime.
- `npm run cf:build:production`: production hostname, public Turnstile key and analytics token.
- `npm run cf:deploy:preview` and `npm run cf:deploy:production`: standard authenticated Wrangler deployment; the latter applies the production routes.
- `npm run cf:typegen`: regenerate ignored binding types.

The build wrapper explicitly sets both `NODE_ENV` and `NEXTJS_ENV` to `production`, including for previews. Next development runtime modules must never enter the deployed Worker.

### Framework versions (Next.js 16, 22 October 2026)

The site runs Next.js 16 (Turbopack builds) with React 19.3 and needs Node 20.9 or later. Build and deploy on a patched Node release: 26.12.1, 24.22.1 or 22.23.4 or later, per the Node.js security release of 21 October 2026.

- OpenNext refuses to build any Next.js major more than two years after its release. The dates are in `@opennextjs/aws`'s build helper. Next.js 15 stopped building on 21 October 2026, the day its support ended. Upgrade the major version rather than passing `--dangerouslyUseUnsupportedNextVersion`; Next.js 16's window ends on 21 October 2027.
- Check each Next.js security release against the exact `next` version, not `npm audit`. `@opennextjs/cloudflare` also pins a minimum patched `next` in its peer range.
- `next lint` no longer exists. `npm run lint` runs ESLint 9 (`eslint src`) with the flat config in `eslint.config.mjs`. React Compiler rules such as `react-hooks/set-state-in-effect` are errors. Effects that deliberately set state after hydration or around an external widget carry a commented disable.
- Image optimisation stays off (`images.unoptimized`), so `/_next/image` answers 404. The Worker doesn't send `X-Powered-By`.

### Prerendered pages: static-assets incremental cache

`open-next.config.ts` uses OpenNext's read-only `staticAssetsIncrementalCache`. The site is fully prerendered and has no ISR or `revalidate`. Prerendered pages are therefore served from Workers static assets under `cdn-cgi/_next_cache/<BUILD_ID>/`.

The catalogue routes `/industries/[slug]` and `/use-cases/[slug]` set `dynamicParams = false` and depend on this cache:

- **With the cache:** unknown slugs return a real, noindex HTTP 404.
- **Without it:** OpenNext answers 404 (`NoFallbackError`) for every prerendered slug.
- **If the flag is dropped instead:** unknown slugs return a soft 404 that is cacheable for a year.

`opennextjs-cloudflare deploy` would normally copy the prerender cache into the assets directory, but the release commands here use `wrangler deploy` directly. `scripts/build-cloudflare.mjs` (used by `cf:build` and `cf:build:production`) therefore copies `.open-next/cache/` to `.open-next/assets/cdn-cgi/_next_cache/` after every build, and fails if that cache is missing. Never deploy an `.open-next` directory that was not produced by those scripts. Page `Cache-Control` headers are unchanged: prerendered pages already sent `s-maxage=31536000`.

### Patchworks ID variables

`wrangler.jsonc` sets three non-secret variables for the header's "Sign in" link and the "Open app" island (`/api/session-apps`). Run `npm run cf:typegen` after pulling so `CloudflareEnv` includes them.

| Variable                  | Preview                             | Production                  | Purpose                                                                                                             |
| ------------------------- | ----------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_ID_URL`      | `https://id-staging.patchworks.ai`  | `https://id.patchworks.ai`  | Sign-in link and the `/signin` and `/signup` 307 redirects. It is read at build time, so rebuild after changing it. |
| `ID_API_ORIGIN`           | `https://id-staging.patchworks.ai`  | `https://id.patchworks.ai`  | Origin for `GET /api/v1/me/apps`.                                                                                   |
| `ID_SESSION_COOKIE_NAMES` | `__Secure-pw-staging.session_token` | `__Secure-pw.session_token` | The only cookies forwarded to identity. Preview deliberately accepts only the staging cookie.                       |

`/api/session-apps` always answers HTTP 200 with `Cache-Control: private, no-store` and `Vary: Cookie`. With no Patchworks ID cookie it answers `signed-out` without calling identity. When identity fails or takes longer than 1.5 s it answers `unavailable`. No `ID` service binding is declared yet. When the identity Worker exists, add a `services` binding named `ID`; the route already prefers it over public fetch.

This release uses the Cloudflare plugin for account configuration and Worker uploads. No Cloudflare dashboard browser access or persistent local Cloudflare account credential is used. For this mode, generate the bundle with `wrangler deploy --dry-run --outdir .wrangler/plugin-upload`, then run `node scripts/prepare-plugin-upload.cjs`. Create an asset upload session with the plugin using `.wrangler/plugin-payload/manifest.json`; write its response privately to the ignored `asset-session.json`, and complete its upload-only, expiring token using `node scripts/upload-plugin-assets.cjs`. Upload the generated modules plus Wrangler-equivalent metadata through the plugin's multipart Worker API. Keep existing secret bindings. Never put session/completion tokens or `.dev.vars` into source control.

## Isolated resources

| Resource  | Preview                                | Production                             |
| --------- | -------------------------------------- | -------------------------------------- |
| Worker    | `patchworks-nextjs-preview`            | `patchworks-nextjs`                    |
| D1        | `9bbf02b4-4339-42de-81e6-bf501ee78586` | `86235363-3d71-48e7-963b-3c2f71fb98d4` |
| Turnstile | `0x4AAAAAAEy-cyZwpul8PJCH`             | `0x4AAAAAAEy3DZlhWnTsbZ8K`             |

Preview URL: https://patchworks-nextjs-preview.bryan-johnson.workers.dev . The Worker adds `X-Robots-Tag: noindex, nofollow` on previews and all Workers.dev hosts. The manual analytics component loads only for a production build on the exact `patchworks.ai` hostname.

Both D1 databases have the migration in `migrations/0001_contact_submission_ledger.sql`. The ledger contains only an HMAC key, status, message ID and timestamps. The daily 03:00 UTC cron expires entries after seven days. See `contact-setup.md` for ambiguity handling and secret-rotation implications.

Production Turnstile is restricted to `patchworks.ai`; preview uses a separate managed widget allowing its exact Workers.dev hostname and loopback development hosts.

The zone's Free-plan WAF rule applies to `/api/contact`, with five requests per IP and Cloudflare location per ten seconds and a ten-second block. `design/evidence/cloudflare/waf-verification.json` records real HTTP 429 enforcement.

## Mail and analytics acceptance

The Google Workspace `info@patchworks.ai` alias points to Bryan's existing mailbox. Root Google MX records remain unchanged. Cloudflare's verified destination registry is shared with Email Sending; destination verification did not enable inbound routing or change MX records. Recipient verification, real preview and production Turnstile enquiries, Cloudflare acknowledgement, inbox readback, Reply-To/authentication, and token replay rejection all passed on 14 September 2026.

Use the restricted `EMAIL` binding: sender `website@patchworks.ai`, destination `info@patchworks.ai`. Visitor email is Reply-To only. The production and preview Workers use separate HMAC secrets and Turnstile secrets.

The existing Web Analytics site is `4f8a5a5f42f548399f594862801d80c0`. Its `auto_install` setting is confirmed false, but that setting alone did not suppress an existing active zone RUM rule for Chrome request headers. Configuration ruleset `6eb4325d456f49d4a9c724c9ee6aca48`, rule `e24ac05640b249dd8cd0741d6656e4f2`, now applies `set_config` with `disable_rum: true` when `http.host eq "patchworks.ai"`. This stops edge injection while retaining the application's manual beacon. Public token `384971dac54f42439bb0873398396c7e` is not a credential. A fresh cache-disabled production reload contained exactly one `cloudflare-web-analytics` DOM beacon from `static.cloudflareinsights.com/beacon.min.js`; its `cloudflareinsights.com/cdn-cgi/rum` preflight returned HTTP 200 and collector returned HTTP 204. No apex `/cdn-cgi/rum` request occurred. Analytics acceptance passed.

## Cutover and rollback

Workers routes `patchworks.ai/*` (`f6fe05c2b67d4778aa8887f43e497b68`) and `www.patchworks.ai/*` (`cb57b22324264d5e8c23aa80cb66ab22`) are applied to `patchworks-nextjs`. The Worker handles every request itself and redirects `www` to the apex with status 308 while preserving path and query. Keeping the existing proxied Vercel origin DNS makes rollback immediate by removing these two Worker routes; no mail DNS change is necessary.

The exact pre-cutover DNS/ruleset snapshot is in `design/evidence/cloudflare/pre-cutover-dns-and-rulesets.json`. Apex origin is `216.198.79.193`; `www` is `cname.vercel-dns.com`. A rollback to the older Vercel release must remove or disable Configuration Rule `e24ac05640b249dd8cd0741d6656e4f2` and restore Web Analytics `auto_install: true`, because that release does not include the manual beacon.

## Verification evidence

The checks below record the September 2026 release. Since then the route list has grown: the verifiers derive the catalogue routes (Industries & Use Cases) from `src/data/*.ts`. They also check the disclosure menu, Request a demo links, 307 redirects for `/signin` and `/signup`, BreadcrumbList data, real 404s for unknown catalogue slugs, and `no-store` on `/api/session-apps`.

The final isolated Cloudflare preview and live production site each passed 166 SEO/asset checks and 149 content checks across all 13 page routes. The current files `preview-seo.json`, `preview-content.json`, `production-seo.json` and `production-content.json` include individual assertions. A random missing route returned genuine HTTP 404. Contact/backend/client tests passed 47 cases including concurrency, ambiguous provider outcomes, replay, exact origins, unavailable runtime bindings, HTML/non-JSON recovery and responsive Turnstile sizing. Booking/privacy tests cover consent and loading/failure/focus behavior.

The dependency audit identified build-tool advisories; trace inspection found none of those vulnerable packages in the browser or Worker bundle. The build does not process visitor-controlled CSS, glob, YAML or configuration input.
