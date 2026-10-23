import ResponsiveImage from "../Common/ResponsiveImage";
import BookingWidget from "../Common/BookingWidget";
import EditorialLink from "../Common/EditorialLink";
import { BOOKING_LABEL } from "@/data/positioning";
export default function Hero() {
  return (
    <section id="home" className="home-hero enterprise-hero">
      <div className="site-container hero-grid">
        <div>
          <p className="eyebrow enterprise-eyebrow">
            AI counsel and delivery for complex enterprises
          </p>
          <h1 className="hero-title">
            <span>Know what’s real.</span> <em>Know what to do next.</em>
          </h1>
        </div>
        <div className="hero-aside">
          <p>
            We help enterprise leaders understand what matters in AI, where the
            real risks lie and which investments deserve backing. Then we work
            alongside their teams, from reviewing programmes and suppliers to
            carrying the right decisions through to implementation.
          </p>
          <div className="hero-actions">
            <BookingWidget
              className="hero-booking"
              buttonText={BOOKING_LABEL}
            />
            <EditorialLink href="/services" quiet>
              How we help
            </EditorialLink>
          </div>
        </div>
      </div>
      <div className="hero-art">
        <ResponsiveImage
          src="/images/editorial/home-systems.webp"
          alt="White stone and glass systems connected by a continuous orange route"
          width={1983}
          height={793}
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
