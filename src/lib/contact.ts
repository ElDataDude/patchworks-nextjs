import { pillars } from "../data/positioning";

/** Shared browser/server contract. Keep secrets and delivery code out of this file. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  message: 5000,
} as const;

export const CONTACT_INTEREST_OPTIONS = [
  { value: pillars[0].id, label: pillars[0].title },
  { value: pillars[1].id, label: pillars[1].title },
  { value: "both", label: "Both" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export type ContactInterest =
  | ""
  | (typeof CONTACT_INTEREST_OPTIONS)[number]["value"];

export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  interest: ContactInterest;
  message: string;
  website: string;
}

export type ContactRequest = ContactFormValues & {
  submissionId: string;
  turnstileToken: string;
};

export type ContactFieldErrors = Partial<
  Record<keyof ContactFormValues, string>
>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: ContactFieldErrors };

type ContactValidation =
  | { ok: true; values: ContactFormValues }
  | { ok: false; error: string; fieldErrors: ContactFieldErrors };

function hasControlCharacters(value: string, multiline = false): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    if (multiline && (code === 9 || code === 10 || code === 13)) return false;
    return (
      code < 32 ||
      (code >= 127 && code <= 159) ||
      code === 0x2028 ||
      code === 0x2029
    );
  });
}

export function isValidContactEmail(value: string): boolean {
  if (value.length > CONTACT_LIMITS.email || hasControlCharacters(value))
    return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return (
    local.length > 0 &&
    local.length <= 64 &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) &&
    domain.includes(".") &&
    domain
      .split(".")
      .every((label) =>
        /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label),
      )
  );
}

export function validateContactFields(input: unknown): ContactValidation {
  const source =
    input && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const fieldErrors: ContactFieldErrors = {};
  const values: ContactFormValues = {
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
    website: "",
  };

  for (const field of ["name", "email", "company", "message"] as const) {
    const raw = source[field];
    const label = field === "message" ? "message" : field;
    if (typeof raw !== "string" || !raw.trim()) {
      fieldErrors[field] = `Please enter your ${label}.`;
      continue;
    }
    if (hasControlCharacters(raw, field === "message")) {
      fieldErrors[field] =
        `Please remove unsupported characters from your ${label}.`;
      continue;
    }
    const value = raw.trim().replace(/\r\n?/g, "\n");
    if (value.length > CONTACT_LIMITS[field]) {
      fieldErrors[field] =
        `Please use ${CONTACT_LIMITS[field]} characters or fewer.`;
      continue;
    }
    values[field] = value;
  }

  if (values.email && !isValidContactEmail(values.email)) {
    fieldErrors.email = "Please enter a valid email address.";
  } else if (values.email) {
    const [local, domain] = values.email.split("@");
    values.email = `${local}@${domain.toLowerCase()}`;
  }

  if (source.interest !== undefined && source.interest !== "") {
    if (
      typeof source.interest !== "string" ||
      !CONTACT_INTEREST_OPTIONS.some(({ value }) => value === source.interest)
    ) {
      fieldErrors.interest = "Please choose one of the listed options.";
    } else {
      values.interest = source.interest as ContactInterest;
    }
  }

  if (source.website !== undefined) {
    if (typeof source.website !== "string" || source.website.length > 200) {
      fieldErrors.website = "Please leave the website field empty.";
    } else {
      values.website = source.website.trim();
    }
  }

  return Object.keys(fieldErrors).length
    ? {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors,
      }
    : { ok: true, values };
}
