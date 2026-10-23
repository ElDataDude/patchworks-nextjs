import EditorialLink from "@/components/Common/EditorialLink";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Patchworks AI",
  description: "The requested page could not be found on Patchworks AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="site-container">
      <section className="section-space grid min-h-[60vh] items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="eyebrow mb-5 text-[#d16013]">404 error</p>
          <h1 className="page-title max-w-3xl text-[clamp(52px,7vw,100px)]">
            Sorry, the page can&apos;t be found
          </h1>
          <p className="body-copy mt-7 max-w-xl">
            The page you were looking for may have moved or no longer exists.
          </p>
          <EditorialLink href="/" className="mt-9">
            Back to homepage
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
  );
}
