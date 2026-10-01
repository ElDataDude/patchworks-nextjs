import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AppBadge from "@/components/Catalogue/AppBadge";
import Breadcrumbs from "@/components/Catalogue/Breadcrumbs";
import CtaBand from "@/components/Catalogue/CtaBand";
import OpenAppSlot from "@/components/Catalogue/OpenAppSlot";
import ShowcasePanel from "@/components/Catalogue/ShowcasePanel";
import UseCaseCard from "@/components/Catalogue/UseCaseCard";
import { appBySlug, openableAppSlugs } from "@/data/apps";
import { hrefForIndustry, hrefForUseCase } from "@/data/navigation";
import { pillars } from "@/data/positioning";
import { createRouteMetadata } from "@/data/seo";
import {
  industriesFor,
  relatedUseCases,
  findUseCase,
  useCases,
} from "@/data/use-cases";
import { enquiryHref, isEnquiryFormEnabled } from "@/lib/enquiry-links";
import "../../../styles/core-pages.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const useCase = findUseCase((await params).slug);
  if (!useCase) return {};
  return createRouteMetadata({
    path: hrefForUseCase(useCase.slug),
    title: `${useCase.title} | Use Cases | Patchworks AI`,
    description: `${useCase.summary} An enterprise AI use case from Patchworks AI.`,
    index: true,
    follow: true,
  });
}

export default async function UseCasePage({ params }: Params) {
  const useCase = findUseCase((await params).slug);
  if (!useCase) notFound();
  const industries = industriesFor(useCase);
  const related = relatedUseCases(useCase);
  const formEnabled = isEnquiryFormEnabled();
  const openable = openableAppSlugs();
  const singleIndustry = industries.length === 1 ? industries[0] : undefined;
  return (
    <div className="core-page catalogue-page">
      <section className="site-container">
        <div className="page-hero page-hero-grid catalogue-hero">
          <div>
            <Breadcrumbs
              trail={[
                ["Home", "/"],
                ["Use cases", "/use-cases"],
                [useCase.title, hrefForUseCase(useCase.slug)],
              ]}
            />
            <h1 className="page-title">{useCase.title}</h1>
            <p className="body-copy">{useCase.summary}</p>
            <div className="use-case-card-apps catalogue-hero-apps">
              {Array.from(new Set(useCase.apps.map((link) => link.app))).map(
                (slug) => {
                  const app = appBySlug(slug);
                  return app ? <AppBadge app={app} key={slug} /> : null;
                },
              )}
            </div>
          </div>
          <ShowcasePanel showcase={useCase.showcase} title={useCase.title} />
        </div>
      </section>
      <section className="section-space rule-section">
        <div className="site-container editorial-layout">
          <h2 className="section-heading catalogue-section-heading">The job</h2>
          <div className="editorial-content">
            <p className="editorial-intro catalogue-lead">{useCase.job}</p>
          </div>
        </div>
      </section>
      <section className="section-space rule-section">
        <div className="site-container editorial-layout">
          <h2 className="section-heading catalogue-section-heading">
            How it works
          </h2>
          <ol className="editorial-content catalogue-steps">
            {useCase.howItWorks.map((step, index) => (
              <li className="numbered-item" key={step}>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-space rule-section">
        <div className="site-container catalogue-columns">
          <div>
            <h2 className="catalogue-subheading">What it shows</h2>
            <ul className="detail-list">
              {useCase.shows.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="catalogue-subheading">Where it stops</h2>
            <ul className="detail-list">
              {useCase.stops.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section-space rule-section" id="apps">
        <div className="site-container editorial-layout">
          <h2 className="section-heading catalogue-section-heading">
            See it in the app
          </h2>
          <ul className="editorial-content catalogue-app-links">
            {useCase.apps.map((link) => {
              const app = appBySlug(link.app);
              if (!app) return null;
              const intent = link.ctaKind;
              return (
                <li key={`${link.app}-${link.label}`}>
                  <div>
                    <p className="catalogue-app-link-label">{link.label}</p>
                    <AppBadge app={app} />
                  </div>
                  <div className="catalogue-app-link-actions">
                    <a
                      className="text-link text-link--quiet"
                      href={enquiryHref(
                        {
                          intent,
                          useCase: useCase.slug,
                          industry: singleIndustry?.slug,
                          app: app.slug,
                          topic: `${useCase.title} (${app.name})`,
                        },
                        formEnabled,
                      )}
                      data-cta={
                        intent === "access" ? "request-access" : "request-demo"
                      }
                    >
                      {intent === "access"
                        ? "Request access"
                        : "Request a demo"}
                    </a>
                    {openable.includes(app.slug) && link.launchPath && (
                      <OpenAppSlot
                        app={app.slug}
                        launchPath={link.launchPath}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <section className="section-space rule-section">
        <div className="site-container catalogue-columns">
          <div>
            <h2 className="catalogue-subheading">Industries</h2>
            <ul className="catalogue-tags catalogue-tags--large">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link href={hrefForIndustry(industry.slug)}>
                    {industry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="catalogue-subheading">How we deliver it</h2>
            <ul className="catalogue-pillars">
              {pillars.map((pillar) => (
                <li key={pillar.id}>
                  <Link href={pillar.href}>
                    {pillar.title}
                    <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                  </Link>
                  <p>{pillar.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <CtaBand
        heading="See it working."
        text="We demonstrate every use case with synthetic data, then discuss what an equivalent would need inside your organisation: data, controls, people and delivery."
        context={{
          intent: "demo",
          useCase: useCase.slug,
          industry: singleIndustry?.slug,
          topic: useCase.title,
        }}
      />
      {related.length > 0 && (
        <section className="section-space rule-section catalogue-use-cases">
          <div className="site-container">
            <h2 className="section-heading catalogue-section-heading">
              Related use cases
            </h2>
            <div className="use-case-grid">
              {related.map((item) => (
                <UseCaseCard useCase={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
