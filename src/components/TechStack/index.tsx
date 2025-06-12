import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const TechStack = () => {
  return (
    <section id="tech-stack" className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <SectionTitle
          title="Our Technology Stack"
          paragraph="We leverage cutting-edge AI tools and platforms to deliver rapid, flexible, and powerful solutions that integrate seamlessly with your existing systems."
          center
          mb="40px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Process Automation & Integration
              </h3>
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  className="fill-current"
                >
                  <path
                    opacity="0.5"
                    d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30ZM35 30C37.75 30 40 32.25 40 35C40 37.75 37.75 40 35 40C32.25 40 30 37.75 30 35C30 32.25 32.25 30 35 30ZM35 15C37.75 15 40 17.25 40 20C40 22.75 37.75 25 35 25C32.25 25 30 22.75 30 20C30 17.25 32.25 15 35 15Z"
                  />
                  <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15ZM20 0C22.75 0 25 2.25 25 5C25 7.75 22.75 10 20 10C17.25 10 15 7.75 15 5C15 2.25 17.25 0 20 0ZM5 30C7.75 30 10 32.25 10 35C10 37.75 7.75 40 5 40C2.25 40 0 37.75 0 35C0 32.25 2.25 30 5 30ZM5 15C7.75 15 10 17.25 10 20C10 22.75 7.75 25 5 25C2.25 25 0 22.75 0 20C0 17.25 2.25 15 5 15ZM5 0C7.75 0 10 2.25 10 5C10 7.75 7.75 10 5 10C2.25 10 0 7.75 0 5C0 2.25 2.25 0 5 0ZM35 0C37.75 0 40 2.25 40 5C40 7.75 37.75 10 35 10C32.25 10 30 7.75 30 5C30 2.25 32.25 0 35 0Z" />
                </svg>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
                We use powerful workflow automation tools to connect systems, automate processes, and create seamless data flows that eliminate manual work and reduce errors.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/n8n.svg"
                    alt="n8n"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/make.svg"
                    alt="Make.com"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/zapier.svg"
                    alt="Zapier"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
                Key Capabilities:
              </h4>
              <ul className="space-y-1">
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  API integration and orchestration
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Conditional workflows and business logic
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Data transformation and enrichment
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Event-driven automation
                </li>
              </ul>
            </div>
          </div>
          
          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Generative AI & Application Development
              </h3>
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  className="fill-current"
                >
                  <path
                    opacity="0.5"
                    d="M39 12C39.5523 12 40 12.4477 40 13V39C40 39.5523 39.5523 40 39 40H13C12.4477 40 12 39.5523 12 39V33C12 32.4477 12.4477 32 13 32H31C31.5523 32 32 31.5523 32 31V13C32 12.4477 32.4477 12 33 12H39Z"
                  />
                  <rect width="28" height="28" rx="1" />
                </svg>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
                We leverage the latest generative AI platforms to build custom applications that can understand, generate, and process natural language, images, and other complex data types.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/dify.svg"
                    alt="dify.ai"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/deepopinion.svg"
                    alt="DeepOpinion"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/langchain.svg"
                    alt="LangChain"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
                Key Capabilities:
              </h4>
              <ul className="space-y-1">
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Custom LLM application development
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Retrieval-augmented generation (RAG)
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Fine-tuning and prompt engineering
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Multi-modal AI integration
                </li>
              </ul>
            </div>
          </div>
          
          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Productivity & Desktop AI
              </h3>
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  className="fill-current"
                >
                  <path
                    opacity="0.5"
                    d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30ZM35 30C37.75 30 40 32.25 40 35C40 37.75 37.75 40 35 40C32.25 40 30 37.75 30 35C30 32.25 32.25 30 35 30ZM35 15C37.75 15 40 17.25 40 20C40 22.75 37.75 25 35 25C32.25 25 30 22.75 30 20C30 17.25 32.25 15 35 15Z"
                  />
                  <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15ZM20 0C22.75 0 25 2.25 25 5C25 7.75 22.75 10 20 10C17.25 10 15 7.75 15 5C15 2.25 17.25 0 20 0ZM5 30C7.75 30 10 32.25 10 35C10 37.75 7.75 40 5 40C2.25 40 0 37.75 0 35C0 32.25 2.25 30 5 30ZM5 15C7.75 15 10 17.25 10 20C10 22.75 7.75 25 5 25C2.25 25 0 22.75 0 20C0 17.25 2.25 15 5 15ZM5 0C7.75 0 10 2.25 10 5C10 7.75 7.75 10 5 10C2.25 10 0 7.75 0 5C0 2.25 2.25 0 5 0ZM35 0C37.75 0 40 2.25 40 5C40 7.75 37.75 10 35 10C32.25 10 30 7.75 30 5C30 2.25 32.25 0 35 0Z" />
                </svg>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
                We help organizations maximize productivity through AI-powered tools that enhance everyday work, from document creation to data analysis and decision support.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/microsoft-copilot.svg"
                    alt="Microsoft Copilot"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/power-automate.svg"
                    alt="Power Automate"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/power-apps.svg"
                    alt="Power Apps"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
                Key Capabilities:
              </h4>
              <ul className="space-y-1">
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Microsoft Copilot deployment and customization
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Custom copilot development for specific workflows
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  AI-enhanced productivity training
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Microsoft 365 AI integration
                </li>
              </ul>
            </div>
          </div>
          
          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Data & Analytics
              </h3>
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
                <svg
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  className="fill-current"
                >
                  <path
                    opacity="0.5"
                    d="M37.7778 40.2223H24C22.8954 40.2223 22 39.3268 22 38.2223V20.0001C22 18.8955 22.8954 18.0001 24 18.0001H37.7778C38.8823 18.0001 39.7778 18.8955 39.7778 20.0001V38.2223C39.7778 39.3268 38.8823 40.2223 37.7778 40.2223Z"
                  />
                  <path d="M23.2222 0C22.6699 0 22.2222 0.447715 22.2222 1V12.3333C22.2222 12.8856 22.6699 13.3333 23.2222 13.3333H39C39.5523 13.3333 40 12.8856 40 12.3333V0.999999C40 0.447714 39.5523 0 39 0H23.2222ZM0 39C0 39.5523 0.447715 40 1 40H16.7778C17.3301 40 17.7778 39.5523 17.7778 39V27.6667C17.7778 27.1144 17.3301 26.6667 16.7778 26.6667H1C0.447716 26.6667 0 27.1144 0 27.6667V39ZM0 21.2222C0 21.7745 0.447715 22.2222 1 22.2222H16.7778C17.3301 22.2222 17.7778 21.7745 17.7778 21.2222V0.999999C17.7778 0.447714 17.3301 0 16.7778 0H1C0.447716 0 0 0.447715 0 1V21.2222Z" />
                </svg>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="mb-6 text-base font-medium text-body-color dark:text-body-color-dark">
                We implement data analytics and machine learning solutions that transform raw data into actionable insights, predictive capabilities, and automated decision-making.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/power-bi.svg"
                    alt="Power BI"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/python.svg"
                    alt="Python"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white shadow-md dark:bg-gray-dark/40">
                  <Image
                    src="/images/tech/tensorflow.svg"
                    alt="TensorFlow"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
                Key Capabilities:
              </h4>
              <ul className="space-y-1">
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Predictive analytics and forecasting
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Anomaly detection and monitoring
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Data visualization and dashboards
                </li>
                <li className="text-sm text-body-color dark:text-body-color-dark flex items-center">
                  <span className="mr-2 text-primary">•</span>
                  Machine learning model development
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
