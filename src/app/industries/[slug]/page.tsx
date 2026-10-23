import { notFound } from "next/navigation";
import Link from "next/link";
import PageIntro from "@/components/Common/PageIntro";
import Breadcrumbs from "@/components/Catalogue/Breadcrumbs";
import CtaBand from "@/components/Catalogue/CtaBand";
import UseCaseCard from "@/components/Catalogue/UseCaseCard";
import { industries, industryBySlug } from "@/data/industries";
import { hrefForIndustry } from "@/data/navigation";
import { casesForIndustry } from "@/data/use-cases";
import { createRouteMetadata } from "@/data/seo";
import "../../../styles/core-pages.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const industry = industryBySlug((await params).slug);
  if (!industry) return {};
  return createRouteMetadata({
    path: hrefForIndustry(industry.slug),
    title: `${industry.title} | Industries | Patchworks AI`,
    description: `Enterprise AI counsel, delivery and working use cases for ${industry.title}. ${industry.summary}`,
    index: true,
    follow: true,
  });
}

export default async function IndustryPage({ params }: Params) {
  const industry = industryBySlug((await params).slug);
  if (!industry) notFound();
  const useCases = casesForIndustry(industry.slug);
  const others = industries.filter((item) => item.slug !== industry.slug);
  return (
    <div className="core-page catalogue-page">
      <section className="site-container">
        <Breadcrumbs
          trail={[
            ["Home", "/"],
            ["Industries", "/industries"],
            [industry.title, hrefForIndustry(industry.slug)],
          ]}
        />
        <PageIntro title={industry.title} description={industry.description} />
      </section>
      <section className="section-space rule-section">
        <div className="site-container editorial-layout">
          <h2 className="section-heading catalogue-section-heading">
            What needs care
          </h2>
          <ol className="editorial-content catalogue-steps">
            {industry.considerations.map((item, index) => (
              <li className="numbered-item" key={item}>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section
        id="use-cases"
        className="section-space rule-section catalogue-use-cases"
      >
        <div className="site-container">
          <h2 className="section-heading catalogue-section-heading">
            Use cases for {industry.title}
          </h2>
          <div className="use-case-grid">
            {useCases.map((useCase) => (
              <UseCaseCard useCase={useCase} key={useCase.slug} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        heading="See it working."
        text={`We can walk your team through these use cases with synthetic data, then discuss what an equivalent would need in your ${industry.title.toLowerCase()} organisation.`}
        context={{
          intent: "demo",
          industry: industry.slug,
          topic: industry.title,
        }}
      />
      <section className="section-space rule-section">
        <div className="site-container">
          <h2 className="catalogue-subheading">Other industries</h2>
          <ul className="catalogue-tags catalogue-tags--large">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={hrefForIndustry(item.slug)}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
