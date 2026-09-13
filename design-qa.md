# Patchworks AI — design QA

Verified 13 September 2026 against the production build served at [the local preview](http://127.0.0.1:3017).

**Design implementation: PASS.** No unresolved P0, P1 or P2 design defects were identified in the final reviews. Cal.com embedded-calendar content could not be verified inside the test browser because that browser blocked the iframe document; modal launch and the working direct-calendar fallback were verified. No production deployment was performed.

## Design comparison

[Approved reference](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/reference/approved-homepage.png) · [Final side-by-side comparison](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/homepage-comparison-final.png) · [Implemented homepage at 941 × 1672](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/homepage-941.png)

The comparison uses the same 941 × 1672 region for both designs. Astra reviewed the reference and implementation together and passed the final composition, headline hierarchy, architectural imagery, understated booking treatment and services alignment. Instrument Serif and Inter replace raster mockup lettering. The original brand orange is retained, EN is a current-language label, and service rows extend farther vertically to retain readable body text. These are deliberate adaptations to the approved brief.

Sol reviewed Services, Industries, About and Careers. Luna reviewed both article layouts, Blog, Sign-in, Sign-up and Error. Their final desktop and tablet reviews passed without material layout findings. Mobile layouts were also reviewed. Root reviewed the homepage, shared navigation, contact layout and interaction behavior.

## Route coverage

Desktop: 1440 × 900. Tablet: 834 × 1112. Mobile: 390 × 844. Additional narrow wrapping checks: 320 × 740. Each Pass link opens its route screenshot.

| Route | Desktop | Tablet | Mobile | Narrow 320px |
| --- | --- | --- | --- | --- |
| / | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/home-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/home-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/home-mobile.png) | Pass |
| /services | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/services-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/services-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/services-mobile.png) | Pass |
| /industries | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/industries-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/industries-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/industries-mobile.png) | Pass |
| /about | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/about-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/about-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/about-mobile.png) | Pass |
| /careers | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/careers-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/careers-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/careers-mobile.png) | Pass |
| /contact | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/contact-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/contact-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/contact-mobile.png) | Pass |
| /blog | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-mobile.png) | Pass |
| /blog-details | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-details-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-details-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-details-mobile.png) | Pass |
| /blog-sidebar | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-sidebar-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-sidebar-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/blog-sidebar-mobile.png) | Pass |
| /signin | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/signin-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/signin-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/signin-mobile.png) | Pass |
| /signup | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/signup-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/signup-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/signup-mobile.png) | Pass |
| /error | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/error-desktop.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/error-tablet.png) | [Pass](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/error-mobile.png) | Pass |

All 36 primary viewport cases had one main landmark, one H1, labelled form controls, no detected horizontally clipped text and no document overflow. All 12 additional 320px checks passed. Measurements are saved in [responsive-check.json](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/responsive-check.json) and [narrow-check.json](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/narrow-check.json).

Full-page evidence files stitch ordinary viewport captures because the browser's full-page capture was unreliable. Sticky section titles and the floating scroll control can appear more than once in those stitched files; they are capture artifacts, not duplicated page content. Screenshot dimensions were independently checked against the measured viewport. The reference-size comparison has no sticky-title stitching duplication.

## Content preservation

A rendered baseline was captured before editing. [The final comparison](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/content-check.json) confirms all **666 captured text blocks**, all original placeholders and all 12 document titles are preserved. The check normalizes presentation-only case, whitespace, list markers and typographic apostrophes; it does not rewrite content. Original contact option values were also compared with the source archive and preserved.

Prices, service identifiers, availability data, article details, job information, CTA wording and company/legal details remain intact. Availability JSON has the same SHA-256 as the baseline. Rolling month display now avoids month-end date overflow without changing service data. Existing uncommitted lucide dependency and footer registration/address changes were retained.

Baseline and verification sources: [Before](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/content-before.json), [After](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/content-after.json), [Data baseline](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/data-before.json), [Verifier](/Users/bryanj/dev/patchworks/patchworks-nextjs/scripts/verify-design-content.mjs).

## Interaction and accessibility checks

