import PageIntro from "../Common/PageIntro";

const capabilities = [
  "Executive-Level AI Strategy",
  "Rapid ROI Demonstration",
  "Business-First Approach",
  "Technology-Agnostic Solutions",
  "Team Capability Building",
  "Proven Implementation Methodology",
];

export default function AboutSectionOne() {
  return (
    <>
      <section className="site-container">
        <PageIntro
          title={
            <>
              About <span className="whitespace-nowrap">Patchworks AI</span>
            </>
          }
          description="We bridge the gap between executive vision and technical execution, delivering AI solutions that generate measurable returns within weeks, not years. Our technology-agnostic approach ensures you get the right solution for your specific business needs."
          image="/images/editorial/about-bridge.webp"
          imageWidth={1254}
          imageHeight={1254}
          imageAlt="An abstract bridge joining strategy and technical execution"
        />
      </section>
      <section id="about" className="section-space rule-section">
        <div className="site-container">
          <div className="about-capabilities">
            {capabilities.map((capability, index) => (
              <article className="about-capability" key={capability}>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{capability}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
