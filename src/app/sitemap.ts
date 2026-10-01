import type { MetadataRoute } from "next";
import { absoluteUrl, indexablePagePaths } from "@/data/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePagePaths.map((path) => ({
    url: absoluteUrl(path),
  }));
}
