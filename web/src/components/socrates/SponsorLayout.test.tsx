import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadSponsoring } from "@/content/load";
import { SponsorLayout } from "./SponsorLayout";

const { form, faq } = loadSponsoring();

function setup() {
  return render(
    <SponsorLayout title={form.title} lead={form.lead} faq={faq}>
      <p>le formulaire</p>
    </SponsorLayout>,
  );
}

describe("SponsorLayout", () => {
  it("opens with the title and the lead of sponsoring.json form", () => {
    setup();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Parlons de la prochaine édition",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/^Laissez-nous vos coordonnées et le niveau/),
    ).toBeInTheDocument();
  });

  it("lists the four questions as closed native disclosures in #sponsor-faq", () => {
    const { container } = setup();
    const list = container.querySelector("#sponsor-faq") as HTMLElement;
    const details = list.querySelectorAll("details");
    expect(details).toHaveLength(4);
    for (const d of details) expect(d).not.toHaveAttribute("open");
    expect(
      within(list).getByText("Peut-on envoyer plusieurs collaborateurs ?"),
    ).toBeInTheDocument();
    expect(list).toHaveTextContent("Hébergement et repas des participants");
  });

  it("puts the children in the white panel #sponsor-funnel", () => {
    const { container } = setup();
    const panel = container.querySelector("#sponsor-funnel") as HTMLElement;
    expect(within(panel).getByText("le formulaire")).toBeInTheDocument();
    expect(panel).toHaveClass("bg-card", "text-ink");
  });
});
