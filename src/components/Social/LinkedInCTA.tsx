import Link from "next/link";
import Image from "next/image";

const LinkedInCTA = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="wow fadeInUp rounded-md bg-primary/[.03] p-8 dark:bg-gray-dark sm:p-11 lg:p-8 xl:p-11">
          <div className="flex flex-wrap items-center gap-8 md:gap-0">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Follow Us on LinkedIn
              </h3>
              <p className="mb-8 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark sm:mb-11 lg:mb-8 xl:mb-11">
                Stay updated with our latest AI insights, industry trends, and practical implementation tips. We regularly share thought leadership content on how businesses can achieve measurable ROI from AI investments.
              </p>
              <div className="flex flex-col xs:flex-row xs:space-x-4">
                <Link
                  href="https://www.linkedin.com/company/patchworks-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 xs:mb-0"
                >
                  <span className="mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 3c0 1.1-.7 2-2 2-1.2 0-2-.9-2-1.9C1 2 1.8 1 3 1s2 .9 2 2zM1 19h4V6H1v13zM14.6 6.2c-2.1 0-3.3 1.2-3.8 2h-.1l-.2-1.7H6.9c0 1.1.1 2.4.1 3.9V19h4v-7.1c0-.4 0-.7.1-1 .3-.7.8-1.6 1.9-1.6 1.4 0 2 1.2 2 2.8V19h4v-7.4c0-3.7-1.9-5.4-4.4-5.4z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  Follow on LinkedIn
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-sm bg-black/20 px-6 py-3 text-base font-medium text-black hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/2">
              <div className="relative mx-auto aspect-[25/24] max-w-[300px] lg:mr-0">
                <Image
                  src="/images/social/linkedin-illustration.svg"
                  alt="LinkedIn"
                  fill
                  className="mx-auto max-w-full drop-shadow-three dark:hidden dark:drop-shadow-none lg:mr-0"
                />
                <Image
                  src="/images/social/linkedin-illustration-dark.svg"
                  alt="LinkedIn"
                  fill
                  className="mx-auto hidden max-w-full drop-shadow-three dark:block dark:drop-shadow-none lg:mr-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkedInCTA;
