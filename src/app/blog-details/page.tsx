import { Eye, MessageCircle } from "lucide-react";
import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import BookingCTA from "@/components/Common/BookingCTA";
import Image from "next/image";
import ResponsiveImage from "@/components/Common/ResponsiveImage";
import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/blog-details");

const BlogDetailsPage = () => {
  return (
    <div>
      <div className="site-container">
        <article className="section-space">
          <header className="mx-auto max-w-5xl border-b border-[#E3E8EF] pb-10">
            <p className="eyebrow mb-5 text-[#d16013]">Strategy</p>
            <h1 className="page-title max-w-4xl text-[clamp(48px,6.4vw,88px)]">
              5 Ways Fractional AI Leadership Can Transform Your Business
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-[#626875]">
              <span className="flex items-center gap-3">
                <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#E3E8EF]">
                  <Image
                    src="/images/blog/author-02.png"
                    alt="James Wilson"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <span>
                  By{" "}
                  <strong className="font-medium text-[#121723]">
                    James Wilson
                  </strong>
                </span>
              </span>
              <span>15 Mar 2025</span>
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

          <div className="mx-auto mt-12 max-w-5xl">
            <div className="media-frame relative aspect-[16/9] overflow-hidden">
              <ResponsiveImage
                src="/images/editorial/article-leadership.webp"
                alt="Stone and glass leadership structures joined by an orange connection"
                fill
                priority
                sizes="(max-width: 1023px) 90vw, 960px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-[760px] text-[18px] leading-[1.75] text-[#333333]">
            <p className="mb-10">
              In today&apos;s competitive business landscape, having
              executive-level AI leadership is no longer optional—it&apos;s
              essential. But hiring a full-time Chief AI Officer can be
              prohibitively expensive for many organizations. This is where the
              fractional leadership model shines.
            </p>
            <p className="mb-8">
              Fractional AI leadership provides your organization with
              experienced executive guidance at a fraction of the cost of a
              full-time hire. This approach gives you access to seasoned AI
              experts who can bridge the gap between{" "}
              <strong className="font-medium text-[#121723]">
                executive vision and technical execution
              </strong>
              , ensuring your AI initiatives deliver measurable business impact
              from day one. Let&apos;s explore five ways this model can
              transform your business.
            </p>
            <p className="mb-10">
              With the right fractional AI leadership, you can accelerate your
              AI journey without the overhead of a full-time executive.{" "}
              <span className="text-[#121723] underline decoration-[#d16013] decoration-1 underline-offset-4">
                Our clients typically see ROI within weeks
              </span>
              , not months or years, making this approach particularly
              attractive for organizations looking to move quickly but
              strategically.
            </p>

            <h2 className="mb-8 text-[clamp(32px,4vw,52px)] leading-tight">
              Five Key Benefits of Fractional AI Leadership
            </h2>
            <p className="mb-10">
              Here&apos;s how a fractional head-of-AI can deliver immediate
              value while setting your organization up for long-term AI success.
            </p>
            <ul className="mb-12 list-disc space-y-3 pl-6">
              <li>
                Cost-effective executive expertise without the full-time salary
                and benefits package.
              </li>
              <li>
                Rapid implementation of AI strategy with proven methodologies
                and frameworks.
              </li>
              <li>
                Objective, vendor-neutral guidance that focuses on your business
                outcomes, not selling specific tools.
              </li>
              <li>
                Knowledge transfer to your internal team, building sustainable
                AI capabilities.
              </li>
            </ul>

            <blockquote className="mb-12 border-y border-[#d16013] py-8 text-center text-xl font-[var(--font-display)] italic leading-relaxed text-[#121723]">
              &quot;Working with a fractional head-of-AI allowed us to implement
              our AI strategy in just 8 weeks, compared to the 6+ months we had
              initially planned. The ROI was immediate and the knowledge
              transfer to our team has been invaluable.&quot;
            </blockquote>
            <p className="mb-10">
              Ready to explore how fractional AI leadership can transform your
              business? Contact us today to learn more about our approach and
              how we can help you achieve measurable ROI from your AI
              investments.
            </p>
            <div className="mb-12 border-y border-[#E3E8EF] py-8 text-center">
              <BookingCTA />
            </div>

            <footer className="flex flex-col justify-between gap-8 border-t border-[#E3E8EF] pt-7 sm:flex-row sm:items-start">
              <div>
                <h3 className="mb-3 text-sm font-medium text-[#626875]">
                  Popular Tags :
                </h3>
                <div className="flex flex-wrap">
                  <TagButton text="Strategy" />
                  <TagButton text="Leadership" />
                  <TagButton text="ROI" />
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
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
