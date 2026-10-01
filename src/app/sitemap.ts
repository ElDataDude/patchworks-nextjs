import type { MetadataRoute } from "next";
import { absoluteUrl, indexablePagePaths } from "@/data/seo";
import { catalogueRoutes } from "@/data/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = Array.from(
    new Set<string>([...indexablePagePaths, ...catalogueRoutes()]),
  );
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
