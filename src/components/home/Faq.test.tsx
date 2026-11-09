import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq, FaqList } from "./Faq";

// A fixture written here: the component draws the items it gets.
const ITEMS = [
  { q: "Combien de personnes faut-il prévoir ?", a: "Entre 30 et 40." },
  {
    q: "Pourquoi le samedi matin ?",
    a: "Un seul atout : la communauté ; c'est tout.",
  },
  { q: "Qui gère les inscriptions ?", a: "Nous." },
];
const PROPS = {
  eyebrow: "Questions fréquentes",
  title: "Avant de vous lancer",
  items: ITEMS,
};

describe("Faq", () => {
  it("renders no section, and no orphan heading, without a question", () => {
    const { container } = render(<Faq {...PROPS} items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is the #faq section, named by its title", () => {
    render(<Faq {...PROPS} />);
    const section = screen.getByRole("region", {
      name: "Avant de vous lancer",
    });
    expect(section).toHaveAttribute("id", "faq");
  });

  it("opens with the eyebrow and the title as a level 2 heading", () => {
    render(<Faq {...PROPS} />);
    expect(screen.getByText("Questions fréquentes")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Avant de vous lancer" }),
    ).toBeInTheDocument();
  });

  it("renders one closed native details per item, in the given order", () => {
    const { container } = render(<Faq {...PROPS} />);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(ITEMS.length);
    for (const item of details) expect(item).not.toHaveAttribute("open");
    // The text before the hidden plus is the question.
    const summaries = [...container.querySelectorAll("summary")].map(
      (summary) => summary.firstChild?.textContent,
    );
    expect(summaries).toEqual([
      "Combien de personnes faut-il prévoir\u202f?",
      "Pourquoi le samedi matin\u202f?",
      "Qui gère les inscriptions\u202f?",
    ]);
  });

  it("keeps each answer in its own details, after the summary, as plain text", () => {
    const { container } = render(<Faq {...PROPS} />);
    const details = container.querySelectorAll("details")[2]!;
    expect(details.firstElementChild?.tagName).toBe("SUMMARY");
    expect(details.querySelector("p")?.textContent).toBe("Nous.");
  });

  it("puts a narrow no-break space before a colon or a semicolon in an answer", () => {
    render(<Faq {...PROPS} />);
    expect(screen.getByText(/Un seul atout/).textContent).toBe(
      "Un seul atout\u202f: la communauté\u202f; c'est tout.",
    );
  });

  it("opens one item on click and leaves the others closed", async () => {
    const user = userEvent.setup();
    const { container } = render(<Faq {...PROPS} />);
    const details = container.querySelectorAll("details");
    await user.click(details[1]!.querySelector("summary")!);
    expect(details[1]).toHaveAttribute("open");
    expect(details[0]).not.toHaveAttribute("open");
    expect(details[2]).not.toHaveAttribute("open");
  });

  // The browser toggles a details on Enter and Space by itself; jsdom and
  // user-event do not simulate that, so the test covers the tab order only.
  it("makes every question a tab stop, in the given order", async () => {
    const user = userEvent.setup();
    const { container } = render(<Faq {...PROPS} />);
    const summaries = container.querySelectorAll("summary");
    await user.tab();
    expect(summaries[0]).toHaveFocus();
    await user.tab();
    expect(summaries[1]).toHaveFocus();
  });
});

describe("FaqList", () => {
  it("marks the plus of each question with the green or the sage color by tone", () => {
    const light = render(<FaqList items={ITEMS} />);
    expect(light.container.querySelector("summary [aria-hidden]")).toHaveClass(
      "text-green",
    );
    light.unmount();
    const dark = render(<FaqList items={ITEMS} tone="dark" />);
    expect(dark.container.querySelector("summary [aria-hidden]")).toHaveClass(
      "text-sage",
    );
  });

  it("keeps the plus out of the name that a screen reader reads", () => {
    const { container } = render(<FaqList items={ITEMS} />);
    for (const summary of container.querySelectorAll("summary")) {
      const plus = within(summary as HTMLElement).getByText("+");
      expect(plus).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("renders nothing without a question", () => {
    const { container } = render(<FaqList items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps the className and the attributes of the caller on the list", () => {
    render(<FaqList items={ITEMS} className="mt-4" aria-label="Aide" />);
    expect(screen.getByLabelText("Aide")).toHaveClass("mt-4");
  });
});
