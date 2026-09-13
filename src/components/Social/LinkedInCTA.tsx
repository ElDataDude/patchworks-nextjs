import EditorialLink from "../Common/EditorialLink";
export default function LinkedInCTA() {
  return (
    <section className="section-space rule-section" data-reveal>
      <div className="site-container social-grid">
        <h2>Follow Us on LinkedIn</h2>
        <div>
          <p className="body-copy">
            Stay updated with our latest AI insights, industry trends, and
            practical implementation tips. We regularly share thought leadership
            content on how businesses can achieve measurable ROI from AI
            investments.
          </p>
          <div className="social-links">
            <EditorialLink
              href="https://www.linkedin.com/company/patchworks-ai"
              external
            >
              Follow on LinkedIn
            </EditorialLink>
            <EditorialLink href="/contact" quiet>
              Contact Us
            </EditorialLink>
          </div>
        </div>
      </div>
    </section>
  );
}
