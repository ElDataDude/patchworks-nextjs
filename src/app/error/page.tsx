import EditorialLink from "@/components/Common/EditorialLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Page | Free Next.js Template for Startup and SaaS",
  description: "This is Error Page for Startup Nextjs Template",
};

const ErrorPage = () => (
  <div>
    <div className="site-container">
      <section className="section-space grid min-h-[60vh] items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h1 className="page-title max-w-3xl text-[clamp(52px,7vw,100px)]">
            Sorry, the page can&apos;t be found
          </h1>
          <p className="body-copy mt-7 max-w-xl">
            The page you were looking for appears to have been moved, deleted or
            does not exist.
          </p>
          <EditorialLink href="/" className="mt-9">
            Back to Homepage
          </EditorialLink>
        </div>
        <div
          aria-hidden="true"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          className="text-[clamp(120px,20vw,300px)] leading-none text-[#d16013]"
        >
          404
        </div>
      </section>
    </div>
  </div>
);

export default ErrorPage;
