import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { Event, Home } from "@/content/types";
import { LightboxProvider } from "../Lightbox";
import { HistorySection } from "./HistorySection";

// jsdom has no showModal() or close() on HTMLDialogElement: stub them here.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  document.body.style.overflow = "";
});

// content/home.json, history.
const HISTORY: Home["history"] = {
  eyebrow: "Historique",
  title: "Sept ans de meetups, 21 événements.",
  lead: "Des Code Snacks de 2019 aux meetups de 2026, en passant par quatre éditions de SoCraTes Maroc.",
  filters: [
    { value: "all", label: "Tous" },
    { value: "meetup", label: "Meetups" },
    { value: "socrates", label: "SoCraTes Maroc" },
    { value: "codesnack", label: "Code Snacks" },
    { value: "online", label: "En ligne" },
  ],
  limit: 6,
  more: "Voir les {n} événements",
};

// The eight newest events of content/events.json, in file order (newest first).
// Three meetups have photos (featured), two are SoCraTes editions.
const EVENTS: Event[] = [
  {
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
  },
  {
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
    photos: [
      "2026-05-axa-1",
      "2026-05-axa-2",
      "2026-05-axa-3",
      "2026-05-axa-4",
    ],
    poster: "2026-05-axa-affiche",
    links: {
      luma: "https://luma.com/jjn7tuih",
      linkedin:
        "https://www.linkedin.com/feed/update/urn:li:activity:7464586067107528704/",
    },
  },
  {
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
  },
  {
    id: "2025-09-socrates",
    date: "2025-09-04",
    type: "socrates",
    title: "SoCraTes Maroc 2025 · 4e édition",
    city: "Bouznika",
    venue: "The View Bouznika",
    participants: 50,
    sponsors: [
      "McKinsey & Company",
      "Done",
      "Gemography",
      "inwi",
      "Keiken",
      "Maltem Africa",
    ],
    summary:
      "Quatre jours d'open space autour du software craft et du testing.",
    links: { site: "https://socrates-ma.github.io/" },
  },
  {
    id: "2025-07-jobzyn",
    date: "2025-07-19",
    type: "meetup",
    title: "Meetup @ Jobzyn",
    host: "Jobzyn",
    city: "Casablanca",
    venue: "Oasis",
    registrations: 89,
    links: { luma: "https://luma.com/xcu9wt9v" },
  },
  {
    id: "2025-01-oracle",
    date: "2025-01-25",
    type: "meetup",
    title: "Meetup @ Oracle MADC",
    host: "Oracle MADC",
    city: "Casablanca",
    venue: "Shore 23, Casanearshore",
    topics: [
      "Outils IA pour développeurs",
      "Culture développeur",
      "Estimations et deadlines",
    ],
    registrations: 157,
    links: { luma: "https://luma.com/hxn4eijq" },
  },
  {
    id: "2024-09-socrates",
    date: "2024-09-12",
    type: "socrates",
    title: "SoCraTes Maroc 2024 · 3e édition",
    city: "Bouznika",
    venue: "The View Bouznika",
    participants: 50,
    sponsors: [
      "McKinsey & Company",
      "Gemography",
      "InnovX",
      "inwi",
      "Keiken",
      "Maltem Africa",
    ],
    summary: "Des participants venus du Maroc, de France et d'Allemagne.",
    links: { site: "https://socrates-ma.github.io/" },
  },
  {
    id: "2024-06-renault",
    date: "2024-06-29",
    type: "meetup",
    title: "Meetup @ Renault Digital Maroc",
    host: "Renault Digital Maroc",
    city: "Casablanca",
    venue: "Shore 19, Casanearshore",
    topics: [
      "GenAI",
      "React",
      "Knowledge management",
      "Cloud",
      "SQL",
      "Recrutement",
    ],
  },
];

