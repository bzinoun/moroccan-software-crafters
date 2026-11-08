import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Event } from "@/content/types";
import type { YearGroup } from "@/lib/home-data";
import { EventTimeline } from "./EventTimeline";
import { setJs } from "./js-mode";

beforeEach(() => {
  setJs(true);
});

afterEach(() => {
  setJs(false);
});

// Fixture events (copies of real shapes, not read from content), grouped by
// year as eventsByYear() gives them: a SoCraTes edition with partners, a meetup with six topics, an online
// event dated by month only, a code snack.
const SOCRATES_2025: Event = {
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
  summary: "Quatre jours d'open space autour du software craft et du testing.",
  links: { site: "https://socrates-ma.github.io/" },
};

const ORACLE: Event = {
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
};

const RENAULT: Event = {
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
};

const ONLINE: Event = {
  id: "2021-04-online",
  date: "2021-04",
  type: "online",
  title: "Meet other Crafts From Home",
  city: "En ligne",
  topics: ["Talks", "Challenges"],
};

const CODE_SNACK: Event = {
  id: "2019-04-codesnack-2",
  date: "2019-04-20",
  type: "codesnack",
  title: "Code Snack #2",
  city: "Casablanca",
  venue: "Casanearshore",
  topics: ["Lightning talks", "Refactoring challenges"],
};

const GROUPS: YearGroup[] = [
  { year: "2025", items: [SOCRATES_2025, ORACLE] },
  { year: "2024", items: [RENAULT] },
  { year: "2021", items: [ONLINE] },
  { year: "2019", items: [CODE_SNACK] },
];

function item(title: string): HTMLElement {
  const li = screen
    .getByRole("heading", { level: 4, name: title })
    .closest("li");
  if (!(li instanceof HTMLElement)) throw new Error(`no item for ${title}`);
  return li;
}

describe("EventTimeline", () => {
  it("groups the events under their year, in the given order", () => {
    render(<EventTimeline groups={GROUPS} />);
    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["2025", "2024", "2021", "2019"]);
    expect(
      screen
        .getAllByRole("heading", { level: 4 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "SoCraTes Maroc 2025 · 4e édition",
      "Meetup @ Oracle MADC",
      "Meetup @ Renault Digital Maroc",
      "Meet other Crafts From Home",
      "Code Snack #2",
    ]);
  });

  it("dates each item by month and year, with a machine-readable date", () => {
    render(<EventTimeline groups={GROUPS} />);
    const oracle = within(item("Meetup @ Oracle MADC")).getByText("janv. 2025");
    expect(oracle.tagName).toBe("TIME");
    expect(oracle).toHaveAttribute("datetime", "2025-01-25");
    const online = within(item("Meet other Crafts From Home")).getByText(
      "avr. 2021",
    );
    expect(online).toHaveAttribute("datetime", "2021-04");
  });

  it("gives the place, then registrations, participants and partners", () => {
    render(<EventTimeline groups={GROUPS} />);
    expect(
      within(item("SoCraTes Maroc 2025 · 4e édition")).getByText(
        "The View Bouznika, Bouznika · 50 participants · 6 partenaires",
      ),
    ).toBeInTheDocument();
    expect(
      within(item("Meetup @ Oracle MADC")).getByText(
        "Shore 23, Casanearshore, Casablanca · 157 inscrits",
      ),
    ).toBeInTheDocument();
    expect(
      within(item("Code Snack #2")).getByText("Casanearshore, Casablanca"),
    ).toBeInTheDocument();
  });

  it("lists up to six topics, and no list when the event has none", () => {
    render(<EventTimeline groups={GROUPS} />);
    expect(
      within(item("Meetup @ Renault Digital Maroc"))
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "GenAI",
      "React",
      "Knowledge management",
      "Cloud",
      "SQL",
      "Recrutement",
    ]);
    expect(
      within(item("SoCraTes Maroc 2025 · 4e édition")).queryByRole("list"),
    ).not.toBeInTheDocument();
  });

  it("badges each item with its event type", () => {
    render(<EventTimeline groups={GROUPS} />);
    expect(
      within(item("SoCraTes Maroc 2025 · 4e édition")).getByText("SoCraTes"),
    ).toBeInTheDocument();
    expect(
      within(item("Meetup @ Oracle MADC")).getByText("Meetup"),
    ).toBeInTheDocument();
    // The online event's city is also "En ligne": the place line, then the badge.
    expect(
      within(item("Meet other Crafts From Home")).getAllByText("En ligne"),
    ).toHaveLength(2);
    expect(
      within(item("Code Snack #2")).getByText("Code Snack"),
    ).toBeInTheDocument();
  });

  it("carries the id that the more button controls", () => {
    render(<EventTimeline id="timeline" groups={GROUPS} />);
    expect(document.getElementById("timeline")).toContainElement(
      item("Code Snack #2"),
    );
  });

  it("focuses the item named by focusId, and only that one", () => {
    render(<EventTimeline groups={GROUPS} focusId="2024-06-renault" />);
    const renault = item("Meetup @ Renault Digital Maroc");
    expect(renault).toHaveFocus();
    expect(renault).toHaveAttribute("tabindex", "-1");
    expect(item("Meetup @ Oracle MADC")).not.toHaveAttribute("tabindex");
  });

  it("moves no focus without focusId", () => {
    render(<EventTimeline groups={GROUPS} />);
    expect(document.body).toHaveFocus();
  });
});

