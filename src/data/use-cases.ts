/**
 * Use cases are the single source of the catalogue's cross-references: each
 * one names its industries and the Patchworks apps that demonstrate it, and
 * an industry's use cases are derived from here. Copy follows each app's own
 * documentation; demonstration data is synthetic and any organisations in it
 * are fictional. Relative imports only: offline tests load this source.
 */
import type { AppSlug } from "./apps";
import { industries, type Industry, type IndustrySlug } from "./industries";

export const USE_CASE_SLUGS = [
  "business-os",
  "live-claims-calls",
  "claims-policy-checks",
  "insurance-service-calls",
  "banking-service-calls",
  "commercial-lending-calls",
  "adviser-relationship-calls",
  "fund-selection",
  "grant-fundraising",
  "funding-fit-checks",
  "decision-engines",
] as const;

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

/**
 * The static call to action for an app link when the visitor has no session:
 * "demo" asks for a demonstration, "access" asks to be given access.
 */
export type CtaKind = "demo" | "access";

export interface AppLink {
  app: AppSlug;
  label: string;
  /** Site-relative launch path inside the app. Planned apps have none. */
  launchPath?: string;
  ctaKind: CtaKind;
}

export type Showcase =
  | {
      kind: "decision-answer";
      question: string;
      excerpt: string;
      answer: string;
      probability: string;
      route: string;
    }
  | {
      kind: "live-call";
      callTitle: string;
      transcript: readonly { speaker: string; text: string }[];
      draft: readonly { field: string; value: string; status: string }[];
      checklist: readonly { item: string; done: boolean }[];
    }
  | {
      kind: "fund-shortlist";
      brief: string;
      criteria: readonly string[];
      rows: readonly { name: string; risk: string; fit: string }[];
    }
  | {
      kind: "grant-guide";
      organisation: string;
      tabs: readonly string[];
      items: readonly { title: string; status: string }[];
    }
  | {
      kind: "app-launcher";
      tiles: readonly { name: string; tier: string; note: string }[];
    };

export interface UseCase {
  slug: UseCaseSlug;
  title: string;
  summary: string;
  featured?: boolean;
  /** "all" applies a use case to every industry. */
  industries: readonly IndustrySlug[] | "all";
  /** The job the use case does, in the customer's terms. */
  job: string;
  howItWorks: readonly string[];
  shows: readonly string[];
  stops: readonly string[];
  apps: readonly AppLink[];
  showcase: Showcase;
}

const liveCallStops = [
  "It never submits anything or changes an external system; the record stays a draft for a person to complete.",
  "The demonstration calls are authored scripts, and every bank, business and customer in them is fictional.",
  "It does not establish production speech-recognition accuracy or handler performance.",
];

