import UnconnectedForm from "../Common/UnconnectedForm";
import { ArrowUpRight } from "lucide-react";
export default function NewsLatterBox({ page = false }: { page?: boolean }) {
  const Heading = page ? "h2" : "h3";
  return (
    <div className="newsletter">
      <div>
        <Heading>Join Our AI Insights Newsletter</Heading>
        <p>
          Stay updated with the latest AI trends, practical implementation tips,
          and case studies that demonstrate measurable ROI from AI investments.
        </p>
      </div>
      <UnconnectedForm
        className="newsletter-form"
        aria-label="AI Insights Newsletter"
      >
        <input
          className="form-control"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Enter your name"
          aria-label="Newsletter name"
        />
        <input
          className="form-control"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-label="Newsletter email"
        />
        <button type="submit" className="text-link">
          Subscribe
          <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
        </button>
        <p className="newsletter-privacy">
          We respect your privacy. No spam, just valuable AI insights.
        </p>
      </UnconnectedForm>
    </div>
  );
}
