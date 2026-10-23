import Contact from "@/components/Contact";
import Features from "@/components/Features";
import DifferentiatorSection from "@/components/Features/DifferentiatorSection";
import Hero from "@/components/Hero";
import EditorialLink from "@/components/Common/EditorialLink";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/");
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <DifferentiatorSection />
      <section
        className="section-space rule-section enterprise-context"
        data-reveal
      >
        <div className="site-container editorial-layout">
          <h2 className="section-heading">
            Built around enterprise realities.
          </h2>
          <div className="editorial-content">
            <p className="editorial-intro">
              Multiple markets. Established systems. Decisions under scrutiny.
              Our work is shaped around large, complex enterprises, including
              regulated industries, and the people responsible for moving them
              forward.
            </p>
            <p className="body-copy">
              Financial services, insurance, consumer goods and supply chain
              operations each bring different priorities. The technology has to
              make sense in your context.
            </p>
            <EditorialLink href="/industries">
              Explore enterprise contexts
            </EditorialLink>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}
