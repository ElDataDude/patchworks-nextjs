import { partnerExpertise } from "@/data/positioning";
import EditorialLink from "../Common/EditorialLink";

export default function DifferentiatorSection() {
  return (
    <section className="section-space rule-section enterprise-expertise">
      <div className="site-container editorial-layout">
        <h2 className="section-heading editorial-anchor">
          Two perspectives. One clear view.
        </h2>
        <div className="editorial-content">
          <p className="editorial-intro">
            Technology has to stand up to technical scrutiny and commercial
            judgement. Our partnership brings both to the same conversation.
          </p>
          {partnerExpertise.map((expertise, index) => (
            <article
              className="numbered-item"
              key={expertise.title}
              data-reveal
            >
              <span className="item-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="item-title">{expertise.title}</h3>
                <p>{expertise.text}</p>
              </div>
            </article>
          ))}
          <EditorialLink href="/about">Our partnership</EditorialLink>
        </div>
      </div>
    </section>
  );
}
