import Link from "next/link";
import BookingWidget from "../Common/BookingWidget";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-white pb-12 pt-[100px] dark:bg-gray-dark md:pb-16 md:pt-[120px] xl:pb-20 xl:pt-[140px] 2xl:pb-24 2xl:pt-[160px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Executive-Level <span className="text-primary">AI</span> Leadership Without the Full-Time Cost
                </h1>
                <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  Patchworks AI bridges the gap between executive vision and technical execution, delivering measurable ROI from AI investments in weeks, not months or years.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <BookingWidget 
                    variant="primary"
                    buttonText="Book Your Free 30-Minute AI Strategy Call"
                  />
                  <Link
                    href="/services"
                    className="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                  >
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background decorative elements removed */}
      </section>
    </>
  );
};

export default Hero;
