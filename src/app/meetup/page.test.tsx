import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MeetupPage, { metadata } from "./page";

// Expected values are literals read from content/meetup.json and the former `meetup.html` (`git show 1353207:meetup.html`).
function renderPage() {
  return render(<MeetupPage />);
}

describe("meetup metadata", () => {
  it("takes the title and the description of meetup.json", () => {
    expect(metadata.title).toBe(
      "Le meetup, expliqué · Moroccan Software Crafters",
    );
    expect(metadata.description).toMatch(
      /^Comment se déroule un meetup Moroccan Software Crafters/,
    );
  });

  it("carries the social tags of meetup.html", () => {
    expect(metadata.openGraph).toMatchObject({
      title: "Le meetup, expliqué · Moroccan Software Crafters",
      description:
        "Lightning talks, bubble topics, tables rondes : le déroulé d'un samedi matin chez les Moroccan Software Crafters.",
      url: "https://bzinoun.github.io/moroccan-software-crafters/meetup/",
      images: [
        "https://bzinoun.github.io/moroccan-software-crafters/assets/img/meetups/2026-03-innovx-3.jpg",
      ],
    });
  });
});

describe("MeetupPage", () => {
  it("has the section ids of the old page, in order", () => {
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

  it("opens with the hero: the only level 1 heading, four facts, the photo and its post-it", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(
      "Une matinée, quatre heures, zéro slide obligatoire.",
    );
    expect(h1.querySelector("em")).toHaveTextContent("zéro");
    expect(screen.getByText("Le meetup, expliqué")).toBeInTheDocument();
    expect(screen.getByText("0 MAD")).toBeInTheDocument();
    expect(screen.getByText("9 h 30 → 14 h")).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Participants en cercle pendant un meetup",
      }),
    ).toHaveAttribute("src", "/assets/img/meetups/2026-10-sg-gscm-2.jpg");
    expect(screen.getByText("Vous fixez l'agenda.")).toBeInTheDocument();
  });

  it("alternates plain and alt bands as the old page does", () => {
    const { container } = renderPage();
    const alt = [...container.querySelectorAll("section[id]")]
      .filter((s) => s.classList.contains("bg-sage-soft"))
      .map((s) => s.id);
    expect(alt).toEqual(["deroule", "proposer", "sujets"]);
  });

  it("#pour-qui: head with lead and four cards", () => {
    renderPage();
    const section = screen.getByRole("region", {
      name: "Celles et ceux qui livrent du logiciel, quel que soit le langage.",
    });
    expect(section).toHaveAttribute("id", "pour-qui");
    expect(section).toHaveTextContent("Développeurs, testeurs, ops, data");
    expect(within(section).getAllByRole("article")).toHaveLength(4);
    expect(
      within(section).getByRole("heading", { level: 3, name: "Vous testez" }),
    ).toBeInTheDocument();
  });

  it("#deroule: five step rows with their anchors, times and tips", () => {
    const { container } = renderPage();
    const section = container.querySelector("#deroule") as HTMLElement;
    const rows = [...section.querySelectorAll("article")].map((a) => a.id);
    expect(rows).toEqual(["accueil", "lightning", "bubble", "tables", "retro"]);
    expect(within(section).getByText("9 h 30 → 10 h 15")).toBeInTheDocument();
    expect(
      within(section).getByText("On commence par le café"),
    ).toBeInTheDocument();
    expect(
      within(section).getByText("Un bon lightning talk tient en une idée."),
    ).toBeInTheDocument();
  });

  it("#marketplace: the zoom split with the four numbered steps", () => {
    const { container } = renderPage();
    const section = container.querySelector("#marketplace") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Comment naissent les trois tables rondes",
      }),
    ).toBeInTheDocument();
    expect(within(section).getAllByRole("listitem")).toHaveLength(4);
  });

  it("#proposer: four cards of proposals", () => {
    const { container } = renderPage();
    const section = container.querySelector("#proposer") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(4);
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: "Comment s'inscrire",
      }),
    ).toBeInTheDocument();
  });

  it("#regles: five rules in the three-column grid", () => {
    const { container } = renderPage();
    const section = container.querySelector("#regles") as HTMLElement;
    expect(within(section).getAllByRole("article")).toHaveLength(5);
    expect(
      within(section).getByRole("heading", { level: 3, name: "Photos" }),
    ).toBeInTheDocument();
  });

  it("#sujets: the cork board with every distinct topic", () => {
    const { container } = renderPage();
    const section = container.querySelector("#sujets") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Le mur des sujets, depuis 2019.",
      }),
    ).toBeInTheDocument();
    const board = within(section).getByRole("group", {
      name: "Le mur des sujets, depuis 2019.",
    });
    expect(board.children).toHaveLength(47);
    expect(board.children[0]).toHaveTextContent("AI factory");
    expect(board.children[0]).toHaveTextContent("2026 · Société Générale GSCM");
  });

  it("#faq: centered head and four closed questions", () => {
    const { container } = renderPage();
    const section = container.querySelector("#faq") as HTMLElement;
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Avant de venir",
      }),
    ).toBeInTheDocument();
    const details = section.querySelectorAll("details");
    expect(details).toHaveLength(4);
    expect(details[2]?.querySelector("summary")).toHaveTextContent(
      "Comment suis-je prévenu du prochain meetup ?",
    );
  });

  it("ends with the green call to action: LinkedIn in a new tab, then the host page", () => {
    renderPage();
    const follow = screen.getByRole("link", { name: "Suivre l'association" });
    expect(follow).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    );
    expect(follow).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: "Accueillir un meetup" }),
    ).toHaveAttribute("href", "/accueillir/");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Le prochain meetup est annoncé sur LinkedIn.",
      }),
    ).toBeInTheDocument();
  });
});
