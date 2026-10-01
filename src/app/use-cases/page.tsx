import PageIntro from "@/components/Common/PageIntro";
import Breadcrumbs from "@/components/Catalogue/Breadcrumbs";
import CtaBand from "@/components/Catalogue/CtaBand";
import UseCaseCard from "@/components/Catalogue/UseCaseCard";
import { industries } from "@/data/industries";
import { useCases, casesForIndustry } from "@/data/use-cases";
import { hrefForIndustry } from "@/data/navigation";
import { createPageMetadata } from "@/data/seo";
import Link from "next/link";
import "../../styles/core-pages.css";

export const metadata = createPageMetadata("/use-cases");

export default function UseCasesPage() {
  const featured = useCases.filter((useCase) => useCase.featured);
  const others = useCases.filter((useCase) => !useCase.featured);
  return (
    <div className="core-page catalogue-page">
      <section className="site-container">
        <Breadcrumbs
          trail={[
            ["Home", "/"],
            ["Use cases", "/use-cases"],
          ]}
        />
        <PageIntro
          title="Use cases"
          description="Working examples of AI in regulated, high-stakes and resource-stretched settings. Each one runs on a Patchworks app we can demonstrate with synthetic data, and each is clear about where a person still needs to decide."
        />
      </section>
      <section className="section-space rule-section catalogue-use-cases">
        <div className="site-container">
          <h2 className="section-heading catalogue-section-heading">
            Featured
          </h2>
          <div className="use-case-grid use-case-grid--featured">
            {featured.map((useCase) => (
              <UseCaseCard useCase={useCase} key={useCase.slug} />
            ))}
          </div>
        </div>
      </section>
      <section className="section-space rule-section catalogue-use-cases">
        <div className="site-container">
          <h2 className="section-heading catalogue-section-heading">
            All use cases
          </h2>
          <div className="use-case-grid">
            {others.map((useCase) => (
              <UseCaseCard useCase={useCase} key={useCase.slug} />
            ))}
          </div>
        </div>
      </section>
      <section className="section-space rule-section">
        <div className="site-container">
          <h2 className="section-heading catalogue-section-heading">
            By industry
          </h2>
          <ul className="catalogue-industry-index">
            {industries.map((industry) => (
              <li key={industry.slug}>
                <Link href={hrefForIndustry(industry.slug)}>{industry.title}</Link>
                <span>{casesForIndustry(industry.slug).length} use cases</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand
        heading="See one working."
        text="Tell us which use case matters to you and we will arrange a demonstration with synthetic data, followed by a conversation about your own context."
        context={{ intent: "demo" }}
      />
    </div>
  );
}
