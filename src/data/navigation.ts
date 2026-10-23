/**
 * Primary navigation. The Industries panel is built from the catalogue so the
 * menu can never drift from the routes it links to. Relative imports only.
 */
import { industries } from "./industries";
import { useCases } from "./use-cases";

export interface NavLink {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: readonly NavLink[];
}

export interface NavPanel {
  id: string;
  /** Accessible name for the disclosure button. */
  label: string;
  groups: readonly NavGroup[];
  overviewLinks: readonly NavLink[];
}

export interface NavItem {
  title: string;
  href: string;
  panel?: NavPanel;
}

export const hrefForIndustry = (slug: string) => `/industries/${slug}`;
export const hrefForUseCase = (slug: string) => `/use-cases/${slug}`;

export const primaryNavigation: readonly NavItem[] = [
  { title: "Services", href: "/services" },
  {
    title: "Industries",
    href: "/industries",
    panel: {
      id: "nav-panel-industries",
      label: "Industries and use cases",
      groups: [
        {
          title: "Industries",
          links: industries.map((industry) => ({
            title: industry.title,
            href: hrefForIndustry(industry.slug),
          })),
        },
        {
          title: "Use cases",
          links: useCases.map((useCase) => ({
            title: useCase.title,
            href: hrefForUseCase(useCase.slug),
          })),
        },
      ],
      overviewLinks: [
        { title: "Industries overview", href: "/industries" },
        { title: "All use cases", href: "/use-cases" },
      ],
    },
  },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

/** Every catalogue page, for the sitemap and route verifiers. */
export function catalogueRoutes(): string[] {
  return [
    ...industries.map((industry) => hrefForIndustry(industry.slug)),
    "/use-cases",
    ...useCases.map((useCase) => hrefForUseCase(useCase.slug)),
  ];
}
