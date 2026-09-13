import { Eye, MessageCircle } from "lucide-react";
import RelatedPost from "@/components/Blog/RelatedPost";
import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import BookingCTA from "@/components/Common/BookingCTA";
import NewsLatterBox from "@/components/Contact/NewsLatterBox";
import Image from "next/image";
import { Search } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Implementation Insights | Patchworks AI Blog",
  description:
    "Discover practical insights and strategies for implementing AI solutions that deliver measurable business value.",
};

const BlogSidebarPage = () => {
  return (
    <div>
      <div className="site-container">
        <section className="section-space">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] lg:gap-20">
            <article>
              <header className="border-b border-[#E3E8EF] pb-9">
                <p className="eyebrow mb-5 text-[#d16013]">Design</p>
                <h1 className="page-title text-[clamp(44px,5.6vw,78px)]">
                  10 amazing sites to download stock photos &amp; digital assets
                  for free
                </h1>
                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm text-[#626875]">
                  <span className="flex items-center gap-3">
                    <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#E3E8EF]">
                      <Image
                        src="/images/blog/author-02.png"
                        alt="Musharof Chy"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    By{" "}
                    <strong className="font-medium text-[#121723]">
                      {" "}
                      Musharof Chy
                    </strong>
                  </span>
                  <span>12 Jan 2024</span>
                  <span className="inline-flex items-center gap-5">
                    <span
                      className="inline-flex items-center gap-2"
                      aria-label="50 views"
                    >
                      <Eye size={16} aria-hidden="true" />
                      50
                    </span>
                    <span
                      className="inline-flex items-center gap-2"
                      aria-label="35 comments"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      35
                    </span>
                  </span>
                </div>
              </header>

              <div className="mt-12 max-w-[760px] text-[18px] leading-[1.75] text-[#333333]">
                <p className="mb-10">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat.
                </p>
                <div className="media-frame relative mb-10 aspect-[16/9]">
                  <Image
                    src="/images/blog/blog-details-01.jpg"
                    alt="image"
                    fill
                    sizes="(max-width: 767px) 90vw, 760px"
                    className="object-cover"
                  />
                </div>
                <p className="mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Quis enim lobortis scelerisque fermentum. Neque sodales ut
                  etiam sit amet. Ligula ullamcorper{" "}
                  <strong className="font-medium text-[#121723]">
                    {" "}
                    malesuada{" "}
                  </strong>{" "}
                  proin libero nunc consequat interdum varius. Quam pellentesque
                  nec nam aliquam sem et tortor consequat. Pellentesque
                  adipiscing commodo elit at imperdiet.
                </p>
                <p className="mb-10">
                  Semper auctor neque vitae tempus quam pellentesque nec.{" "}
                  <span className="text-[#121723] underline decoration-[#d16013] decoration-1 underline-offset-4">
                    {" "}
                    Amet dictum sit amet justo{" "}
                  </span>{" "}
                  donec enim diam. Varius sit amet mattis vulputate enim nulla
                  aliquet porttitor. Odio pellentesque diam volutpat commodo
                  sed.
                </p>
                <h2 className="mb-8 text-[clamp(32px,4vw,52px)] leading-tight">
                  Digital marketplace for Ui/Ux designers.
                </h2>
                <p className="mb-8">
                  consectetur adipiscing elit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  mattis vulputate cupidatat.
                </p>
                <div className="mb-10 border-y border-[#d16013] py-8 text-center">
                  <BookingCTA text="Get Expert AI Implementation Guidance" />
                </div>
                <ul className="mb-12 list-disc space-y-3 pl-6">
                  <li>Consectetur adipiscing elit in voluptate velit.</li>
                  <li>Mattis vulputate cupidatat.</li>
                  <li>
                    Vulputate enim nulla aliquet porttitor odio pellentesque
                  </li>
                  <li>Ligula ullamcorper malesuada proin</li>
                </ul>
                <blockquote className="mb-10 border-y border-[#E3E8EF] py-8 text-center font-serif text-xl italic leading-relaxed text-[#121723]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod incididunt utionals labore et dolore magna aliqua.
                  Quis lobortis scelerisque fermentum, The Neque ut etiam sit
                  amet.
                </blockquote>
                <p className="mb-10">
                  consectetur adipiscing elit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  mattis vulputate cupidatat.
                </p>
                <div className="flex flex-col justify-between gap-8 border-t border-[#E3E8EF] pt-7 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-[#626875]">
                      Popular Tags :
                    </h3>
                    <div className="flex flex-wrap">
                      <TagButton text="Design" />
                      <TagButton text="Development" />
                      <TagButton text="Info" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-[#626875] sm:text-right">
                      Share this post :
                    </h3>
                    <div className="flex items-center sm:justify-end">
                      <SharePost />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <aside className="lg:pt-24">
              <div className="mb-10 border-y border-[#E3E8EF] py-5">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search here..."
                    aria-label="Search here..."
                    className="form-control"
                  />
                  <button
                    type="button"
                    aria-label="search button"
                    className="grid h-12 w-12 shrink-0 place-items-center bg-[#d16013] text-white"
                  >
                    <Search aria-hidden="true" size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="mb-10 border-t border-[#E3E8EF]">
                <h2 className="border-b border-[#E3E8EF] py-5 text-2xl">
                  Related Posts
                </h2>
                <ul>
                  <li className="border-b border-[#E3E8EF] py-6">
                    <RelatedPost
                      title="Best way to boost your online sales."
                      image="/images/blog/post-01.jpg"
                      slug="#"
                      date="12 Feb 2025"
                    />
                  </li>
                  <li className="border-b border-[#E3E8EF] py-6">
                    <RelatedPost
                      title="50 Best web design tips & tricks that will help you."
                      image="/images/blog/post-02.jpg"
                      slug="#"
                      date="15 Feb, 2024"
                    />
                  </li>
                  <li className="py-6">
                    <RelatedPost
                      title="The 8 best landing page builders, reviewed"
                      image="/images/blog/post-03.jpg"
                      slug="#"
                      date="05 Jun, 2024"
                    />
                  </li>
                </ul>
              </div>
              <div className="mb-10 border-t border-[#E3E8EF]">
                <h2 className="border-b border-[#E3E8EF] py-5 text-2xl">
                  Popular Category
                </h2>
                <ul className="py-5">
                  {[
                    "Tailwind Templates",
                    "Landing page",
                    "Startup",
                    "Business",
                    "Multipurpose",
                  ].map((category) => (
                    <li key={category}>
                      <a
                        href="#0"
                        className="inline-block py-2 text-sm text-[#626875] hover:text-[#d16013]"
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-10 border-t border-[#E3E8EF]">
                <h2 className="border-b border-[#E3E8EF] py-5 text-2xl">
                  Popular Tags
                </h2>
                <div className="flex flex-wrap pt-6">
                  <TagButton text="Themes" />
                  <TagButton text="UI Kit" />
                  <TagButton text="Tailwind" />
                  <TagButton text="Startup" />
                  <TagButton text="Business" />
                </div>
              </div>
              <NewsLatterBox />
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogSidebarPage;
