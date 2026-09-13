import EditorialLink from "../Common/EditorialLink";

interface JobCardProps {
  number: string;
  title: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export default function JobCard({
  number,
  title,
  location,
  type,
  description,
  responsibilities,
  requirements,
}: JobCardProps) {
  return (
    <article className="job-row">
      <span className="item-number" aria-hidden="true">
        {number}
      </span>
      <header>
        <h3 className="item-title">{title}</h3>
        <p className="job-meta">
          <span>{location}</span>
          <span>{type}</span>
        </p>
      </header>
      <div className="job-body">
        <p>{description}</p>
        <div className="job-columns">
          <div>
            <h4>Responsibilities:</h4>
            <ul className="detail-list">
              {responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Requirements:</h4>
            <ul className="detail-list">
              {requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <EditorialLink href="/contact">Apply for this position</EditorialLink>
      </div>
    </article>
  );
}
