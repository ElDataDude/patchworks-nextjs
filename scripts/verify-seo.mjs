import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const { loadSource } = createRequire(import.meta.url)("./lib/load-ts.cjs");
const { industries } = loadSource("src/data/industries.ts");
const { useCases } = loadSource("src/data/use-cases.ts");

// Usage: node scripts/verify-seo.mjs [baseUrl]
// GET-only verification of rendered SEO metadata and static asset contracts.
const root = fileURLToPath(new URL("../", import.meta.url));
const baseUrl = new URL(process.argv[2] ?? "http://127.0.0.1:3027");
const siteUrl = "https://patchworks.ai";
const socialImage = `${siteUrl}/images/brand/patchworks-og-1200x630.png`;
const faviconIcoPath =
  "/images/brand/patchworks-favicon-lowercase-continuum.ico";

const pages = {
  "/": {
    title: "Patchworks AI | AI Counsel & Enterprise Delivery",
    index: true,
    follow: true,
  },
  "/services": {
    title: "Services | Patchworks AI",
    index: true,
    follow: true,
  },
  "/industries": {
    title: "Industries & Use Cases | Patchworks AI",
    index: true,
    follow: true,
  },
  "/use-cases": {
    title: "AI Use Cases | Patchworks AI",
    index: true,
    follow: true,
  },
  "/about": {
    title: "About | Patchworks AI",
    index: true,
    follow: true,
  },
  "/contact": {
    title: "Contact Patchworks AI | Book a Partner Conversation",
    index: true,
    follow: true,
  },
  "/privacy": {
    title: "Privacy Notice | Patchworks AI",
    index: true,
    follow: true,
  },
  "/careers": {
    title: "Careers at Patchworks AI",
    index: false,
    follow: true,
  },
  "/blog": {
    title: "AI Insights Archive | Patchworks AI",
    index: false,
    follow: true,
  },
  "/blog-details": {
    title: "Fractional AI Leadership | Patchworks AI",
    index: false,
    follow: true,
  },
  "/blog-sidebar": {
    title: "Legacy Blog Layout | Patchworks AI",
    index: false,
    follow: false,
  },
  "/error": {
    title: "Error | Patchworks AI",
    index: false,
    follow: false,
  },
};
// Catalogue pages are generated from the same data the site renders.
const breadcrumbs = new Map();
for (const industry of industries) {
  const route = `/industries/${industry.slug}`;
  pages[route] = {
    title: `${industry.title} | Industries | Patchworks AI`,
    index: true,
    follow: true,
  };
  breadcrumbs.set(route, ["Home", "Industries", industry.title]);
}
for (const useCase of useCases) {
  const route = `/use-cases/${useCase.slug}`;
  pages[route] = {
    title: `${useCase.title} | Use Cases | Patchworks AI`,
    index: true,
    follow: true,
  };
  breadcrumbs.set(route, ["Home", "Use cases", useCase.title]);
}
breadcrumbs.set("/use-cases", ["Home", "Use cases"]);
const routesWithResponsiveEditorialImages = new Set([
  "/",
  "/services",
  "/industries",
  "/about",
  "/careers",
  "/blog",
  "/blog-details",
]);

const checks = [];
let rootHtml = "";
function check(scope, name, passed, detail) {
  checks.push({
    scope,
    name,
    passed: Boolean(passed),
    ...(detail ? { detail } : {}),
  });
}

