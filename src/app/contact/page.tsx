import BookingCTA from "@/components/Common/BookingCTA";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Patchworks AI | Fractional AI Leadership & Implementation",
  description:
    "Get in touch with Patchworks AI to discuss how our fractional AI leadership and implementation services can help your business achieve measurable ROI from AI investments.",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Contact page />
    </>
  );
};

export default ContactPage;
