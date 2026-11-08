import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HostHero, HostLayout, ProcessSteps, ProofCard } from "./HostLayout";

describe("HostHero", () => {
  it("shows the eyebrow, the level 1 title and the lead", () => {
    render(
      <HostHero
        eyebrow="Accueillir un meetup"
        title="Recevez 50 crafters un samedi matin."
        lead="Dites-nous quand."
      />,
    );
    expect(screen.getByText("Accueillir un meetup")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Recevez 50 crafters un samedi matin.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dites-nous quand.")).toBeInTheDocument();
  });
});

describe("ProcessSteps", () => {
  it("numbers the steps in an ordered list", () => {
    render(
      <ProcessSteps
        steps={[
          { title: "Vous remplissez ce formulaire", text: "Deux minutes." },
          { title: "On vous rappelle sous 48 h", text: "Un membre valide." },
        ]}
      />,
    );
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("1");
    expect(items[0]).toHaveTextContent("Vous remplissez ce formulaire");
    expect(items[0]).toHaveTextContent("Deux minutes.");
    expect(items[1]).toHaveTextContent("2");
  });
});

describe("ProofCard", () => {
  it("writes the last edition from the latest meetup", () => {
    const { container } = render(
      <ProofCard
        src="/assets/img/meetups/2026-10-sg-gscm-5.jpg"
        alt="Participants du dernier meetup"
        edition={{
          host: "Société Générale GSCM",
          date: "2026-10-24",
          registrations: 110,
        }}
      />,
    );
    expect(container.querySelector("#proof-text")).toHaveTextContent(
      "Dernière édition : Société Générale GSCM, 24 octobre 2026, 110 inscrits.",
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    );
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  it("leaves out the registrations when the edition has none", () => {
    const { container } = render(
      <ProofCard
        src="/x.jpg"
        alt="x"
        edition={{ host: "Acme", date: "2026-05-16" }}
      />,
    );
    expect(container.querySelector("#proof-text")).toHaveTextContent(
      "Dernière édition : Acme, 16 mai 2026.",
    );
  });

  it("falls back to the text of the old page without an edition", () => {
    const { container } = render(
      <ProofCard src="/x.jpg" alt="x" edition={null} />,
    );
    expect(container.querySelector("#proof-text")).toHaveTextContent(
      "Dernière édition : Société Générale GSCM, 24 octobre 2026, 110 inscrits.",
    );
  });
});

describe("HostLayout", () => {
  it("puts the aside before the funnel", () => {
    render(
      <HostLayout aside={<p>Colonne</p>}>
        <p>Formulaire</p>
      </HostLayout>,
    );
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveTextContent("Colonne");
    expect(aside.nextElementSibling).toHaveTextContent("Formulaire");
  });
});
