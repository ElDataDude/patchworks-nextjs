import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <SectionTitle
            title="Our Services"
            paragraph="From strategic guidance to hands-on implementation, our services are designed for executives who need AI solutions that deliver measurable ROI within weeks, not years. Each service is built on our pragmatic, business-first approach."
            center
            mb="40px"
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
