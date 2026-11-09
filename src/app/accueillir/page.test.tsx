import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadEvents, loadOffers, loadSite } from "@/content/load";
import { fmtDate } from "@/lib/derive";
import AccueillirLayout from "./layout";
import AccueillirPage, { metadata } from "./page";

const site = loadSite();

describe("accueillir page metadata", () => {
  it("takes the title and the description of accueillir.html", () => {
    expect(metadata.title).toBe(
      "Accueillir un meetup · Moroccan Software Crafters",
    );
    expect(metadata.description).toBe(
      "Votre entreprise souhaite accueillir un meetup Moroccan Software Crafters ? Choisissez une formule, proposez une date et nous revenons vers vous sous 48 heures.",
    );
  });

  it("sets the Open Graph tags of accueillir.html on the route", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "Accueillir un meetup Moroccan Software Crafters",
      description:
        "Gratuit ou en formule partenaire : recevez la communauté Software Craftsmanship dans vos locaux.",
      url: `${site.baseUrl}/accueillir/`,
      images: [`${site.baseUrl}/assets/img/meetups/2026-05-axa-1.jpg`],
    });
  });
});

describe("AccueillirLayout", () => {
  it("renders the page frame with the host page id", () => {
    const { container } = render(
      <AccueillirLayout>
        <p>contenu</p>
      </AccueillirLayout>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-page", "host");
    expect(screen.getByRole("main")).toHaveTextContent("contenu");
  });
});

describe("AccueillirPage", () => {
  it("opens with the eyebrow, the title and the lead of accueillir.html", () => {
    render(<AccueillirPage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Recevez 50 crafters un samedi matin.",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Accueillir un meetup")[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        "Dites-nous quand, combien et dans quelles conditions. Nous revenons vers vous sous 48 heures pour caler les détails.",
      ),
    ).toBeInTheDocument();
  });

  it("lists the four steps of what happens next", () => {
    render(<AccueillirPage />);
    const aside = screen.getByRole("complementary");
    const items = within(aside).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    const expected = [
      [
        "1",
        "Vous remplissez ce formulaire",
        "Deux minutes : formule, date, capacité, contact.",
      ],
      [
        "2",
        "On vous rappelle sous 48 h",
        "Un membre de l'équipe valide la date et la logistique avec vous.",
      ],
      [
        "3",
        "On annonce l'édition",
        "Affiche, page Luma et post LinkedIn, 3 à 4 semaines avant.",
      ],
      [
        "4",
        "Le jour J",
        "On accueille, on anime, on publie le récap avec photos.",
      ],
    ];
    expected.forEach(([digit, title, text], index) => {
      expect(items[index]).toHaveTextContent(`${digit}${title}${text}`);
    });
  });

  it("shows the last meetup as proof, with its photo", () => {
    const { container } = render(<AccueillirPage />);
    const latest = loadEvents().find((e) => e.type === "meetup");
    const proof = container.querySelector("#proof-text");
    expect(proof).toHaveTextContent(latest?.host ?? "");
    expect(proof).toHaveTextContent(
      fmtDate(latest?.date ?? "", { long: true }),
    );
    expect(proof).toHaveTextContent(`${latest?.registrations} inscrits`);
    expect(
      screen.getByRole("img", { name: "Participants du dernier meetup" }),
    ).toHaveAttribute("src", "/assets/img/meetups/2026-10-sg-gscm-5.jpg");
  });

  it("links to the meetup page under the proof", () => {
    render(<AccueillirPage />);
    expect(
      screen.getByRole("link", {
        name: "Le déroulé d'un meetup, étape par étape.",
      }),
    ).toHaveAttribute("href", "/meetup/");
  });

  it("puts the funnel after the aside, on step 1 with one choice per offer", () => {
    const { container } = render(<AccueillirPage />);
    const funnel = container.querySelector("#funnel") as HTMLElement;
    expect(funnel).toBeInTheDocument();
    expect(screen.getByRole("complementary").nextElementSibling).toBe(funnel);
    expect(within(funnel).getAllByRole("radio")).toHaveLength(
      loadOffers().items.length,
    );
    expect(
      within(funnel).getByText("Étape 1 sur 4 · Formule"),
    ).toBeInTheDocument();
  });
});
