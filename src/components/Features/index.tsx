import { pillars } from "@/data/positioning";
import EditorialLink from "../Common/EditorialLink";
export default function Features() {
  return (
    <section
      id="how-we-help"
      className="home-services enterprise-pillars section-space"
    >
      <div className="site-container editorial-layout">
        <h2 className="section-heading editorial-anchor">How we help</h2>
        <div className="editorial-content">
          <p className="editorial-intro">
            Clear counsel on where to go. Practical support to get there. Two
            ways to work with us, shaped around the decisions and delivery
            challenges your team faces.
          </p>
          <div>
            {pillars.map((pillar, index) => (
              <article className="numbered-item" key={pillar.id} data-reveal>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="item-title">{pillar.title}</h3>
                  <p>{pillar.summary}</p>
                  <EditorialLink href={pillar.href}>
                    {index === 0
                      ? "Explore AI counsel"
                      : "Explore review and delivery"}
                  </EditorialLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