function decode(value) {
  return value
    .replace(/&amp;/gu, "&")
    .replace(/&quot;/gu, '"')
    .replace(/&#x27;|&#39;/gu, "'")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">");
}

function pngBackedIcoFrames(buffer) {
  const pngSignature = Buffer.from("89504e470d0a1a0a", "hex");
  if (
    buffer.length < 6 ||
    buffer.readUInt16LE(0) !== 0 ||
    buffer.readUInt16LE(2) !== 1
  ) {
    return [];
  }

  const count = buffer.readUInt16LE(4);
  if (buffer.length < 6 + count * 16) return [];

  const frames = [];
  for (let index = 0; index < count; index += 1) {
    const entryOffset = 6 + index * 16;
    const width = buffer.readUInt8(entryOffset) || 256;
    const height = buffer.readUInt8(entryOffset + 1) || 256;
    const byteLength = buffer.readUInt32LE(entryOffset + 8);
    const imageOffset = buffer.readUInt32LE(entryOffset + 12);
    const image = buffer.subarray(imageOffset, imageOffset + byteLength);
    if (
      image.length !== byteLength ||
      !image.subarray(0, 8).equals(pngSignature) ||
      image.readUInt32BE(16) !== width ||
      image.readUInt32BE(20) !== height
    ) {
      return [];
    }
    frames.push({ width, height, image });
  }

  return frames;
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(
    /([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu,
  )) {
    result[match[1].toLowerCase()] = decode(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return result;
}

function openings(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "giu"))].map(
    (match) => attributes(match[0]),
  );
}

function meta(html, key, value) {
  return openings(html, "meta").find((item) => item[key] === value)?.content;
}

function title(html) {
  return decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] ?? "");
}

function sameUrl(actual, expected) {
  try {
    return new URL(actual).toString() === new URL(expected).toString();
  } catch {
    return false;
  }
}

for (const [route, expected] of Object.entries(pages)) {
  const response = await fetch(new URL(route, baseUrl), {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  const html = await response.text();
  if (route === "/") rootHtml = html;
  const scope = route;
  const canonical = new URL(route, siteUrl).toString();
  const robots = meta(html, "name", "robots") ?? "";
  const robotsTokens = robots
    .split(",")
    .map((token) => token.trim().toLowerCase());

  check(scope, "returns HTML with HTTP 200", response.status === 200);
  check(scope, "has the approved unique title", title(html) === expected.title);
  check(
    scope,
    "has a useful meta description",
    (meta(html, "name", "description") ?? "").length >= 50,
  );
  check(
    scope,
    "has one absolute self-canonical",
    openings(html, "link").filter(
      (item) => item.rel === "canonical" && sameUrl(item.href, canonical),
    ).length === 1,
  );
  check(
    scope,
    "has the intended robots policy",
    robotsTokens.includes(expected.index ? "index" : "noindex") &&
      robotsTokens.includes(expected.follow ? "follow" : "nofollow"),
    robots,
  );
  check(
    scope,
    "has canonical Open Graph metadata",
    sameUrl(meta(html, "property", "og:url") ?? "", canonical) &&
      meta(html, "property", "og:image") === socialImage &&
      meta(html, "property", "og:image:width") === "1200" &&
      meta(html, "property", "og:image:height") === "630",
  );
  check(
    scope,
    "uses the large Twitter card",
    meta(html, "name", "twitter:card") === "summary_large_image" &&
      meta(html, "name", "twitter:image") === socialImage,
  );
  check(
    scope,
    "does not depend on the Next image optimizer",
    !html.includes("/_next/image?"),
  );
  if (routesWithResponsiveEditorialImages.has(route)) {
    check(
      scope,
      "publishes a native responsive editorial image source set",
      openings(html, "source").some(
        (source) =>
          source.type === "image/webp" &&
          source.srcset?.includes("/images/editorial/responsive/"),
      ),
    );
  }

  if (breadcrumbs.has(route)) {
    const lists = [
      ...html.matchAll(
        /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gu,
      ),
    ]
      .map((match) => {
        try {
          return JSON.parse(match[1]);
        } catch {
          return null;
        }
      })
      .filter((item) => item?.["@type"] === "BreadcrumbList");
    const items = lists[0]?.itemListElement ?? [];
    check(
      scope,
      "has one BreadcrumbList ending at the canonical URL",
      lists.length === 1 &&
        JSON.stringify(items.map((item) => item.name)) ===
          JSON.stringify(breadcrumbs.get(route)) &&
        items.every((item, index) => item.position === index + 1) &&
        sameUrl(items.at(-1)?.item ?? "", canonical),
    );
  }

  for (const image of openings(html, "img")) {
    check(
      scope,
      `image ${image.src ?? "without src"} has alt text semantics`,
      Object.hasOwn(image, "alt"),
    );
  }
}

const robotsResponse = await fetch(new URL("/robots.txt", baseUrl));
const robotsText = await robotsResponse.text();
check("/robots.txt", "returns plain text", robotsResponse.status === 200);
check(
  "/robots.txt",
  "allows the site and protects the API",
  /Allow:\s*\//iu.test(robotsText) && /Disallow:\s*\/api\//iu.test(robotsText),
);
check(
  "/robots.txt",
  "declares the canonical sitemap",
  robotsText.includes(`Sitemap: ${siteUrl}/sitemap.xml`),
);

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
const sitemapText = await sitemapResponse.text();
const sitemapLocations = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/gu)].map(
  (match) => decode(match[1]),
);
const expectedSitemapLocations = Object.entries(pages)
  .filter(([, entry]) => entry.index)
  .map(([route]) => new URL(route, siteUrl).toString());
