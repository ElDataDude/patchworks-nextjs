import SectionTitle from "../Common/SectionTitle";

const DifferentiatorSection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#f8f8f8] dark:bg-gray-dark/30">
      <div className="container">
        <SectionTitle
          title="What Makes Us Different"
          paragraph="Our unique approach combines strategic vision with pragmatic execution, delivering measurable AI results where others only promise potential."
          center
          mb="40px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div className="w-full">
            <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8">
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
                Fractional Head-of-AI
              </h3>
              <p className="text-base font-medium leading-relaxed text-body-color">
                Executive-level AI leadership without the full-time cost. Our fractional model gives you strategic guidance, team coaching, and implementation expertise at 30% the cost of a full-time hire.
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
                <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                  <path d="M28 32H4C1.79086 32 0 30.2091 0 28V4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32Z"></path>
                  <path d="M9 8H7V24H9V8Z" fill="white"></path>
                  <path d="M17 8H15V24H17V8Z" fill="white"></path>
                  <path d="M25 8H23V24H25V8Z" fill="white"></path>
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Pragmatic, ROI-First Delivery
              </h3>
              <p className="text-base font-medium leading-relaxed text-body-color">
                We focus exclusively on AI applications with measurable financial returns. Our approach prioritizes quick wins that build momentum while establishing the foundation for sustainable long-term value.
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary bg-opacity-10">
                <svg width="32" height="32" viewBox="0 0 32 32" className="fill-primary">
                  <path d="M30.7 7.53333L28.2667 5.1C27.8 4.63333 27.0667 4.63333 26.6 5.1L12.6667 19.0333L8.53333 14.9C8.06667 14.4333 7.33333 14.4333 6.86667 14.9L4.43333 17.3333C3.96667 17.8 3.96667 18.5333 4.43333 19L12.6667 27.2333C13.1333 27.7 13.8667 27.7 14.3333 27.2333L30.7 10.8667C31.1667 10.4 31.1667 9.66667 30.7 9.2L30.7 7.53333Z"></path>
                  <path d="M4.43333 27.2333C3.96667 27.7 3.23333 27.7 2.76667 27.2333L0.333332 24.8C-0.133335 24.3333 -0.133335 23.6 0.333332 23.1333L8.56666 14.9C9.03333 14.4333 9.76666 14.4333 10.2333 14.9L12.6667 17.3333C13.1333 17.8 13.1333 18.5333 12.6667 19L4.43333 27.2333Z"></path>
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Executive + Engineer Fluency
              </h3>
              <p className="text-base font-medium leading-relaxed text-body-color">
                We bridge the gap between executive vision and technical execution, speaking both languages fluently. This dual communication capability ensures alignment between business goals and technical implementation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
