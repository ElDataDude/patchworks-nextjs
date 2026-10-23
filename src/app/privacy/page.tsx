import { createPageMetadata } from "@/data/seo";
import {
  COMPANY_LEGAL_NAME,
  COMPANY_NUMBER,
  CONTACT_EMAIL,
  REGISTERED_OFFICE,
} from "@/data/positioning";

export const metadata = createPageMetadata(
  "/privacy",
  "Privacy Notice | Patchworks AI",
  "How Patchworks AI handles enquiries, website data and third-party services.",
);

export default function PrivacyPage() {
  return (
    <article className="privacy-page section-space">
      <div className="site-container privacy-layout">
        <header className="privacy-intro">
          <p className="eyebrow">Privacy</p>
          <h1 className="page-title">Privacy notice</h1>
          <p className="body-copy">
            This notice explains how Patchworks AI handles information when you
            visit this website, contact us or book a conversation.
          </p>
          <p className="privacy-updated">
            Last updated <time dateTime="2026-09-13">13 September 2026</time>
          </p>
        </header>

        <div className="privacy-content">
          <section>
            <h2>Who is responsible for your information</h2>
            <p>
              Patchworks AI is a trading name of {COMPANY_LEGAL_NAME}, company
              number {COMPANY_NUMBER}. The company is the controller of personal
              information described in this notice.
            </p>
            <address>
              Registered office: {REGISTERED_OFFICE}
              <br />
              Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </address>
          </section>

          <section>
            <h2>Information we handle</h2>
            <p>Depending on how you use the site, we may handle:</p>
            <ul>
              <li>
                contact details and the contents of emails or enquiries you send
                us;
              </li>
              <li>
                booking details you provide when arranging a conversation;
              </li>
              <li>
                ordinary technical request information needed to deliver and
                protect the website, such as an IP address, browser headers,
                requested page and request time; and
              </li>
              <li>
                aggregate page-use and performance measurements from Cloudflare
                Web Analytics. Its beacon does not use cookies, browser storage
                or visitor fingerprinting.
              </li>
            </ul>
            <p>
              Please do not include confidential, special-category or other
              sensitive information in an initial enquiry.
            </p>
          </section>

          <section>
            <h2>Why we use it</h2>
            <p>We use information to:</p>
            <ul>
              <li>respond to enquiries and take steps you request;</li>
              <li>
                arrange and manage conversations and client relationships;
              </li>
              <li>operate, secure and improve the website; and</li>
              <li>meet legal, regulatory and accounting obligations.</li>
            </ul>
            <p>
              Our lawful bases depend on the context. They include taking steps
              at your request before entering a contract, our legitimate
              interests in responding to business enquiries and operating a
              secure service, performing a contract, and complying with legal
              obligations. Where consent is required, you can withdraw it at any
              time without affecting earlier lawful processing.
            </p>
          </section>

          <section>
            <h2>Services that support this website</h2>
            <ul>
              <li>
                <strong>Cloudflare</strong> provides hosting, delivery,
                security, cookieless Web Analytics and, when the enquiry form is
                enabled, Turnstile bot protection, D1 anti-duplicate records and
                email transmission.
              </li>
              <li>
                <strong>Cal.com</strong> provides booking. When you book with
                us, Patchworks decides why attendee data is used and Cal.com
                processes it to provide the booking service. The embedded
                experience loads only after you allow it and select a booking
                link. A direct link takes you to Cal.com instead.
              </li>
              <li>
                <strong>Google Workspace</strong> provides business email and
                receives website enquiries. The application keeps an opaque
                anti-duplicate record in Cloudflare D1 for seven days. That
                record does not contain submitted contact details or messages.
              </li>
            </ul>
            <p>
              These providers process information under their service terms and
              data-protection arrangements. Some processing may take place
              outside the United Kingdom. Where data-protection law requires it,
              transfers are covered by an applicable adequacy decision or
              contractual safeguards.
            </p>
          </section>

          <section id="cookies-and-technologies">
            <h2>Cookies and similar technologies</h2>
            <p>
              We store one first-party preference cookie for six months to
              remember whether you allow embedded Cal.com booking. It is used
              only for that choice. You can change it at any time through the
              Privacy choices button in the footer.
            </p>
            <p>
              Cloudflare Web Analytics measures aggregate page use and
              performance without reading or writing cookies, local storage,
              session storage or similar browser storage. Cloudflare currently
              makes Web Analytics reports available for the preceding six
              months.
            </p>
            <p>
              Cal.com code is not requested unless you have allowed embedded
              booking and then select a booking link. If you choose Essential
              only, booking links remain available and open Cal.com directly.
              Turnstile runs only when the online enquiry form is available and
              uses browser signals to protect that form from abuse.
            </p>
          </section>

          <section>
            <h2>How long we keep information</h2>
            <p>
              We keep enquiries, correspondence and booking records only while
              they are needed to respond, manage the resulting business
              relationship, meet legal or accounting obligations, or resolve a
              dispute. Records are then deleted through our documented review
              process. The website enquiry anti-duplicate record expires after
              seven days. Other security and service records are retained
              according to the configured provider settings and reviewed against
              their operational purpose.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              Depending on the circumstances, you may have rights to access,
              correct or erase your personal information, restrict or object to
              its use, receive a portable copy, or withdraw consent. Contact us
              at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to make
              a request.
            </p>
            <p>
              You can also complain to the UK Information Commissioner’s Office
              through its{" "}
              <a href="https://ico.org.uk/make-a-complaint/" rel="external">
                complaints service
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Changes to this notice</h2>
            <p>
              We update this page when our services or handling practices change
              and publish the revised date above.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
