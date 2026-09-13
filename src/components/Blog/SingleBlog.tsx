import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { title, image, paragraph, author, tags, publishDate } = blog;
  return (
    <article className="rule-section py-8 first:border-t-0 first:pt-0">
      <div className="grid gap-7 md:grid-cols-[minmax(220px,0.9fr)_1.1fr] md:items-start md:gap-10">
        <Link href="/blog-details" className="group block w-full">
          <span className="media-frame relative block aspect-[16/10] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </span>
        </Link>
        <div>
          <p className="eyebrow mb-4 text-[#626875]">{tags[0]}</p>
          <h3 className="mb-4 text-[clamp(28px,3vw,44px)] leading-[1.05]">
            <Link
              href="/blog-details"
              className="block text-inherit hover:text-[#d16013]"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 max-w-2xl text-base leading-7 text-[#4b5260]">
            {paragraph}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#E3E8EF] pt-4 text-xs text-[#626875]">
            <span>By {author.name}</span>
            <span>{author.designation}</span>
            <span>
              <span>Date</span> {publishDate}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SingleBlog;