- Mobile menu opens with focus on Home; Tab reaches Services; Escape closes it and returns focus to the menu toggle. Selecting Contact closes the menu and scrolls to the homepage contact section with clearance below the sticky header. Inner-page Contact destinations remain /contact.
- Focus styles, minimum 44px shared action targets, a skip link and a single main landmark are present. Scroll-to-top returns to scroll position zero and focuses main-content.
- Every captured input, textarea and select has a programmatic label. Contact options and form wording are retained.
- Contact's local blank-submit check shows “Online submission is currently unavailable.” The URL remains unchanged and no submission is sent. Unconnected forms do not invent success states or append entered data to URL query strings.
- Reduced motion leaves all reveal elements visible. With animation enabled, the opening content remains visible and offscreen sections are marked for subtle reveals. A JavaScript-disabled reload still exposed the headline, full services content and contact section.
- No application warnings or errors were captured in the final production-preview console.

Evidence: [Interaction checks](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/functional-check.json) and [JavaScript-disabled content](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/no-javascript.txt).

## Booking verification and external limitation

The existing https://cal.com/bryanj/30min and https://cal.com/bryanj destinations are preserved. The real Cal.com script bootstraps, and activating the booking link launches the provider modal with its close control. In this test browser, its https://app.cal.com/.../embed document fails with **net::ERR_BLOCKED_BY_CLIENT**. The watchdog closes the failed embed and exposes the direct booking link. Clicking that fallback opened Bryan Johnson's live 30 Min Meeting calendar, including dates and appointment times. No appointment was booked.

The embedded provider calendar itself therefore remains an external verification limitation. This does not prevent direct booking. The loader's success, script failure, readiness timeout, modal failure and close/fallback behavior are covered by the reproducible [booking harness](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/test-booking.cjs). The harness executes the actual TypeScript module after transpilation.

Evidence: [Sanitized browser network events](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/booking-network.json) and [Loaded direct calendar](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/evidence/booking-direct.txt).

## Artwork

Nine coordinated image masters were generated: homepage, drilling case study, Services, Industries, About, Careers and three article covers. All are standalone artwork; headings and controls remain real HTML. The nine optimized local WebP files total **722,070 bytes (about 705 KiB)**. Responsive Next.js image sizing, intrinsic dimensions or dimensioned aspect-ratio containers, and descriptive alternative text are provided.

[Asset manifest and hashes](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/assets.json) · [Astra prompts](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/asset-prompts-astra.md) · [Sol prompts](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/asset-prompts-sol.md) · [Luna prompts](/Users/bryanj/dev/patchworks/patchworks-nextjs/design/asset-prompts-luna.md)

The existing ancillary sidebar article retains its original blue stock photograph as source content. Generated masters are retained locally under public/images/editorial/masters.

## Technical validation

| Check | Result |
| --- | --- |
| npx tsc --noEmit | Pass |
| npm run lint | Pass |
| npm run build | Pass; production preview served from this build |
| node scripts/verify-design-content.mjs | Pass: 666 blocks and unchanged availability data |
| node design/evidence/test-booking.cjs | Pass |
| git diff --check | Pass |

Theme switching, next-themes and its provider were removed. Scroll and observer listeners clean up correctly. Existing JSX escaping issues were corrected without changing displayed wording. The redundant mount-time ScrollUp component was removed so route transitions use Next.js navigation behavior.

## Phase boundaries

This is an English-only local design implementation. Italian, Portuguese, Spanish and German will become selectable only after translated revised content exists. Forms, account screens, legacy search/pagination and other ancillary functionality retain their existing backend scope; this report does not claim submissions or authentication work. No production deployment or external message was sent.

To restart the preview: npm run start -- --hostname 127.0.0.1 --port 3017 (after npm run build).

## Production release follow-up — 13 September 2026

The user subsequently authorized merging and production deployment. The redesign was merged into main as 454d454. Vercel compiled that revision but rejected its inherited Next.js 15.1.6 dependency as vulnerable. The release therefore updates Next.js and eslint-config-next to 15.5.25, React and React DOM to 19.0.8, and ESLint to compatible 8.57.1. No application wording, layout or business data changed in this dependency follow-up.

Next.js 15.5 is the maintained major-15 release line; see the [official August security advisory](https://nextjs.org/blog/august-2026-security-release). The production build, lint and booking harness pass with the patched dependencies. Deployment outcome is recorded separately in the task.
