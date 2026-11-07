import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadAssociation } from "@/content/load";
import { CardsSection } from "./CardsSection";

const a = loadAssociation();

describe("CardsSection (mission)", () => {
  function renderMission() {
    return render(
      <CardsSection
        id="mission"
        eyebrow={a.mission.eyebrow}
        title={a.mission.title}
        items={a.mission.items}
        columns={3}
      />,
    );
  }

  it("is the #mission section on the plain background", () => {
    const { container } = renderMission();
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "mission");
    expect(section).not.toHaveClass("bg-sage-soft");
  });

  it("opens with the eyebrow and the title of the JSON", () => {
    renderMission();
    expect(screen.getByText("Ce qu'on fait")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Deux rendez-vous, un même fil.",
      }),
    ).toBeInTheDocument();
  });

  it("shows the three cards with their links to the root pages", () => {
    renderMission();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Le déroulé →" })).toHaveAttribute(
      "href",
      "/meetup/",
    );
    expect(
      screen.getByRole("link", { name: "La conférence →" }),
    ).toHaveAttribute("href", "/socrates/");
    expect(
      screen.getByRole("link", { name: "L'historique →" }),
    ).toHaveAttribute("href", "/#historique");
  });
});

describe("CardsSection (principles)", () => {
  it("is the #principes section on the alternate background with six cards without link", () => {
    const { container } = render(
      <CardsSection
        id="principes"
        variant="alt"
        eyebrow={a.principles.eyebrow}
        title={a.principles.title}
        items={a.principles.items}
        columns={3}
      />,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "principes");
    expect(section).toHaveClass("bg-sage-soft");
    const cards = within(section as HTMLElement).getAllByRole("article");
    expect(cards).toHaveLength(6);
    expect(within(section as HTMLElement).queryByRole("link")).toBeNull();
    expect(
      screen.getByRole("heading", { level: 3, name: "Ouvert à tous" }),
    ).toBeInTheDocument();
  });
});

describe("CardsSection (contribute)", () => {
  function renderContribute() {
    return render(
      <CardsSection
        id="contribuer"
        eyebrow={a.contribute.eyebrow}
        title={a.contribute.title}
        items={a.contribute.items}
        columns={4}
      />,
    );
  }

  it("is the #contribuer section with four cards", () => {
    const { container } = renderContribute();
    expect(container.querySelector("section")).toHaveAttribute(
      "id",
      "contribuer",
    );
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("links internal cards to routes and the last card to LinkedIn in a new tab", () => {
    renderContribute();
    expect(
      screen.getByRole("link", { name: "Proposer une date →" }),
    ).toHaveAttribute("href", "/accueillir/");
    expect(
      screen.getByRole("link", { name: "Voir les formules →" }),
    ).toHaveAttribute("href", "/socrates/#sponsoring");
    expect(
      screen.getByRole("link", { name: "Comment faire →" }),
    ).toHaveAttribute("href", "/meetup/#proposer");
    const linkedin = screen.getByRole("link", { name: "Nous écrire →" });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/moroccansoftwarecrafters/",
    );
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener");
  });
});

describe("CardsSection (lead and titleId)", () => {
  it("shows the lead under the title and names the section by its title", () => {
    render(
      <CardsSection
        id="pour-qui"
        titleId="who-title"
        eyebrow="Pour qui"
        title="Un titre."
        lead="Un chapeau d'une phrase."
        items={a.mission.items}
        columns={3}
      />,
    );
    expect(screen.getByText("Un chapeau d'une phrase.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Un titre." })).toHaveAttribute(
      "id",
      "pour-qui",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "id",
      "who-title",
    );
  });

  it("is no landmark when no titleId is given", () => {
    render(
      <CardsSection
        id="mission"
        eyebrow={a.mission.eyebrow}
        title={a.mission.title}
        items={a.mission.items}
        columns={3}
      />,
    );
    expect(screen.queryByRole("region")).toBeNull();
  });
});
