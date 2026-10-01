import Link from "next/link";
import type { Industry } from "@/data/industries";
import { casesForIndustry } from "@/data/use-cases";
import { hrefForIndustry, hrefForUseCase } from "@/data/navigation";

export default function IndustryCard({
  industry,
  index,
  headingLevel = "h2",
}: {
  industry: Industry;
  index: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const useCases = casesForIndustry(industry.slug);
  return (
    <article
      className="numbered-item sector-row industry-card"
      id={industry.slug}
      data-reveal
    >
      <span className="item-number" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Heading className="item-title">
        <Link href={hrefForIndustry(industry.slug)}>{industry.title}</Link>
      </Heading>
      <div className="industry-card-body">
        <p>{industry.description}</p>
        <ul
          className="catalogue-tags"
          aria-label={`Use cases for ${industry.title}`}
        >
          {useCases.map((useCase) => (
            <li key={useCase.slug}>
              <Link href={hrefForUseCase(useCase.slug)}>{useCase.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
