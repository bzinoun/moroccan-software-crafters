import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { loadHome } from "@/content/load";
import { Faq, FaqList } from "./Faq";

const { faq } = loadHome();

describe("Faq", () => {
  it("is the #faq section on the alternate background, named by its title", () => {
    render(<Faq {...faq} />);
    const section = screen.getByRole("region", {
      name: "Avant de vous lancer",
    });
    expect(section).toHaveAttribute("id", "faq");
    expect(section).toHaveClass("bg-sage-soft");
  });

  it("opens with the centered head of home.json", () => {
    render(<Faq {...faq} />);
    expect(screen.getByText("Questions fréquentes")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Avant de vous lancer" }),
    ).toBeInTheDocument();
  });

  it("takes the eyebrow marker out of the layout so the centered label stays centered", () => {
    render(<Faq {...faq} />);
    expect(screen.getByText("Questions fréquentes")).toHaveClass(
      "before:hidden",
    );
  });

  it("renders the five questions of the file as closed native details", () => {
    const { container } = render(<Faq {...faq} />);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(5);
    for (const item of details) expect(item).not.toHaveAttribute("open");
    const summaries = [...container.querySelectorAll("summary")].map(
      (summary) => summary.textContent,
    );
    expect(summaries).toEqual([
      "Combien de personnes faut-il prévoir\u202f?",
      "Pourquoi le samedi matin\u202f?",
      "Est-ce qu'on peut présenter notre entreprise\u202f?",
      "Qui gère les inscriptions\u202f?",
      "Combien de temps à l'avance faut-il s'y prendre\u202f?",
    ]);
  });

  it("keeps each answer in its own details, after the summary, as plain text", () => {
    const { container } = render(<Faq {...faq} />);
    const details = container.querySelectorAll("details")[4];
    expect(details.firstElementChild?.tagName).toBe("SUMMARY");
    expect(details.querySelector("p")?.textContent).toBe(
      "Comptez 4 à 6 semaines entre le premier échange et le jour J pour laisser le temps à l'annonce de circuler.",
    );
  });

  it("puts a narrow no-break space before a colon in an answer", () => {
    render(<Faq {...faq} />);
    const answer = screen.getByText(/C'est le créneau historique/);
    expect(answer.textContent).toContain("communauté\u202f: les participants");
  });

  it("opens one item on click and leaves the others closed", async () => {
    const user = userEvent.setup();
    const { container } = render(<Faq {...faq} />);
    const details = container.querySelectorAll("details");
    await user.click(details[1].querySelector("summary")!);
    expect(details[1]).toHaveAttribute("open");
    expect(details[0]).not.toHaveAttribute("open");
    expect(details[3]).not.toHaveAttribute("open");
  });

  // The browser toggles a details on Enter and Space by itself; jsdom and
  // user-event do not simulate that, so the test covers the tab order only.
  it("makes every question a tab stop, in file order", async () => {
    const user = userEvent.setup();
    const { container } = render(<Faq {...faq} />);
    const summaries = container.querySelectorAll("summary");
    await user.tab();
    expect(summaries[0]).toHaveFocus();
    await user.tab();
    expect(summaries[1]).toHaveFocus();
  });

  it("is 820px wide at most and centered, with a line under each item", () => {
    const { container } = render(<Faq {...faq} />);
    const list = container.querySelector("details")?.parentElement;
    expect(list).toHaveClass("mx-auto", "max-w-[820px]");
    expect(container.querySelector("details")).toHaveClass(
      "border-b",
      "border-line",
    );
  });

  it("shows a green plus that turns into a cross when the item is open", () => {
    const { container } = render(<Faq {...faq} />);
    const summary = container.querySelector("summary");
    expect(summary).toHaveClass(
      "after:content-['+']",
      "after:text-green",
      "group-open:after:rotate-45",
    );
    expect(container.querySelector("details")).toHaveClass("group");
  });
});

describe("FaqList", () => {
  it("uses translucent lines, on-dark answers and a sage plus in the dark tone", () => {
    const { container } = render(<FaqList items={faq.items} tone="dark" />);
    const details = container.querySelector("details");
    expect(details).toHaveClass("border-white/14");
    expect(details).not.toHaveClass("border-line");
    expect(container.querySelector("details p")).toHaveClass("text-on-dark");
    expect(container.querySelector("summary")).toHaveClass("after:text-sage");
    expect(container.querySelector("summary")).not.toHaveClass(
      "after:text-green",
    );
  });

  it("merges a caller className and keeps the 820px measure", () => {
    const { container } = render(
      <FaqList items={faq.items} className="mt-4" />,
    );
    expect(container.firstElementChild).toHaveClass("mt-4", "max-w-[820px]");
  });
});
