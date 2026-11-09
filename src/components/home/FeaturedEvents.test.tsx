import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Event } from "@/content/types";
import { recorder } from "@/test/recorder";
import { FeaturedEvents } from "./FeaturedEvents";

// Fixtures written here: three invented meetups with photos, newest first.
const ALPHA: Event = {
  id: "2026-10-alpha",
  date: "2026-10-24",
  type: "meetup",
  title: "Meetup @ Alpha Corp",
  host: "Alpha Corp",
  city: "Casablanca",
  topics: ["Un", "Deux", "Trois", "Quatre", "Cinq"],
  summary: "Un résumé court.",
  registrations: 110,
  photos: ["2026-10-alpha-5", "2026-10-alpha-3", "2026-10-alpha-2"],
  links: {
    luma: "https://luma.example/alpha",
    linkedin: "https://linkedin.example/alpha",
  },
};

const BETA: Event = {
  id: "2026-05-beta",
  date: "2026-05-23",
  type: "meetup",
  title: "Meetup @ Beta",
  host: "Beta",
  city: "Rabat",
  topics: ["Cloud", "Data", "Sécurité", "Tests", "IA"],
  summary: "Au programme : cloud, data ; puis la sécurité.",
  registrations: 51,
  photos: [
    "2026-05-beta-1",
    "2026-05-beta-2",
    "2026-05-beta-3",
    "2026-05-beta-4",
  ],
  links: {
    luma: "https://luma.example/beta",
    linkedin: "https://linkedin.example/beta",
  },
};

const GAMMA: Event = {
  id: "2026-03-gamma",
  date: "2026-03-28",
  type: "meetup",
  title: "Meetup @ Gamma",
  host: "Gamma",
  city: "Casablanca",
  topics: ["Management"],
  summary: "Le changement dans les process.",
  registrations: 119,
  photos: ["2026-03-gamma-1", "2026-03-gamma-2"],
  links: {
    luma: "https://luma.example/gamma",
    linkedin: "https://linkedin.example/gamma",
  },
};

const EVENTS = [ALPHA, BETA, GAMMA];

function setup() {
  const onOpenPhotos = recorder<[Event]>();
  render(<FeaturedEvents events={EVENTS} onOpenPhotos={onOpenPhotos.fn} />);
  return { onOpenPhotos, cards: screen.getAllByRole("article") };
}

describe("FeaturedEvents", () => {
  it("is one card per event, titled, in the given order", () => {
    const { cards } = setup();
    expect(
      cards.map(
        (card) => within(card).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual(EVENTS.map((event) => event.title));
  });

  it("gives date, city and registrations, then the summary", () => {
    const [alpha, beta] = setup().cards;
    expect(
      within(alpha!).getByText("24 oct. 2026 · Casablanca · 110 inscrits"),
    ).toBeInTheDocument();
    expect(
      within(beta!).getByText("23 mai 2026 · Rabat · 51 inscrits"),
    ).toBeInTheDocument();
    // French spacing: a narrow no-break space (U+202F) before a colon or a
    // semicolon. getByText folds U+202F into a plain space, so read textContent.
    expect(within(beta!).getByText(/^Au programme/).textContent).toBe(
      "Au programme\u202f: cloud, data\u202f; puis la sécurité.",
    );
  });

  it("lists at most the first four topics", () => {
    const [alpha, , gamma] = setup().cards;
    expect(
      within(alpha!)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["Un", "Deux", "Trois", "Quatre"]);
    expect(within(gamma!).getAllByRole("listitem")).toHaveLength(1);
  });

  it("shows the first photo, decorative and lazy, with the photo count", () => {
    const [alpha, , gamma] = setup().cards;
    const thumb = within(alpha!).getByRole("link", {
      name: "Voir les 3 photos de Meetup @ Alpha Corp",
    });
    expect(thumb).toHaveAttribute(
      "href",
      "/assets/img/meetups/2026-10-alpha-5.jpg",
    );
    const img = thumb.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-alpha-5.jpg",
    );
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(within(thumb).getByText("3 photos")).toBeInTheDocument();
    expect(
      within(gamma!).getByRole("link", {
        name: "Voir les 2 photos de Meetup @ Gamma",
      }),
    ).toBeInTheDocument();
  });

  it("links to the LinkedIn recap, then the Luma page, in a new tab", () => {
    const [, , gamma] = setup().cards;
    const links = within(gamma!).getAllByRole("link").slice(1);
    expect(links.map((link) => link.textContent)).toEqual([
      "Récap LinkedIn, Meetup @ Gamma",
      "Page Luma, Meetup @ Gamma",
    ]);
    expect(links[0]).toHaveAttribute("href", "https://linkedin.example/gamma");
    expect(links[1]).toHaveAttribute("href", "https://luma.example/gamma");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener");
    }
  });

  it("zooms the photo on hover only behind motion-safe", () => {
    const { cards } = setup();
    const img = within(cards[0]!)
      .getByRole("link", { name: /^Voir les 3 photos/ })
      .querySelector("img");
    const classes = img!.className.split(" ");
    expect(classes.filter((c) => /(^|:)scale-/.test(c))).toEqual([
      "motion-safe:group-hover:scale-104",
    ]);
  });

  it("reports the event of the clicked photo", async () => {
    const user = userEvent.setup();
    const { onOpenPhotos, cards } = setup();
    await user.click(
      within(cards[1]!).getByRole("link", { name: /^Voir les 4 photos/ }),
    );
    expect(onOpenPhotos.calls).toEqual([[BETA]]);
  });

  it("keeps a plain click on the photo from following the link", () => {
    const { cards } = setup();
    const link = within(cards[1]!).getByRole("link", {
      name: /^Voir les 4 photos/,
    });
    expect(fireEvent.click(link)).toBe(false);
  });

  it("uses the singular for a single photo", () => {
    const single = { ...GAMMA, photos: ["2026-03-gamma-1"] };
    render(<FeaturedEvents events={[single]} onOpenPhotos={recorder().fn} />);
    const link = screen.getByRole("link", {
      name: "Voir la photo de Meetup @ Gamma",
    });
    expect(within(link).getByText("1 photo")).toBeInTheDocument();
  });

  it("renders nothing when there is no event to feature", () => {
    const { container } = render(
      <FeaturedEvents events={[]} onOpenPhotos={recorder().fn} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("lists two links with the same address, each one a link of the card", () => {
    const twin = {
      ...GAMMA,
      links: { luma: "https://x.example/a", linkedin: "https://x.example/a" },
    };
    render(<FeaturedEvents events={[twin]} onOpenPhotos={recorder().fn} />);
    const links = within(screen.getByRole("article"))
      .getAllByRole("link")
      .slice(1);
    expect(links.map((link) => link.textContent)).toEqual([
      "Récap LinkedIn, Meetup @ Gamma",
      "Page Luma, Meetup @ Gamma",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://x.example/a",
      "https://x.example/a",
    ]);
  });
});
