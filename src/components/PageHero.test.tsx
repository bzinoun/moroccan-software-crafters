import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "./PageHero";

const MEETUP = {
  eyebrow: "Le meetup",
  title: "Une matinée, quatre heures, <em>zéro</em> slide.",
  lead: "Un meetup gratuit, un samedi matin, chez une entreprise hôte.",
  facts: [
    { value: "9 h → 14 h", label: "un samedi matin" },
    { value: "~100", label: "inscrits" },
    { value: "50", label: "places sur place" },
    { value: "Gratuit", label: "pour les participants" },
  ],
  image: {
    src: "/assets/img/meetups/hero.jpg",
    alt: "Participants en cercle pendant un meetup",
  },
  postit: { color: "yellow" as const, text: "Vous fixez l'agenda." },
};

describe("PageHero", () => {
  it("renders the eyebrow, the level 1 title with its emphasis and the lead", () => {
    render(<PageHero {...MEETUP} />);
    expect(screen.getByText("Le meetup")).toBeInTheDocument();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Une matinée, quatre heures, zéro slide.");
    expect(within(title).getByText("zéro").tagName).toBe("EM");
    expect(screen.getByText(MEETUP.lead)).toBeInTheDocument();
  });

  it("renders one list item per fact", () => {
    render(<PageHero {...MEETUP} />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(
      MEETUP.facts.length,
    );
    expect(within(list).getByText("Gratuit")).toBeInTheDocument();
  });

  it("shows the photo with its alt text, loaded at once", () => {
    render(<PageHero {...MEETUP} />);
    const photo = screen.getByRole("img", {
      name: "Participants en cercle pendant un meetup",
    });
    expect(photo).toHaveAttribute("src", "/assets/img/meetups/hero.jpg");
    expect(photo).not.toHaveAttribute("loading", "lazy");
  });

  it("overlaps a post-it on the photo with the given color", () => {
    render(<PageHero {...MEETUP} />);
    const note = screen.getByText("Vous fixez l'agenda.");
    expect(note).toHaveClass("bg-postit-yellow");
    expect(note.parentElement?.tagName).toBe("FIGURE");
  });

  it("uses the green post-it of the association page", () => {
    render(
      <PageHero {...MEETUP} postit={{ color: "green", text: "Depuis 2019" }} />,
    );
    expect(screen.getByText("Depuis 2019")).toHaveClass("bg-postit-green");
  });

  it("renders no post-it and no list when they are not given", () => {
    render(
      <PageHero
        eyebrow={MEETUP.eyebrow}
        title={MEETUP.title}
        lead={MEETUP.lead}
        image={MEETUP.image}
      />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText("Vous fixez l'agenda.")).not.toBeInTheDocument();
  });

  it("labels the section with the title when titleId is given", () => {
    render(<PageHero {...MEETUP} titleId="hero-title" />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveAttribute("id", "hero-title");
    expect(screen.getByRole("region")).toHaveAccessibleName(
      "Une matinée, quatre heures, zéro slide.",
    );
  });
});
