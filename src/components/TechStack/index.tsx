import Image from "next/image";

const technologies = [
  {
    title: "Process Automation & Integration",
    description:
      "We use powerful workflow automation tools to connect systems, automate processes, and create seamless data flows that eliminate manual work and reduce errors.",
    logos: [
      { src: "/images/tech/n8n.svg", alt: "n8n" },
      { src: "/images/tech/make.svg", alt: "Make.com" },
      { src: "/images/tech/zapier.svg", alt: "Zapier" },
    ],
    capabilities: [
      "API integration and orchestration",
      "Conditional workflows and business logic",
      "Data transformation and enrichment",
      "Event-driven automation",
    ],
  },
  {
    title: "Generative AI & Application Development",
    description:
      "We leverage the latest generative AI platforms to build custom applications that can understand, generate, and process natural language, images, and other complex data types.",
    logos: [
      { src: "/images/tech/dify.svg", alt: "dify.ai" },
      { src: "/images/tech/deepopinion.svg", alt: "DeepOpinion" },
      { src: "/images/tech/langchain.svg", alt: "LangChain" },
    ],
    capabilities: [
      "Custom LLM application development",
      "Retrieval-augmented generation (RAG)",
      "Fine-tuning and prompt engineering",
      "Multi-modal AI integration",
    ],
  },
  {
    title: "Productivity & Desktop AI",
    description:
      "We help organizations maximize productivity through AI-powered tools that enhance everyday work, from document creation to data analysis and decision support.",
    logos: [
      { src: "/images/tech/microsoft-copilot.svg", alt: "Microsoft Copilot" },
      { src: "/images/tech/power-automate.svg", alt: "Power Automate" },
      { src: "/images/tech/power-apps.svg", alt: "Power Apps" },
    ],
    capabilities: [
      "Microsoft Copilot deployment and customization",
      "Custom copilot development for specific workflows",
      "AI-enhanced productivity training",
      "Microsoft 365 AI integration",
    ],
  },
  {
    title: "Data & Analytics",
    description:
      "We implement data analytics and machine learning solutions that transform raw data into actionable insights, predictive capabilities, and automated decision-making.",
    logos: [
      { src: "/images/tech/power-bi.svg", alt: "Power BI" },
      { src: "/images/tech/python.svg", alt: "Python" },
      { src: "/images/tech/tensorflow.svg", alt: "TensorFlow" },
    ],
    capabilities: [
      "Predictive analytics and forecasting",
      "Anomaly detection and monitoring",
      "Data visualization and dashboards",
      "Machine learning model development",
    ],
  },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="section-space tech-stack">
      <div className="site-container">
        <div className="editorial-layout">
          <div className="editorial-anchor">
            <h2 className="section-heading">Our Technology Stack</h2>
          </div>
          <div className="editorial-content">
            <p className="editorial-intro">
              We leverage cutting-edge AI tools and platforms to deliver rapid,
              flexible, and powerful solutions that integrate seamlessly with
              your existing systems.
            </p>
          </div>
        </div>
        <div>
          {technologies.map((technology, index) => (
            <article className="tech-row" key={technology.title}>
              <span className="item-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="item-title">{technology.title}</h3>
              <div className="tech-copy">
                <p>{technology.description}</p>
                <div className="tech-logos">
                  {technology.logos.map((logo) => (
                    <span className="tech-logo" key={logo.alt}>
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={30}
                        height={30}
                      />
                    </span>
                  ))}
                </div>
              </div>
              <div className="tech-capabilities">
                <h4>Key Capabilities:</h4>
                <ul className="detail-list">
                  {technology.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
