import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Event } from "@/content/types";
import { FeaturedEvents } from "./FeaturedEvents";

// The three featured meetups of content/events.json (featuredEvents()): the
// newest meetups that have photos, newest first.
const SG: Event = {
  id: "2026-10-sg-gscm",
  date: "2026-10-24",
  type: "meetup",
  title: "Meetup @ Société Générale GSCM",
  host: "Société Générale GSCM",
  city: "Casablanca",
  topics: [
    "AI factory",
    "Responsabilité humaine",
    "Sécurité du vibe coding",
    "Outils IA",
    "Coût des tokens",
  ],
  summary:
    "Qui est responsable quand l'IA écrit le code ? L'IA multiplie ce que la codebase est déjà : tests, documentation et architecture d'abord.",
  registrations: 110,
  photos: [
    "2026-10-sg-gscm-5",
    "2026-10-sg-gscm-3",
    "2026-10-sg-gscm-2",
    "2026-10-sg-gscm-7",
    "2026-10-sg-gscm-8",
    "2026-10-sg-gscm-4",
    "2026-10-sg-gscm-6",
    "2026-10-sg-gscm-1",
  ],
  poster: "2026-10-sg-gscm-affiche",
  links: {
    luma: "https://luma.com/6eiyisjw",
    linkedin:
      "https://www.linkedin.com/feed/update/urn:li:activity:7517872453725888512/",
  },
};

const AXA: Event = {
  id: "2026-05-axa",
  date: "2026-05-23",
  type: "meetup",
  title: "Meetup @ AXA Assurance Maroc",
  host: "AXA Assurance Maroc",
  city: "Casablanca",
  venue: "Avenue Hassan II",
  topics: [
    "Craftsmanship à l'ère de l'IA",
    "Cloud",
    "Data",
    "Sécurité",
    "Modèle maison vs sur étagère",
    "Coût des tokens",
  ],
  summary:
    "Toute la stack passée en revue : cloud, infra, data, et la place de l'IA. Côté sécurité : les vulnérabilités ont toujours existé, les attaquants ont juste trouvé une nouvelle motivation.",
  registrations: 51,
  photos: ["2026-05-axa-1", "2026-05-axa-2", "2026-05-axa-3", "2026-05-axa-4"],
  poster: "2026-05-axa-affiche",
  links: {
    luma: "https://luma.com/jjn7tuih",
    linkedin:
      "https://www.linkedin.com/feed/update/urn:li:activity:7464586067107528704/",
  },
};

const INNOVX: Event = {
  id: "2026-03-innovx",
  date: "2026-03-28",
  type: "meetup",
  title: "Meetup @ InnovX",
  host: "InnovX",
  city: "Casablanca",
  venue: "Zenith Anfa",
  topics: [
    "Impact réel de l'IA",
    "Management",
    "Process",
    "Tests",
    "Produits production-grade",
  ],
  summary:
    "L'IA et son impact concret sur notre façon de construire du logiciel, et le changement qu'elle demande au management et aux process.",
  registrations: 119,
  photos: ["2026-03-innovx-1", "2026-03-innovx-2", "2026-03-innovx-3"],
  poster: "2026-03-innovx-affiche",
  links: {
    luma: "https://luma.com/4whe7w5k",
    linkedin:
      "https://www.linkedin.com/feed/update/urn:li:activity:7444654887302418432/",
  },
};

const EVENTS = [SG, AXA, INNOVX];

function setup(onOpenPhotos = vi.fn()) {
  render(<FeaturedEvents events={EVENTS} onOpenPhotos={onOpenPhotos} />);
  return { onOpenPhotos, cards: screen.getAllByRole("article") };
}

describe("FeaturedEvents", () => {
  it("is one card per event, titled, in the given order", () => {
    const { cards } = setup();
    expect(
      cards.map(
        (card) => within(card).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual([
      "Meetup @ Société Générale GSCM",
      "Meetup @ AXA Assurance Maroc",
      "Meetup @ InnovX",
    ]);
  });

  it("gives date, city and registrations, then the summary", () => {
    const [sg, axa] = setup().cards;
    expect(
      within(sg!).getByText("24 oct. 2026 · Casablanca · 110 inscrits"),
    ).toBeInTheDocument();
    expect(
      within(axa!).getByText("23 mai 2026 · Casablanca · 51 inscrits"),
    ).toBeInTheDocument();
    // French spacing: a narrow no-break space (U+202F) before each colon.
    // getByText folds U+202F into a plain space, so read textContent.
    expect(within(axa!).getByText(/^Toute la stack/).textContent).toBe(
      "Toute la stack passée en revue\u202f: cloud, infra, data, et la place de l'IA. Côté sécurité\u202f: les vulnérabilités ont toujours existé, les attaquants ont juste trouvé une nouvelle motivation.",
    );
  });

  it("lists the first four topics", () => {
    const [, axa] = setup().cards;
    expect(
      within(axa!)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["Craftsmanship à l'ère de l'IA", "Cloud", "Data", "Sécurité"]);
  });

  it("shows the first photo, decorative and lazy, with the photo count", () => {
    const [sg, , innovx] = setup().cards;
    const thumb = within(sg!).getByRole("button", {
      name: "Voir les 8 photos de Meetup @ Société Générale GSCM",
    });
    expect(thumb).toHaveAttribute("type", "button");
    const img = thumb.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    );
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(within(thumb).getByText("8 photos")).toBeInTheDocument();
    expect(
      within(innovx!).getByRole("button", {
        name: "Voir les 3 photos de Meetup @ InnovX",
      }),
    ).toBeInTheDocument();
  });

  it("links to the LinkedIn recap, then the Luma page, in a new tab", () => {
    const [, , innovx] = setup().cards;
    const links = within(innovx!).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Récap LinkedIn",
      "Page Luma",
    ]);
    expect(links[0]).toHaveAttribute(
      "href",
      "https://www.linkedin.com/feed/update/urn:li:activity:7444654887302418432/",
    );
    expect(links[1]).toHaveAttribute("href", "https://luma.com/4whe7w5k");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener");
    }
  });

  describe("layout guards", () => {
    it("stacks the cards, makes rows from sm and three columns from lg", () => {
      const { cards } = setup();
      const card = cards[0]!.className.split(" ");
      expect(card).toEqual(
        expect.arrayContaining(["flex-col", "sm:flex-row", "lg:flex-col"]),
      );
      const columns = cards[0]!.parentElement!.className.split(" ");
      expect(columns).toEqual(
        expect.arrayContaining(["grid-cols-1", "lg:grid-cols-3"]),
      );
    });

    it("draws the keyboard focus ring inside the photo, the card clips what is outside", () => {
      const { cards } = setup();
      const card = cards[0]!;
      const thumb = within(card).getByRole("button");
      expect(card).toHaveClass("overflow-hidden");
      expect(thumb.className.split(" ")).toContain(
        "focus-visible:-outline-offset-3",
      );
    });

    it("zooms the photo on hover only behind motion-safe", () => {
      const { cards } = setup();
      const img = within(cards[0]!).getByRole("button").querySelector("img");
      const classes = img!.className.split(" ");
      expect(classes.filter((c) => /(^|:)scale-/.test(c))).toEqual([
        "motion-safe:group-hover:scale-104",
      ]);
    });
  });

  it("reports the event of the clicked photo", async () => {
    const user = userEvent.setup();
    const { onOpenPhotos, cards } = setup();
    await user.click(within(cards[1]!).getByRole("button"));
    expect(onOpenPhotos).toHaveBeenCalledExactlyOnceWith(AXA);
  });
});
