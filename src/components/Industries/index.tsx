const industries = [
  {
    title: "Financial Services & Retail Banking",
    description:
      "Customer operations, internal knowledge and risk workflows all present opportunities for AI. The right decisions account for sensitive data, existing controls and the complexity of delivering across markets and business lines.",
  },
  {
    title: "Insurance",
    description:
      "From underwriting and claims to distribution and service, AI needs to work within the realities of insurance. We help teams examine where it can support decisions and workflows, how proposals stand up to scrutiny and what implementation requires.",
  },
  {
    title: "Consumer Goods",
    description:
      "Large brand portfolios connect commercial decisions, operations and customer insight across regions. We help teams assess AI opportunities against those dependencies and focus effort where there is a clear business case.",
  },
  {
    title: "Supply Chain & Logistics",
    description:
      "Networks of suppliers, systems and geographies make promising demonstrations difficult to put into practice. We help teams review AI for planning, operational knowledge and exception handling in the context of their data and existing workflows.",
  },
  {
    title: "Audit & Professional Services",
    description:
      "Knowledge-intensive work demands careful judgement about evidence, confidentiality and accountability. We help teams evaluate AI across research, document workflows and client delivery while keeping professional judgement central.",
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
