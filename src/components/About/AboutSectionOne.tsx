import {
  BOOKING_LABEL,
  partnerExpertise,
  pillars,
  relationshipDisclosure,
} from "@/data/positioning";
import BookingWidget from "../Common/BookingWidget";
import EditorialLink from "../Common/EditorialLink";
import PageIntro from "../Common/PageIntro";

export default function AboutSectionOne() {
  return (
    <>
      <section className="site-container enterprise-about-intro">
        <PageIntro
          title={
            <>
              About <span className="whitespace-nowrap">Patchworks AI</span>
            </>
          }
          description="Our partnership brings together hands-on AI engineering and enterprise implementation experience with technology investment and board-level judgement. We examine the technology, the business case and the realities of delivery together, giving clients clear advice and practical support."
          image="/images/editorial/about-bridge.webp"
          imageWidth={1254}
          imageHeight={1254}
          imageAlt="An abstract bridge joining strategy and technical execution"
        />
      </section>
      <section id="about" className="section-space enterprise-about">
        <div className="site-container editorial-layout">
          <h2 className="section-heading editorial-anchor">
            The value of two perspectives.
          </h2>
          <div className="editorial-content">
            {partnerExpertise.map((expertise, index) => (
              <article className="numbered-item" key={expertise.title}>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="item-title">{expertise.title}</h3>
                  <p>{expertise.text}</p>
                </div>
              </article>
            ))}
            <p className="body-copy enterprise-about-summary">
              Together, those perspectives connect what AI makes possible with
              what an enterprise should do about it. We work directly with your
              leadership and delivery teams, with responsibility agreed around
              the needs of each engagement.
            </p>
          </div>
        </div>
      </section>
      <section className="section-space rule-section enterprise-about-work">
        <div className="site-container editorial-layout">
          <h2 className="section-heading editorial-anchor">
            Clear counsel. Practical support.
          </h2>
          <div className="editorial-content">
            {pillars.map((pillar) => (
              <div className="enterprise-about-pillar" key={pillar.id}>
                <h3 className="item-title">{pillar.title}</h3>
                <p className="body-copy">{pillar.summary}</p>
                <EditorialLink href={pillar.href}>
                  {pillar.id === "ai-counsel"
                    ? "Explore AI counsel"
                    : "Explore review and delivery"}
                </EditorialLink>
              </div>
            ))}
            <p className="body-copy enterprise-disclosure">
              {relationshipDisclosure}
            </p>
            <BookingWidget buttonText={BOOKING_LABEL} />
          </div>
        </div>
      </section>
    </>
  );
}
