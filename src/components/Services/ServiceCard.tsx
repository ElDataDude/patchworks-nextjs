interface ServiceCardProps {
  id: string;
  number: string;
  title: string;
  summary: string;
  questions: readonly string[];
  activities: readonly string[];
  outputs: readonly string[];
}

export default function ServiceCard({
  id,
  number,
  title,
  summary,
  questions,
  activities,
  outputs,
}: ServiceCardProps) {
  const sections = [
    { title: "Questions we help answer", items: questions },
    { title: "How we work", items: activities },
    { title: "What you leave with", items: outputs },
  ];

  return (
    <article
      id={id}
      className="enterprise-service"
      aria-labelledby={`${id}-title`}
    >
      <div className="enterprise-service-heading">
        <span className="item-number" aria-hidden="true">
          {number}
        </span>
        <div>
          <h2 id={`${id}-title`} className="enterprise-service-title">
            {title}
          </h2>
          <p className="body-copy">{summary}</p>
        </div>
      </div>
      <div className="enterprise-service-details">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="enterprise-label">{section.title}</h3>
            <ul className="detail-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
