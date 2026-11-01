import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Site } from "@/content/types";
import { SiteFooter } from "./SiteFooter";

// Values copied from content/site.json.
const site: Site = {
  name: "Moroccan Software Crafters",
  shortName: "MSC",
  tagline: "Association à but non lucratif",
  mission: "Stimuler et promouvoir les valeurs du Software Craftsmanship au Maroc",
  description:
    "Depuis 2019, Moroccan Software Crafters réunit développeurs, testeurs et ops un samedi matin chez une entreprise hôte à Casablanca, et organise chaque année SoCraTes Maroc.",
  baseUrl: "https://bzinoun.github.io/moroccan-software-crafters",
  since: 2019,
  linkedinFollowers: 3666,
  links: {
    linkedin: "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    socrates: "https://socrates-ma.github.io/",
    github: "https://github.com/bzinoun/moroccan-software-crafters",
  },
  contact: { email: "" },
  form: { endpoint: "", extraFields: {} },
  nav: [
    { label: "Le meetup", href: "meetup.html" },
    { label: "Éditions", href: "index.html#historique" },
    { label: "SoCraTes", href: "socrates.html" },
    { label: "Actualités", href: "actualites.html" },
    { label: "L'association", href: "association.html" },
  ],
  cta: { label: "Accueillir un meetup", href: "accueillir.html" },
  footer: {
    links: [
      { label: "Accueillir un meetup", href: "accueillir.html" },
      { label: "Sponsoriser SoCraTes", href: "socrates.html#sponsoring" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/moroccansoftwarecrafters/" },
      { label: "Site SoCraTes Maroc", href: "https://socrates-ma.github.io/" },
    ],
    legal:
      "Moroccan Software Crafters, association à but non lucratif. Une communauté ouverte, sans sexisme, sans élitisme et sans contrainte technologique.",
  },
};

function footerNav() {
  return screen.getByRole("navigation", { name: "Liens de pied de page" });
}

describe("SiteFooter", () => {
  it("renders the brand with the name and the mission", () => {
    render(<SiteFooter site={site} />);
    const brand = screen.getByRole("link", { name: /Moroccan Software Crafters/ });
    expect(brand).toHaveClass("brand");
    expect(brand).toHaveAttribute("href", "/");
    expect(within(brand).getByText(site.mission)).toBeInTheDocument();
    expect(within(brand).getByRole("presentation")).toHaveAttribute("width", "52");
  });

  it("renders the 4 footer links with mapped hrefs", () => {
    render(<SiteFooter site={site} />);
    const nav = footerNav();
    expect(nav).toHaveAttribute("id", "footer-nav");
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([
      "Accueillir un meetup",
      "Sponsoriser SoCraTes",
      "LinkedIn",
      "Site SoCraTes Maroc",
    ]);
    expect(links[0]).toHaveAttribute("href", "/accueillir/");
    expect(links[1]).toHaveAttribute("href", "/socrates/#sponsoring");
  });

  it("opens external links in a new tab with rel noopener", () => {
    render(<SiteFooter site={site} />);
    const nav = footerNav();
    const linkedin = within(nav).getByRole("link", { name: "LinkedIn" });
    expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/company/moroccansoftwarecrafters/");
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener");
    const socrates = within(nav).getByRole("link", { name: "Site SoCraTes Maroc" });
    expect(socrates).toHaveAttribute("target", "_blank");
    expect(within(nav).getByRole("link", { name: "Accueillir un meetup" })).not.toHaveAttribute("target");
  });

  it("renders the legal line", () => {
    render(<SiteFooter site={site} />);
    const legal = screen.getByText(site.footer.legal);
    expect(legal).toHaveClass("legal");
  });

  it("applies the French narrow space before a colon in the legal line", () => {
    // Testing Library's text matcher folds U+202F into a plain space, so read textContent.
    const { container } = render(
      <SiteFooter site={{ ...site, footer: { ...site.footer, legal: "Contact : bientôt." } }} />,
    );
    expect(container.querySelector("p.legal")?.textContent).toBe("Contact : bientôt.");
  });
});
