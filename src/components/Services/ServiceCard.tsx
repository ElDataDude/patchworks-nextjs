import AvailabilityDisplay from "../Common/AvailabilityDisplay";
import EditorialLink from "../Common/EditorialLink";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  idealFor: string;
  ctaLink: string;
}

export default function ServiceCard({
  number,
  title,
  description,
  price,
  features,
  idealFor,
  ctaLink,
}: ServiceCardProps) {
  return (
    <article className="numbered-item service-row">
      <span className="item-number" aria-hidden="true">
        {number}
      </span>
      <div className="service-row-main">
        <h2 className="item-title">{title}</h2>
        <p>{description}</p>
        <div className="service-details">
          <div>
            <h4>Features:</h4>
            <ul className="detail-list">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Ideal for:</h4>
            <p>{idealFor}</p>
          </div>
        </div>
      </div>
      <aside
        className="service-commercial"
        aria-label={`${title} pricing and availability`}
      >
        <p className="service-price">{price}</p>
        <AvailabilityDisplay productId={title} />
        <EditorialLink href={ctaLink}>Book Free Consultation</EditorialLink>
      </aside>
    </article>
  );
}
