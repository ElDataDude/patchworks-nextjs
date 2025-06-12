import SectionTitle from "../Common/SectionTitle";
import UseCaseCard from "./UseCaseCard";

const UseCases = () => {
  return (
    <section id="use-cases" className="py-16 md:py-20 lg:py-28 bg-[#f8f8f8] dark:bg-gray-dark/30">
      <div className="container">
        <SectionTitle
          title="High-ROI AI Use Cases"
          paragraph="Practical applications of AI that deliver measurable business value across operations, data, finance, HR, and more."
          center
          mb="50px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <UseCaseCard
            title="Automated Document Processing"
            problem="Manual document processing is slow, error-prone, and expensive, with staff spending 15+ hours weekly on repetitive tasks."
            solution="AI-powered document extraction and processing that automatically captures, categorizes, and routes information from invoices, contracts, and forms."
            tool="Document AI + workflow automation"
            result="85% reduction in processing time, 95% accuracy, and £120K annual savings for a mid-sized organization."
          />

          <UseCaseCard
            title="Customer Support Copilot"
            problem="Support teams struggle with response consistency, knowledge retrieval, and handling increasing ticket volumes."
            solution="AI assistant that provides real-time guidance to agents, suggests responses, retrieves relevant information, and automates routine inquiries."
            tool="LLM-powered copilot with RAG"
            result="40% faster resolution times, 30% increase in first-contact resolution, and improved CSAT scores."
          />

          <UseCaseCard
            title="Sales Intelligence Automation"
            problem="Sales teams waste time on manual research, struggle to prioritize leads, and miss opportunities in existing accounts."
            solution="AI system that analyzes customer data, identifies buying signals, recommends next best actions, and automates personalized outreach."
            tool="Predictive analytics + generative AI"
            result="27% increase in sales productivity, 35% higher conversion rates, and 22% growth in average deal size."
          />

          <UseCaseCard
            title="Financial Forecasting Enhancement"
            problem="Finance teams rely on basic Excel models that miss complex patterns and require extensive manual updates."
            solution="Machine learning models that analyze historical data, identify trends, and generate more accurate forecasts while reducing manual effort."
            tool="Time series forecasting + anomaly detection"
            result="40% improvement in forecast accuracy, 70% reduction in preparation time, and earlier identification of financial risks."
          />

          <UseCaseCard
            title="HR Candidate Matching"
            problem="Recruiters spend hours manually screening CVs, leading to hiring delays, missed candidates, and inconsistent evaluation."
            solution="AI-powered candidate matching that identifies the best fits based on skills, experience, and cultural alignment while reducing unconscious bias."
            tool="NLP + semantic matching algorithms"
            result="65% reduction in time-to-shortlist, 45% improvement in candidate quality, and more diverse candidate pools."
          />

          <UseCaseCard
            title="Operational Anomaly Detection"
            problem="Operations teams can't manually monitor all systems and often miss early warning signs of equipment failures or process inefficiencies."
            solution="AI system that continuously monitors operational data, detects anomalies, predicts potential failures, and recommends preventive actions."
            tool="Machine learning + real-time analytics"
            result="72% reduction in unplanned downtime, 35% decrease in maintenance costs, and extended equipment lifespan."
          />
        </div>
      </div>
    </section>
  );
};

export default UseCases;
