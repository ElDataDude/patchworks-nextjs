import {
  BOOKING_LABEL,
  pillars,
  relationshipDisclosure,
} from "@/data/positioning";
import BookingWidget from "../Common/BookingWidget";
import ServiceCard from "./ServiceCard";

const serviceDetails = {
  "ai-counsel": {
    questions: [
      "Which frontier developments matter to our business, and what could change next?",
      "Where are the real opportunities and risks across our organisation?",
      "Which assumptions should we challenge before committing investment?",
    ],
    activities: [
      "Leadership briefings on AI capabilities, limitations and market developments.",
      "Technical and commercial scrutiny of proposed opportunities.",
      "Assessment of enterprise implications across teams, markets and customer operations.",
    ],
    outputs: [
      "A clear view of the developments that matter to your enterprise.",
      "Prioritised opportunities, risks and questions that need evidence.",
      "Decision recommendations and a practical direction for investment.",
    ],
  },
  "review-delivery": {
    questions: [
      "Which parts of our AI programme are working, and what is holding progress back?",
      "Should we build, buy, or use capabilities already available to our teams?",
      "What will it take to make the chosen approach work in practice?",
    ],
    activities: [
      "Review programmes, architecture, code and workflows with your teams.",
      "Assess supplier claims against evidence, enterprise requirements and alternatives.",
      "Prioritise changes and work alongside your teams through implementation.",
      "Define useful measures of performance, adoption and business value.",
    ],
    outputs: [
      "A candid programme assessment and recommendations on what to change.",
      "Evidence-based build, buy and supplier decisions.",
      "An implementation plan, hands-on delivery and agreed measures of progress.",
    ],
  },
} as const;

const workingSteps = [
  {
    title: "Understand the decision",
    text: "Start with your priorities, existing work and the constraints your teams operate within. Agree the questions the engagement needs to answer.",
  },
  {
    title: "Test against reality",
    text: "Examine the technology, evidence and business case together. Make the trade-offs visible and agree which actions deserve investment.",
  },
  {
    title: "Put it to work",
    text: "Work with your teams to carry decisions into delivery, with clear ownership and measures of progress. Scope and responsibility are agreed for each engagement.",
  },
];

export default function Services() {
  return (
    <>
      <section id="services" className="enterprise-services section-space">
        <div className="site-container">
          {pillars.map((pillar, index) => (
            <ServiceCard
              key={pillar.id}
              number={String(index + 1).padStart(2, "0")}
              {...pillar}
              {...serviceDetails[pillar.id]}
            />
          ))}
        </div>
      </section>
      <section className="section-space rule-section enterprise-working">
        <div className="site-container editorial-layout">
          <h2 className="section-heading editorial-anchor">
            Alongside your team.
          </h2>
          <div className="editorial-content">
            <p className="editorial-intro">
              Your leaders set the ambition. We bring fresh scrutiny and
              practical support, working with the people responsible for making
              it happen.
            </p>
            {workingSteps.map((step, index) => (
              <article className="numbered-item" key={step.title}>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="item-title">{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space rule-section enterprise-vendors">
        <div className="site-container editorial-layout">
          <h2 className="section-heading editorial-anchor">
            Technology has to earn its place.
          </h2>
          <div className="editorial-content">
            <p className="editorial-intro">
              An impressive demo is not a strategy. We assess a supplier’s
              offering against your needs, the capabilities your teams already
              have and what they could build using frontier models.
            </p>
            <div className="enterprise-vendor-copy">
              <p>
                That means examining performance, integration, data and control
                requirements, cost and the durability of the supplier’s
                differentiation. The recommendation starts with your business
                case and the evidence behind it.
              </p>
              <p>{relationshipDisclosure}</p>
            </div>
            <BookingWidget buttonText={BOOKING_LABEL} />
          </div>
        </div>
      </section>
    </>
  );
}
