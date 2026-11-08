import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepRows, TipList, type Step } from "./StepRows";

// content/meetup.json, steps.items[0] and [1]; image is the final photo URL.
const STEPS: Step[] = [
  {
    id: "accueil",
    time: "9 h 30 → 10 h 15",
    title: "Accueil et networking",
    kicker: "On commence par le café",
    image: "/assets/img/meetups/2026-10-sg-gscm-7.jpg",
    text: "L'hôte ouvre ses portes, l'équipe d'organisation pointe les inscrits Luma et distribue les post-its.",
    tips: [
      "Arrivez à l'heure : l'accès au bâtiment ferme souvent 30 minutes après le début.",
      "Venez avec une question que vous vous posez en ce moment : elle finira sur un post-it.",
    ],
  },
  {
    id: "lightning",
    time: "10 h 15 → 11 h 00",
    title: "Lightning talks",
    kicker: "Cinq à dix minutes, chrono en main",
    image: "/assets/img/meetups/2026-10-sg-gscm-3.jpg",
    text: "Quatre à six prises de parole courtes, sur le sujet de son choix.",
    tips: [
      "Un bon lightning talk tient en une idée.",
      "Les talks s'annoncent le matin même : il suffit de s'inscrire sur le tableau à l'accueil.",
    ],
  },
];

describe("StepRows", () => {
  it("renders each step with its time, kicker, level 3 title and text", () => {
    render(<StepRows steps={STEPS} />);
    const rows = screen.getAllByRole("article");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveAttribute("id", "accueil");
    expect(within(rows[0]).getByText("9 h 30 → 10 h 15")).toBeInTheDocument();
    expect(
      within(rows[0]).getByText("On commence par le café"),
    ).toBeInTheDocument();
    expect(
      within(rows[0]).getByRole("heading", {
        level: 3,
        name: "Accueil et networking",
      }),
    ).toBeInTheDocument();
    expect(within(rows[1]).getByText(STEPS[1].text)).toBeInTheDocument();
  });

  it("shows a decorative lazy photo for each step", () => {
    const { container } = render(<StepRows steps={STEPS} />);
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "");
    expect(images[0]).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-7.jpg",
    );
    expect(images[0]).toHaveAttribute("loading", "lazy");
  });

  it("lists the tips of each step as list items", () => {
    render(<StepRows steps={STEPS} />);
    const rows = screen.getAllByRole("article");
    const tips = within(rows[1]).getAllByRole("listitem");
    expect(tips).toHaveLength(2);
    expect(tips[0]).toHaveTextContent(
      "Un bon lightning talk tient en une idée.",
    );
  });

  it("renders no list for a step without tips", () => {
    render(<StepRows steps={[{ ...STEPS[0], tips: undefined }]} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("puts the photo on the right of the even rows from md", () => {
    const { container } = render(<StepRows steps={STEPS} />);
    const images = container.querySelectorAll("img");
    // Every row is a group; the photo box orders itself last when its row is even.
    for (const image of images) {
      expect(image.closest("article")).toHaveClass("group", "md:grid-cols-2");
      expect(image.parentElement).toHaveClass("md:group-even:order-2");
    }
  });

  it("uses a narrow no-break space before a colon in a tip", () => {
    render(<StepRows steps={STEPS} />);
    const tip = screen.getAllByRole("listitem")[0];
    expect(tip.textContent).toBe(
      "Arrivez à l'heure : l'accès au bâtiment ferme souvent 30 minutes après le début.",
    );
  });

  it("renders nothing for an empty list of steps", () => {
    const { container } = render(<StepRows steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("TipList", () => {
  it("renders the tips as a list", () => {
    render(<TipList tips={["Un bon lightning talk tient en une idée."]} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent(
      "Un bon lightning talk tient en une idée.",
    );
  });

  it("renders nothing for no tips", () => {
    const { container } = render(<TipList tips={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is a yellow note, green on even items", () => {
    render(<TipList tips={["Un.", "Deux."]} />);
    const [first, second] = screen.getAllByRole("listitem");
    expect(first).toHaveClass("bg-postit-yellow", "even:bg-postit-green");
    expect(second).toHaveClass("bg-postit-yellow", "even:bg-postit-green");
  });
});
