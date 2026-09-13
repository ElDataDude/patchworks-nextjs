import AboutSectionOne from "@/components/About/AboutSectionOne";
import "../../styles/core-pages.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Patchworks AI",
  description:
    "Learn about Patchworks AI's mission to deliver pragmatic AI solutions with measurable ROI through our fractional leadership model and expertise.",
};

export default function AboutPage() {
  return (
    <div className="core-page">
      <AboutSectionOne />
    </div>
  );
}
