import PageIntro from "@/components/Common/PageIntro";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import "../../styles/core-pages.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Patchworks AI",
  description:
    "Explore our range of AI services designed to deliver measurable ROI, from fractional head-of-AI to custom AI application development.",
};

export default function ServicesPage() {
  return (
    <div className="core-page">
      <section className="site-container">
        <PageIntro
          title="Our Services"
          description="We offer a range of services designed to help businesses achieve measurable ROI from AI investments, from strategic guidance to custom implementation."
          image="/images/editorial/services-system.webp"
          imageAlt="Five connected abstract capability platforms"
        />
      </section>
      <Services />
      <TechStack />
    </div>
  );
}
