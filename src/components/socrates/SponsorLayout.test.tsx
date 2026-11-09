import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorLayout } from "./SponsorLayout";

const FAQ = [
  { q: "Peut-on envoyer plusieurs collaborateurs ?", a: "Oui, par pack." },
  { q: "Que couvre le pack ?", a: "Les repas des participants." },
];

function setup() {
  return render(
    <SponsorLayout
      title="Parlons de la prochaine édition"
      lead="Laissez-nous vos coordonnées."
      faq={FAQ}
    >
      <p>le formulaire</p>
    </SponsorLayout>,
  );
}

describe("SponsorLayout", () => {
  it("opens with the title and the lead", () => {
    setup();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Parlons de la prochaine édition",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Laissez-nous vos coordonnées."),
    ).toBeInTheDocument();
  });

  it("lists the questions as closed native disclosures in #sponsor-faq", () => {
    const { container } = setup();
    const list = container.querySelector("#sponsor-faq") as HTMLElement;
    const details = list.querySelectorAll("details");
    expect(details).toHaveLength(FAQ.length);
    for (const d of details) expect(d).not.toHaveAttribute("open");
    expect(
      within(list).getByText("Peut-on envoyer plusieurs collaborateurs ?"),
    ).toBeInTheDocument();
    expect(list).toHaveTextContent("Les repas des participants.");
  });

  it("puts the children in the panel #sponsor-funnel", () => {
    const { container } = setup();
    const panel = container.querySelector("#sponsor-funnel") as HTMLElement;
    expect(within(panel).getByText("le formulaire")).toBeInTheDocument();
  });
});
