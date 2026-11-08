import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  loadCompanies,
  loadEvents,
  loadSite,
  loadSocrates,
  loadSponsoring,
} from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import SocratesPage, { metadata } from "./page";

// Expected values come from content/socrates.json, content/sponsoring.json,
// content/companies.json, content/events.json and content/site.json. Only the
// texts written in page.tsx are literals here.
const site = loadSite();
const s = loadSocrates();
const sp = loadSponsoring();
const withoutEm = (title: string) => title.replace(/<\/?em>/g, "");
// Text queries compare with spaces collapsed, so a no-break space matches a plain one.
const plainSpaces = (text: string) => text.replace(/\s+/g, " ");

function renderPage() {
  return render(<SocratesPage />);
}

describe("socrates metadata", () => {
  it("takes the title and the description of socrates.json", () => {
    expect(metadata.title).toBe(s.meta.title);
    expect(metadata.description).toBe(s.meta.description);
  });

  it("carries the social tags of the sponsoring pitch", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "SoCraTes Maroc · Devenir partenaire",
      description:
        "Quatre jours d'unconference entre crafters. Trois niveaux de partenariat pour la 5e édition.",
      url: `${site.baseUrl}/socrates/`,
      images: [
        `${site.baseUrl}/assets/img/meetups/2022-03-socrates-groupe.jpg`,
      ],
    });
  });
});

describe("SocratesPage", () => {
  it("has the section ids that other pages link to, in order", () => {
    const { container } = renderPage();
    const ids = [...container.querySelectorAll("section[id]")].map(
      (el) => el.id,
    );
    expect(ids).toEqual([
      "unconference",
      "regles",
      "deroule",
      "editions",
      "famille",
      "valeurs",
      "sponsoring",
      "partenaires",
    ]);
  });

  it("opens with the dark hero: the only level 1 heading, photo, status, facts and two buttons", () => {
    const { container } = renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(withoutEm(s.hero.title));
    expect(h1.querySelector("em")).toBeInTheDocument();
    expect(screen.getByText(plainSpaces(s.hero.eyebrow))).toBeInTheDocument();
    expect(container.querySelector("[data-hero-photo]")).toHaveStyle({
      backgroundImage: `url("/assets/img/meetups/${s.hero.photo}.jpg")`,
    });
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === "P" &&
          plainSpaces(el.textContent ?? "") === plainSpaces(s.hero.status),
      ),
    ).toBeInTheDocument();
    for (const fact of s.hero.facts) {
      expect(screen.getByText(plainSpaces(fact.value))).toBeInTheDocument();
    }
    const hero = h1.closest("section") as HTMLElement;
    expect(
      within(hero).getByRole("link", {
        name: frenchSpacing(s.hero.primary.label),
      }),
    ).toHaveAttribute("href", s.hero.primary.href);
    const secondary = within(hero).getByRole("link", {
      name: frenchSpacing(s.hero.secondary.label),
    });
    expect(secondary).toHaveAttribute("href", s.hero.secondary.href);
    expect(secondary).toHaveAttribute("target", "_blank");
    expect(secondary).toHaveAttribute("rel", "noopener");
  });

  it("#unconference: head, lead and one card per pillar", () => {
    renderPage();
    const section = screen.getByRole("region", {
      name: frenchSpacing(s.about.title),
    });
    expect(section).toHaveAttribute("id", "unconference");
    expect(within(section).getAllByRole("article")).toHaveLength(
      s.about.pillars.length,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: frenchSpacing(s.about.pillars[0]!.title),
      }),
    ).toBeInTheDocument();
  });

  it("#regles: the laws, the grid formats and #formats", () => {
    const { container } = renderPage();
    const section = container.querySelector("#regles") as HTMLElement;
    const lastLaw = s.openspace.laws[s.openspace.laws.length - 1]!;
    expect(within(section).getByRole("list")).toHaveTextContent(
      plainSpaces(lastLaw.title),
    );
    expect(within(section).getAllByRole("listitem")).toHaveLength(
      s.openspace.laws.length,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: frenchSpacing(s.openspace.formats.title),
      }),
    ).toBeInTheDocument();
    const formats = section.querySelector("#formats") as HTMLElement;
    expect(within(formats).getAllByRole("article")).toHaveLength(
      s.openspace.formats.items.length,
    );
    expect(
      within(formats).getByRole("heading", {
        level: 3,
        name: frenchSpacing(s.openspace.formats.items[0]!.title),
      }),
    ).toBeInTheDocument();
  });

  it("#deroule: one item per day and the note", () => {
    const { container } = renderPage();
    const section = container.querySelector("#deroule") as HTMLElement;
    expect(within(section).getAllByRole("listitem")).toHaveLength(
      s.schedule.days.length,
    );
    expect(section).toHaveTextContent(plainSpaces(s.schedule.days[0]!.title));
    expect(section).toHaveTextContent(plainSpaces(s.schedule.note));
  });

  it("#editions: one card per edition", () => {
    const { container } = renderPage();
    const section = container.querySelector("#editions") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(
      s.editions.items.length,
    );
    const venue = s.editions.items.find((e) => e.venue)?.venue ?? "";
    expect(venue).not.toBe("");
    expect(section).toHaveTextContent(venue);
  });

  it("#famille: lead and one item per event of the family", () => {
    const { container } = renderPage();
    const section = container.querySelector("#famille") as HTMLElement;
    expect(section).toHaveTextContent(plainSpaces(s.family.text));
    expect(within(section).getAllByRole("listitem")).toHaveLength(
      s.family.items.length,
    );
  });

  it("#valeurs: one card per value", () => {
    const { container } = renderPage();
    const section = container.querySelector("#valeurs") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(
      s.values.items.length,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: frenchSpacing(s.values.items[0]!.title),
      }),
    ).toBeInTheDocument();
  });

  it("#sponsoring: one package per card, each linking to #sponsor-form, and the form", () => {
    const { container } = renderPage();
    const section = container.querySelector("#sponsoring") as HTMLElement;
    const buttons = within(section).getAllByRole("link", {
      name: "Choisir ce niveau",
    });
    expect(buttons).toHaveLength(sp.packages.length);
    for (const button of buttons) {
      expect(button).toHaveAttribute("href", "#sponsor-form");
    }
    expect(section.querySelector("form#sponsor-form")).not.toBeNull();
    expect(section.querySelector("#sponsor-funnel")).not.toBeNull();
    expect(section.querySelector("#sponsor-faq")).not.toBeNull();
  });

  it("#partenaires: centered head and the sponsors wall with the sponsor sticker", () => {
    const { container } = renderPage();
    const section = container.querySelector("#partenaires") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: frenchSpacing(s.sponsorsWall.title),
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(plainSpaces(s.sponsorsWall.eyebrow)),
    ).toBeInTheDocument();
    const wall = section.querySelector("#sponsors-wall") as HTMLElement;
    expect(wall).not.toBeNull();
    const { items, sticker } = loadCompanies();
    expect(
      wall.querySelector(`a[href="${sticker.sponsor.href}"]`),
    ).toBeInTheDocument();
    // One tile per company named in the sponsors of an event, plus the sticker.
    const sponsorNames = new Set(loadEvents().flatMap((e) => e.sponsors ?? []));
    const sponsors = items.filter((c) => sponsorNames.has(c.name));
    expect(wall.children).toHaveLength(sponsors.length + 1);
    expect(wall).toHaveTextContent(sponsors[0]!.display || sponsors[0]!.name);
  });
});
