import Contact from "@/components/Contact";

import { createPageMetadata } from "@/data/seo";

export const metadata = createPageMetadata("/contact");

const ContactPage = () => {
  return (
    <>
      <Contact page />
    </>
  );
};

export default ContactPage;
