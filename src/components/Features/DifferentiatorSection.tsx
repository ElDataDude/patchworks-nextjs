const items = [
  {
    title: "Fractional Head-of-AI",
    text: "Executive-level AI leadership without the full-time cost. Our fractional model gives you strategic guidance, team coaching, and implementation expertise at 30% the cost of a full-time hire.",
  },
  {
    title: "Pragmatic, ROI-First Delivery",
    text: "We focus exclusively on AI applications with measurable financial returns. Our approach prioritizes quick wins that build momentum while establishing the foundation for sustainable long-term value.",
  },
  {
    title: "Executive + Engineer Fluency",
    text: "We bridge the gap between executive vision and technical execution, speaking both languages fluently. This dual communication capability ensures alignment between business goals and technical implementation.",
  },
];
export default function DifferentiatorSection() {
  return (
    <section className="section-space rule-section">
      <div className="site-container editorial-layout">
        <h2 className="section-heading editorial-anchor">
          What Makes Us Different
        </h2>
        <div>
          <p className="editorial-intro">
            Our unique approach combines strategic vision with pragmatic
            execution, delivering measurable AI results where others only
            promise potential.
          </p>
          {items.map((item, i) => (
            <article className="numbered-item" key={item.title} data-reveal>
              <span className="item-number" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="item-title">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
