import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import DifferentiatorSection from "@/components/Features/DifferentiatorSection";
import Hero from "@/components/Hero";
import LinkedInCTA from "@/components/Social/LinkedInCTA";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Patchworks AI | Pragmatic AI Solutions for Business Growth",
  description: "Patchworks AI provides fractional head-of-AI services and AI implementation expertise to help your business achieve measurable ROI from AI investments.",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <DifferentiatorSection />
      
      {/* Services Preview Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center mb-8">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">
              Our Services
            </h2>
            <p className="text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
              We offer a range of services designed to help businesses achieve measurable ROI from AI investments, from strategic guidance to custom implementation.
            </p>
            <div className="mt-8">
              <Link
                href="/services"
                className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <AboutSectionTwo />
      <LinkedInCTA />
      <Contact />
    </>
  );
}
