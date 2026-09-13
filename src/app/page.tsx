import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import DifferentiatorSection from "@/components/Features/DifferentiatorSection";
import Hero from "@/components/Hero";
import LinkedInCTA from "@/components/Social/LinkedInCTA";
import EditorialLink from "@/components/Common/EditorialLink";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Patchworks AI | Pragmatic AI Solutions for Business Growth",
  description:
    "Patchworks AI provides fractional head-of-AI services and AI implementation expertise to help your business achieve measurable ROI from AI investments.",
};
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <DifferentiatorSection />
      <section className="site-container service-gateway" data-reveal>
        <h2>Our Services</h2>
        <p>
          We offer a range of services designed to help businesses achieve
          measurable ROI from AI investments, from strategic guidance to custom
          implementation.
        </p>
        <EditorialLink href="/services">View All Services</EditorialLink>
      </section>
      <AboutSectionTwo />
      <LinkedInCTA />
      <Contact />
    </>
  );
}
