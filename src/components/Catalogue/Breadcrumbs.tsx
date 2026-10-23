import Link from "next/link";
import { breadcrumbJsonLd } from "@/data/seo";

/** Visible breadcrumb trail plus its schema.org BreadcrumbList. */
export default function Breadcrumbs({
  trail,
}: {
  trail: readonly (readonly [string, string])[];
}) {
  const json = JSON.stringify(breadcrumbJsonLd(trail)).replace(/</g, "\\u003c");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
      <nav className="catalogue-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map(([name, path], index) => (
            <li key={path}>
              {index === trail.length - 1 ? (
                <span aria-current="page">{name}</span>
              ) : (
                <Link href={path}>{name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
