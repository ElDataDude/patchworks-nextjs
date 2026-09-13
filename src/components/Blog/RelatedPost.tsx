import Image from "next/image";
import Link from "next/link";

const RelatedPost = ({
  image,
  slug,
  title,
  date,
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
}) => {
  return (
    <div className="flex items-center gap-5">
      <div className="shrink-0">
        <div className="media-frame relative h-[60px] w-[70px] sm:h-[75px] sm:w-[85px]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="85px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="w-full">
        <h5>
          <Link
            href={slug}
            className="block text-base leading-snug text-[#121723] hover:text-[#d16013]"
          >
            {title}
          </Link>
        </h5>
        <p className="text-xs font-medium text-body-color">{date}</p>
      </div>
    </div>
  );
};

export default RelatedPost;
