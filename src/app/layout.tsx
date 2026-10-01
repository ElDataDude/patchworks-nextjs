import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Motion from "@/components/Common/Motion";
import CloudflareWebAnalytics from "@/components/Common/CloudflareWebAnalytics";
import PrivacyControls from "@/components/Common/PrivacyControls";
import SessionAppsProvider from "@/components/Catalogue/SessionAppsProvider";
import type { Metadata } from "next";
import { brandIcons, brandSocialImage } from "@/data/brand";
import { Instrument_Serif, Source_Sans_3 } from "next/font/google";
import "../styles/index.css";
import "../styles/enterprise.css";
import "../styles/contact.css";
import "../styles/catalogue.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://patchworks.ai"),
  icons: brandIcons,
  openGraph: {
    siteName: "Patchworks AI",
    type: "website",
    images: [brandSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [brandSocialImage.url],
  },
};

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SessionAppsProvider>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SessionAppsProvider>
        <ScrollToTop />
        <Motion />
        <PrivacyControls />
        <CloudflareWebAnalytics />
      </body>
    </html>
  );
}
