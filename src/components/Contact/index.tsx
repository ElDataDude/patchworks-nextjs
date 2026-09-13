import NewsLatterBox from "./NewsLatterBox";
import BookingWidget from "../Common/BookingWidget";
import UnconnectedForm from "../Common/UnconnectedForm";
import { ArrowUpRight } from "lucide-react";
export default function Contact({ page = false }: { page?: boolean }) {
  const Heading = page ? "h1" : "h2";
  const Subheading = page ? "h2" : "h3";
  return (
    <section id="contact" className="section-space rule-section">
      <div className="site-container">
        <div className="contact-grid">
          <div className="contact-intro">
            <Heading className="section-heading">
              Start Your AI Journey Today
            </Heading>
            <p className="body-copy">
              Ready to see measurable ROI from AI within weeks, not years? Our
              executive-level AI expertise is just a message away. Tell us about
              your business challenges, and we&apos;ll show you how our
              pragmatic approach can deliver tangible results.
            </p>
            <div className="contact-booking">
              <Subheading>Prefer to Talk? Book a Free Consultation</Subheading>
              <p>
                Skip the form and speak directly with our AI experts. Book a
                free 30-minute strategy call to discuss your specific needs.
              </p>
              <BookingWidget buttonText="Book Free 30-Minute Call" />
            </div>
          </div>
          <UnconnectedForm
            className="form-grid"
            aria-label="Contact Patchworks AI"
          >
            <div className="form-field">
              <label htmlFor="contact-name">Your Name</label>
              <input
                className="form-control"
                id="contact-name"
                name="name"
                autoComplete="name"
                type="text"
                placeholder="Enter your name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Your Email</label>
              <input
                className="form-control"
                id="contact-email"
                name="email"
                autoComplete="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-field form-wide">
              <label htmlFor="contact-company">Company</label>
              <input
                className="form-control"
                id="contact-company"
                name="company"
                autoComplete="organization"
                type="text"
                placeholder="Enter your company name"
              />
            </div>
            <div className="form-field form-wide">
              <label htmlFor="contact-service">I&apos;m interested in</label>
              <select
                className="form-control"
                id="contact-service"
                name="service"
              >
                <option value="">Please select</option>
                <option value="fractional-head-of-ai">
                  Fractional Head-of-AI
                </option>
                <option value="getting-started-workshop">
                  Getting Started Workshop
                </option>
                <option value="ai-roadmap">Full AI Roadmap</option>
                <option value="bespoke-ai-applications">
                  Bespoke AI Applications
                </option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-field form-wide">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                className="form-control"
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Enter your message"
              />
            </div>
            <div className="form-wide">
              <button className="text-link" type="submit">
                Send Message
                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>
          </UnconnectedForm>
        </div>
        <NewsLatterBox page={page} />
      </div>
    </section>
  );
}
