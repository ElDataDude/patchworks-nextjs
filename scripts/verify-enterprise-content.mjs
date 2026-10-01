import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { findForbiddenCopy } from "./lib/forbidden-copy.mjs";

const { loadSource } = createRequire(import.meta.url)("./lib/load-ts.cjs");
const { industries } = loadSource("src/data/industries.ts");
const { useCases, casesForIndustry } = loadSource("src/data/use-cases.ts");
const { openableAppSlugs } = loadSource("src/data/apps.ts");
const { catalogueRoutes, primaryNavigation } = loadSource(
  "src/data/navigation.ts",
);

// Usage: node scripts/verify-enterprise-content.mjs [baseUrl] [newReportPath]
// GET-only checks of server-rendered HTML. This does not submit forms, load
// external calendars or claim that delivery, hydration or visual QA passed.
const root = fileURLToPath(new URL("../", import.meta.url));
const baseUrl = new URL(process.argv[2] ?? "http://127.0.0.1:3027");
const outputPath = process.argv[3];
const routes = [
  "/",
  "/services",
  "/industries",
  "/about",
  "/contact",
  "/privacy",
  "/careers",
  "/blog",
  "/blog-details",
  "/blog-sidebar",
  "/error",
  ...catalogueRoutes(),
];
const coreRoutes = new Set([
  "/",
  "/services",
  "/industries",
  "/about",
  "/contact",
  ...catalogueRoutes(),
]);
const topLevelHrefs = ["/services", "/industries", "/about", "/contact"];
const industriesPanel = primaryNavigation.find((item) => item.panel).panel;
const catalogueLinks = [
  ...industries.map((industry) => `/industries/${industry.slug}`),
  ...useCases.map((useCase) => `/use-cases/${useCase.slug}`),
];
const signInPattern =
  /^https:\/\/id(?:-staging)?\.patchworks\.ai\/sign-in\?return=https?%3A%2F%2F/u;
const bookingLabel = "Book a partner conversation";
const bookingUrl = "https://cal.com/bryanj/30min";
const pillarTitles = [
  "AI Intelligence & Counsel",
  "Enterprise AI Review & Delivery",
];
const pillarLinks = ["/services#ai-counsel", "/services#review-delivery"];
const sectors = industries.map((industry) => industry.title);
const checks = [];
const pages = new Map();
function check(route, name, passed, detail) {
  checks.push({
    route,
    name,
    passed: Boolean(passed),
    ...(detail ? { detail } : {}),
  });
}

function decode(value) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/giu,
    (_, entity) => {
      if (entity.startsWith("#")) {
        const hex = entity[1].toLowerCase() === "x";
        const codePoint = Number.parseInt(
          entity.slice(hex ? 2 : 1),
          hex ? 16 : 10,
        );
        return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : "�";
      }
      return entities[entity.toLowerCase()];
    },
  );
}
function normalized(value) {
  return decode(value).replace(/[’‘]/gu, "'").replace(/\s+/gu, " ").trim();
}
function cleanHtml(value) {
  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, "")
    .replace(/<!--[\s\S]*?-->/gu, "");
}
function text(value) {
  return normalized(value.replace(/<[^>]*>/gu, " "));
}
function attrs(value) {
  const result = {};
  for (const match of value.matchAll(
    /([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu,
  )) {
    result[match[1].toLowerCase()] = decode(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return result;
}
function elements(html, tag) {
  return [
    ...html.matchAll(
      new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "giu"),
    ),
  ].map((match) => ({
    attrs: attrs(match[1]),
    html: match[2],
    full: match[0],
    text: text(match[2]),
  }));
}
function openings(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "giu"))].map(
    (match) => attrs(match[1]),
  );
}
function rejectOldOffer(route, label, content) {
  const found = findForbiddenCopy(content);
  check(
    route,
    `${label} omits old commercial positioning`,
    found.length === 0,
    found.length ? found.join(", ") : undefined,
  );
}

