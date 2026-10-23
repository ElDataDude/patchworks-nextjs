import ResponsiveImage from "../Common/ResponsiveImage";
export default function AboutSectionTwo() {
  return (
    <section className="section-space">
      <div className="site-container">
        <h2 className="section-heading case-study-heading">
          Case Study: Oil &amp; Gas Drilling Analytics
        </h2>
        <div className="case-study-grid">
          <div className="media-frame" data-reveal>
            <ResponsiveImage
              src="/images/editorial/drilling-study.webp"
              alt="Conceptual illustration of geological layers connected to transparent analytical systems"
              width={1532}
              height={1026}
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
          <div>
            <article>
              <p>
                A major energy company was losing £2.3M annually due to drilling
                inefficiencies. Their engineers spent 15+ hours weekly on manual
                Excel analysis, resulting in delayed decision-making and missed
                optimization opportunities that directly impacted the bottom
                line.
              </p>
            </article>
            <article>
              <h3>Our Approach</h3>
              <p>
                Rather than building a complex solution requiring new hires, we
                empowered existing engineers as citizen developers. We
                implemented a pragmatic AI solution that automated data
                collection, applied machine learning to identify optimization
                opportunities, and created real-time dashboards that translated
                technical data into actionable business insights.
              </p>
            </article>
            <article>
              <h3>The Results</h3>
              <p>
                Within 90 days, our solution delivered:{" "}
                <strong>85% reduction</strong> in manual data processing time,{" "}
                <strong>3.2x faster</strong> identification of drilling
                anomalies, and <strong>£1.2M annual cost savings</strong> from
                optimized operations. The client achieved full ROI within 5
                months, with zero additional headcount required.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
