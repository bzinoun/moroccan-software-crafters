import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  loadAssociation,
  loadCompanies,
  loadEvents,
  loadSite,
} from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import { associationFacts } from "@/lib/pages-data";
import AssociationPage, { metadata } from "./page";

const site = loadSite();
const association = loadAssociation();
const withoutEm = (title: string) => title.replace(/<\/?em>/g, "");

describe("association page metadata", () => {
  it("takes the title and the description from content/association.json", () => {
    expect(metadata.title).toBe(association.meta.title);
    expect(metadata.description).toBe(association.meta.description);
  });

  it("sets the Open Graph tags on the route", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: association.meta.title,
      description:
        "Une communauté, pas une marque. Mission, principes, histoire et façons de contribuer.",
      url: `${site.baseUrl}/association/`,
      images: [
        `${site.baseUrl}/assets/img/meetups/${association.hero.photo}.jpg`,
      ],
    });
  });
});

describe("AssociationPage", () => {
  it("opens with the page hero: title, group photo, post-it and the four facts", () => {
    const { container } = render(<AssociationPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: frenchSpacing(withoutEm(association.hero.title)),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Photo de groupe d'un meetup" }),
    ).toHaveAttribute(
      "src",
      `/assets/img/meetups/${association.hero.photo}.jpg`,
    );
    expect(screen.getByText("Depuis 2019")).toBeInTheDocument();
    const facts = container.querySelector("section ul") as HTMLElement;
    expect(within(facts).getAllByRole("listitem")).toHaveLength(
      associationFacts(site, loadEvents()).length,
    );
    expect(within(facts).getByText("entreprises hôtes")).toBeInTheDocument();
    expect(
      within(facts).getByText("éditions de SoCraTes Maroc"),
    ).toBeInTheDocument();
  });

  it("renders the sections in this order, with these ids", () => {
    const { container } = render(<AssociationPage />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map(
      (s) => s.id,
    );
    expect(ids).toEqual([
      "mission",
      "principes",
      "histoire",
      "entreprises",
      "contribuer",
    ]);
  });

  it("names every section by its heading", () => {
    const { container } = render(<AssociationPage />);
    const sections = container.querySelectorAll("section");
    expect(screen.getAllByRole("region")).toHaveLength(sections.length);
    for (const section of sections) {
      const heading = section.querySelector("h1, h2") as HTMLElement;
      expect(section).toHaveAccessibleName(heading.textContent as string);
    }
  });

  it("ends with the contact band that opens the LinkedIn page", () => {
    render(<AssociationPage />);
    expect(
      screen.getByRole("link", { name: "Écrire sur LinkedIn" }),
    ).toHaveAttribute("href", site.links.linkedin);
  });

  it("closes with the contact band named by its title, with the host funnel link", () => {
    const { container } = render(<AssociationPage />);
    const sections = container.querySelectorAll("section");
    const last = sections[sections.length - 1];
    expect(last).toHaveAccessibleName(frenchSpacing(association.contact.title));
    expect(
      screen.getByRole("link", { name: "Accueillir un meetup" }),
    ).toHaveAttribute("href", "/accueillir/");
  });

  it("shows the logo of every company that has one, and one milestone per history item", () => {
    const { container } = render(<AssociationPage />);
    const withLogo = loadCompanies().items.filter((c) => c.logo !== "");
    const hosts = container.querySelector("#entreprises") as HTMLElement;
    // Logos have alt "": count the files, then check that each name is printed.
    expect(hosts.querySelectorAll("img")).toHaveLength(withLogo.length);
    for (const company of withLogo) {
      expect(
        within(hosts).getByText(frenchSpacing(company.display || company.name)),
      ).toBeInTheDocument();
    }
    const history = container.querySelector("#histoire") as HTMLElement;
    expect(within(history).getAllByRole("listitem")).toHaveLength(
      association.timeline.items.length,
    );
  });
});