check("/sitemap.xml", "returns XML", sitemapResponse.status === 200);
check(
  "/sitemap.xml",
  "contains exactly the indexable pages, including the catalogue",
  sitemapLocations.length === expectedSitemapLocations.length &&
    JSON.stringify([...sitemapLocations].sort()) ===
      JSON.stringify([...expectedSitemapLocations].sort()),
  sitemapLocations.join(", "),
);

for (const legacy of ["/signin", "/signup"]) {
  const response = await fetch(new URL(legacy, baseUrl), {
    redirect: "manual",
  });
  check(
    legacy,
    "redirects temporarily (307) to Patchworks ID sign-in",
    response.status === 307 &&
      /^https:\/\/id(?:-staging)?\.patchworks\.ai\/sign-in$/u.test(
        response.headers.get("location") ?? "",
      ),
    `${response.status} ${response.headers.get("location") ?? ""}`,
  );
}

const sessionResponse = await fetch(new URL("/api/session-apps", baseUrl), {
  redirect: "manual",
});
const sessionCache = sessionResponse.headers.get("cache-control") ?? "";
const sessionBody = await sessionResponse.json().catch(() => null);
check(
  "/api/session-apps",
  "answers signed-out privately with no-store and Vary: Cookie",
  sessionResponse.status === 200 &&
    /\bno-store\b/u.test(sessionCache) &&
    /\bprivate\b/u.test(sessionCache) &&
    /\bcookie\b/iu.test(sessionResponse.headers.get("vary") ?? "") &&
    sessionBody?.status === "signed-out" &&
    Array.isArray(sessionBody.apps) &&
    sessionBody.apps.length === 0,
  `${sessionResponse.status} ${sessionCache}`,
);

const missingResponse = await fetch(
  new URL("/__patchworks_missing_page_check__", baseUrl),
  { redirect: "manual" },
);
const missingHtml = await missingResponse.text();
check("missing route", "returns HTTP 404", missingResponse.status === 404);
check(
  "missing route",
  "renders the branded missing-page content",
  title(missingHtml) === "Page Not Found | Patchworks AI" &&
    missingHtml.includes("Sorry, the page can"),
);
check(
  "missing route",
  "is noindex",
  (meta(missingHtml, "name", "robots") ?? "").includes("noindex"),
);

for (const unknown of [
  "/industries/__patchworks_unknown__",
  "/use-cases/__patchworks_unknown__",
]) {
  const response = await fetch(new URL(unknown, baseUrl), {
    redirect: "manual",
  });
  const html = await response.text();
  check(
    unknown,
    "unknown catalogue slug is a real, noindex 404",
    response.status === 404 &&
      (meta(html, "name", "robots") ?? "").includes("noindex") &&
      !/s-maxage=\d{6,}/u.test(response.headers.get("cache-control") ?? ""),
    `${response.status} ${response.headers.get("cache-control") ?? ""}`,
  );
}

const socialImagePath = path.join(
  root,
  "public/images/brand/patchworks-og-1200x630.png",
);

