import PageIntro from "@/components/Common/PageIntro";
import Services from "@/components/Services";
import EditorialLink from "@/components/Common/EditorialLink";
import { pillars } from "@/data/positioning";
import "../../styles/core-pages.css";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/services");

export default function ServicesPage() {
  return (
    <div className="core-page">
      <section className="site-container">
        <PageIntro
          title="Clear direction. Practical delivery."
          description="Two ways to work with Patchworks AI: counsel on the decisions that matter, and hands-on support to carry them through. Each engagement starts with your priorities and the work already under way."
          image="/images/editorial/services-system.webp"
          imageAlt="Connected abstract platforms illustrating an enterprise system"
        >
          <nav
            className="enterprise-service-nav"
            aria-label="Explore our services"
          >
            {pillars.map((pillar) => (
              <EditorialLink href={`#${pillar.id}`} key={pillar.id} quiet>
                {pillar.title}
              </EditorialLink>
            ))}
          </nav>
        </PageIntro>
      </section>
      <Services />
    </div>
  );
}
