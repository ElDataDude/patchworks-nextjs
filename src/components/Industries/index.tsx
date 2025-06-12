import SectionTitle from "../Common/SectionTitle";

const Industries = () => {
  return (
    <section id="industries" className="pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
      <div className="container">
        <SectionTitle
          title="Industry Expertise"
          paragraph="We've helped organizations across multiple industries achieve measurable ROI from AI investments, with deep expertise in these sectors."
          center
          mb="40px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
              <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                <path d="M28 32H4C1.8 32 0 30.2 0 28V4C0 1.8 1.8 0 4 0H28C30.2 0 32 1.8 32 4V28C32 30.2 30.2 32 28 32ZM4 2C2.9 2 2 2.9 2 4V28C2 29.1 2.9 30 4 30H28C29.1 30 30 29.1 30 28V4C30 2.9 29.1 2 28 2H4Z"></path>
                <path d="M9 25C8.4 25 8 24.6 8 24V16C8 15.4 8.4 15 9 15C9.6 15 10 15.4 10 16V24C10 24.6 9.6 25 9 25Z"></path>
                <path d="M16 25C15.4 25 15 24.6 15 24V8C15 7.4 15.4 7 16 7C16.6 7 17 7.4 17 8V24C17 24.6 16.6 25 16 25Z"></path>
                <path d="M23 25C22.4 25 22 24.6 22 24V12C22 11.4 22.4 11 23 11C23.6 11 24 11.4 24 12V24C24 24.6 23.6 25 23 25Z"></path>
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Oil & Gas
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              Specialized expertise in drilling analytics, operational optimization, and predictive maintenance. We've helped energy companies reduce downtime, optimize production, and improve safety through AI-driven insights.
            </p>
          </div>

          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
              <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                <path d="M27 32H5C2.2 32 0 29.8 0 27V5C0 2.2 2.2 0 5 0H27C29.8 0 32 2.2 32 5V27C32 29.8 29.8 32 27 32ZM5 2C3.3 2 2 3.3 2 5V27C2 28.7 3.3 30 5 30H27C28.7 30 30 28.7 30 27V5C30 3.3 28.7 2 27 2H5Z"></path>
                <path d="M16 7C16.6 7 17 7.4 17 8V24C17 24.6 16.6 25 16 25C15.4 25 15 24.6 15 24V8C15 7.4 15.4 7 16 7Z"></path>
                <path d="M24 15H8C7.4 15 7 15.4 7 16C7 16.6 7.4 17 8 17H24C24.6 17 25 16.6 25 16C25 15.4 24.6 15 24 15Z"></path>
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Professional Services
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              Transforming how consulting, legal, and accounting firms deliver value through AI. Our solutions help professional services firms automate routine tasks, enhance knowledge work, and deliver more value to clients with fewer billable hours.
            </p>
          </div>

          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
              <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                <path d="M30.7 7.53333L28.2667 5.1C27.8 4.63333 27.0667 4.63333 26.6 5.1L12.6667 19.0333L8.53333 14.9C8.06667 14.4333 7.33333 14.4333 6.86667 14.9L4.43333 17.3333C3.96667 17.8 3.96667 18.5333 4.43333 19L12.6667 27.2333C13.1333 27.7 13.8667 27.7 14.3333 27.2333L30.7 10.8667C31.1667 10.4 31.1667 9.66667 30.7 9.2L30.7 7.53333Z"></path>
                <path d="M4.43333 27.2333C3.96667 27.7 3.23333 27.7 2.76667 27.2333L0.333332 24.8C-0.133335 24.3333 -0.133335 23.6 0.333332 23.1333L8.56666 14.9C9.03333 14.4333 9.76666 14.4333 10.2333 14.9L12.6667 17.3333C13.1333 17.8 13.1333 18.5333 12.6667 19L4.43333 27.2333Z"></path>
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Financial Services
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              Enhancing financial operations through AI-powered analytics, risk assessment, and process automation. We help financial institutions improve decision-making, reduce operational costs, and enhance customer experiences.
            </p>
          </div>

          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
              <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                <path d="M18 32.0001H14C13.4477 32.0001 13 31.5524 13 31.0001V30.0001C13 29.4478 13.4477 29.0001 14 29.0001H18C18.5523 29.0001 19 29.4478 19 30.0001V31.0001C19 31.5524 18.5523 32.0001 18 32.0001Z"></path>
                <path d="M26 32.0001H22C21.4477 32.0001 21 31.5524 21 31.0001V30.0001C21 29.4478 21.4477 29.0001 22 29.0001H26C26.5523 29.0001 27 29.4478 27 30.0001V31.0001C27 31.5524 26.5523 32.0001 26 32.0001Z"></path>
                <path d="M10 32.0001H6C5.44772 32.0001 5 31.5524 5 31.0001V30.0001C5 29.4478 5.44772 29.0001 6 29.0001H10C10.5523 29.0001 11 29.4478 11 30.0001V31.0001C11 31.5524 10.5523 32.0001 10 32.0001Z"></path>
                <path d="M16 5.00008C16.5523 5.00008 17 4.55236 17 4.00008V1.00008C17 0.447795 16.5523 8.3921e-05 16 8.3921e-05C15.4477 8.3921e-05 15 0.447795 15 1.00008V4.00008C15 4.55236 15.4477 5.00008 16 5.00008Z"></path>
                <path d="M7.1688 7.16884C7.56833 7.56836 8.20146 7.56836 8.60099 7.16884C9.00051 6.76931 9.00051 6.13618 8.60099 5.73665L6.4795 3.61517C6.07998 3.21564 5.44684 3.21564 5.04732 3.61517C4.64779 4.01469 4.64779 4.64783 5.04732 5.04735L7.1688 7.16884Z"></path>
                <path d="M5 16.0001C5 15.4478 4.55228 15.0001 4 15.0001H1C0.447715 15.0001 0 15.4478 0 16.0001C0 16.5524 0.447715 17.0001 1 17.0001H4C4.55228 17.0001 5 16.5524 5 16.0001Z"></path>
                <path d="M7.1688 24.8313L5.04732 26.9528C4.64779 27.3523 4.64779 27.9855 5.04732 28.385C5.44684 28.7845 6.07998 28.7845 6.4795 28.385L8.60099 26.2635C9.00051 25.864 9.00051 25.2309 8.60099 24.8313C8.20146 24.4318 7.56833 24.4318 7.1688 24.8313Z"></path>
                <path d="M24.8314 7.16884L26.9529 5.04735C27.3524 4.64783 27.3524 4.01469 26.9529 3.61517C26.5534 3.21564 25.9202 3.21564 25.5207 3.61517L23.3992 5.73665C22.9997 6.13618 22.9997 6.76931 23.3992 7.16884C23.7987 7.56836 24.4319 7.56836 24.8314 7.16884Z"></path>
                <path d="M32 16.0001C32 15.4478 31.5523 15.0001 31 15.0001H28C27.4477 15.0001 27 15.4478 27 16.0001C27 16.5524 27.4477 17.0001 28 17.0001H31C31.5523 17.0001 32 16.5524 32 16.0001Z"></path>
                <path d="M24.8314 24.8313C24.4319 24.4318 23.7987 24.4318 23.3992 24.8313C22.9997 25.2309 22.9997 25.864 23.3992 26.2635L25.5207 28.385C25.9202 28.7845 26.5534 28.7845 26.9529 28.385C27.3524 27.9855 27.3524 27.3523 26.9529 26.9528L24.8314 24.8313Z"></path>
                <path d="M16 8.00008C11.5817 8.00008 8 11.5818 8 16.0001C8 20.4184 11.5817 24.0001 16 24.0001C20.4183 24.0001 24 20.4184 24 16.0001C24 11.5818 20.4183 8.00008 16 8.00008ZM16 22.0001C12.6863 22.0001 10 19.3138 10 16.0001C10 12.6864 12.6863 10.0001 16 10.0001C19.3137 10.0001 22 12.6864 22 16.0001C22 19.3138 19.3137 22.0001 16 22.0001Z"></path>
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Manufacturing
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              Optimizing production processes, quality control, and supply chain management through AI. Our manufacturing solutions reduce waste, improve quality, and increase throughput while reducing operational costs.
            </p>
          </div>

          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
              <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                <path d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30ZM35 30C37.75 30 40 32.25 40 35C40 37.75 37.75 40 35 40C32.25 40 30 37.75 30 35C30 32.25 32.25 30 35 30ZM35 15C37.75 15 40 17.25 40 20C40 22.75 37.75 25 35 25C32.25 25 30 22.75 30 20C30 17.25 32.25 15 35 15Z"></path>
                <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15ZM20 0C22.75 0 25 2.25 25 5C25 7.75 22.75 10 20 10C17.25 10 15 7.75 15 5C15 2.25 17.25 0 20 0ZM5 30C7.75 30 10 32.25 10 35C10 37.75 7.75 40 5 40C2.25 40 0 37.75 0 35C0 32.25 2.25 30 5 30ZM5 15C7.75 15 10 17.25 10 20C10 22.75 7.75 25 5 25C2.25 25 0 22.75 0 20C0 17.25 2.25 15 5 15ZM5 0C7.75 0 10 2.25 10 5C10 7.75 7.75 10 5 10C2.25 10 0 7.75 0 5C0 2.25 2.25 0 5 0ZM35 0C37.75 0 40 2.25 40 5C40 7.75 37.75 10 35 10C32.25 10 30 7.75 30 5C30 2.25 32.25 0 35 0Z"></path>
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Healthcare
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              Enhancing patient care and operational efficiency through AI-powered solutions. We help healthcare providers improve diagnostics, optimize resource allocation, and streamline administrative processes while maintaining compliance.
            </p>
          </div>

          <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
              <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                <path d="M28 32H4C1.79086 32 0 30.2091 0 28V4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32Z"></path>
                <path d="M9 8H7V24H9V8Z" fill="white"></path>
                <path d="M17 8H15V24H17V8Z" fill="white"></path>
                <path d="M25 8H23V24H25V8Z" fill="white"></path>
              </svg>
            </div>
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Retail & E-commerce
            </h3>
            <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
              Transforming customer experiences and operational efficiency through AI. Our retail solutions optimize inventory management, personalize customer experiences, and streamline fulfillment operations for increased sales and reduced costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;
