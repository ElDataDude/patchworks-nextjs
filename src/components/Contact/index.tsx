import BookingWidget from "../Common/BookingWidget";
import EnquiryForm from "./EnquiryForm";
import Link from "next/link";
import {
  COMPANY_LEGAL_NAME,
  COMPANY_NUMBER,
  CONTACT_EMAIL,
  REGISTERED_OFFICE,
} from "@/data/positioning";

export default function Contact({ page = false }: { page?: boolean }) {
  const Heading = page ? "h1" : "h2";
  const Subheading = page ? "h2" : "h3";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const enabled =
    process.env.NEXT_PUBLIC_CONTACT_ENABLED === "true" && Boolean(siteKey);
  return (
    <section id="contact" className="section-space rule-section">
      <div className="site-container contact-grid">
        <div className="contact-intro">
          <p className="eyebrow">Let’s talk</p>
          <Heading className={page ? "page-title" : "section-heading"}>
            What needs to happen next?
          </Heading>
          <p className="body-copy">
            A clearer direction. A programme that needs a closer look. A
            supplier decision that matters. Tell us where you are and what you
            want to achieve.
          </p>
          <div className="contact-booking">
            <Subheading>Start with a conversation.</Subheading>
            <p>
              Book time with a partner to discuss your priorities and where we
              can help.
            </p>
            <BookingWidget />
          </div>
          <div className="contact-email">
            <p>Prefer email?</p>
            <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            {page && (
              <address className="contact-address">
                {COMPANY_LEGAL_NAME}, company {COMPANY_NUMBER}
                <br />
                Registered office: {REGISTERED_OFFICE}
              </address>
            )}
          </div>
        </div>
        {enabled ? (
          <EnquiryForm siteKey={siteKey} enabled />
        ) : (
          <div
            id="enquiry"
            className="contact-email-enquiry"
            data-enquiry="email"
          >
            <Subheading>Tell us what you’re working on.</Subheading>
            <p>
              Email us with a little about your company, the decision you’re
              facing and where you would value another perspective.
            </p>
            <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <p className="enquiry-privacy">
              We use your details to respond to your enquiry. Please keep this
              introduction to a general overview and leave out confidential
              information. Read our <Link href="/privacy">privacy notice</Link>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
