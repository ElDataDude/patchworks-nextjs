import Link from "next/link";
import { Linkedin } from "lucide-react";
import {
  COMPANY_LEGAL_NAME,
  COMPANY_NUMBER,
  REGISTERED_OFFICE,
  pillars,
} from "@/data/positioning";
import BrandLogo from "../Common/BrandLogo";
import { PrivacyPreferencesButton } from "../Common/PrivacyControls";
const groups = [
  {
    title: "Services",
    links: pillars.map((pillar) => [pillar.title, pillar.href]),
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Contact", "/contact"],
      ["Careers", "/careers"],
      ["Privacy notice", "/privacy"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Industries", "/industries"],
      ["Case study", "/industries#case-study"],
      ["Use cases", "/use-cases"],
      ["Blog", "/blog"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandLogo placement="footer" />
            <p className="footer-description">
              Candid AI counsel and hands-on delivery for large, complex
              enterprises. We help leadership teams make better decisions and
              work alongside their people to put them into practice.
            </p>
            <a
              href="https://www.linkedin.com/company/patchworks-ai"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 min-w-11 items-center"
            >
              <Linkedin size={18} strokeWidth={1.5} />
            </a>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-legal">
          <p>
            © {new Date().getFullYear()} Patchworks AI. All rights reserved.
          </p>
          <p>
            Patchworks AI is a trading name of {COMPANY_LEGAL_NAME}, registered
            in England and Wales under company number {COMPANY_NUMBER}.
            Registered office: {REGISTERED_OFFICE}.
          </p>
          <PrivacyPreferencesButton className="footer-privacy-button" />
        </div>
      </div>
    </footer>
  );
}
