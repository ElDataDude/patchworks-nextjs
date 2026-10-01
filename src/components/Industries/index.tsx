import { industries } from "@/data/industries";
import IndustryCard from "../Catalogue/IndustryCard";

export default function Industries() {
  return (
    <section id="industries" className="section-space rule-section">
      <div className="site-container core-list">
        {industries.map((industry, index) => (
          <IndustryCard industry={industry} index={index} key={industry.slug} />
        ))}
      </div>
    </section>
  );
}
