const industries = [
  {
    title: "Oil & Gas",
    description:
      "Specialized expertise in drilling analytics, operational optimization, and predictive maintenance. We've helped energy companies reduce downtime, optimize production, and improve safety through AI-driven insights.",
  },
  {
    title: "Professional Services",
    description:
      "Transforming how consulting, legal, and accounting firms deliver value through AI. Our solutions help professional services firms automate routine tasks, enhance knowledge work, and deliver more value to clients with fewer billable hours.",
  },
  {
    title: "Financial Services",
    description:
      "Enhancing financial operations through AI-powered analytics, risk assessment, and process automation. We help financial institutions improve decision-making, reduce operational costs, and enhance customer experiences.",
  },
  {
    title: "Manufacturing",
    description:
      "Optimizing production processes, quality control, and supply chain management through AI. Our manufacturing solutions reduce waste, improve quality, and increase throughput while reducing operational costs.",
  },
  {
    title: "Healthcare",
    description:
      "Enhancing patient care and operational efficiency through AI-powered solutions. We help healthcare providers improve diagnostics, optimize resource allocation, and streamline administrative processes while maintaining compliance.",
  },
  {
    title: "Retail & E-commerce",
    description:
      "Transforming customer experiences and operational efficiency through AI. Our retail solutions optimize inventory management, personalize customer experiences, and streamline fulfillment operations for increased sales and reduced costs.",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="section-space rule-section">
      <div className="site-container core-list">
        {industries.map((industry, index) => (
          <article className="numbered-item sector-row" key={industry.title}>
            <span className="item-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="item-title">{industry.title}</h2>
            <p>{industry.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