function setup(props: Partial<Parameters<typeof HistorySection>[0]> = {}) {
  const view = render(
    <LightboxProvider>
      <HistorySection history={HISTORY} events={EVENTS} {...props} />
    </LightboxProvider>,
  );
  const section = view.container.querySelector("section#historique");
  if (!(section instanceof HTMLElement)) throw new Error("no #historique");
  return { ...view, section };
}

describe("HistorySection head", () => {
  it("is the historique section with its eyebrow, title and lead", () => {
    const { section } = setup();
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Sept ans de meetups, 21 événements.",
      }),
    ).toBeInTheDocument();
    expect(within(section).getByText("Historique")).toBeInTheDocument();
    expect(
      within(section).getByText(
        "Des Code Snacks de 2019 aux meetups de 2026, en passant par quatre éditions de SoCraTes Maroc.",
      ),
    ).toBeInTheDocument();
  });

  it("uses the alternate section background", () => {
    const { section } = setup();
    expect(section).toHaveClass("bg-sage-soft");
  });
});

describe("HistorySection featured events", () => {
  it("shows the three newest meetups with photos, newest first", () => {
    const { section } = setup();
    const cards = within(section).getAllByRole("article");
    expect(
      cards.map(
        (c) => within(c).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual([
      "Meetup @ Société Générale GSCM",
      "Meetup @ AXA Assurance Maroc",
      "Meetup @ InnovX",
    ]);
  });

  it("shows date, city and registrations, then the summary", () => {
    const { section } = setup();
    const [sg, , innovx] = within(section).getAllByRole("article");
    expect(
      within(sg!).getByText("24 oct. 2026 · Casablanca · 110 inscrits"),
    ).toBeInTheDocument();
    expect(
      within(innovx!).getByText("28 mars 2026 · Casablanca · 119 inscrits"),
    ).toBeInTheDocument();
    // French spacing: a narrow no-break space before ? and :. getByText folds
    // U+202F into a plain space, so read textContent.
    expect(within(sg!).getByText(/^Qui est responsable/).textContent).toBe(
      "Qui est responsable quand l'IA écrit le code\u202f? L'IA multiplie ce que la codebase est déjà\u202f: tests, documentation et architecture d'abord.",
    );
  });

  it("lists at most four topics of the event", () => {
    const { section } = setup();
    const [sg, axa] = within(section).getAllByRole("article");
    expect(
      within(sg!)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "AI factory",
      "Responsabilité humaine",
      "Sécurité du vibe coding",
      "Outils IA",
    ]);
    expect(within(axa!).getAllByRole("listitem")).toHaveLength(4);
  });

  it("links to the LinkedIn recap and the Luma page in a new tab", () => {
    const { section } = setup();
    const [sg] = within(section).getAllByRole("article");
    const recap = within(sg!).getByRole("link", { name: "Récap LinkedIn" });
    expect(recap).toHaveAttribute(
      "href",
      "https://www.linkedin.com/feed/update/urn:li:activity:7517872453725888512/",
    );
    expect(recap).toHaveAttribute("target", "_blank");
    expect(recap).toHaveAttribute("rel", "noopener");
    const luma = within(sg!).getByRole("link", { name: "Page Luma" });
    expect(luma).toHaveAttribute("href", "https://luma.com/6eiyisjw");
    expect(luma).toHaveAttribute("target", "_blank");
  });

  it("shows the first photo as a decorative lazy image with a photo count", () => {
    const { section } = setup();
    const [sg, axa] = within(section).getAllByRole("article");
    const thumb = within(sg!).getByRole("button", {
      name: "Voir les 8 photos de Meetup @ Société Générale GSCM",
    });
    const img = thumb.querySelector("img");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    );
    expect(within(thumb).getByText("8 photos")).toBeInTheDocument();
    expect(
      within(axa!).getByRole("button", {
        name: "Voir les 4 photos de Meetup @ AXA Assurance Maroc",
      }),
    ).toBeInTheDocument();
  });

  it("opens the lightbox on the first photo of the event", async () => {
    const user = userEvent.setup();
    const { container, section } = setup();
    const [, axa] = within(section).getAllByRole("article");
    await user.click(
      within(axa!).getByRole("button", { name: /^Voir les 4 photos/ }),
    );
    const dialog = container.ownerDocument.querySelector("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(dialog?.querySelector("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-05-axa-1.jpg",
    );
  });
});

