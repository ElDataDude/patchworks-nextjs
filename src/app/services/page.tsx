import BookingCTA from "@/components/Common/BookingCTA";
import ScrollUp from "@/components/Common/ScrollUp";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Patchworks AI",
  description: "Explore our range of AI services designed to deliver measurable ROI, from fractional head-of-AI to custom AI application development.",
};

const ServicesPage = () => {
  return (
    <>
      <ScrollUp />
      <Services />
      <TechStack />
    </>
  );
};

export default ServicesPage;
