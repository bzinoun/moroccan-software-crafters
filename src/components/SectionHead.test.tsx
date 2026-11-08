import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHead } from "./SectionHead";

// content/home.json, history, and companies.json, top level.
const HISTORY = {
  eyebrow: "Historique",
  title: "Sept ans de meetups, 21 événements.",
  lead: "Des Code Snacks de 2019 aux meetups de 2026, en passant par quatre éditions de SoCraTes Maroc.",
};
const COMPANIES = {
  eyebrow: "Ils nous font confiance",
  title:
    "Les entreprises qui ont ouvert leurs portes ou soutenu la communauté.",
  lead: "En accueillant un meetup un samedi matin, ou en finançant une édition de SoCraTes Maroc.",
};

describe("SectionHead", () => {
  it("renders the eyebrow, the title as a level 2 heading, then the lead", () => {
    const { container } = render(<SectionHead {...HISTORY} />);
    expect(
      screen.getByRole("heading", { level: 2, name: HISTORY.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(HISTORY.eyebrow).tagName).toBe("P");
    expect(screen.getByText(HISTORY.lead).tagName).toBe("P");
    expect(container.textContent).toBe(
      HISTORY.eyebrow + HISTORY.title + HISTORY.lead,
    );
  });

  it("turns the <em> of a title into an element", () => {
    render(
      <SectionHead title="Des samedis matin où l'on parle <em>vraiment</em> de code." />,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.querySelector("em")?.textContent).toBe("vraiment");
    expect(heading.textContent).toBe(
      "Des samedis matin où l'on parle vraiment de code.",
    );
  });

  it("is at most 760px wide with a 44px bottom margin, left aligned", () => {
    const { container } = render(<SectionHead {...HISTORY} />);
    const head = container.firstElementChild;
    expect(head).toHaveClass("max-w-[760px]", "mb-11");
    expect(head).not.toHaveClass("text-center");
  });

  it("centers the block, the lead and drops the eyebrow rule when align is center", () => {
    const { container } = render(<SectionHead align="center" {...COMPANIES} />);
    expect(container.firstElementChild).toHaveClass(
      "mx-auto",
      "text-center",
      "max-w-[760px]",
    );
    expect(screen.getByText(COMPANIES.lead)).toHaveClass("mx-auto");
    // The marker is taken out of the layout: it would shift the centered label.
    expect(screen.getByText(COMPANIES.eyebrow)).toHaveClass("before:hidden");
  });

  it("keeps the rule marker of the eyebrow when the head is left aligned", () => {
    render(<SectionHead align="start" {...HISTORY} />);
    expect(screen.getByText(HISTORY.eyebrow)).not.toHaveClass("before:hidden");
    expect(screen.getByText(HISTORY.eyebrow)).toHaveClass("before:w-[22px]");
  });

  it("lets an explicit marker win over the centered default", () => {
    render(<SectionHead align="center" marker="khatam" {...COMPANIES} />);
    expect(screen.getByText(COMPANIES.eyebrow)).toHaveClass("before:size-3.5");
    expect(screen.getByText(COMPANIES.eyebrow)).not.toHaveClass(
      "before:hidden",
    );
  });

  it("lets an explicit none marker hide the rule of a left aligned head", () => {
    render(<SectionHead marker="none" {...HISTORY} />);
    expect(screen.getByText(HISTORY.eyebrow)).toHaveClass("before:hidden");
  });

  it("omits the eyebrow and the lead when the content has none", () => {
    const { container } = render(<SectionHead title="Galerie" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
    expect(container.textContent).toBe("Galerie");
  });

  it("passes the dark tone to the eyebrow and the lead", () => {
    render(<SectionHead tone="dark" {...HISTORY} />);
    expect(screen.getByText(HISTORY.eyebrow)).toHaveClass("text-sage");
    expect(screen.getByText(HISTORY.lead)).toHaveClass("text-on-dark");
  });

  it("passes the khatam marker to the eyebrow", () => {
    render(<SectionHead marker="khatam" {...HISTORY} />);
    expect(screen.getByText(HISTORY.eyebrow)).toHaveClass("before:size-3.5");
  });

  it("puts titleId on the heading so a section can name itself with aria-labelledby", () => {
    render(
      <section aria-labelledby="historique-title">
        <SectionHead titleId="historique-title" {...HISTORY} />
      </section>,
    );
    expect(
      screen.getByRole("region", { name: HISTORY.title }),
    ).toBeInTheDocument();
  });

  it("renders extra children after the lead", () => {
    const { container } = render(
      <SectionHead {...HISTORY}>
        <p>Note</p>
      </SectionHead>,
    );
    expect(container.lastElementChild?.lastElementChild?.textContent).toBe(
      "Note",
    );
  });
});
