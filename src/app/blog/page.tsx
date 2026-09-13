import PageIntro from "@/components/Common/PageIntro";
import BookingCTA from "@/components/Common/BookingCTA";
import SingleBlog from "@/components/Blog/SingleBlog";
import blogData from "@/components/Blog/blogData";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Insights Blog | Patchworks AI",
  description:
    "Explore the latest insights, trends, and practical advice on AI implementation, strategy, and ROI from the experts at Patchworks AI.",
};

const Blog = () => {
  const [featured, ...articles] = blogData;

  return (
    <div>
      <div className="site-container">
        <PageIntro
          title="AI Insights Blog"
          description="Stay informed with the latest AI trends, implementation strategies, and success stories. Our experts share practical advice to help you maximize ROI from your AI investments."
        >
          <div className="mt-9 flex flex-col items-start gap-4">
            <BookingCTA text="Get Personalized AI Insights" />
            <p className="text-sm text-[#626875]">
              Practical AI insights for business leaders
            </p>
          </div>
        </PageIntro>

        <section
          className="section-space rule-section"
          aria-labelledby="latest-insights"
        >
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <h2
                id="latest-insights"
                className="section-heading text-[clamp(42px,5vw,72px)]"
              >
                Our Latest Blogs
              </h2>
            </div>
          </div>

          <article className="grid gap-8 border-b border-[#E3E8EF] pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <Link href="/blog-details" className="group block w-full">
              <span className="media-frame relative block aspect-[16/9] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </span>
            </Link>
            <div className="flex flex-col justify-end">
              <p className="eyebrow mb-5 text-[#d16013]">{featured.tags[0]}</p>
              <h3 className="mb-5 text-[clamp(34px,4vw,60px)] leading-[1.02]">
                <Link
                  href="/blog-details"
                  className="block text-inherit hover:text-[#d16013]"
                >
                  {featured.title}
                </Link>
              </h3>
              <p className="mb-7 text-base leading-7 text-[#4b5260]">
                {featured.paragraph}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E3E8EF] pt-4 text-xs text-[#626875]">
                <span>By {featured.author.name}</span>
                <span>{featured.author.designation}</span>
                <span>
                  <span>Date</span> {featured.publishDate}
                </span>
              </div>
            </div>
          </article>

          <div className="mt-2">
            {articles.map((blog) => (
              <SingleBlog key={blog.id} blog={blog} />
            ))}
          </div>

          <nav
            aria-label="Blog pagination"
            className="mt-14 flex flex-wrap items-center gap-6 border-t border-[#E3E8EF] pt-6 text-sm"
          >
            <a href="#0" className="text-link text-link--quiet">
              Prev
            </a>
            <a href="#0" className="text-link text-link--quiet">
              1
            </a>
            <a href="#0" className="text-link text-link--quiet">
              2
            </a>
            <a href="#0" className="text-link text-link--quiet">
              3
            </a>
            <span className="px-1 text-[#626875]">...</span>
            <a href="#0" className="text-link text-link--quiet">
              12
            </a>
            <a href="#0" className="text-link text-link--quiet">
              Next
            </a>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default Blog;