async function retainedSource() {
  const drillingFile = "src/components/About/AboutSectionTwo.tsx";
  const drillingSource = ts.createSourceFile(
    drillingFile,
    await fs.readFile(path.join(root, drillingFile), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const drilling = [];
  function jsxText(node) {
    if (ts.isJsxText(node)) return node.text;
    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      ts.isStringLiteral(node.expression)
    )
      return node.expression.text;
    if (ts.isJsxElement(node) || ts.isJsxFragment(node))
      return node.children.map(jsxText).join("");
    return "";
  }
  function visitDrilling(node) {
    if (
      ts.isJsxElement(node) &&
      /^(?:h2|h3|p)$/u.test(node.openingElement.tagName.getText(drillingSource))
    ) {
      drilling.push(normalized(jsxText(node)));
    }
    ts.forEachChild(node, visitDrilling);
  }
  visitDrilling(drillingSource);
  return { drilling };
}

await Promise.all(
  routes.map(async (route) => {
    try {
      const response = await fetch(new URL(route, baseUrl), {
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
      });
      check(
        route,
        "existing route returns HTML without redirect",
        response.status === 200 &&
          (response.headers.get("content-type") ?? "").includes("text/html"),
        `HTTP ${response.status}`,
      );
      if (response.status === 200)
        pages.set(route, cleanHtml(await response.text()));
    } catch (error) {
      check(route, "existing route is reachable", false, error.message);
    }
  }),
);

for (const route of routes) {
  const html = pages.get(route);
  if (!html) continue;
  const header = elements(html, "header").find((item) =>
    item.attrs.class?.split(/\s/u).includes("site-header"),
  );
  const footer = elements(html, "footer").find((item) =>
    item.attrs.class?.split(/\s/u).includes("site-footer"),
  );
  check(route, "shared header and footer render", header && footer);
  if (header) {
    const nav = elements(header.html, "nav").find(
      (item) => item.attrs.id === "main-navigation",
    );
    const navLinks = nav ? elements(nav.html, "a") : [];
    check(
      route,
      "primary navigation contains the four enterprise routes",
      JSON.stringify(
        navLinks
          .filter((item) => item.attrs["data-nav-level"] === "1")
          .map((item) => item.attrs.href),
      ) === JSON.stringify(topLevelHrefs),
    );
    const disclosure = nav
      ? openings(nav.html, "button").find(
          (item) => item["aria-controls"] === industriesPanel.id,
        )
      : undefined;
    check(
      route,
      "Industries disclosure button is collapsed and named",
      disclosure?.["aria-expanded"] === "false" &&
        Boolean(disclosure["aria-label"]),
    );
    const panelOpening = nav
      ? openings(nav.html, "div").find((item) => item.id === industriesPanel.id)
      : undefined;
    const panelLinks = navLinks
      .filter((item) => item.attrs["data-nav-level"] === "2")
      .map((item) => item.attrs.href);
    check(
      route,
      "Industries panel is server-rendered, inert when closed and matches the catalogue",
      panelOpening &&
        "inert" in panelOpening &&
        catalogueLinks.every((href) => panelLinks.includes(href)) &&
        ["/industries", "/use-cases"].every((href) =>
          panelLinks.includes(href),
        ),
    );
    check(
      route,
      "header offers Patchworks ID sign-in",
      elements(header.html, "a").some(
        (item) =>
          item.attrs["data-account"] === "sign-in" &&
          item.text === "Sign in" &&
          signInPattern.test(item.attrs.href ?? ""),
      ),
    );
    check(
      route,
      "header provides partner booking",
      elements(header.html, "a").some(
        (item) => item.attrs.href === bookingUrl && item.text === bookingLabel,
      ),
    );
    rejectOldOffer(route, "Header", header.text);
  }
  if (footer) {
    const links = elements(footer.html, "a").map((item) => item.attrs.href);
    check(
      route,
      "footer preserves pillar and retained-content access",
      [
        ...pillarLinks,
        "/industries#case-study",
        "/use-cases",
        "/blog",
        "/careers",
      ].every((href) => links.includes(href)),
    );
    rejectOldOffer(route, "Footer", footer.text);
  }
  const bookings = elements(html, "a").filter((item) =>
    item.attrs.href?.startsWith("https://cal.com/"),
  );
  check(
    route,
    "booking anchors use the shared destination and label",
    bookings.length > 0 &&
      bookings.every(
        (item) => item.attrs.href === bookingUrl && item.text === bookingLabel,
      ),
  );
  if (!coreRoutes.has(route)) continue;
  const main = elements(html, "main");
  // React can flush a suspended route segment after the closing main tag in a
  // hidden server-rendered container. Use that HTML when the initial main shell
  // is empty so the check describes the delivered document, not flush timing.
  let renderedMainHtml = main[0]?.html ?? "";
  if (elements(renderedMainHtml, "h1").length === 0) {
    renderedMainHtml = html;
    if (header) renderedMainHtml = renderedMainHtml.replace(header.full, "");
    if (footer) renderedMainHtml = renderedMainHtml.replace(footer.full, "");
  }
  const renderedH1 = elements(renderedMainHtml, "h1");
  check(
    route,
    "one main landmark and one nonempty H1",
    main.length === 1 &&
      renderedH1.length === 1 &&
      renderedH1[0]?.text.length > 0,
  );
  check(
    route,
    "core content includes section headings",
    elements(renderedMainHtml, "h2").length > 0,
  );
  const details = elements(renderedMainHtml, "details");
  let revisedHtml = renderedMainHtml;
  if (route === "/industries") {
    for (const detail of details.filter(
      (item) => item.attrs.id === "case-study",
    ))
      revisedHtml = revisedHtml.replace(detail.full, "");
  }
  rejectOldOffer(route, "Revised core content", text(revisedHtml));
  check(
    route,
    "no newsletter in revised core content",
    !/newsletter/iu.test(text(revisedHtml)),
  );
  const title = elements(html, "title")[0]?.text ?? "";
  const description =
    openings(html, "meta").find((item) => item.name === "description")
      ?.content ?? "";
  check(
    route,
    "enterprise metadata is present",
    title.includes("Patchworks AI") &&
      /enterprise|partner|counsel/iu.test(description),
  );
  rejectOldOffer(route, "Metadata", `${title} ${description}`);
  if (["/", "/services", "/about"].includes(route)) {
    check(
      route,
      "both pillars appear in main content",
      pillarTitles.every((pillar) => text(revisedHtml).includes(pillar)),
    );
  }
  if (route === "/services") {
    const ids = openings(revisedHtml, "article").map((item) => item.id);
    check(
      route,
      "both service anchors exist",
      ["ai-counsel", "review-delivery"].every((id) => ids.includes(id)),
    );
  }
  if (["/", "/contact"].includes(route)) {
    const enquiry = elements(revisedHtml, "form").filter(
      (item) => item.attrs.action === "/api/contact",
    );
    check(
      route,
      "enquiries use a POST form or the direct-email release fallback",
      (enquiry.length === 1 &&
        enquiry[0].attrs.method?.toLowerCase() === "post") ||
        (enquiry.length === 0 &&
          revisedHtml.includes('data-enquiry="email"') &&
          elements(revisedHtml, "a").some(
            (link) => link.attrs.href === "mailto:info@patchworks.ai",
          )),
    );
    check(
      route,
      "no disconnected placeholder form",
      !openings(revisedHtml, "form").some(
        (item) => item["data-submission"] === "not-connected",
      ),
    );
  }
}

const industriesHtml = pages.get("/industries");
if (industriesHtml) {
  const details = elements(industriesHtml, "details");
  const allIds = [...industriesHtml.matchAll(/\bid="([^"]*)"/gu)].map((match) =>
    decode(match[1]),
  );
  const caseStudy = details.filter((item) => item.attrs.id === "case-study");
  check(
    "/industries",
    "case-study is one native disclosure with a unique anchor",
    caseStudy.length === 1 &&
      allIds.filter((value) => value === "case-study").length === 1,
  );
  check(
    "/industries",
    "case-study starts collapsed with a readable summary",
    caseStudy.length === 1 &&
      !("open" in caseStudy[0].attrs) &&
      elements(caseStudy[0].html, "summary")[0]?.text.length > 0,
  );
  const useCaseSection = elements(industriesHtml, "section").filter(
    (item) => item.attrs.id === "use-cases",
  );
  const useCaseHrefs = useCaseSection.flatMap((item) =>
    elements(item.html, "a").map((link) => link.attrs.href),
  );
  check(
    "/industries",
    "use-cases anchor is unique and links to every catalogue use case",
    useCaseSection.length === 1 &&
      allIds.filter((value) => value === "use-cases").length === 1 &&
      useCases.every((useCase) =>
        useCaseHrefs.includes(`/use-cases/${useCase.slug}`),
      ),
  );
  const headings = elements(industriesHtml, "h2").map((item) => item.text);
  const sectorPositions = sectors.map((sector) => headings.indexOf(sector));
  check(
    "/industries",
    "catalogue industries appear in order",
    sectorPositions.every(
      (position, index) =>
        position >= 0 && (index === 0 || position > sectorPositions[index - 1]),
    ),
  );
  check(
    "/industries",
    "every industry heading links to its page",
    industries.every((industry) =>
      elements(industriesHtml, "h2").some(
        (item) =>
          item.text === industry.title &&
          elements(item.html, "a")[0]?.attrs.href ===
            `/industries/${industry.slug}`,
      ),
    ),
  );
  const retained = await retainedSource();
  const caseText = caseStudy[0]?.text ?? "";
  check(
    "/industries",
    "complete drilling narrative remains server-rendered",
    retained.drilling.length >= 6 &&
      retained.drilling.every((block) => caseText.includes(block)),
  );
}

