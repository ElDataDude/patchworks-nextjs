import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

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
  "/signin",
  "/signup",
  "/error",
];
const coreRoutes = new Set([
  "/",
  "/services",
  "/industries",
  "/about",
  "/contact",
]);
const bookingLabel = "Book a partner conversation";
const bookingUrl = "https://cal.com/bryanj/30min";
const pillarTitles = [
  "AI Intelligence & Counsel",
  "Enterprise AI Review & Delivery",
];
const pillarLinks = ["/services#ai-counsel", "/services#review-delivery"];
const sectors = [
  "Financial Services & Retail Banking",
  "Insurance",
  "Consumer Goods",
  "Supply Chain & Logistics",
  "Audit & Professional Services",
];
const forbidden = [
  ["public price", /[£€$]\s*\d/iu],
  [
    "pricing or availability offer",
    /\b(?:pricing|VAT|availability|slots booked)\b/iu,
  ],
  ["free offer", /\bfree\b/iu],
  ["fractional leadership", /\bfractional\b/iu],
  ["full-time cost comparison", /full[- ]time cost|30% (?:the )?cost/iu],
  [
    "old service package",
    /getting started (?:with AI )?workshop|full AI roadmap package|3.month trial/iu,
  ],
  [
    "fixed ROI deadline",
    /within (?:the first )?(?:\d+ )?(?:weeks|days)|weeks,? not months|weeks,? not years|ROI.{0,45}(?:\d+ days|\d+ months)/iu,
  ],
];
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
  const found = forbidden
    .filter(([, pattern]) => pattern.test(content))
    .map(([name]) => name);
  check(
    route,
    `${label} omits old commercial positioning`,
    found.length === 0,
    found.length ? found.join(", ") : undefined,
  );
}

async function retainedSource() {
  const casesFile = "src/components/UseCases/index.tsx";
  const casesSource = ts.createSourceFile(
    casesFile,
    await fs.readFile(path.join(root, casesFile), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const cases = [];
  function visitCases(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(casesSource) === "useCases" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const item of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(item)) continue;
        const fields = {};
        for (const property of item.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            ts.isStringLiteral(property.initializer)
          ) {
            fields[property.name.getText(casesSource)] = normalized(
              property.initializer.text,
            );
          }
        }
        cases.push(fields);
      }
    }
    ts.forEachChild(node, visitCases);
  }
  visitCases(casesSource);
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
  return { cases, drilling };
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
      JSON.stringify(navLinks.map((item) => item.attrs.href)) ===
        JSON.stringify(["/services", "/industries", "/about", "/contact"]),
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
        "/industries#use-cases",
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
    for (const detail of details.filter((item) =>
      ["case-study", "use-cases"].includes(item.attrs.id),
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
      (enquiry.length === 1 && enquiry[0].attrs.method?.toLowerCase() === "post") ||
        (enquiry.length === 0 &&
          revisedHtml.includes('data-enquiry="email"') &&
          elements(revisedHtml, "a").some((link) => link.attrs.href === "mailto:info@patchworks.ai")),
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
  for (const id of ["case-study", "use-cases"]) {
    const match = details.filter((item) => item.attrs.id === id);
    check(
      "/industries",
      `${id} is one native disclosure with a unique anchor`,
      match.length === 1 && allIds.filter((value) => value === id).length === 1,
    );
    check(
      "/industries",
      `${id} starts collapsed with a readable summary`,
      match.length === 1 &&
        !("open" in match[0].attrs) &&
        elements(match[0].html, "summary")[0]?.text.length > 0,
    );
  }
  const headings = elements(industriesHtml, "h2").map((item) => item.text);
  const sectorPositions = sectors.map((sector) => headings.indexOf(sector));
  check(
    "/industries",
    "five approved sectors appear in order",
    sectorPositions.every(
      (position, index) =>
        position >= 0 && (index === 0 || position > sectorPositions[index - 1]),
    ),
  );
  const retained = await retainedSource();
  const caseText =
    details.find((item) => item.attrs.id === "case-study")?.text ?? "";
  const useCaseText =
    details.find((item) => item.attrs.id === "use-cases")?.text ?? "";
  check(
    "/industries",
    "complete drilling narrative remains server-rendered",
    retained.drilling.length >= 6 &&
      retained.drilling.every((block) => caseText.includes(block)),
  );
  check(
    "/industries",
    "six complete use-case bodies remain server-rendered",
    retained.cases.length === 6 &&
      retained.cases.every((item) =>
        ["title", "problem", "solution", "tool", "result"].every(
          (key) => item[key] && useCaseText.includes(item[key]),
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
