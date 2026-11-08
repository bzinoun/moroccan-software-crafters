import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHead } from "./SectionHead";

const HEAD = {
  eyebrow: "Historique",
  title: "Des années de meetups.",
  lead: "Des premiers rendez-vous aux éditions annuelles.",
};
const CENTERED = {
  eyebrow: "Partenaires",
  title: "Les entreprises qui soutiennent la communauté.",
  lead: "En accueillant un meetup ou en finançant une édition.",
};

describe("SectionHead", () => {
  it("renders the eyebrow, the title as a level 2 heading, then the lead", () => {
    const { container } = render(<SectionHead {...HEAD} />);
    expect(
      screen.getByRole("heading", { level: 2, name: HEAD.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(HEAD.eyebrow).tagName).toBe("P");
    expect(screen.getByText(HEAD.lead).tagName).toBe("P");
    expect(container.textContent).toBe(HEAD.eyebrow + HEAD.title + HEAD.lead);
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

  it("centers the block and the lead when align is center", () => {
    const { container } = render(<SectionHead align="center" {...CENTERED} />);
    expect(container.firstElementChild).toHaveClass("text-center");
    expect(screen.getByText(CENTERED.lead)).toHaveClass("mx-auto");
  });

  it("does not center the block by default", () => {
    const { container } = render(<SectionHead {...HEAD} />);
    expect(container.firstElementChild).not.toHaveClass("text-center");
    expect(screen.getByText(HEAD.lead)).not.toHaveClass("mx-auto");
  });

  it("hides the eyebrow marker when centered and keeps the rule when left aligned", () => {
    const { rerender } = render(<SectionHead align="center" {...CENTERED} />);
    // A visible marker would shift the centered label.
    expect(screen.getByText(CENTERED.eyebrow)).toHaveClass("before:hidden");
    rerender(<SectionHead align="start" {...CENTERED} />);
    expect(screen.getByText(CENTERED.eyebrow)).not.toHaveClass("before:hidden");
    expect(screen.getByText(CENTERED.eyebrow)).toHaveClass("before:w-[22px]");
  });

  it("lets an explicit marker win over the centered default", () => {
    render(<SectionHead align="center" marker="khatam" {...CENTERED} />);
    expect(screen.getByText(CENTERED.eyebrow)).toHaveClass("before:size-3.5");
    expect(screen.getByText(CENTERED.eyebrow)).not.toHaveClass("before:hidden");
  });

  it("lets an explicit none marker hide the rule of a left aligned head", () => {
    render(<SectionHead marker="none" {...HEAD} />);
    expect(screen.getByText(HEAD.eyebrow)).toHaveClass("before:hidden");
  });

  it("omits the eyebrow and the lead when the content has none", () => {
    const { container } = render(<SectionHead title="Galerie" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
    expect(container.textContent).toBe("Galerie");
  });

  it("passes the dark tone to the eyebrow and the lead", () => {
    render(<SectionHead tone="dark" {...HEAD} />);
    expect(screen.getByText(HEAD.eyebrow)).toHaveClass("text-sage");
    expect(screen.getByText(HEAD.lead)).toHaveClass("text-on-dark");
  });

  it("puts titleId on the heading so a section can name itself with aria-labelledby", () => {
    render(
      <section aria-labelledby="historique-title">
        <SectionHead titleId="historique-title" {...HEAD} />
      </section>,
    );
    expect(
      screen.getByRole("region", { name: HEAD.title }),
    ).toBeInTheDocument();
  });

  it("renders extra children after the lead", () => {
    render(
      <SectionHead {...HEAD}>
        <p>Note</p>
      </SectionHead>,
    );
    const lead = screen.getByText(HEAD.lead);
    const note = screen.getByText("Note");
    expect(lead.compareDocumentPosition(note)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
