import EditorialLink from "../Common/EditorialLink";
import JobCard from "./JobCard";

const values = [
  {
    title: "Cutting-Edge Work",
    description:
      "Work with the latest AI technologies and techniques to solve real business problems.",
  },
  {
    title: "Flexible Work Environment",
    description:
      "Remote-first culture with flexible hours and focus on outcomes rather than hours worked.",
  },
  {
    title: "Direct Client Impact",
    description:
      "See the direct impact of your work on client businesses and their bottom line.",
  },
  {
    title: "Growth Opportunities",
    description:
      "Rapid career advancement in a growing company with opportunities to develop new skills.",
  },
  {
    title: "Collaborative Team",
    description:
      "Work with a diverse team of experts who are passionate about AI and business transformation.",
  },
  {
    title: "Competitive Compensation",
    description:
      "Attractive salary packages, benefits, and potential for equity in a growing company.",
  },
];

const jobs = [
  {
    title: "Product Manager",
    location: "Remote (UK-based)",
    type: "Full-time",
    description:
      "We're looking for a product-minded individual who can bridge the gap between business needs and technical implementation. You'll work closely with clients and our technical team to define, prioritize, and deliver AI solutions that generate measurable ROI.",
    responsibilities: [
      "Translate client business needs into product requirements",
      "Work with technical teams to ensure successful implementation",
      "Define success metrics and track ROI of AI implementations",
      "Manage product roadmaps and prioritize features based on business impact",
    ],
    requirements: [
      "3+ years of product management experience",
      "Experience with AI/ML products preferred",
      "Strong communication and stakeholder management skills",
      "Data-driven approach to decision making",
    ],
  },
  {
    title: "AI Automation Engineer",
    location: "Remote (UK-based)",
    type: "Full-time",
    description:
      "We're seeking an experienced engineer who can build and deploy AI-powered automation solutions. You'll work with tools like n8n, Make.com, and custom LLM applications to create workflows that deliver measurable business value.",
    responsibilities: [
      "Design and implement AI-powered automation workflows",
      "Integrate various systems and APIs to create end-to-end solutions",
      "Work with LLMs and other AI technologies to enhance automation capabilities",
      "Collaborate with clients to understand their processes and automation needs",
    ],
    requirements: [
      "3+ years of experience with workflow automation tools",
      "Experience with n8n, Make.com, Zapier, or similar platforms",
      "Strong programming skills (JavaScript/TypeScript preferred)",
      "Understanding of LLMs and their application in business contexts",
    ],
  },
  {
    title: "AI Consultant",
    location: "Remote (UK-based)",
    type: "Full-time",
    description:
      "We're looking for consultants who can help clients identify, prioritize, and implement AI opportunities. You'll work directly with client stakeholders to understand their business challenges and develop pragmatic AI solutions that deliver measurable ROI.",
    responsibilities: [
      "Conduct AI opportunity assessments and workshops",
      "Develop AI roadmaps and implementation plans",
      "Guide clients through AI implementation and adoption",
      "Measure and report on the business impact of AI initiatives",
    ],
    requirements: [
      "3+ years of consulting experience",
      "Strong understanding of AI/ML technologies and their business applications",
      "Excellent communication and presentation skills",
      "Experience with change management and technology adoption",
    ],
  },
];

export default function Careers() {
  return (
    <>
      <section className="section-space rule-section">
        <div className="site-container">
          <div className="editorial-layout">
            <div className="editorial-anchor">
              <h2 className="section-heading">Why Work With Us?</h2>
            </div>
            <div className="editorial-content">
              <p className="editorial-intro">
                At Patchworks AI, you&apos;ll be at the forefront of AI
                innovation, working directly with clients to solve real business
                challenges. We&apos;re a growth-stage company with a culture
                that values autonomy, craft, speed, long-term thinking, and
                transparency.
              </p>
            </div>
          </div>
          <div className="careers-values">
            {values.map((value, index) => (
              <article className="career-value" key={value.title}>
                <span className="item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="careers" className="section-space">
        <div className="site-container">
          <div className="editorial-layout">
            <div className="editorial-anchor">
              <h2 className="section-heading">Open Positions</h2>
            </div>
            <div className="editorial-content" />
          </div>
          <div className="jobs-list">
            {jobs.map((job, index) => (
              <JobCard
                key={job.title}
                number={String(index + 1).padStart(2, "0")}
                {...job}
              />
            ))}
          </div>
          <div className="careers-apply">
            <EditorialLink href="/contact">Apply Now</EditorialLink>
          </div>
        </div>
      </section>
    </>
  );
}
