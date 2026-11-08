import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { DarkHero, StatusChip } from "./DarkHero";

const SOCRATES = {
  photo: "/assets/img/meetups/group.jpg",
  eyebrow: "Software Craft & Testing · édition marocaine",
  title: "Des jours entre crafters, <em>sans programme</em>.",
  lead: "Une unconference : pas de conférenciers invités, pas d'agenda.",
  status: "Prochaine édition : bientôt, quelque part",
  facts: [
    { value: "4", label: "éditions" },
    { value: "30 → 50", label: "participants" },
    { value: "11", label: "partenaires" },
    { value: "3 pays", label: "d'origine" },
  ],
};

const ACTIONS = (
  <>
    <Button variant="primary-flat" href="#sponsoring">
      Devenir partenaire
    </Button>
    <Button variant="ghost-on-dark" href="https://socrates-ma.github.io/">
      {"Site de l'édition"}
    </Button>
  </>
);

describe("DarkHero", () => {
  it("renders the eyebrow, the level 1 title and the lead", () => {
    render(<DarkHero {...SOCRATES} />);
    expect(screen.getByText(/Software Craft & Testing/)).toBeInTheDocument();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent(
      "Des jours entre crafters, sans programme.",
    );
    expect(within(title).getByText("sans programme").tagName).toBe("EM");
    expect(screen.getByText(/Une unconference/)).toBeInTheDocument();
  });

  it("uses the photo as a background layer hidden from assistive technology", () => {
    const { container } = render(<DarkHero {...SOCRATES} />);
    const layer = container.querySelector("[data-hero-photo]") as HTMLElement;
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer.style.backgroundImage).toContain(
      "/assets/img/meetups/group.jpg",
    );
  });

  it("renders the actions it receives", () => {
    render(<DarkHero {...SOCRATES} actions={ACTIONS} />);
    expect(
      screen.getByRole("link", { name: "Devenir partenaire" }),
    ).toHaveAttribute("href", "#sponsoring");
    expect(
      screen.getByRole("link", { name: "Site de l'édition" }),
    ).toHaveAttribute("href", "https://socrates-ma.github.io/");
  });

  it("renders the status chip with a narrow no-break space before the colon", () => {
    render(<DarkHero {...SOCRATES} />);
    expect(screen.getByText(/Prochaine édition/).textContent).toBe(
      "Prochaine édition\u202f: bientôt, quelque part",
    );
  });

  it("renders one list item per fact", () => {
    render(<DarkHero {...SOCRATES} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(SOCRATES.facts.length);
    expect(within(items[1]!).getByText("30 → 50")).toBeVisible();
  });

  it("renders neither chip nor facts nor actions when they are not given", () => {
    render(
      <DarkHero
        photo={SOCRATES.photo}
        eyebrow={SOCRATES.eyebrow}
        title={SOCRATES.title}
        lead={SOCRATES.lead}
      />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/Prochaine édition/)).not.toBeInTheDocument();
  });

  it("labels the section with the title when titleId is given", () => {
    render(<DarkHero {...SOCRATES} titleId="hero-title" />);
    expect(screen.getByRole("region")).toHaveAccessibleName(
      "Des jours entre crafters, sans programme.",
    );
  });
});

describe("StatusChip", () => {
  it("renders its text in a paragraph with the French narrow space", () => {
    render(<StatusChip>Prochaine édition : 2027</StatusChip>);
    const chip = screen.getByText(/Prochaine édition/);
    expect(chip.tagName).toBe("P");
    expect(chip.textContent).toBe("Prochaine édition\u202f: 2027");
  });

  it("lets a caller className replace the default top margin", () => {
    render(<StatusChip className="mt-0">Texte</StatusChip>);
    expect(screen.getByText("Texte")).toHaveClass("mt-0");
    expect(screen.getByText("Texte")).not.toHaveClass("mt-[1.4rem]");
  });
});