export const useCases: readonly UseCase[] = [
  {
    slug: "business-os",
    title: "Business OS",
    summary:
      "Launch, share and govern your organisation’s own AI-built apps from one place, under one sign-in.",
    featured: true,
    industries: "all",
    job: "Teams are already building small tools with AI assistants: explainers, calculators, checklists and data apps. Business OS gives them a governed place to publish those tools, decide who can open each one, and promote the ones that matter into properly deployed business apps.",
    howItWorks: [
      "Explainers are single-page apps deployed in seconds behind Patchworks sign-in and served in a locked-down sandbox.",
      "Apps that need a database are built and deployed as full business apps, then registered and governed in Business OS.",
      "Each app gets a launcher tile, per-person access and an audit trail of access changes.",
      "Versions can be rolled back, and deploys use short-lived tokens scoped to named apps.",
    ],
    shows: [
      "How an organisation can let people build with AI without losing control of what is published.",
      "Two tiers of app, each with the right level of engineering for the risk.",
      "One sign-in and one launcher across every Patchworks app a person is allowed to use.",
    ],
    stops: [
      "Business OS is in development; we demonstrate it on request.",
      "Explainers have no server code or database of their own.",
      "Business apps are released through their own deployment process, not from the launcher.",
    ],
    apps: [{ app: "os", label: "Business OS", ctaKind: "demo" }],
    showcase: {
      kind: "app-launcher",
      tiles: [
        { name: "Claims playbook", tier: "Explainer", note: "Claims team" },
        { name: "Renewal checklist", tier: "Explainer", note: "Service desk" },
        { name: "Decisions", tier: "Business app", note: "Staff" },
        { name: "Supplier tracker", tier: "Business app", note: "Invited" },
      ],
    },
  },
  {
    slug: "live-claims-calls",
    title: "Live claims calls",
    summary:
      "Follow a first notification of loss as it happens: draft the claim, track the checklist and coach the handler.",
    industries: ["insurance"],
    job: "The first call after a loss sets the tone and the facts for the whole claim. Handlers must capture the right details, give the right information and treat the customer fairly, all while the customer is often upset.",
    howItWorks: [
      "The conversation is transcribed as it happens.",
      "Each new passage is checked for evidence and conduct against the claims checklist.",
      "The draft claim fills in field by field, each with the quote it came from and a status.",
      "The handler sees prompts for anything still missing, and a coaching and compliance review follows the call.",
    ],
    shows: [
      "A claim record drafted from the conversation, with source quotes for every field.",
      "Checklist coverage and conduct tracked while the call is still going.",
      "Strong and weak versions of the same call, so the difference is easy to see.",
    ],
    stops: liveCallStops,
    apps: [
      {
        app: "pci",
        label: "Motor claim first notification",
        launchPath: "/use-cases/fnol-live",
        ctaKind: "access",
      },
      {
        app: "decisions",
        label: "Live-call replay with decision engines",
        launchPath: "/livecall",
        ctaKind: "demo",
      },
    ],
    showcase: {
      kind: "live-call",
      callTitle: "Motor claim, first notification",
      transcript: [
        {
          speaker: "Customer",
          text: "Someone went into the back of me at the lights this morning.",
        },
        { speaker: "Handler", text: "I’m sorry to hear that. Is anyone hurt?" },
        {
          speaker: "Customer",
          text: "No, just shaken. The other driver gave me his details.",
        },
      ],
      draft: [
        {
          field: "Incident type",
          value: "Rear-end collision",
          status: "Quoted",
        },
        { field: "Injuries", value: "None reported", status: "Quoted" },
        { field: "Third party details", value: "Pending", status: "To ask" },
      ],
      checklist: [
        { item: "Confirm the customer is safe", done: true },
        { item: "Record third-party details", done: false },
        { item: "Explain the next steps", done: false },
      ],
    },
  },
  {
    slug: "claims-policy-checks",
    title: "Claims policy checks",
    summary:
      "Check claim files against policy thresholds, dates and cover rules, with every answer carrying its own probability.",
    industries: ["insurance"],
    job: "Claims teams spend much of their time on questions with clear rules: was the loss inside the policy period, was it reported in time, does the event meet the cover’s thresholds. Answering them consistently, and knowing when to ask a person, is the job.",
    howItWorks: [
      "Policy rules are written as plain-language questions.",
      "A decision engine answers each question for every claim file, with a probability.",
      "Answers combine into a verdict for each cover.",
      "A review band sends uncertain answers to a claims handler and decides the confident ones.",
    ],
    shows: [
      "Thresholds and dates (policy period, notification deadline, weather limits) each asked several different ways.",
      "A policy written in Portuguese applied to Portuguese claim files with English rules.",
      "How a hosted engine and an open-source engine compare on the same cases.",
    ],
    stops: [
      "Demonstration claims and policies are synthetic.",
      "Each answer supports a handler’s decision; it does not settle a claim.",
      "Confidence figures cannot be compared across different engines.",
    ],
    apps: [
      {
        app: "decisions",
        label: "Motor claims numerics",
        launchPath: "/demos/motor-claims-numerics",
        ctaKind: "demo",
      },
      {
        app: "decisions",
        label: "Motor claims, Portuguese policy",
        launchPath: "/demos/motor-claims-pt",
        ctaKind: "demo",
      },
    ],
    showcase: {
      kind: "decision-answer",
      question: "Was the loss notified within the deadline set by the policy?",
      excerpt:
        "Policy: notify us no later than 7 days after the incident. Claim: incident on 3 March, first call on 8 March.",
      answer: "Yes",
      probability: "0.97",
      route: "Decided automatically",
    },
  },
  {
    slug: "insurance-service-calls",
    title: "Insurance service calls",
    summary:
      "Broker quotes and mid-term policy changes, with the submission drafted and disclosures tracked as the call goes.",
    industries: ["insurance"],
    job: "Underwriting intake and policy changes depend on asking the right questions and giving the right disclosures. Missed details mean re-work, mispriced risk or an unfair outcome at renewal.",
    howItWorks: [
      "The call is transcribed as it happens.",
      "Evidence for each field of the submission or change is captured with its source quote.",
      "Required disclosures and questions are tracked on a live checklist.",
      "A coaching and compliance review is ready when the call ends.",
    ],
    shows: [
      "A business owner asking a commercial broker for a combined quote, with the risk submission drafted live.",
      "A home insurance customer adding building work and a lodger before renewal, with cost and renewal disclosures tracked.",
      "Strong and weak versions of each call.",
    ],
    stops: liveCallStops,
    apps: [
      {
        app: "pci",
        label: "Commercial underwriting intake",
        launchPath: "/use-cases/underwriting-intake",
        ctaKind: "access",
      },
      {
        app: "pci",
        label: "Policy change before renewal",
        launchPath: "/use-cases/policy-change-renewal",
        ctaKind: "access",
      },
    ],
    showcase: {
      kind: "live-call",
      callTitle: "Policy change before renewal",
      transcript: [
        {
          speaker: "Customer",
          text: "We’re having an extension built, and my cousin is moving in for a while.",
        },
        {
          speaker: "Handler",
          text: "Thanks for telling us. When does the building work start?",
        },
      ],
      draft: [
        { field: "Change requested", value: "Building work", status: "Quoted" },
        { field: "New occupant", value: "Lodger", status: "Quoted" },
        { field: "Start date", value: "Pending", status: "To ask" },
      ],
      checklist: [
        { item: "Explain any change to the premium", done: false },
        { item: "Confirm renewal terms", done: false },
        { item: "Check occupancy conditions", done: true },
      ],
    },
  },
  {
    slug: "banking-service-calls",
    title: "Banking service calls",
    summary:
      "Account opening, disputed payments and financial hardship, with due diligence and fair treatment evidenced live.",
    industries: ["financial-services"],
    job: "Retail and business banking calls carry strict obligations: due diligence when opening an account, a clear record when a payment is disputed, and careful, fair treatment when a customer is struggling.",
    howItWorks: [
      "The call is transcribed as it happens.",
      "The case record (application, dispute or hardship plan) fills in with source quotes.",
      "Due diligence, disclosures, affordability and vulnerability checks are tracked live.",
      "The handler is coached during the call and receives a review afterwards.",
    ],
    shows: [
      "A company director opening a business current account, with due diligence and disclosures tracked.",
      "A cardholder reporting payments they did not make, with the dispute case drafted.",
      "A customer behind on a card and a loan, with a hardship plan drafted and affordability tracked.",
    ],
    stops: liveCallStops,
    apps: [
      {
        app: "pci",
        label: "Business account opening",
        launchPath: "/use-cases/account-opening",
        ctaKind: "access",
      },
      {
        app: "pci",
        label: "Disputed card transaction",
        launchPath: "/use-cases/disputed-transaction",
        ctaKind: "access",
      },
      {
        app: "pci",
        label: "Financial hardship",
        launchPath: "/use-cases/financial-hardship",
        ctaKind: "access",
      },
    ],
    showcase: {
      kind: "live-call",
      callTitle: "Disputed card transaction",
      transcript: [
        {
          speaker: "Customer",
          text: "There are two payments on my card I didn’t make.",
        },
        {
          speaker: "Handler",
          text: "Let’s go through them together. Do you still have the card?",
        },
      ],
      draft: [
        {
          field: "Dispute type",
          value: "Unrecognised payments",
          status: "Quoted",
        },
        { field: "Card in possession", value: "Pending", status: "To ask" },
        { field: "Payments disputed", value: "Two", status: "Quoted" },
      ],
      checklist: [
        { item: "Verify the customer", done: true },
        { item: "Explain how the dispute will proceed", done: false },
        { item: "Offer to block the card", done: false },
      ],
    },
  },
  {
    slug: "commercial-lending-calls",
    title: "Commercial lending calls",
    summary:
      "Credit intake and annual reviews where the application or review memo is drafted from the conversation.",
    industries: ["financial-services"],
    job: "Relationship teams gather a great deal of information in conversation, from equipment financing needs to covenant check-ins. Turning it into an accurate credit application or review memo, with fair-lending requirements met, takes time.",
    howItWorks: [
      "The call is transcribed as it happens.",
      "The credit application or annual review memo fills in with source quotes.",
      "Fair-lending and covenant points are tracked on a live checklist.",
      "A review of the call is ready when it ends.",
    ],
    shows: [
      "A small-business owner asking about equipment financing, with the credit application drafted. This pack follows US lending rules.",
      "A relationship director’s annual review and covenant check-in, with the review memo drafted.",
    ],
    stops: liveCallStops,
    apps: [
      {
        app: "pci",
        label: "Commercial loan intake",
        launchPath: "/use-cases/commercial-loan-intake",
        ctaKind: "access",
      },
      {
        app: "pci",
        label: "Annual review",
        launchPath: "/use-cases/annual-review",
        ctaKind: "access",
      },
    ],
    showcase: {
      kind: "live-call",
      callTitle: "Annual review",
      transcript: [
        {
          speaker: "Director",
          text: "Trading has been steady, and we’ve taken on a second site.",
        },
        {
          speaker: "Relationship lead",
          text: "Has the new site changed your borrowing needs?",
        },
      ],
      draft: [
        { field: "Trading update", value: "Steady", status: "Quoted" },
        { field: "Material change", value: "Second site", status: "Quoted" },
        { field: "Covenant position", value: "Pending", status: "To ask" },
      ],
      checklist: [
        { item: "Review covenant compliance", done: false },
        { item: "Record changes in ownership", done: true },
        { item: "Agree next review date", done: false },
      ],
    },
  },
  {
    slug: "adviser-relationship-calls",
    title: "Adviser relationship calls",
    summary:
      "Help a relationship manager recall the last conversation, notice what has changed and prepare a cited shortlist.",
    industries: ["wealth-management"],
    job: "Private banking and advice depend on remembering the client: what they said last time, what has changed in their life and what they have asked to look at. Good notes and well-sourced suggestions make the difference.",
    howItWorks: [
      "Context from the earlier conversation is recalled before the call.",
      "As the call happens, new personal news and requests are noticed.",
      "A fund shortlist is built with citations to its sources.",
      "Call notes are kept for the adviser to review and approve.",
    ],
    shows: [
      "A relationship manager’s call with a fictional private-bank client.",
      "Memory of the previous conversation alongside what is new.",
      "A cited shortlist and call notes ready for review.",
    ],
    stops: [
      ...liveCallStops,
      "Shortlists support an adviser’s judgement; they are not a recommendation or suitability assessment.",
    ],
    apps: [
      {
        app: "pci",
        label: "Wealth adviser",
        launchPath: "/use-cases/wealth-adviser",
        ctaKind: "access",
      },
    ],
    showcase: {
      kind: "live-call",
      callTitle: "Relationship review",
      transcript: [
        {
          speaker: "Client",
          text: "Our daughter starts university next year, so we’re thinking about cash flow.",
        },
        {
          speaker: "Adviser",
          text: "Last time you mentioned keeping a cautious approach. Is that still right?",
        },
      ],
      draft: [
        { field: "Life event", value: "University costs", status: "New" },
        { field: "Risk appetite", value: "Cautious", status: "Recalled" },
        { field: "Follow-up", value: "Income options", status: "To prepare" },
      ],
      checklist: [
        { item: "Recall previous objectives", done: true },
        { item: "Note changes in circumstances", done: true },
        { item: "Agree what to send after the call", done: false },
      ],
    },
  },
  {
    slug: "fund-selection",
    title: "Fund selection",
    summary:
      "Describe the fund you need and get a ranked, visual shortlist read from fund documents.",
    industries: ["wealth-management"],
    job: "Investment teams screen thousands of funds against briefs that rarely fit standard filters: themes, exclusions, charges and risk together. Getting to a defensible shortlist quickly is the job.",
    howItWorks: [
      "Describe the fund in a sentence or two; the brief becomes editable filters and criteria.",
      "Filters narrow about 4,400 funds instantly.",
      "An AI ranking reads each remaining fund’s Key Information Document and holdings and scores every criterion.",
      "Weights can be adjusted and the search saved or shared.",
    ],
    shows: [
      "Plain-language briefs turned into transparent, editable criteria.",
      "Scores that point back to the fund documents they were read from.",
      "Funds with missing data kept in view and labelled as unverified.",
    ],
    stops: [
      "Scores are AI estimates, not ratings, advice or a suitability check.",
      "The data is a dated snapshot, not a live feed; returns are price returns.",
      "There are no company fundamentals or analyst ratings.",
    ],
    apps: [
      {
        app: "funds",
        label: "Fund shortlisting",
        launchPath: "/funds",
        ctaKind: "demo",
      },
    ],
    showcase: {
      kind: "fund-shortlist",
      brief: "Global equity with low charges, avoiding fossil fuels",
      criteria: [
        "Global equity",
        "Low ongoing charges",
        "Fossil fuel exclusion",
      ],
      rows: [
        { name: "Example World Equity Index", risk: "Risk 4", fit: "High fit" },
        { name: "Sample Sustainable Global", risk: "Risk 4", fit: "High fit" },
        {
          name: "Illustrative Developed Markets",
          risk: "Risk 5",
          fit: "Unverified",
        },
      ],
    },
  },
  {
    slug: "grant-fundraising",
    title: "Grant fundraising",
    summary:
      "Type your organisation’s name and get a fundraising guide: funds open now, a twelve-month roadmap and drafted applications.",
    industries: ["charities-education"],
    job: "Parent associations, schools, charities and community groups know they could raise more, but few have time to research funds, track deadlines and write applications. A clear, checked plan is the job.",
    howItWorks: [
      "Type the organisation’s name and confirm what was found.",
      "The search checks which funds are open now and which fit.",
      "A guide sets out funds open now, a twelve-month roadmap and up to ten drafted applications.",
      "Anything that could not be verified is listed for the organisation to confirm.",
    ],
    shows: [
      "A complete fundraising guide for a fictional school parent association.",
      "Drafted applications, question by question.",
      "Clear labels on every fund and fact that still needs checking.",
    ],
    stops: [
      "UK sources only.",
      "A fund is called open only if that run checked it.",
      "Facts it cannot verify are marked to confirm, never invented.",
      "Access is by invitation.",
    ],
    apps: [
      {
        app: "grants",
        label: "GrantGranter guides",
        launchPath: "/guides",
        ctaKind: "access",
      },
    ],
    showcase: {
      kind: "grant-guide",
      organisation: "Example Primary School PTA",
      tabs: [
        "Overview",
        "Open now",
        "Roadmap",
        "Applications",
        "To confirm",
        "Sources",
      ],
      items: [
        { title: "Community sports equipment fund", status: "Open, checked" },
        {
          title: "Local library reading grant",
          status: "Probably open, not verified",
        },
        { title: "Charity registration number", status: "To confirm" },
      ],
    },
  },
  {
    slug: "funding-fit-checks",
    title: "Funding fit checks",
    summary:
      "Match an organisation to a funding programme on eligibility, geography, award size and purpose.",
    industries: ["charities-education"],
    job: "Funders and the organisations applying to them both need to know, quickly and consistently, whether an application fits a programme’s rules before anyone invests time in it.",
    howItWorks: [
      "Eligibility rules are written as plain-language questions.",
      "A decision engine answers each one for every organisation, with a probability.",
      "Clear matches and clear mismatches are decided automatically.",
      "Borderline cases go to a person to review.",
    ],
    shows: [
      "Eligibility, geography, award size and purpose checked separately.",
      "A review band that decides confident cases and holds uncertain ones.",
    ],
    stops: [
      "The organisations are fictional and the expected answers have not yet been reviewed.",
      "A fit check informs a funding decision; it does not make it.",
    ],
    apps: [
      {
        app: "decisions",
        label: "Fund fit",
        launchPath: "/demos/guide-fund-fit",
        ctaKind: "demo",
      },
    ],
    showcase: {
      kind: "decision-answer",
      question: "Is the organisation based in an area the programme funds?",
      excerpt:
        "Programme: open to groups working in the North West. Applicant: community garden in Wigan.",
      answer: "Yes",
      probability: "0.91",
      route: "Decided automatically",
    },
  },
  {
    slug: "decision-engines",
    title: "Decision engines",
    summary:
      "Turn plain-language questions into typed answers with probabilities, and route the uncertain ones to a person.",
    industries: [
      "insurance",
      "financial-services",
      "audit-professional-services",
      "consumer-goods",
      "supply-chain-logistics",
    ],
    job: "Many operational decisions are judgements about text: does this document meet the rule, which category does this case belong to, how serious is this issue. Decision engines answer such questions consistently and say how sure they are.",
    howItWorks: [
      "Write the question in plain language: yes or no, one choice from a set, or a level on a rubric.",
      "Run it over cases whose answers are already known.",
      "See how often the engine was right and how sure it said it was.",
      "Choose a review band that decides confident cases and sends the rest to a person.",
    ],
    shows: [
      "A small worked example of routing with a review band.",
      "Which cases each band setting would have got wrong.",
      "Hosted and open-source engines side by side.",
    ],
    stops: [
      "Demonstrations use synthetic cases and are read-only.",
      "Confidence figures cannot be compared across different engines.",
      "Runs are capped per person and per day.",
    ],
    apps: [
      {
        app: "decisions",
        label: "Decisions workbench",
        launchPath: "/",
        ctaKind: "demo",
      },
      {
        app: "decisions",
        label: "Review band worked example",
        launchPath: "/demos/hotdog",
        ctaKind: "demo",
      },
    ],
    showcase: {
      kind: "decision-answer",
      question: "Does this supplier exception need escalating today?",
      excerpt:
        "Delivery for a key component is four days late; the line has two days of stock remaining.",
      answer: "Escalate",
      probability: "0.58",
      route: "Held for a person to review",
    },
  },
];

