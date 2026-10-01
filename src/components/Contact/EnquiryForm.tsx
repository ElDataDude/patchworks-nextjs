"use client";
import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  CONTACT_INTEREST_OPTIONS,
  CONTACT_LIMITS,
  validateContactFields,
  type ContactFieldErrors,
  type ContactFormValues,
} from "@/lib/contact";
import { classifyContactResponse } from "@/lib/contact-client";
import { CONTACT_EMAIL } from "@/data/positioning";
import Link from "next/link";
import TurnstileChallenge from "./TurnstileChallenge";

const EMPTY: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  interest: "",
  message: "",
  website: "",
};
const FIELD_LABELS: Record<keyof ContactFormValues, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  interest: "Interest",
  message: "Message",
  website: "Website",
};

export default function EnquiryForm({
  siteKey,
  enabled,
}: {
  siteKey: string;
  enabled: boolean;
}) {
  const formId = useId();
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const summary = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const attempt = useRef<{ payload: string; id: string } | undefined>(
    undefined,
  );
  const onToken = useCallback((next: string) => setToken(next), []);
  const onVerificationError = useCallback(() => setToken(""), []);
  const resetChallenge = useCallback(() => {
    setToken("");
    setResetKey((key) => key + 1);
  }, []);
  useEffect(() => {
    if (retrySeconds <= 0) return;
    const timer = window.setInterval(() => {
      setRetrySeconds((current) => {
        if (current <= 1) {
          setError("You can try sending your enquiry again.");
          return 0;
        }
        return current - 1;
      });
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [retrySeconds]);
  const idFor = (field: string) => `${formId}-${field}`;
  function change(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }
  function showError(message: string, fields: ContactFieldErrors = {}) {
    setError(message);
    setFieldErrors(fields);
    requestAnimationFrame(() => summary.current?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || retrySeconds > 0 || !enabled) return;
    const validation = validateContactFields(values);
    if (validation.ok === false) {
      resetChallenge();
      showError(validation.error, validation.fieldErrors);
      return;
    }
    if (!token) {
      showError(
        "Please complete verification before sending, or use the email or booking option.",
      );
      return;
    }
    const payload = JSON.stringify(validation.values);
    if (attempt.current?.payload !== payload)
      attempt.current = { payload, id: crypto.randomUUID() };
    pending.current = true;
    setStatus("submitting");
    setError("");
    setFieldErrors({});
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.values,
          submissionId: attempt.current.id,
          turnstileToken: token,
        }),
        signal: controller.signal,
      });
      const outcome = await classifyContactResponse(response);
      if (outcome.kind === "success") {
        setStatus("success");
        setValues(EMPTY);
        attempt.current = undefined;
        requestAnimationFrame(() => summary.current?.focus());
      } else if (outcome.kind === "rate-limited") {
        setStatus("idle");
        setRetrySeconds(outcome.retrySeconds);
        showError(
          `Too many attempts were received. Please wait ${outcome.retrySeconds} seconds before trying again.`,
        );
      } else {
        setStatus("idle");
        showError(outcome.error, outcome.fieldErrors);
      }
    } catch {
      setStatus("idle");
      showError(
        "We couldn’t confirm your submission. Please retry, or email us or book a conversation.",
      );
    } finally {
      clearTimeout(timeout);
      pending.current = false;
      resetChallenge();
    }
  }
  if (status === "success")
    return (
      <div
        className="enquiry-success"
        tabIndex={-1}
        ref={summary}
        role="status"
      >
        <h3>Thank you for getting in touch.</h3>
        <p>
          Your enquiry has been submitted. We’ll be in touch using the email
          address you provided.
        </p>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setStatus("idle");
            setError("");
          }}
        >
          Send another enquiry <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    );
  return (
    <form
      method="post"
      action="/api/contact"
      className="form-grid enquiry-form"
      onSubmit={submit}
      noValidate
      aria-label="Enquire with Patchworks AI"
      aria-busy={status === "submitting"}
    >
      <div className="form-wide enquiry-heading">
        <h3>Tell us what you’re working on.</h3>
        <p>
          Share your priorities and where you would value another perspective.
        </p>
      </div>
      {!enabled && (
        <p className="form-wide contact-notice" role="status">
          Online enquiries are temporarily unavailable. Please{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>email us</a> or book a partner
          conversation.
        </p>
      )}
      {error && (
        <div
          className="form-wide form-error-summary"
          role="alert"
          tabIndex={-1}
          ref={summary}
        >
          <p>
            {retrySeconds > 0
              ? `Too many attempts were received. Please wait ${retrySeconds} second${retrySeconds === 1 ? "" : "s"} before trying again.`
              : error}
          </p>
          {Object.entries(fieldErrors).some(([, message]) => message) && (
            <ul>
              {Object.entries(fieldErrors)
                .filter(([, message]) => message)
                .map(([field, message]) => (
                  <li key={field}>
                    <a href={`#${idFor(field)}`}>
                      {FIELD_LABELS[field as keyof ContactFormValues]}:{" "}
                      {message}
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
      {(["name", "email", "company"] as const).map((field) => (
        <div
          className={`form-field ${field === "company" ? "form-wide" : ""}`}
          key={field}
        >
          <label htmlFor={idFor(field)}>
            {field === "email" ? "Work email" : FIELD_LABELS[field]}{" "}
            <span className="field-required">(required)</span>
          </label>
          <input
            id={idFor(field)}
            name={field}
            type={field === "email" ? "email" : "text"}
            autoComplete={field === "company" ? "organization" : field}
            required
            maxLength={CONTACT_LIMITS[field]}
            value={values[field]}
            onChange={(event) => change(field, event.target.value)}
            className="form-control"
            aria-invalid={Boolean(fieldErrors[field])}
            aria-describedby={
              fieldErrors[field] ? idFor(`${field}-error`) : undefined
            }
            disabled={status === "submitting"}
          />
          {fieldErrors[field] && (
            <p className="field-error" id={idFor(`${field}-error`)}>
              {fieldErrors[field]}
            </p>
          )}
        </div>
      ))}
      <div className="form-field form-wide">
        <label htmlFor={idFor("interest")}>
          What would you like to discuss?{" "}
          <span className="field-required">(optional)</span>
        </label>
        <select
          id={idFor("interest")}
          name="interest"
          className="form-control"
          value={values.interest}
          onChange={(event) => change("interest", event.target.value)}
          disabled={status === "submitting"}
          aria-invalid={Boolean(fieldErrors.interest)}
          aria-describedby={
            fieldErrors.interest ? idFor("interest-error") : undefined
          }
        >
          <option value="">Please select</option>
          {CONTACT_INTEREST_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldErrors.interest && (
          <p className="field-error" id={idFor("interest-error")}>
            {fieldErrors.interest}
          </p>
        )}
      </div>
      <div className="form-field form-wide">
        <label htmlFor={idFor("message")}>
          Your message <span className="field-required">(required)</span>
        </label>
        <textarea
          id={idFor("message")}
          name="message"
          className="form-control"
          required
          maxLength={CONTACT_LIMITS.message}
          rows={5}
          value={values.message}
          onChange={(event) => change("message", event.target.value)}
          disabled={status === "submitting"}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={`${idFor("privacy")}${fieldErrors.message ? ` ${idFor("message-error")}` : ""}`}
        />
        {fieldErrors.message && (
          <p className="field-error" id={idFor("message-error")}>
            {fieldErrors.message}
          </p>
        )}
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor={idFor("website")}>Leave this field empty</label>
        <input
          id={idFor("website")}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => change("website", event.target.value)}
        />
      </div>
      <p className="form-wide enquiry-privacy" id={idFor("privacy")}>
        We use your details to respond to your enquiry. Please keep this
        introduction to a general overview and leave out confidential
        information. Read our <Link href="/privacy">privacy notice</Link>.
      </p>
      {enabled && (
        <div className="form-wide">
          <TurnstileChallenge
            siteKey={siteKey}
            resetKey={resetKey}
            onToken={onToken}
            onError={onVerificationError}
            onRefresh={resetChallenge}
          />
        </div>
      )}
      <div className="form-wide enquiry-submit">
        <button
          type="submit"
          className="text-link"
          disabled={!enabled || status === "submitting" || retrySeconds > 0}
        >
          {status === "submitting"
            ? "Sending enquiry…"
            : retrySeconds > 0
              ? `Try again in ${retrySeconds}s`
              : "Send enquiry"}
          <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
        </button>
        <span className="sr-only" role="status">
          {status === "submitting" ? "Sending your enquiry. Please wait." : ""}
        </span>
      </div>
      <noscript>
        <p>
          Please enable JavaScript to submit this form, or{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>email us directly</a>.
        </p>
      </noscript>
    </form>
  );
}
