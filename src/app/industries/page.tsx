import PageIntro from "@/components/Common/PageIntro";
import Industries from "@/components/Industries";
import UseCases from "@/components/UseCases";
import "../../styles/core-pages.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries | Patchworks AI",
  description:
    "Discover how Patchworks AI delivers industry-specific AI solutions with measurable ROI across oil & gas, professional services, financial services, and more.",
};

export default function IndustriesPage() {
  return (
    <div className="core-page">
      <section className="site-container">
        <PageIntro
          title="Industry Expertise"
          description="We've helped organizations across multiple industries achieve measurable ROI from AI investments, with deep expertise in these sectors."
          image="/images/editorial/industries-system.webp"
          imageAlt="Six connected abstract sector systems"
        />
      </section>
      <Industries />
      <UseCases />
    </div>
  );
}
