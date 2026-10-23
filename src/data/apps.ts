/**
 * Patchworks applications referenced by the Industries & Use Cases catalogue.
 * Mirrors the Patchworks ID registry (slug, host, access model). Launch URLs
 * are always built from this file, never from data returned by another
 * service. Relative imports only: offline tests load this source directly.
 */
export const APP_SLUGS = ["decisions", "funds", "grants", "pci", "os"] as const;

export type AppSlug = (typeof APP_SLUGS)[number];

/** How a person signs in to the app today. */
export type AppAuth = "patchworks-id" | "cloudflare-access";
export type AppStatus = "live" | "planned";
/** Who can use the app: Patchworks staff, invited people, or customer teams. */
export type AppAccess = "staff" | "invite" | "customer";

export interface PatchworksApp {
  slug: AppSlug;
  name: string;
  /** Production origin. Planned apps keep their reserved host. */
  origin: string;
  auth: AppAuth;
  status: AppStatus;
  access: AppAccess;
  oneLine: string;
  howItWorks: readonly string[];
  limits: readonly string[];
}

export const apps: readonly PatchworksApp[] = [
  {
    slug: "decisions",
    name: "Decisions",
    origin: "https://decisions.patchworks.ai",
    auth: "patchworks-id",
    status: "live",
    access: "staff",
    oneLine:
      "A workbench for decision engines: ask a plain-language question about a piece of text and get a typed answer with the engine’s own probability.",
    howItWorks: [
      "Write the questions in plain language.",
      "Give the engine cases whose right answers are already known.",
      "Each answer comes back with a probability, so you can see how often the engine was right and how sure it said it was.",
      "Set a review band: confident answers are decided automatically and uncertain ones go to a person.",
    ],
    limits: [
      "Demos run on synthetic or fictional cases and are read-only.",
      "The live-call page replays a recorded call; it does not supervise a real one.",
      "Confidence figures cannot be compared across different engines.",
      "Runs are capped per person and per day.",
    ],
  },
  {
    slug: "funds",
    name: "Funds",
    origin: "https://funds.patchworks.ai",
    auth: "patchworks-id",
    status: "live",
    access: "staff",
    oneLine:
      "Fund shortlisting for investment teams: describe the fund you need and see a ranked, visual shortlist drawn from about 4,400 funds.",
    howItWorks: [
      "Describe the fund in a sentence or two; the brief becomes editable filters and up to eight criteria.",
      "Filters on charges, risk indicator, currency, asset class and region narrow the list instantly.",
      "On a short enough list, the AI ranking reads each fund’s Key Information Document and top holdings and scores every criterion.",
      "Adjust the weights, then save or share the search as a link.",
    ],
    limits: [
      "Scores are AI estimates read from fund documents, not ratings, advice or a suitability check.",
      "The data is a dated snapshot of Key Information Documents and issuer data, not a live feed.",
      "Returns are price returns; there are no company fundamentals or analyst ratings.",
      "The AI ranking takes at most 250 funds and eight criteria per run.",
    ],
  },
  {
    slug: "grants",
    name: "GrantGranter",
    origin: "https://grants.patchworks.ai",
    auth: "patchworks-id",
    status: "live",
    access: "invite",
    oneLine:
      "Type your organisation’s name and get a fundraising guide: the funds open now, a twelve-month roadmap and the strongest applications drafted.",
    howItWorks: [
      "Type the organisation’s name, with its town if that helps.",
      "Confirm what it found and add a few quick facts; the long search starts only after you confirm.",
      "Receive a guide covering funds open now, a twelve-month roadmap, drafted applications, points to confirm and sources.",
      "Read it on the web or download it as a PDF.",
    ],
    limits: [
      "UK sources only.",
      "A fund is called open only if that run checked it; anything unchecked is labelled as not verified.",
      "Facts it cannot verify are marked to confirm, never invented.",
      "Access is by invitation, and each guide uses a credit allocated by an administrator.",
    ],
  },
  {
    slug: "pci",
    name: "Patchworks Call Intelligence",
    origin: "https://pci.patchworks.ai",
    auth: "cloudflare-access",
    status: "live",
    access: "staff",
    oneLine:
      "A live-call workspace: as a call happens it transcribes the conversation, drafts the record with source quotes, tracks the regulatory checklist and coaches the handler.",
    howItWorks: [
      "Choose a use-case pack: each one configures the same pipeline for a different kind of call.",
      "Play a recorded call, replay a saved run, or hold a live conversation in the room.",
      "Watch the draft record, checklist, conduct checks and coaching update as the call goes.",
      "Open the coaching and compliance review once the call ends.",
    ],
    limits: [
      "It never submits a claim or application or changes an external system; the draft stays a draft.",
      "Calls are authored, synthetic scripts; any banks and businesses in them are fictional.",
      "It does not establish production speech-recognition accuracy or handler performance.",
      "Open to Patchworks staff and invited guests.",
    ],
  },
  {
    slug: "os",
    name: "Business OS",
    origin: "https://os.patchworks.ai",
    auth: "patchworks-id",
    status: "planned",
    access: "staff",
    oneLine:
      "One place to launch, share and govern an organisation’s own AI-built apps, from a quick explainer to a fully deployed business app.",
    howItWorks: [
      "Explainers: single-page HTML apps deployed in seconds behind Patchworks sign-in, served in a locked-down sandbox.",
      "Business apps: apps that need a database are built and deployed properly, then registered and governed in Business OS.",
      "Every app gets a launcher tile, per-person access and an audit trail of who changed what.",
      "Versions can be rolled back, and deploys use short-lived, scoped tokens.",
    ],
    limits: [
      "In development; we demonstrate it on request.",
      "Explainers have no server code and no database of their own.",
      "Business apps are deployed through their own release process, not from the launcher.",
    ],
  },
];

export function appBySlug(slug: string): PatchworksApp | undefined {
  return apps.find((app) => app.slug === slug);
}

export function isAppSlug(value: unknown): value is AppSlug {
  return (
    typeof value === "string" &&
    (APP_SLUGS as readonly string[]).includes(value)
  );
}

/**
 * Apps a signed-in visitor can be offered an "Open" link for: live apps that
 * already sign in with Patchworks ID.
 */
export function openableAppSlugs(): AppSlug[] {
  return apps
    .filter((app) => app.status === "live" && app.auth === "patchworks-id")
    .map((app) => app.slug);
}

/** Builds a launch URL from local data. `path` must start with "/". */
export function appUrl(slug: AppSlug, path = "/"): string {
  const app = appBySlug(slug);
  if (!app) throw new Error(`Unknown app: ${slug}`);
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error(`Launch path must be site-relative: ${path}`);
  return new URL(path, app.origin).toString();
}
