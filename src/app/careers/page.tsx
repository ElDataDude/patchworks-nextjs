import BookingCTA from "@/components/Common/BookingCTA";
import ScrollUp from "@/components/Common/ScrollUp";
import Careers from "@/components/Careers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Patchworks AI",
  description: "Join our team of exceptional individuals who are passionate about delivering pragmatic AI solutions with measurable business impact.",
};

const CareersPage = () => {
  return (
    <>
      <ScrollUp />
      <Careers />
    </>
  );
};

export default CareersPage;
