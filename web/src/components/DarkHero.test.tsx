import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { DarkHero, StatusChip } from "./DarkHero";

// content/socrates.json, hero.
const SOCRATES = {
  photo: "/assets/img/meetups/2022-03-socrates-groupe.jpg",
  eyebrow: "Software Craft & Testing · édition marocaine depuis 2022",
  title: "Quatre jours entre crafters, <em>sans programme</em>.",
  lead: "SoCraTes Maroc est une unconference : pas de conférenciers invités, pas d'agenda fixé à l'avance.",
  status: "Prochaine édition : après le Ramadan 2027, Bouznika",
  facts: [
    { value: "4", label: "éditions depuis 2022" },
    { value: "30 → 50", label: "participants par édition" },
    { value: "11", label: "entreprises partenaires" },
    { value: "3 pays", label: "Maroc, France, Allemagne" },
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
      "Quatre jours entre crafters, sans programme.",
    );
    expect(within(title).getByText("sans programme").tagName).toBe("EM");
    expect(
      screen.getByText(/SoCraTes Maroc est une unconference/),
    ).toBeInTheDocument();
  });

  it("sets the title in white and the emphasis in sage without the underline", () => {
    render(<DarkHero {...SOCRATES} />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass(
      "text-white",
      "[&_em]:text-sage",
      "[&_em]:bg-none",
    );
  });

  it("lightens the emphasis weight so the title keeps the two lines of the old page", () => {
    render(<DarkHero {...SOCRATES} />);
    // Fraunces italic at 76.8px, 1280px wide: the line "sans programme."
    // has 283px + the emphasis + 17px to fit in the 820px column. The emphasis
    // is 513.1px at 500 (the old faux bold), 527.6px at the global 590 (third
    // line) and about 516px at 520 (fits with 4px to spare).
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "[&_em]:font-[520]",
    );
  });

  it("draws the zellige corner in sage above the photo", () => {
    const { container } = render(<DarkHero {...SOCRATES} />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("zellige-corner", "zellige-corner-dark");
  });

  it("marks the eyebrow with a khatam in cream", () => {
    render(<DarkHero {...SOCRATES} />);
    const eyebrow = screen.getByText(/Software Craft & Testing/);
    expect(eyebrow).toHaveClass("text-cream", "before:size-3.5");
  });

  it("uses the photo as a background layer hidden from assistive technology", () => {
    const { container } = render(<DarkHero {...SOCRATES} />);
    const layer = container.querySelector("[data-hero-photo]") as HTMLElement;
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer.style.backgroundImage).toContain(
      "/assets/img/meetups/2022-03-socrates-groupe.jpg",
    );
    expect(layer).toHaveClass("opacity-45");
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
      "Prochaine édition : après le Ramadan 2027, Bouznika",
    );
  });

  it("renders the four facts in the dark tone", () => {
    render(<DarkHero {...SOCRATES} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveClass("bg-white/7");
    expect(within(items[1]).getByText("30 → 50")).toHaveClass("text-sage");
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

  it("is a deep green band with the zellige corner and a cream focus ring in sage", () => {
    const { container } = render(<DarkHero {...SOCRATES} />);
    expect(container.querySelector("section")).toHaveClass(
      "zellige-corner",
      "bg-green-deep",
      "text-cream",
      "pt-30",
      "pb-18",
      "**:focus-visible:outline-sage",
    );
  });

  it("labels the section with the title when titleId is given", () => {
    render(<DarkHero {...SOCRATES} titleId="hero-title" />);
    expect(screen.getByRole("region")).toHaveAccessibleName(
      "Quatre jours entre crafters, sans programme.",
    );
  });
});

describe("StatusChip", () => {
  it("renders its text in a paragraph, cream on a translucent green pill", () => {
    render(<StatusChip>Prochaine édition : 2027</StatusChip>);
    const chip = screen.getByText(/Prochaine édition/);
    expect(chip.tagName).toBe("P");
    expect(chip.textContent).toBe("Prochaine édition : 2027");
    expect(chip).toHaveClass("text-cream", "rounded-[18px]", "text-balance");
    expect(chip.className).toContain("before:[clip-path:polygon(");
  });

  it("merges a caller className", () => {
    render(<StatusChip className="mt-0">Texte</StatusChip>);
    expect(screen.getByText("Texte")).toHaveClass("mt-0");
    expect(screen.getByText("Texte")).not.toHaveClass("mt-[1.4rem]");
  });
});