function expectedEnquiry(intent, fields) {
  const params = new URLSearchParams({ intent });
  for (const [key, value] of Object.entries(fields))
    if (value) params.set(key, value);
  return `/contact?${params.toString()}#enquiry`;
}
function ctaMatches(href, expected, topic) {
  return (
    href === expected ||
    (href?.startsWith("mailto:info@patchworks.ai?subject=") &&
      decodeURIComponent(href).includes(topic))
  );
}

const openable = new Set(openableAppSlugs());
for (const useCase of useCases) {
  const route = `/use-cases/${useCase.slug}`;
  const html = pages.get(route);
  if (!html) continue;
  const headings = elements(html, "h2").map((item) => item.text);
  check(
    route,
    "use-case sections are present",
    [
      "The job",
      "How it works",
      "What it shows",
      "Where it stops",
      "Industries",
    ].every((heading) => headings.includes(heading)),
  );
  const showcase = elements(html, "figure").find(
    (item) => item.attrs["data-showcase"] === useCase.showcase.kind,
  );
  check(
    route,
    "showcase panel is illustrative HTML, not a screenshot",
    showcase &&
      showcase.text.includes("Illustrative") &&
      openings(showcase.html, "img").length === 0,
  );
  const scope =
    useCase.industries !== "all" && useCase.industries.length === 1
      ? useCase.industries[0]
      : undefined;
  const anchors = elements(html, "a");
  check(
    route,
    "Request a demo carries the use case and industry",
    anchors.some(
      (item) =>
        item.attrs["data-cta"] === "request-demo" &&
        item.text === "Request a demo" &&
        ctaMatches(
          item.attrs.href,
          expectedEnquiry("demo", { useCase: useCase.slug, industry: scope }),
          useCase.title,
        ),
    ),
  );
  for (const link of useCase.apps) {
    const expected = expectedEnquiry(link.ctaKind, {
      useCase: useCase.slug,
      industry: scope,
      app: link.app,
    });
    check(
      route,
      `${link.app} link asks for ${link.ctaKind === "access" ? "access" : "a demo"}`,
      anchors.some(
        (item) =>
          item.attrs["data-cta"] ===
            (link.ctaKind === "access" ? "request-access" : "request-demo") &&
          ctaMatches(item.attrs.href, expected, useCase.title),
      ),
    );
  }
  const slots = openings(html, "span").filter(
    (item) => "data-open-app" in item,
  );
  const expectedSlots = useCase.apps.filter(
    (link) => openable.has(link.app) && link.launchPath,
  );
  check(
    route,
    "Open app slots render hidden, only for Patchworks ID apps",
    slots.length === expectedSlots.length &&
      slots.every(
        (item) => "hidden" in item && openable.has(item["data-open-app"]),
      ) &&
      !anchors.some((item) => /^Open /u.test(item.text)),
  );
}
for (const industry of industries) {
  const route = `/industries/${industry.slug}`;
  const html = pages.get(route);
  if (!html) continue;
  const hrefs = elements(html, "a").map((item) => item.attrs.href);
  check(
    route,
    "industry page links to each of its use cases",
    casesForIndustry(industry.slug).every((useCase) =>
      hrefs.includes(`/use-cases/${useCase.slug}`),
    ),
  );
  check(
    route,
    "Request a demo carries the industry",
    elements(html, "a").some(
      (item) =>
        item.attrs["data-cta"] === "request-demo" &&
        ctaMatches(
          item.attrs.href,
          expectedEnquiry("demo", { industry: industry.slug }),
          industry.title,
        ),
    ),
  );
}

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: baseUrl.origin,
  scope:
    "GET-only server-rendered content; no submissions, external provider checks or visual assertions",
  passed: checks.every((item) => item.passed),
  summary: {
    routes: routes.length,
    checks: checks.length,
    failures: checks.filter((item) => !item.passed).length,
  },
  checks,
};
const json = `${JSON.stringify(report, null, 2)}\n`;
if (outputPath) {
  // Exclusive creation protects historical evidence from accidental overwrites.
  await fs.writeFile(path.resolve(outputPath), json, { flag: "wx" });
}
process.stdout.write(json);
if (!report.passed) process.exitCode = 1;
