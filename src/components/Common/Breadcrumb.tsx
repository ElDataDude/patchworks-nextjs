import Link from "next/link";

const Breadcrumb = ({
  pageName,
  description,
}: {
  pageName: string;
  description: string;
}) => (
  <section className="page-hero">
    <div className="site-container">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-4 text-sm"
      >
        <Link href="/" className="text-link text-link--quiet">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{pageName}</span>
      </nav>
      <h1 className="page-title">{pageName}</h1>
      <p className="body-copy">{description}</p>
    </div>
  </section>
);
export default Breadcrumb;
