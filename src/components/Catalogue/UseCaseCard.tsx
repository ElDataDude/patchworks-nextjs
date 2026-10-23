import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { appBySlug } from "@/data/apps";
import type { UseCase } from "@/data/use-cases";
import { hrefForUseCase } from "@/data/navigation";
import AppBadge from "./AppBadge";

export default function UseCaseCard({
  useCase,
  headingLevel = "h3",
}: {
  useCase: UseCase;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const appSlugs = Array.from(new Set(useCase.apps.map((link) => link.app)));
  return (
    <article
      className={`use-case-card ${useCase.featured ? "is-featured" : ""}`}
      data-use-case={useCase.slug}
      data-reveal
    >
      {useCase.featured && (
        <p className="eyebrow catalogue-eyebrow">Featured</p>
      )}
      <Heading className="use-case-card-title">
        <Link href={hrefForUseCase(useCase.slug)}>{useCase.title}</Link>
      </Heading>
      <p>{useCase.summary}</p>
      <div className="use-case-card-apps">
        {appSlugs.map((slug) => {
          const app = appBySlug(slug);
          return app ? <AppBadge app={app} key={slug} /> : null;
        })}
      </div>
      <Link
        className="text-link text-link--quiet use-case-card-link"
        href={hrefForUseCase(useCase.slug)}
        aria-label={`Explore ${useCase.title}`}
      >
        Explore the use case
        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
      </Link>
    </article>
  );
}
