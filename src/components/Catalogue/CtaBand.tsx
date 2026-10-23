import { ArrowUpRight } from "lucide-react";
import BookingWidget from "../Common/BookingWidget";
import {
  enquiryHref,
  isEnquiryFormEnabled,
  type EnquiryContext,
} from "@/lib/enquiry-links";

/** The static "Request a demo" call to action, always server-rendered. */
export default function CtaBand({
  heading,
  text,
  context,
  children,
}: {
  heading: string;
  text: string;
  context: EnquiryContext;
  children?: React.ReactNode;
}) {
  return (
    <section className="catalogue-cta section-space rule-section">
      <div className="site-container editorial-layout">
        <h2 className="section-heading catalogue-section-heading">{heading}</h2>
        <div className="editorial-content">
          <p className="editorial-intro">{text}</p>
          <div className="catalogue-cta-actions">
            <a
              className="text-link catalogue-cta-primary"
              href={enquiryHref(context, isEnquiryFormEnabled())}
              data-cta="request-demo"
            >
              {context.intent === "access"
                ? "Request access"
                : "Request a demo"}
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
            </a>
            <BookingWidget />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
