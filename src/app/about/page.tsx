import AboutSectionOne from "@/components/About/AboutSectionOne";
import BookingCTA from "@/components/Common/BookingCTA";
import ScrollUp from "@/components/Common/ScrollUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Patchworks AI",
  description: "Learn about Patchworks AI's mission to deliver pragmatic AI solutions with measurable ROI through our fractional leadership model and expertise.",
};

const AboutPage = () => {
  return (
    <>
      <ScrollUp />
      <AboutSectionOne />
    </>
  );
};

export default AboutPage;