function timelineTitles(section: HTMLElement): (string | null)[] {
  return within(section)
    .queryAllByRole("heading", { level: 4 })
    .map((heading) => heading.textContent);
}

describe("HistorySection timeline", () => {
  it("presses the first filter and shows the first six events by year", () => {
    const { section } = setup();
    const filters = within(section).getByRole("group", {
      name: "Filtrer les événements",
    });
    expect(
      within(filters).getByRole("button", { name: "Tous" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(timelineTitles(section)).toEqual([
      "Meetup @ Société Générale GSCM",
      "Meetup @ AXA Assurance Maroc",
      "Meetup @ InnovX",
      "SoCraTes Maroc 2025 · 4e édition",
      "Meetup @ Jobzyn",
      "Meetup @ Oracle MADC",
    ]);
    expect(
      within(section)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent)
        .filter((text) => /^\d{4}$/.test(text ?? "")),
    ).toEqual(["2026", "2025"]);
  });

  it("offers a more button with the total, wired to the timeline", () => {
    const { section } = setup();
    const more = within(section).getByRole("button", {
      name: "Voir les 8 événements",
    });
    expect(more).toHaveAttribute("aria-expanded", "false");
    const timeline = document.getElementById(
      more.getAttribute("aria-controls") ?? "missing",
    );
    expect(timeline).toContainElement(
      within(section).getByRole("heading", {
        level: 4,
        name: "Meetup @ InnovX",
      }),
    );
  });

  it("shows every event, focuses the first new one and drops the button", async () => {
    const user = userEvent.setup();
    const { section } = setup();
    await user.click(
      within(section).getByRole("button", { name: "Voir les 8 événements" }),
    );
    expect(timelineTitles(section)).toHaveLength(8);
    const first = within(section)
      .getByRole("heading", {
        level: 4,
        name: "SoCraTes Maroc 2024 · 3e édition",
      })
      .closest("li");
    expect(first).toHaveFocus();
    expect(
      within(section).queryByRole("button", { name: /événements$/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the first six again after a filter click", async () => {
    const user = userEvent.setup();
    const { section } = setup();
    await user.click(
      within(section).getByRole("button", { name: "Voir les 8 événements" }),
    );
    await user.click(within(section).getByRole("button", { name: "Meetups" }));
    await user.click(within(section).getByRole("button", { name: "Tous" }));
    expect(timelineTitles(section)).toHaveLength(6);
    expect(
      within(section).getByRole("button", { name: "Voir les 8 événements" }),
    ).toBeInTheDocument();
  });

  it("keeps only the events of the pressed filter", async () => {
    const user = userEvent.setup();
    const { section } = setup();
    await user.click(
      within(section).getByRole("button", { name: "SoCraTes Maroc" }),
    );
    expect(
      within(section).getByRole("button", { name: "SoCraTes Maroc" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(section).getByRole("button", { name: "Tous" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(timelineTitles(section)).toEqual([
      "SoCraTes Maroc 2025 · 4e édition",
      "SoCraTes Maroc 2024 · 3e édition",
    ]);
    expect(
      within(section).queryByRole("button", { name: /événements$/ }),
    ).not.toBeInTheDocument();
  });

  it("shows an empty timeline for a type with no event", async () => {
    const user = userEvent.setup();
    const { section } = setup();
    await user.click(within(section).getByRole("button", { name: "En ligne" }));
    expect(timelineTitles(section)).toEqual([]);
  });
});
