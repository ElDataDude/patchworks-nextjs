import Link from "next/link";
import { Linkedin } from "lucide-react";
const groups = [
  {
    title: "Services",
    links: [
      ["Fractional Head-of-AI", "/services"],
      ["AI Workshops", "/services"],
      ["Custom AI Solutions", "/services"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Careers", "/careers"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Blog", "/blog"],
      ["Industries", "/industries"],
      ["Get in Touch", "/contact"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="wordmark" aria-label="Patchworks AI home">
              <span>patchworks</span>AI
            </Link>
            <p className="footer-description">
              Patchworks AI provides fractional head-of-AI services and
              pragmatic AI implementation expertise to help businesses achieve
              measurable ROI from AI investments.
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
            Patchworks AI is a trading name of PATCHWORKS AI CONSULTING LTD,
            registered in England and Wales under company number 16144699.
            Registered office: 14 David Mews, London, W1U 6EQ.
          </p>
        </div>
      </div>
    </footer>
  );
}
