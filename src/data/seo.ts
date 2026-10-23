import type { Metadata } from "next";
import { brandSocialImage } from "@/data/brand";

export const SITE_NAME = "Patchworks AI";
export const SITE_URL = "https://patchworks.ai";

export const pageSeo = {
  "/": {
    title: "Patchworks AI | AI Counsel & Enterprise Delivery",
    description:
      "AI counsel and hands-on delivery for complex enterprises. Understand frontier AI, assess programmes and suppliers, and implement alongside your teams.",
    index: true,
    follow: true,
  },
  "/services": {
    title: "Services | Patchworks AI",
    description:
      "AI Intelligence & Counsel and Enterprise AI Review & Delivery. Clear advice, programme and supplier assessment, and implementation alongside your teams.",
    index: true,
    follow: true,
  },
  "/industries": {
    title: "Industries & Use Cases | Patchworks AI",
    description:
      "Enterprise AI counsel and delivery for insurance, banking, wealth management, charities and schools, audit, consumer goods and supply chain, with working use cases.",
    index: true,
    follow: true,
  },
  "/use-cases": {
    title: "AI Use Cases | Patchworks AI",
    description:
      "Working AI use cases from Patchworks AI: live call intelligence, decision engines, fund selection, fundraising guides and a governed home for enterprise AI apps.",
    index: true,
    follow: true,
  },
  "/about": {
    title: "About | Patchworks AI",
    description:
      "A partnership combining AI engineering and enterprise delivery with technology investment and board judgement. Clear counsel and practical support for enterprise teams.",
    index: true,
    follow: true,
  },
  "/contact": {
    title: "Contact Patchworks AI | Book a Partner Conversation",
    description:
      "Speak with a Patchworks AI partner about AI intelligence, enterprise programmes, supplier evaluation and hands-on implementation.",
    index: true,
    follow: true,
  },
  "/privacy": {
    title: "Privacy Notice | Patchworks AI",
    description:
      "How Patchworks AI handles enquiries, website data and third-party services.",
    index: true,
    follow: true,
  },
  "/careers": {
    title: "Careers at Patchworks AI",
    description:
      "Information about working with Patchworks AI. Contact us to confirm whether any roles are currently open.",
    index: false,
    follow: true,
  },
  "/blog": {
    title: "AI Insights Archive | Patchworks AI",
    description:
      "Archived Patchworks AI articles about AI strategy and delivery, retained for reference while editorial content is reviewed.",
    index: false,
    follow: true,
  },
  "/blog-details": {
    title: "Fractional AI Leadership | Patchworks AI",
    description:
      "An archived article about fractional AI leadership, retained while Patchworks AI reviews its editorial content.",
    index: false,
    follow: true,
  },
  "/blog-sidebar": {
    title: "Legacy Blog Layout | Patchworks AI",
    description:
      "An archived Patchworks AI blog layout retained for reference.",
    index: false,
    follow: false,
  },
  "/error": {
    title: "Error | Patchworks AI",
    description: "A Patchworks AI error page retained for diagnostic use.",
    index: false,
    follow: false,
  },
} as const;

export type PagePath = keyof typeof pageSeo;

export const indexablePagePaths = Object.entries(pageSeo)
  .filter(([, entry]) => entry.index)
  .map(([path]) => path as PagePath);

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  index: boolean;
  follow: boolean;
}

/** Metadata for any route, including generated catalogue pages. */
export function createRouteMetadata({
  path,
  title,
  description,
  index,
  follow,
}: RouteSeo): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [brandSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [brandSocialImage.url],
    },
  };
}

export function createPageMetadata(
  path: PagePath,
  titleOverride?: string,
  descriptionOverride?: string,
): Metadata {
  const entry = pageSeo[path];
  return createRouteMetadata({
    path,
    title: titleOverride ?? entry.title,
    description: descriptionOverride ?? entry.description,
    index: entry.index,
    follow: entry.follow,
  });
}

/** schema.org BreadcrumbList for a page trail of [name, path] pairs. */
export function breadcrumbJsonLd(
  trail: readonly (readonly [string, string])[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}
