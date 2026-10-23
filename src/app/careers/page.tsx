import PageIntro from "@/components/Common/PageIntro";
import Careers from "@/components/Careers";
import "../../styles/core-pages.css";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/careers");

export default function CareersPage() {
  return (
    <div className="core-page">
      <section className="site-container">
        <PageIntro
          title="Join Our Team"
          description="We're building a team of exceptional individuals who are passionate about delivering pragmatic AI solutions with measurable business impact."
          image="/images/editorial/careers-system.webp"
          imageAlt="An abstract network of connected capability stations"
        />
      </section>
      <Careers />
    </div>
  );
}
