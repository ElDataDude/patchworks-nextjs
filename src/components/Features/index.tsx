import featuresData from "./featuresData";
export default function Features() {
  return (
    <section id="features" className="home-services section-space">
      <div className="site-container editorial-layout">
        <h2 className="section-heading editorial-anchor">
          Our
          <br /> Services
        </h2>
        <div className="editorial-content">
          <p className="editorial-intro">
            From strategic guidance to hands-on implementation, our services are
            designed for executives who need AI solutions that deliver
            measurable ROI within weeks, not years. Each service is built on our
            pragmatic, business-first approach.
          </p>
          <div>
            {featuresData.map((feature, index) => (
              <article className="numbered-item" key={feature.id} data-reveal>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="item-title">{feature.title}</h3>
                  <p>{feature.paragraph}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
