import PageIntro from "@/components/Common/PageIntro";
import Industries from "@/components/Industries";
import UseCases from "@/components/UseCases";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import BookingWidget from "@/components/Common/BookingWidget";
import "../../styles/core-pages.css";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/industries");

export default function IndustriesPage() {
  return (
    <div className="core-page">
      <section className="site-container">
        <PageIntro
          title="AI at enterprise scale"
          description="Cross-border operations, complex systems and customer obligations change what a good AI decision looks like. We help leadership and delivery teams assess opportunities in the context of how their organisation actually works."
          image="/images/editorial/industries-system.webp"
          imageAlt="Connected abstract systems illustrating enterprise complexity"
        />
      </section>
      <Industries />
      <section className="section-space rule-section">
        <div className="site-container editorial-layout">
          <h2 className="section-heading">Start with your context.</h2>
          <div className="editorial-content">
            <p className="editorial-intro">
              Tell us what your organisation is trying to achieve, where its AI
              programmes stand and which decisions need a clearer answer.
            </p>
            <BookingWidget />
          </div>
        </div>
      </section>
      <section className="retained-examples section-space rule-section">
        <div className="site-container">
          <h2 className="section-heading">More to explore</h2>
        </div>
        <details id="case-study" className="retained-disclosure">
          <summary className="site-container retained-summary">
            Read the drilling analytics case study
          </summary>
          <div className="retained-body">
            <AboutSectionTwo />
          </div>
        </details>
        <details id="use-cases" className="retained-disclosure">
          <summary className="site-container retained-summary">
            Explore AI use cases
          </summary>
          <div className="retained-body">
            <UseCases />
          </div>
        </details>
      </section>
    </div>
  );
}
