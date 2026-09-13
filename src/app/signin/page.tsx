import UnconnectedForm from "@/components/Common/UnconnectedForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In Page | Free Next.js Template for Startup and SaaS",
  description: "This is Sign In Page for Startup Nextjs Template",
};

const SigninPage = () => (
  <div>
    <div className="site-container">
      <section className="section-space mx-auto max-w-xl">
        <div className="mb-10 border-b border-[#E3E8EF] pb-8">
          <h1 className="page-title text-[clamp(48px,6vw,76px)]">
            Sign in to your account
          </h1>
          <p className="body-copy mt-6">
            Login to your account for a faster checkout.
          </p>
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
          Or, sign in with your email
        </p>
        <UnconnectedForm className="space-y-8">
          <div className="form-field">
            <label htmlFor="email">Your Email</label>
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
          <div className="flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center">
            <label
              htmlFor="checkboxLabel"
              className="flex cursor-pointer items-center gap-3 text-[#626875]"
            >
              <input
                type="checkbox"
                id="checkboxLabel"
                className="h-4 w-4 accent-[#d16013]"
              />
              Keep me signed in
            </label>
            <a href="#0" className="text-[#d16013] hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="min-h-14 w-full bg-[#d16013] px-9 py-4 text-base font-medium text-white transition-colors hover:bg-[#aa4d0f]"
          >
            Sign in
          </button>
        </UnconnectedForm>
        <p className="mt-8 text-center text-sm text-[#626875]">
          Don’t you have an account?{" "}
          <Link href="/signup" className="text-[#d16013] hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </div>
  </div>
);

export default SigninPage;
