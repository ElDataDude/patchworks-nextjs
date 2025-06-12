import Link from "next/link";
import SectionTitle from "../Common/SectionTitle";
import JobCard from "./JobCard";

const Careers = () => {
  return (
    <section id="careers" className="pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20 bg-[#f8f8f8] dark:bg-gray-dark/30">
      <div className="container">
        <SectionTitle
          title="Join Our Team"
          paragraph="We're building a team of exceptional individuals who are passionate about delivering pragmatic AI solutions with measurable business impact."
          center
          mb="40px"
        />

        <div className="mb-16">
          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark lg:px-5 xl:px-8">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Why Work With Us?
            </h3>
            <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              At Patchworks AI, you'll be at the forefront of AI innovation, working directly with clients to solve real business challenges. We're a growth-stage company with a culture that values autonomy, craft, speed, long-term thinking, and transparency.
            </p>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary">
                    <path d="M20.3 12.04C20.84 11.43 21.16 10.66 21.16 9.79C21.16 8.35 20.22 7.11 18.93 6.65C18.93 6.6 18.93 6.55 18.93 6.5C18.93 4.29 17.13 2.5 14.93 2.5C13.64 2.5 12.47 3.08 11.69 3.96C10.92 2.4 9.32 1.34 7.46 1.34C4.75 1.34 2.55 3.54 2.55 6.24C2.55 6.3 2.55 6.36 2.56 6.42C1.36 7 0.55 8.24 0.55 9.67C0.55 11.7 2.2 13.35 4.23 13.35H9.34C9.4 13.35 9.46 13.35 9.5 13.33C9.92 14.9 11.39 16.04 13.11 16.04C15.13 16.04 16.78 14.39 16.78 12.37C16.78 12.26 16.77 12.15 16.76 12.04H20.3Z"></path>
                    <path d="M9.5 13.33V22.5H13.11V16.04C11.39 16.04 9.92 14.9 9.5 13.33Z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="mb-2 text-base font-medium text-black dark:text-white">
                    Cutting-Edge Work
                  </h4>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Work with the latest AI technologies and techniques to solve real business problems.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                    <path d="M12 6V12L16 14" fill="white"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="mb-2 text-base font-medium text-black dark:text-white">
                    Flexible Work Environment
                  </h4>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Remote-first culture with flexible hours and focus on outcomes rather than hours worked.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="mb-2 text-base font-medium text-black dark:text-white">
                    Direct Client Impact
                  </h4>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    See the direct impact of your work on client businesses and their bottom line.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"></path>
                    <path d="M11 17H13V11H11V17Z" fill="white"></path>
                    <path d="M11 9H13V7H11V9Z" fill="white"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="mb-2 text-base font-medium text-black dark:text-white">
                    Growth Opportunities
                  </h4>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Rapid career advancement in a growing company with opportunities to develop new skills.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary">
                    <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"></path>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"></path>
                    <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13"></path>
                    <path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="mb-2 text-base font-medium text-black dark:text-white">
                    Collaborative Team
                  </h4>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Work with a diverse team of experts who are passionate about AI and business transformation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-primary">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"></path>
                    <path d="M18.7273 7.27273C17.8484 6.39394 16.2121 5 12 5C7.78788 5 6.15152 6.39394 5.27273 7.27273C4.39394 8.15152 3 9.78788 3 14C3 18.2121 4.39394 19.8485 5.27273 20.7273C6.15152 21.6061 7.78788 23 12 23C16.2121 23 17.8484 21.6061 18.7273 20.7273C19.6061 19.8485 21 18.2121 21 14C21 9.78788 19.6061 8.15152 18.7273 7.27273Z"></path>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="white"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="mb-2 text-base font-medium text-black dark:text-white">
                    Competitive Compensation
                  </h4>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Attractive salary packages, benefits, and potential for equity in a growing company.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-8 text-2xl font-bold text-black dark:text-white text-center">
            Open Positions
          </h3>
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            <JobCard
              title="Product Manager"
              location="Remote (UK-based)"
              type="Full-time"
              description="We're looking for a product-minded individual who can bridge the gap between business needs and technical implementation. You'll work closely with clients and our technical team to define, prioritize, and deliver AI solutions that generate measurable ROI."
              responsibilities={[
                "Translate client business needs into product requirements",
                "Work with technical teams to ensure successful implementation",
                "Define success metrics and track ROI of AI implementations",
                "Manage product roadmaps and prioritize features based on business impact"
              ]}
              requirements={[
                "3+ years of product management experience",
                "Experience with AI/ML products preferred",
                "Strong communication and stakeholder management skills",
                "Data-driven approach to decision making"
              ]}
            />
            
            <JobCard
              title="AI Automation Engineer"
              location="Remote (UK-based)"
              type="Full-time"
              description="We're seeking an experienced engineer who can build and deploy AI-powered automation solutions. You'll work with tools like n8n, Make.com, and custom LLM applications to create workflows that deliver measurable business value."
              responsibilities={[
                "Design and implement AI-powered automation workflows",
                "Integrate various systems and APIs to create end-to-end solutions",
                "Work with LLMs and other AI technologies to enhance automation capabilities",
                "Collaborate with clients to understand their processes and automation needs"
              ]}
              requirements={[
                "3+ years of experience with workflow automation tools",
                "Experience with n8n, Make.com, Zapier, or similar platforms",
                "Strong programming skills (JavaScript/TypeScript preferred)",
                "Understanding of LLMs and their application in business contexts"
              ]}
            />
            
            <JobCard
              title="AI Consultant"
              location="Remote (UK-based)"
              type="Full-time"
              description="We're looking for consultants who can help clients identify, prioritize, and implement AI opportunities. You'll work directly with client stakeholders to understand their business challenges and develop pragmatic AI solutions that deliver measurable ROI."
              responsibilities={[
                "Conduct AI opportunity assessments and workshops",
                "Develop AI roadmaps and implementation plans",
                "Guide clients through AI implementation and adoption",
                "Measure and report on the business impact of AI initiatives"
              ]}
              requirements={[
                "3+ years of consulting experience",
                "Strong understanding of AI/ML technologies and their business applications",
                "Excellent communication and presentation skills",
                "Experience with change management and technology adoption"
              ]}
            />
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Careers;
