import Image from "next/image";
import BookingWidget from "../Common/BookingWidget";
import EditorialLink from "../Common/EditorialLink";
export default function Hero() {
  return (
    <section id="home" className="home-hero">
      <div className="site-container hero-grid">
        <h1 className="hero-title">
          <span>Executive-Level</span> <em>AI Leadership</em>{" "}
          <span className="hero-qualifier">Without the Full-Time Cost</span>
        </h1>
        <div className="hero-aside">
          <p>
            Patchworks AI bridges the gap between executive vision and technical
            execution, delivering measurable ROI from AI investments in weeks,
            not months or years.
          </p>
          <div className="hero-actions">
            <BookingWidget
              className="hero-booking"
              buttonText="Book Your Free 30-Minute AI Strategy Call"
            />
            <EditorialLink href="/services" quiet>
              Explore Services
            </EditorialLink>
          </div>
        </div>
      </div>
      <div className="hero-art">
        <Image
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