export function findUseCase(slug: string): UseCase | undefined {
  return useCases.find((useCase) => useCase.slug === slug);
}

export function isUseCaseSlug(value: unknown): value is UseCaseSlug {
  return (
    typeof value === "string" &&
    (USE_CASE_SLUGS as readonly string[]).includes(value)
  );
}

/** Use cases that apply to an industry, featured first, then in catalogue order. */
export function casesForIndustry(industry: IndustrySlug): UseCase[] {
  const matching = useCases.filter(
    (useCase) =>
      useCase.industries === "all" || useCase.industries.includes(industry),
  );
  return [
    ...matching.filter((useCase) => useCase.featured),
    ...matching.filter((useCase) => !useCase.featured),
  ];
}

/** Industries a use case applies to, in industry order. */
export function industriesFor(useCase: UseCase): Industry[] {
  const scope = useCase.industries;
  return scope === "all"
    ? [...industries]
    : industries.filter((industry) => scope.includes(industry.slug));
}

/** Use cases sharing a specific industry with this one, excluding "all" use cases. */
export function relatedUseCases(useCase: UseCase, limit = 3): UseCase[] {
  if (useCase.industries === "all")
    return useCases
      .filter((item) => item.slug !== useCase.slug)
      .slice(0, limit);
  const scope = useCase.industries;
  return useCases
    .filter(
      (item) =>
        item.slug !== useCase.slug &&
        item.industries !== "all" &&
        item.industries.some((industry) => scope.includes(industry)),
    )
    .slice(0, limit);
}
