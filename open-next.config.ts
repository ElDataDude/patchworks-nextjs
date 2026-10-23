import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// @ts-ignore tsconfig uses "node" resolution, which ignores package exports;
// the OpenNext build (esbuild) resolves this subpath export.
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (no ISR or revalidation), so prerendered pages
// are served read-only from the static assets. This lets catalogue routes use
// `dynamicParams = false`: unknown slugs answer 404 instead of a cached
// soft-404.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
