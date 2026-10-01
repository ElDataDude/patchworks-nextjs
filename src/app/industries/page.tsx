import PageIntro from "@/components/Common/PageIntro";
import EditorialLink from "@/components/Common/EditorialLink";
import Industries from "@/components/Industries";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import BookingWidget from "@/components/Common/BookingWidget";
import UseCaseCard from "@/components/Catalogue/UseCaseCard";
import { useCases } from "@/data/use-cases";
import "../../styles/core-pages.css";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/industries");

export default function IndustriesPage() {
  return (
    <div className="core-page">
      <section className="site-container">
        <PageIntro
          title="Industries & use cases"
          description="Cross-border operations, complex systems and customer obligations change what a good AI decision looks like. We help leadership and delivery teams assess opportunities in the context of how their organisation actually works, and show working examples along the way."
          image="/images/editorial/industries-system.webp"
          imageAlt="Connected abstract systems illustrating enterprise complexity"
        >
          <nav className="enterprise-service-nav" aria-label="On this page">
            <EditorialLink href="#industries" quiet>
              Industries we serve
            </EditorialLink>
            <EditorialLink href="#use-cases" quiet>
              Use cases you can see working
            </EditorialLink>
          </nav>
        </PageIntro>
      </section>
      <Industries />
      <section
        id="use-cases"
        className="section-space rule-section catalogue-use-cases"
      >
        <div className="site-container">
          <div className="editorial-layout">
            <h2 className="section-heading catalogue-section-heading">
              Use cases
            </h2>
            <div className="editorial-content">
              <p className="editorial-intro">
                Each use case is built on a Patchworks app we can demonstrate,
                using synthetic or fictional data. They show what AI can do in a
                real workflow, and where a person still needs to decide.
              </p>
              <EditorialLink href="/use-cases">All use cases</EditorialLink>
            </div>
          </div>
          <div className="use-case-grid">
            {useCases.map((useCase) => (
              <UseCaseCard useCase={useCase} key={useCase.slug} />
            ))}
          </div>
        </div>
      </section>
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
      </section>
    </div>
  );
}
