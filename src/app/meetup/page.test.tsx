import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadEvents, loadMeetup, loadSite } from "@/content/load";
import { topicKey } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import MeetupPage, { metadata } from "./page";

// Expected values come from content/meetup.json, content/events.json and
// content/site.json. Only the texts written in page.tsx are literals here.
const site = loadSite();
const m = loadMeetup();
// Text queries compare with spaces collapsed, so a no-break space matches a plain one.
const plainSpaces = (text: string) => text.replace(/\s+/g, " ");
const withoutEm = (title: string) => title.replace(/<\/?em>/g, "");

function renderPage() {
  return render(<MeetupPage />);
}

describe("meetup metadata", () => {
  it("takes the title and the description of meetup.json", () => {
    expect(metadata.title).toBe(m.meta.title);
    expect(metadata.description).toBe(m.meta.description);
  });

  it("carries the social tags of the meetup page", () => {
    expect(metadata.openGraph).toMatchObject({
      title: m.meta.title,
      description:
        "Lightning talks, bubble topics, tables rondes : le déroulé d'un samedi matin chez les Moroccan Software Crafters.",
      url: `${site.baseUrl}/meetup/`,
      images: [`${site.baseUrl}/assets/img/meetups/2026-03-innovx-3.jpg`],
    });
  });
});

describe("MeetupPage", () => {
  it("has the section ids that other pages link to, in order", () => {
    const { container } = renderPage();
    const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
    expect(ids).toEqual([
      "pour-qui",
      "deroule",
      "marketplace",
      "proposer",
      "regles",
      "sujets",
      "faq",
    ]);
  });

  it("opens with the hero: the only level 1 heading, the facts, the photo and its post-it", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(withoutEm(m.hero.title));
    expect(h1.querySelector("em")).toBeInTheDocument();
    expect(screen.getByText(plainSpaces(m.hero.eyebrow))).toBeInTheDocument();
    for (const fact of m.hero.facts) {
      expect(screen.getByText(plainSpaces(fact.value))).toBeInTheDocument();
    }
    expect(
      screen.getByRole("img", {
        name: "Participants en cercle pendant un meetup",
      }),
    ).toHaveAttribute("src", `/assets/img/meetups/${m.hero.photo}.jpg`);
    expect(screen.getByText("Vous fixez l'agenda.")).toBeInTheDocument();
  });

  it("names every section by its heading", () => {
    const { container } = renderPage();
    const sections = container.querySelectorAll("section");
    expect(screen.getAllByRole("region")).toHaveLength(sections.length);
    for (const section of sections) {
      const heading = section.querySelector("h1, h2") as HTMLElement;
      expect(section).toHaveAccessibleName(heading.textContent as string);
    }
  });

  it("#pour-qui: head with lead and one card per audience", () => {
    renderPage();
    const section = screen.getByRole("region", {
      name: frenchSpacing(m.who.title),
    });
    expect(section).toHaveAttribute("id", "pour-qui");
    expect(section).toHaveTextContent(m.who.text);
    expect(within(section).getAllByRole("article")).toHaveLength(
      m.who.items.length,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: frenchSpacing(m.who.items[0]!.title),
      }),
    ).toBeInTheDocument();
  });

  it("#deroule: one row per step with its anchor, time and a tip", () => {
    const { container } = renderPage();
    const section = container.querySelector("#deroule") as HTMLElement;
    const rows = [...section.querySelectorAll("article")].map((a) => a.id);
    expect(rows).toEqual(m.steps.items.map((s) => s.id));
    const withTips = m.steps.items.find((s) => s.tips?.length);
    expect(
      within(section).getByText(plainSpaces(withTips!.time)),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(plainSpaces(withTips!.kicker)),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(plainSpaces(withTips!.tips![0]!)),
    ).toBeInTheDocument();
  });

  it("#marketplace: the zoom split with one numbered item per step", () => {
    const { container } = renderPage();
    const section = container.querySelector("#marketplace") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: frenchSpacing(m.marketplace.title),
      }),
    ).toBeInTheDocument();
    expect(within(section).getAllByRole("listitem")).toHaveLength(
      m.marketplace.steps.length,
    );
  });

  it("#proposer: one card per proposal", () => {
    const { container } = renderPage();
    const section = container.querySelector("#proposer") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(
      m.propose.items.length,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: frenchSpacing(m.propose.items[0]!.title),
      }),
    ).toBeInTheDocument();
  });

  it("#regles: one card per rule", () => {
    const { container } = renderPage();
    const section = container.querySelector("#regles") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(
      m.rules.items.length,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: frenchSpacing(m.rules.items[0]!.title),
      }),
    ).toBeInTheDocument();
  });

  it("#sujets: the cork board with every distinct topic", () => {
    const { container } = renderPage();
    const section = container.querySelector("#sujets") as HTMLElement;
    const title = frenchSpacing(m.topicsWall.title);
    expect(
      within(section).getByRole("heading", { level: 2, name: title }),
    ).toBeInTheDocument();
    const board = within(section).getByRole("group", { name: title });
    const events = loadEvents();
    // One note per topic, whatever its case, accents or outer spaces.
    const distinct = new Set(
      events.flatMap((e) => e.topics ?? []).map(topicKey),
    );
    expect(board.children).toHaveLength(distinct.size);
    const newest = events.find((e) => e.topics?.length);
    expect(board.children[0]).toHaveTextContent(newest!.topics![0]!);
  });

  it("#faq: centered head and one closed question per item", () => {
    const { container } = renderPage();
    const section = container.querySelector("#faq") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: frenchSpacing(m.faq.title),
      }),
    ).toBeInTheDocument();
    const details = section.querySelectorAll("details");
    expect(details).toHaveLength(m.faq.items.length);
    expect([...details].filter((d) => d.open)).toEqual([]);
    expect(details[1]?.querySelector("summary")).toHaveTextContent(
      m.faq.items[1]!.q,
    );
  });

  it("ends with the call to action: the primary link in a new tab, then the host page", () => {
    renderPage();
    const primary = screen.getByRole("link", {
      name: frenchSpacing(m.cta.primary.label),
    });
    expect(primary).toHaveAttribute("href", m.cta.primary.href);
    expect(primary).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: frenchSpacing(m.cta.secondary.label) }),
    ).toHaveAttribute("href", "/accueillir/");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: frenchSpacing(m.cta.title),
      }),
    ).toBeInTheDocument();
  });
});
