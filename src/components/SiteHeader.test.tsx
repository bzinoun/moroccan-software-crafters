import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Site } from "@/content/types";
import { SiteHeader } from "./SiteHeader";

// Fixture site: not read from content/site.json.
const site: Site = {
  name: "Moroccan Software Crafters",
  tagline: "Association à but non lucratif",
  mission:
    "Stimuler et promouvoir les valeurs du Software Craftsmanship au Maroc",
  baseUrl: "https://bzinoun.github.io/moroccan-software-crafters",
  since: 2019,
  linkedinFollowers: 1234,
  links: {
    linkedin: "https://www.linkedin.com/company/moroccansoftwarecrafters/",
  },
  contact: { email: "" },
  form: { endpoint: "", extraFields: {} },
  nav: [
    { label: "Le meetup", href: "/meetup/" },
    { label: "Éditions", href: "/#historique" },
    { label: "SoCraTes", href: "/socrates/" },
    { label: "Actualités", href: "/actualites/" },
    { label: "L'association", href: "/association/" },
  ],
  cta: { label: "Accueillir un meetup", href: "/accueillir/" },
  footer: {
    links: [
      { label: "Accueillir un meetup", href: "/accueillir/" },
      { label: "Sponsoriser SoCraTes", href: "/socrates/#sponsoring" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/moroccansoftwarecrafters/",
      },
      { label: "Site SoCraTes Maroc", href: "https://socrates-ma.github.io/" },
    ],
    legal:
      "Moroccan Software Crafters, association à but non lucratif. Une communauté ouverte, sans sexisme, sans élitisme et sans contrainte technologique.",
  },
};

// Two copies of the links: the row from `lg` up, and the panel of the mobile
// menu (a native disclosure). The stylesheet shows one of them.
function navs() {
  return screen.getAllByRole("navigation", { name: "Navigation principale" });
}

function mobileNav() {
  return within(screen.getByRole("group")).getByRole("navigation", {
    name: "Navigation principale",
  });
}

function mainNav() {
  const row = navs().find((nav) => nav.closest("details") === null);
  if (!row) throw new Error("No desktop navigation");
  return row;
}

describe("SiteHeader", () => {
  it("renders the brand with the name and the tagline", () => {
    render(<SiteHeader site={site} page="home" />);
    const brand = screen.getByRole("link", {
      name: /Moroccan Software Crafters/,
    });
    expect(brand).toHaveAttribute("href", "/");
    expect(
      within(brand).getByText("Association à but non lucratif"),
    ).toBeInTheDocument();
  });

  it("renders the 5 nav links with mapped hrefs", () => {
    render(<SiteHeader site={site} page="home" />);
    for (const nav of [mainNav(), mobileNav()]) {
      expect(
        within(nav).getByRole("link", { name: "Le meetup" }),
      ).toHaveAttribute("href", "/meetup/");
      expect(
        within(nav).getByRole("link", { name: "Éditions" }),
      ).toHaveAttribute("href", "/#historique");
      expect(
        within(nav).getByRole("link", { name: "SoCraTes" }),
      ).toHaveAttribute("href", "/socrates/");
      expect(
        within(nav).getByRole("link", { name: "Actualités" }),
      ).toHaveAttribute("href", "/actualites/");
      expect(
        within(nav).getByRole("link", { name: "L'association" }),
      ).toHaveAttribute("href", "/association/");
    }
  });

  it("renders the CTA twice: in the mobile menu and after the nav", () => {
    render(<SiteHeader site={site} page="home" />);
    const ctas = screen.getAllByRole("link", { name: "Accueillir un meetup" });
    expect(ctas).toHaveLength(2);
    const [inNav, trailing] = ctas;
    // The menu CTA shows below lg (the menu is gone from lg up), the trailing one from lg up.
    expect(inNav).toHaveAttribute("href", "/accueillir/");
    expect(mobileNav()).toContainElement(inNav as HTMLElement);
    expect(mainNav()).not.toContainElement(inNav as HTMLElement);
    expect(trailing).toHaveClass("max-lg:hidden");
    expect(trailing).toHaveAttribute("href", "/accueillir/");
  });

  it("marks the current page link with aria-current on meetup", () => {
    render(<SiteHeader site={site} page="meetup" />);
    for (const nav of [mainNav(), mobileNav()]) {
      expect(
        within(nav).getByRole("link", { name: "Le meetup" }),
      ).toHaveAttribute("aria-current", "page");
      expect(
        within(nav).getByRole("link", { name: "SoCraTes" }),
      ).not.toHaveAttribute("aria-current");
    }
  });

  it.each([
    ["meetup", "Le meetup"],
    ["socrates", "SoCraTes"],
    ["news", "Actualités"],
    ["association", "L'association"],
  ] as const)("marks exactly the %s link as current", (page, label) => {
    render(<SiteHeader site={site} page={page} />);
    const current = within(mainNav())
      .getAllByRole("link")
      .filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.textContent)).toEqual([label]);
  });

  it("marks no link on home because the Éditions href has a hash", () => {
    render(<SiteHeader site={site} page="home" />);
    const links = within(mainNav()).getAllByRole("link");
    expect(links.filter((a) => a.hasAttribute("aria-current"))).toHaveLength(0);
  });

  it("uses the Devenir partenaire CTA on socrates", () => {
    render(<SiteHeader site={site} page="socrates" />);
    const ctas = screen.getAllByRole("link", { name: "Devenir partenaire" });
    expect(ctas).toHaveLength(2);
    for (const cta of ctas) {
      expect(cta).toHaveAttribute("href", "#sponsoring");
    }
    expect(
      screen.queryByRole("link", { name: "Accueillir un meetup" }),
    ).not.toBeInTheDocument();
  });

  it("uses the Les formules CTA on host, in the ghost style", () => {
    render(<SiteHeader site={site} page="host" />);
    const ctas = screen.getAllByRole("link", { name: "Les formules" });
    expect(ctas).toHaveLength(2);
    for (const cta of ctas) {
      expect(cta).toHaveAttribute("href", "/#offres");
      expect(cta).toHaveClass("border-ink");
    }
  });

  it("renders the hash nav link as a plain anchor with the base path, in both copies", () => {
    render(
      <SiteHeader
        site={site}
        page="home"
        basePath="/moroccan-software-crafters"
      />,
    );
    for (const nav of [mainNav(), mobileNav()]) {
      expect(
        within(nav).getByRole("link", { name: "Éditions" }),
      ).toHaveAttribute("href", "/moroccan-software-crafters/#historique");
    }
  });

  it("renders the mobile menu as a closed disclosure, readable with no script", () => {
    render(<SiteHeader site={site} page="home" />);
    const menu = screen.getByRole("group");
    expect(menu.tagName).toBe("DETAILS");
    expect(menu).not.toHaveAttribute("open");
    expect(within(menu).getByText("Menu")).toBeInTheDocument();
  });
});
