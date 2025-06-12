import SectionTitle from "../Common/SectionTitle";
import ServiceCard from "./ServiceCard";

const Services = () => {
  return (
    <section id="services" className="pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
      <div className="container">
        <SectionTitle
          title="Our Services"
          paragraph="We offer a range of services designed to help businesses achieve measurable ROI from AI investments, from strategic guidance to custom implementation."
          center
          mb="30px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-2">
          <ServiceCard
            title="Fractional Head of AI"
            description="Strategic AI leadership without the full-time cost. Our fractional leaders provide executive-level guidance, team coaching, and implementation expertise."
            price="£1,500/month + VAT"
            features={[
              "3-month trial period",
              "Strategic AI roadmap development",
              "Team coaching and capability building",
              "Vendor selection and management",
              "ROI measurement and optimization",
              "Executive-level reporting and communication"
            ]}
            idealFor="COOs, CTOs, CDOs seeking strategic AI leadership without adding headcount"
            cta="Schedule a Consultation"
            ctaLink="/contact"
          />

          <ServiceCard
            title="Getting Started with AI Workshop"
            description="Transform uncertainty into clarity in just one day. Our workshop identifies your highest-ROI AI opportunities and delivers an actionable roadmap."
            price="£1,000-£4,000 + VAT"
            features={[
              "One-day intensive workshop",
              "Business value assessment",
              "AI opportunity identification",
              "Prioritized use case roadmap",
              "ROI estimation for top opportunities",
              "Comprehensive implementation plan"
            ]}
            idealFor="Organizations that are AI-curious but hesitant to commit without clear direction"
            cta="Book Your Workshop"
            ctaLink="/contact"
          />

          <ServiceCard
            title="Full AI Roadmap Package"
            description="Accelerate from concept to implementation in 4-6 weeks. This comprehensive engagement delivers a complete AI strategy and working proof-of-value."
            price="£20,000 + VAT"
            features={[
              "Multiple stakeholder workshops",
              "Comprehensive AI strategy",
              "Organization-wide alignment",
              "Proof-of-value application build",
              "Team capability assessment",
              "Detailed implementation roadmap"
            ]}
            idealFor="Organizations ready for organization-wide AI transformation with executive sponsorship"
            cta="Request Proposal"
            ctaLink="/contact"
          />

          <ServiceCard
            title="Bespoke AI Application & Workflow Automation"
            description="Custom AI solutions built for your specific business challenges. We develop and implement AI-embedded applications that deliver documented ROI."
            price="From £20,000 + VAT"
            features={[
              "Custom AI solution development",
              "Workflow automation implementation",
              "Integration with existing systems",
              "Team training and knowledge transfer",
              "Ongoing optimization and support",
              "ROI tracking and reporting"
            ]}
            idealFor="Organizations with specific AI use cases ready for implementation"
            cta="Discuss Your Project"
            ctaLink="/contact"
          />

          <ServiceCard
            title="Microsoft Copilot Integration & Training"
            description="Maximize your investment in Microsoft Copilot with expert integration, customization, and team enablement that ensures adoption and measurable productivity gains."
            price="Custom Pricing"
            features={[
              "Copilot deployment planning",
              "Custom prompt engineering",
              "Integration with business workflows",
              "Team training and adoption support",
              "Usage analytics and optimization",
              "ROI measurement framework"
            ]}
            idealFor="Enterprise teams and department heads implementing Microsoft Copilot"
            cta="Get Started with Copilot"
            ctaLink="/contact"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
