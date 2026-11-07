import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "./PageHero";

// content/meetup.json, hero; photo URL and alt from meetup.html.
const MEETUP = {
  eyebrow: "Le meetup, expliqué",
  title: "Une matinée, quatre heures, <em>zéro</em> slide obligatoire.",
  lead: "Le meetup est gratuit, se tient un samedi matin chez une entreprise hôte, et ne ressemble pas à une conférence.",
  facts: [
    { value: "9 h 30 → 14 h", label: "un samedi, toutes les 6 à 8 semaines" },
    { value: "~100", label: "inscrits par édition" },
    { value: "50", label: "places retenues sur place" },
    { value: "0 MAD", label: "pour les participants" },
  ],
  image: {
    src: "/assets/img/meetups/2026-10-sg-gscm-2.jpg",
    alt: "Participants en cercle pendant un meetup",
  },
  postit: { color: "yellow" as const, text: "Vous fixez l'agenda." },
};

describe("PageHero", () => {
  it("renders the eyebrow, the level 1 title with its emphasis and the lead", () => {
    render(<PageHero {...MEETUP} />);
    expect(screen.getByText("Le meetup, expliqué")).toBeInTheDocument();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent(
      "Une matinée, quatre heures, zéro slide obligatoire.",
    );
    expect(within(title).getByText("zéro").tagName).toBe("EM");
    expect(screen.getByText(MEETUP.lead)).toBeInTheDocument();
  });

  it("renders the four facts", () => {
    render(<PageHero {...MEETUP} />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(4);
    expect(within(list).getByText("0 MAD")).toBeInTheDocument();
  });

  it("keeps the facts on two columns at every width", () => {
    render(<PageHero {...MEETUP} />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass(
      "grid-cols-[repeat(2,1fr)]",
      "sm:grid-cols-[repeat(2,1fr)]",
    );
    expect(list).not.toHaveClass("sm:grid-cols-[repeat(4,1fr)]");
  });

  it("shows the photo with its alt text, loaded at once", () => {
    render(<PageHero {...MEETUP} />);
    const photo = screen.getByRole("img", {
      name: "Participants en cercle pendant un meetup",
    });
    expect(photo).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-2.jpg",
    );
    expect(photo).not.toHaveAttribute("loading", "lazy");
  });

  it("overlaps a post-it on the photo with the given color", () => {
    render(<PageHero {...MEETUP} />);
    const note = screen.getByText("Vous fixez l'agenda.");
    expect(note).toHaveClass("bg-postit-yellow", "absolute");
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

  it("has the zellige corner and two columns from lg", () => {
    const { container } = render(<PageHero {...MEETUP} />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("zellige-corner", "pt-16", "pb-10");
    expect(section?.firstElementChild).toHaveClass(
      "lg:grid-cols-[1.1fr_0.9fr]",
    );
  });

  it("labels the section with the title when titleId is given", () => {
    render(<PageHero {...MEETUP} titleId="hero-title" />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveAttribute("id", "hero-title");
    expect(screen.getByRole("region")).toHaveAccessibleName(
      "Une matinée, quatre heures, zéro slide obligatoire.",
    );
  });
});
