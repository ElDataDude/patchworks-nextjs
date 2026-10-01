import type { Metadata } from "next";

// Exact PNG exports from the approved Lowercase Continuum asset pack.
export const brandWordmarks = {
  light: "/images/brand/patchworks-ai-full-colour-600.png",
  dark: "/images/brand/patchworks-ai-dark-background-600.png",
} as const;

export const brandFavicon =
  "/images/brand/patchworks-favicon-lowercase-continuum.ico";

export const brandIcons: Metadata["icons"] = {
  icon: [
    {
      url: brandFavicon,
      sizes: "16x16 32x32 64x64",
      type: "image/x-icon",
    },
    {
      url: "/images/brand/patchworks-wo-16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      url: "/images/brand/patchworks-wo-32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/images/brand/patchworks-wo-64.png",
      sizes: "64x64",
      type: "image/png",
    },
  ],
  shortcut: brandFavicon,
  apple: [
    {
      url: "/images/brand/patchworks-wo-180.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

export const brandSocialImage = {
  url: "/images/brand/patchworks-og-1200x630.png",
  width: 1200,
  height: 630,
  alt: "Patchworks AI — AI counsel and delivery for complex enterprises",
};
