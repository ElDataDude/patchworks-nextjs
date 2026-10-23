import AboutSectionOne from "@/components/About/AboutSectionOne";
import "../../styles/core-pages.css";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/about");

export default function AboutPage() {
  return (
    <div className="core-page">
      <AboutSectionOne />
    </div>
  );
}
