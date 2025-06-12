import Link from "next/link";
import AvailabilityDisplay from "../Common/AvailabilityDisplay";
import BookingWidget from "../Common/BookingWidget";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  idealFor: string;
  cta: string;
  ctaLink: string;
}

const ServiceCard = ({
  title,
  description,
  price,
  features,
  idealFor,
  cta,
  ctaLink,
}: ServiceCardProps) => {
  return (
    <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark xl:p-10">
      <div className="flex items-center justify-between">
        <h3 className="mb-3 text-xl font-bold text-black dark:text-white sm:text-2xl">
          {title}
        </h3>
        <div className="flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="fill-current"
          >
            <path
              opacity="0.5"
              d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30ZM35 30C37.75 30 40 32.25 40 35C40 37.75 37.75 40 35 40C32.25 40 30 37.75 30 35C30 32.25 32.25 30 35 30ZM35 15C37.75 15 40 17.25 40 20C40 22.75 37.75 25 35 25C32.25 25 30 22.75 30 20C30 17.25 32.25 15 35 15Z"
            />
            <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15ZM20 0C22.75 0 25 2.25 25 5C25 7.75 22.75 10 20 10C17.25 10 15 7.75 15 5C15 2.25 17.25 0 20 0ZM5 30C7.75 30 10 32.25 10 35C10 37.75 7.75 40 5 40C2.25 40 0 37.75 0 35C0 32.25 2.25 30 5 30ZM5 15C7.75 15 10 17.25 10 20C10 22.75 7.75 25 5 25C2.25 25 0 22.75 0 20C0 17.25 2.25 15 5 15ZM5 0C7.75 0 10 2.25 10 5C10 7.75 7.75 10 5 10C2.25 10 0 7.75 0 5C0 2.25 2.25 0 5 0ZM35 0C37.75 0 40 2.25 40 5C40 7.75 37.75 10 35 10C32.25 10 30 7.75 30 5C30 2.25 32.25 0 35 0Z" />
          </svg>
        </div>
      </div>
      <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
        {description}
      </p>
      
      <div className="mb-6 border-b border-body-color border-opacity-10 pb-6 dark:border-white dark:border-opacity-10">
        <h4 className="text-lg font-semibold text-primary">
          {price}
        </h4>
        <AvailabilityDisplay productId={title} />
      </div>
      
      <div className="mb-6">
        <h5 className="mb-3 text-sm font-semibold text-black dark:text-white">
          Features:
        </h5>
        <ul className="space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-body-color dark:text-body-color-dark flex items-center">
              <span className="mr-2 text-primary">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h5 className="mb-3 text-sm font-semibold text-black dark:text-white">
          Ideal for:
        </h5>
        <p className="text-sm text-body-color dark:text-body-color-dark">
          {idealFor}
        </p>
      </div>
      
      <div className="flex w-full">
        <BookingWidget 
          variant="primary"
          className="w-full"
          buttonText="Book Free Consultation"
        />
      </div>
    </div>
  );
};

export default ServiceCard;
