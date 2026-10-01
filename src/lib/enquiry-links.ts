/**
 * Links from catalogue pages to the enquiry form. Query parameters are
 * allow-listed again by the form and the contact API, so these links only
 * prefill; they never decide what is accepted. Relative imports only.
 */
import { CONTACT_EMAIL } from "../data/positioning";

export type EnquiryIntent = "demo" | "access";

export interface EnquiryContext {
  intent: EnquiryIntent;
  useCase?: string;
  industry?: string;
  app?: string;
  /** Human-readable topic for the email fallback subject. */
  topic?: string;
}

export function enquiryHref(
  context: EnquiryContext,
  formEnabled: boolean,
): string {
  if (!formEnabled) {
    const subject =
      context.intent === "access"
        ? `Patchworks AI access request${context.topic ? `: ${context.topic}` : ""}`
        : `Patchworks AI demo request${context.topic ? `: ${context.topic}` : ""}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
  }
  const params = new URLSearchParams({ intent: context.intent });
  if (context.useCase) params.set("useCase", context.useCase);
  if (context.industry) params.set("industry", context.industry);
  if (context.app) params.set("app", context.app);
  return `/contact?${params.toString()}#enquiry`;
}

/** Mirrors the contact page: the form renders only with a site key. */
export function isEnquiryFormEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_CONTACT_ENABLED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  );
}
