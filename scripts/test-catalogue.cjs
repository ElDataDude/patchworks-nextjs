/* Offline integrity tests for the Industries & Use Cases catalogue. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { loadSource, root } = require("./lib/load-ts.cjs");

const appsModule = loadSource("src/data/apps.ts");
const industriesModule = loadSource("src/data/industries.ts");
const useCasesModule = loadSource("src/data/use-cases.ts");
const navigation = loadSource("src/data/navigation.ts");
const { apps, APP_SLUGS, appUrl, openableAppSlugs } = appsModule;
const { industries, INDUSTRY_SLUGS } = industriesModule;
const { useCases, USE_CASE_SLUGS, casesForIndustry, industriesFor } =
  useCasesModule;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

function unique(values) {
  return new Set(values).size === values.length;
}

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(full) : [full];
  });
}

test("slugs are unique, well formed and match their declared lists", () => {
  for (const [items, declared] of [
    [apps, APP_SLUGS],
    [industries, INDUSTRY_SLUGS],
    [useCases, USE_CASE_SLUGS],
  ]) {
    const slugs = items.map((item) => item.slug);
    assert(unique(slugs), `duplicate slug in ${slugs.join(", ")}`);
    assert.deepEqual(slugs, [...declared]);
    for (const slug of slugs) assert.match(slug, SLUG);
  }
  assert.equal(industries.length, 7);
  assert.equal(useCases.length, 11);
});

test("use-case cross-references point at real industries and apps", () => {
  for (const useCase of useCases) {
    if (useCase.industries !== "all") {
      assert(useCase.industries.length > 0, `${useCase.slug} has no industry`);
      assert(unique(useCase.industries));
      for (const industry of useCase.industries)
        assert(INDUSTRY_SLUGS.includes(industry), `${useCase.slug}: ${industry}`);
    }
    assert(useCase.apps.length > 0, `${useCase.slug} has no app`);
    for (const link of useCase.apps)
      assert(APP_SLUGS.includes(link.app), `${useCase.slug}: ${link.app}`);
    for (const list of ["howItWorks", "shows", "stops"])
      assert(useCase[list].length > 0, `${useCase.slug} has no ${list}`);
  }
});

test("every industry has at least one use case, derived from use cases", () => {
  for (const industry of industries) {
    const derived = casesForIndustry(industry.slug);
    assert(derived.length >= 1, `${industry.slug} has no use case`);
    for (const useCase of derived)
      assert(
        industriesFor(useCase).some((item) => item.slug === industry.slug),
      );
  }
  const featured = useCases.filter((useCase) => useCase.featured);
  assert.deepEqual(
    featured.map((useCase) => useCase.slug),
    ["business-os"],
  );
  assert.equal(featured[0].industries, "all");
  for (const industry of industries)
    assert.equal(casesForIndustry(industry.slug)[0].slug, "business-os");
});

test("every live app is referenced by at least one use case", () => {
  const referenced = new Set(
    useCases.flatMap((useCase) => useCase.apps.map((link) => link.app)),
  );
  for (const app of apps.filter((item) => item.status === "live"))
    assert(referenced.has(app.slug), `${app.slug} is not referenced`);
});

test("launch paths are site-relative and only live apps have them", () => {
  for (const useCase of useCases) {
    for (const link of useCase.apps) {
      const app = apps.find((item) => item.slug === link.app);
      if (app.status === "planned") {
        assert.equal(
          link.launchPath,
          undefined,
          `${useCase.slug}: planned app ${app.slug} must not launch`,
        );
        continue;
      }
      assert.equal(typeof link.launchPath, "string");
      assert(link.launchPath.startsWith("/"), link.launchPath);
      assert(!link.launchPath.startsWith("//"), link.launchPath);
      assert.equal(new URL(appUrl(app.slug, link.launchPath)).origin, app.origin);
    }
  }
  assert.throws(() => appUrl("decisions", "https://evil.example/"));
  assert.throws(() => appUrl("decisions", "//evil.example/"));
});

test("Access-protected and invite-only apps ask for access, never offer to open", () => {
  for (const useCase of useCases)
    for (const link of useCase.apps) {
      const app = apps.find((item) => item.slug === link.app);
      assert(["demo", "access"].includes(link.ctaKind));
      if (app.auth === "cloudflare-access")
        assert.equal(link.ctaKind, "access", `${useCase.slug}: ${app.slug}`);
    }
  const openable = openableAppSlugs();
  for (const slug of openable) {
    const app = apps.find((item) => item.slug === slug);
    assert.equal(app.status, "live");
    assert.equal(app.auth, "patchworks-id");
  }
  assert(!openable.includes("pci"));
  assert(!openable.includes("os"));
  for (const app of apps) assert.match(app.origin, /^https:\/\/[a-z]+\.patchworks\.ai$/u);
});

test("no catalogue or site source mentions folio", () => {
  const offenders = filesUnder(path.join(root, "src")).filter((file) =>
    /folio/iu.test(fs.readFileSync(file, "utf8")),
  );
  assert.deepEqual(offenders, []);
});

test("catalogue copy passes the forbidden-copy rules", async () => {
  const { findForbiddenCopy } = await import("./lib/forbidden-copy.mjs");
  for (const item of [...apps, ...industries, ...useCases]) {
    const found = findForbiddenCopy(JSON.stringify(item));
    assert.deepEqual(found, [], `${item.slug}: ${found.join(", ")}`);
  }
  assert.deepEqual(findForbiddenCopy("A free 3-month trial"), [
    "free offer",
    "old service package",
  ]);
});

test("the menu is built from the catalogue and keeps four top-level routes", () => {
  const { primaryNavigation, catalogueRoutes } = navigation;
  assert.deepEqual(
    primaryNavigation.map((item) => item.href),
    ["/services", "/industries", "/about", "/contact"],
  );
  const panels = primaryNavigation.filter((item) => item.panel);
  assert.equal(panels.length, 1);
  const [industryGroup, useCaseGroup] = panels[0].panel.groups;
  assert.deepEqual(
    industryGroup.links.map((link) => link.href),
    industries.map((industry) => `/industries/${industry.slug}`),
  );
  assert.deepEqual(
    useCaseGroup.links.map((link) => link.href),
    useCases.map((useCase) => `/use-cases/${useCase.slug}`),
  );
  assert.deepEqual(
    panels[0].panel.overviewLinks.map((link) => link.href),
    ["/industries", "/use-cases"],
  );
  const routes = catalogueRoutes();
  assert(unique(routes));
  assert.equal(routes.length, industries.length + useCases.length + 1);
});
