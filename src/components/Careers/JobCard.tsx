import Link from "next/link";

interface JobCardProps {
  title: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

const JobCard = ({
  title,
  location,
  type,
  description,
  responsibilities,
  requirements,
}: JobCardProps) => {
  return (
    <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
      <h3 className="mb-3 text-xl font-bold text-black dark:text-white">
        {title}
      </h3>
      
      <div className="mb-5 flex items-center space-x-5">
        <div className="flex items-center text-sm text-body-color dark:text-body-color-dark">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="mr-2 fill-current"
          >
            <path d="M14 6.667v6.666c0 .734-.6 1.334-1.333 1.334H3.333A1.334 1.334 0 012 13.333V6.667c0-.734.6-1.334 1.333-1.334h9.334c.733 0 1.333.6 1.333 1.334z"></path>
            <path d="M4.667 5.333V2.667A2.667 2.667 0 017.333 0h1.334a2.667 2.667 0 012.666 2.667v2.666"></path>
          </svg>
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-sm text-body-color dark:text-body-color-dark">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="mr-2 fill-current"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>
            <path d="M8 3.5c-.4 0-.8.3-.8.8v3.5c0 .4.3.8.8.8s.8-.3.8-.8V4.2c0-.4-.4-.7-.8-.7z"></path>
            <path d="M8 9.5c-.4 0-.8.3-.8.8s.3.8.8.8.8-.3.8-.8-.4-.8-.8-.8z"></path>
          </svg>
          <span>{type}</span>
        </div>
      </div>
      
      <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
        {description}
      </p>
      
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
          Responsibilities:
        </h4>
        <ul className="list-inside list-disc space-y-1.5">
          {responsibilities.map((item, index) => (
            <li key={index} className="text-sm text-body-color dark:text-body-color-dark">
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
          Requirements:
        </h4>
        <ul className="list-inside list-disc space-y-1.5">
          {requirements.map((item, index) => (
            <li key={index} className="text-sm text-body-color dark:text-body-color-dark">
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <Link
        href="/contact"
        className="flex w-full items-center justify-center rounded-sm bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
      >
        Apply for this position
      </Link>
    </div>
  );
};

export default JobCard;
