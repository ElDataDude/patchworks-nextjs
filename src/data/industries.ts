/**
 * Industries served by Patchworks AI. The use cases for each industry are
 * derived from `use-cases.ts`, so cross-references live in one place.
 * Relative imports only: offline tests load this source directly.
 */
export const INDUSTRY_SLUGS = [
  "insurance",
  "financial-services",
  "wealth-management",
  "charities-education",
  "audit-professional-services",
  "consumer-goods",
  "supply-chain-logistics",
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export interface Industry {
  slug: IndustrySlug;
  title: string;
  /** One sentence for cards and the navigation panel. */
  summary: string;
  /** The established sector narrative shown on the hub and industry page. */
  description: string;
  /** Where AI decisions in this sector need particular care. */
  considerations: readonly string[];
}

export const industries: readonly Industry[] = [
  {
    slug: "insurance",
    title: "Insurance",
    summary:
      "Claims, underwriting and service calls where every answer must stand up to the policy wording and the regulator.",
    description:
      "From underwriting and claims to distribution and service, AI needs to work within the realities of insurance. We help teams examine where it can support decisions and workflows, how proposals stand up to scrutiny and what implementation requires.",
    considerations: [
      "Decisions must trace back to policy wording and the evidence in the file.",
      "Conduct and fair-treatment obligations apply on every customer call.",
      "Uncertain cases need a clear route to an experienced handler.",
    ],
  },
  {
    slug: "financial-services",
    title: "Financial Services & Retail Banking",
    summary:
      "Customer calls, due diligence and lending conversations held to the standards of a regulated bank.",
    description:
      "Customer operations, internal knowledge and risk workflows all present opportunities for AI. The right decisions account for sensitive data, existing controls and the complexity of delivering across markets and business lines.",
    considerations: [
      "Disclosures, affordability and vulnerability checks must be evidenced.",
      "Sensitive customer data stays inside agreed controls.",
      "New tools have to fit existing case-management and audit processes.",
    ],
  },
  {
    slug: "wealth-management",
    title: "Wealth Management & Investment",
    summary:
      "Fund research and adviser conversations that stay grounded in source documents and suitability rules.",
    description:
      "Investment teams and advisers work from long documents, fast-changing data and client relationships that span years. We help them assess where AI can speed up research and preparation while keeping recommendations traceable to their sources and inside suitability rules.",
    considerations: [
      "Every score or shortlist must show the documents it was read from.",
      "AI research supports, and never replaces, a suitability assessment.",
      "Client context gathered across conversations must be handled with care.",
    ],
  },
  {
    slug: "charities-education",
    title: "Charities, Schools & Community Groups",
    summary:
      "Fundraising research and funding-fit checks for organisations with small teams and big ambitions.",
    description:
      "Charities, schools, parent associations and community groups compete for funding with limited time and few specialist staff. We help them use AI to find the right funds, check eligibility and prepare stronger applications, with every claim checked before it is submitted.",
    considerations: [
      "Fund details change often; anything unchecked must be labelled as such.",
      "Applications must reflect the organisation’s own facts, not invented ones.",
      "Volunteers need tools that are simple enough to use between other commitments.",
    ],
  },
  {
    slug: "audit-professional-services",
    title: "Audit & Professional Services",
    summary:
      "Evidence-heavy judgements where confidentiality, accountability and professional scepticism come first.",
    description:
      "Knowledge-intensive work demands careful judgement about evidence, confidentiality and accountability. We help teams evaluate AI across research, document workflows and client delivery while keeping professional judgement central.",
    considerations: [
      "Each conclusion needs evidence a reviewer can follow.",
      "Client information must stay within engagement boundaries.",
      "Automation should route doubtful items to a professional, not hide them.",
    ],
  },
  {
    slug: "consumer-goods",
    title: "Consumer Goods",
    summary:
      "Many brands and regional operations where AI needs to fit commercial and operational dependencies.",
    description:
      "Large families of brands connect commercial decisions, operations and customer insight across regions. We help teams assess AI opportunities against those dependencies and focus effort where there is a clear business case.",
    considerations: [
      "Opportunities span brands, regions and functions with different owners.",
      "Customer and commercial data sit in many separate systems.",
      "Teams need a shared place to try, govern and retire internal tools.",
    ],
  },
  {
    slug: "supply-chain-logistics",
    title: "Supply Chain & Logistics",
    summary:
      "Planning, exceptions and operational knowledge spread across suppliers, systems and geographies.",
    description:
      "Networks of suppliers, systems and geographies make promising demonstrations difficult to put into practice. We help teams review AI for planning, operational knowledge and exception handling in the context of their data and existing workflows.",
    considerations: [
      "Exceptions need fast, consistent triage with a person in the loop.",
      "Operational knowledge is often held by a few experienced people.",
      "Tools must work with existing planning and execution systems.",
    ],
  },
];

export function industryBySlug(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}

export function isIndustrySlug(value: unknown): value is IndustrySlug {
  return (
    typeof value === "string" &&
    (INDUSTRY_SLUGS as readonly string[]).includes(value)
  );
}
