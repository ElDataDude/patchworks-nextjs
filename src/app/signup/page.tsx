import UnconnectedForm from "@/components/Common/UnconnectedForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Page | Free Next.js Template for Startup and SaaS",
  description: "This is Sign Up Page for Startup Nextjs Template",
};

const SignupPage = () => (
  <div>
    <div className="site-container">
      <section className="section-space mx-auto max-w-xl">
        <div className="mb-10 border-b border-[#E3E8EF] pb-8">
          <h1 className="page-title text-[clamp(48px,6vw,76px)]">
            Create your account
          </h1>
          <p className="body-copy mt-6">It’s totally free and super easy</p>
        </div>
        <div className="border-y border-[#E3E8EF] py-8">
          <button
            type="button"
            className="mb-4 flex min-h-12 w-full items-center justify-center border border-[#E3E8EF] px-6 py-3 text-sm text-[#121723] transition-colors hover:border-[#d16013] hover:text-[#d16013]"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-center border border-[#E3E8EF] px-6 py-3 text-sm text-[#121723] transition-colors hover:border-[#d16013] hover:text-[#d16013]"
          >
            Sign in with Github
          </button>
        </div>
        <p className="my-8 text-center text-sm text-[#626875]">
          Or, register with your email
        </p>
        <UnconnectedForm className="space-y-8">
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="form-control"
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Work Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your Email"
              className="form-control"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Your Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your Password"
              className="form-control"
            />
          </div>
          <label
            htmlFor="checkboxLabel"
            className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#626875]"
          >
            <input
              type="checkbox"
              id="checkboxLabel"
              className="mt-1 h-4 w-4 shrink-0 accent-[#d16013]"
            />
            <span>
              By creating account means you agree to the{" "}
              <a href="#0" className="text-[#d16013] hover:underline">
                {" "}
                Terms and Conditions{" "}
              </a>
              , and our{" "}
              <a href="#0" className="text-[#d16013] hover:underline">
                {" "}
                Privacy Policy{" "}
              </a>
            </span>
          </label>
          <button
            type="submit"
            className="min-h-14 w-full bg-[#d16013] px-9 py-4 text-base font-medium text-white transition-colors hover:bg-[#aa4d0f]"
          >
            Sign up
          </button>
        </UnconnectedForm>
        <p className="mt-8 text-center text-sm text-[#626875]">
          Already using Startup?{" "}
          <Link href="/signin" className="text-[#d16013] hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  </div>
);

export default SignupPage;
