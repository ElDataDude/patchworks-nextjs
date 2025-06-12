import BookingCTA from "@/components/Common/BookingCTA";
import ScrollUp from "@/components/Common/ScrollUp";
import Industries from "@/components/Industries";
import UseCases from "@/components/UseCases";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries | Patchworks AI",
  description: "Discover how Patchworks AI delivers industry-specific AI solutions with measurable ROI across oil & gas, professional services, financial services, and more.",
};

const IndustriesPage = () => {
  return (
    <>
      <ScrollUp />
      <Industries />
      <UseCases />
    </>
  );
};

export default IndustriesPage;