const rootLinks = openings(rootHtml, "link");
const expectedRasterIconLinks = [
  ["icon", "16x16", "/images/brand/patchworks-wo-16.png"],
  ["icon", "32x32", "/images/brand/patchworks-wo-32.png"],
  ["icon", "64x64", "/images/brand/patchworks-wo-64.png"],
  ["apple-touch-icon", "180x180", "/images/brand/patchworks-wo-180.png"],
];
const expectedIconLinks = [
  ["icon", "16x16 32x32 64x64", faviconIcoPath],
  ...expectedRasterIconLinks,
];
check(
  "favicons",
  "publishes the versioned ICO and approved PNG/Apple icon links",
  expectedIconLinks.every(([rel, sizes, href]) =>
    rootLinks.some(
      (item) => item.rel === rel && item.sizes === sizes && item.href === href,
    ),
  ) &&
    rootLinks.some(
      (item) => item.rel === "shortcut icon" && item.href === faviconIcoPath,
    ),
);

const iconDimensions = await Promise.all(
  expectedRasterIconLinks.map(async ([, sizes, href]) => {
    const metadata = await sharp(path.join(root, "public", href)).metadata();
    const expectedSize = Number.parseInt(sizes, 10);
    return metadata.width === expectedSize && metadata.height === expectedSize;
  }),
);
const localIco = await fs.readFile(path.join(root, "public/favicon.ico"));
const versionedLocalIco = await fs.readFile(
  path.join(root, "public", faviconIcoPath),
);
const icoFrames = pngBackedIcoFrames(localIco);
const expectedIcoSizes = [16, 32, 64];
const sourceIconBuffers = new Map(
  await Promise.all(
    expectedIcoSizes.map(async (size) => [
      size,
      await fs.readFile(
        path.join(
          root,
          `design/logo-assets-lowercase-continuum/icons/patchworks-wo-${size}.png`,
        ),
      ),
    ]),
  ),
);
check(
  "favicons",
  "ICO embeds the approved 16/32/64 PNGs without altering them",
  iconDimensions.every(Boolean) &&
    localIco.equals(versionedLocalIco) &&
    icoFrames.length === expectedIcoSizes.length &&
    icoFrames.every(
      ({ width, height, image }, index) =>
        width === expectedIcoSizes[index] &&
        height === width &&
        image.equals(sourceIconBuffers.get(width)),
    ),
);

const [servedVersionedIco, servedRootIco] = await Promise.all([
  fetch(new URL(faviconIcoPath, baseUrl)),
  fetch(new URL("/favicon.ico", baseUrl)),
]);
const [servedVersionedBytes, servedRootBytes] = await Promise.all([
  servedVersionedIco.arrayBuffer().then(Buffer.from),
  servedRootIco.arrayBuffer().then(Buffer.from),
]);
check(
  "favicons",
  "serves the exact approved ICO from versioned and conventional URLs",
  servedVersionedIco.ok &&
    servedRootIco.ok &&
    servedVersionedBytes.equals(localIco) &&
    servedRootBytes.equals(localIco) &&
    pngBackedIcoFrames(servedVersionedBytes).length === 3 &&
    pngBackedIcoFrames(servedRootBytes).length === 3,
  `${servedVersionedIco.status}/${servedRootIco.status}`,
);

const socialMetadata = await sharp(socialImagePath).metadata();
const socialStat = await fs.stat(socialImagePath);
check(
  "social image",
  "is a compressed 1200x630 PNG",
  socialMetadata.format === "png" &&
    socialMetadata.width === 1200 &&
    socialMetadata.height === 630 &&
    socialStat.size <= 300_000,
  `${socialMetadata.width}x${socialMetadata.height}, ${socialStat.size} bytes`,
);

const publicMasters = path.join(root, "public/images/editorial/masters");
check(
  "image assets",
  "source masters are outside public",
  await fs.access(publicMasters).then(
    () => false,
    () => true,
  ),
);

const responsiveDirectory = path.join(
  root,
  "public/images/editorial/responsive",
);
const responsiveFiles = await fs.readdir(responsiveDirectory);
check(
  "image assets",
  "all 27 responsive editorial variants exist",
  responsiveFiles.filter((file) => file.endsWith(".webp")).length === 27,
);

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: baseUrl.origin,
  scope:
    "GET-only rendered SEO, missing-route and static-asset verification; no submissions or external provider actions",
  passed: checks.every((item) => item.passed),
  summary: {
    routes: Object.keys(pages).length,
    checks: checks.length,
    failures: checks.filter((item) => !item.passed).length,
  },
  checks,
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (!report.passed) process.exitCode = 1;