describe("EventTimeline list semantics", () => {
  it("keeps the list role explicit on every year group", () => {
    const { container } = render(<EventTimeline groups={GROUPS} />);
    const lists = container.querySelectorAll("ol");
    expect(lists).toHaveLength(GROUPS.length);
    for (const list of lists) expect(list).toHaveAttribute("role", "list");
  });
});

describe("EventTimeline year sections", () => {
  it("names each year section by its year heading", () => {
    render(<EventTimeline groups={GROUPS} />);
    expect(
      screen.getAllByRole("region").map((region) => region.textContent),
    ).toHaveLength(GROUPS.length);
    const section = screen.getByRole("region", { name: "2024" });
    expect(section).toContainElement(item("Meetup @ Renault Digital Maroc"));
  });

  it("gives two timelines on one page distinct names to their sections", () => {
    render(
      <>
        <EventTimeline groups={GROUPS} />
        <EventTimeline groups={GROUPS} />
      </>,
    );
    const ids = screen
      .getAllByRole("region")
      .map((region) => region.getAttribute("aria-labelledby"));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("EventTimeline shownIds", () => {
  const SHOWN = new Set([SOCRATES_2025.id, RENAULT.id]);

  it("hides, for a visitor with JavaScript, the events that are not shown", () => {
    render(<EventTimeline groups={GROUPS} shownIds={SHOWN} />);
    expect(
      screen
        .getAllByRole("heading", { level: 4 })
        .map((heading) => heading.textContent),
    ).toEqual([SOCRATES_2025.title, RENAULT.title]);
  });

  it("keeps the hidden events in the page", () => {
    render(<EventTimeline groups={GROUPS} shownIds={SHOWN} />);
    expect(
      screen.getAllByRole("heading", { level: 4, hidden: true }),
    ).toHaveLength(5);
  });

  it("hides the year of a group with no shown event", () => {
    render(<EventTimeline groups={GROUPS} shownIds={SHOWN} />);
    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["2025", "2024"]);
  });

  it("shows every event without JavaScript", () => {
    setJs(false);
    render(<EventTimeline groups={GROUPS} shownIds={SHOWN} />);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(5);
  });
});

describe("EventTimeline empty", () => {
  it("renders nothing without a group", () => {
    const { container } = render(<EventTimeline groups={[]} id="timeline" />);
    expect(container).toBeEmptyDOMElement();
  });
});
