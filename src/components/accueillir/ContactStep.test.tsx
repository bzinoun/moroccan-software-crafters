import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadOffers } from "@/content/load";
import { EMPTY_VALUES, type FunnelValues } from "@/lib/funnel";
import { ContactStep } from "./ContactStep";
import type { BindText } from "./useHostFunnel";

const offers = loadOffers().items;

function renderStep(values: FunnelValues, errors = {}) {
  const bind: BindText = (name) => ({
    name,
    value: values[name],
    onChange: () => {},
  });
  return render(
    <ContactStep
      active
      offers={offers}
      values={values}
      errors={errors}
      update={() => {}}
      bind={bind}
    />,
  );
}

describe("ContactStep", () => {
  it("asks for the name, the e-mail, the phone and the consent, with the trap field", () => {
    const { container } = renderStep(EMPTY_VALUES);
    expect(screen.getByLabelText("Prénom et nom")).toBeRequired();
    expect(screen.getByLabelText("E-mail professionnel")).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByRole("textbox", { name: "Téléphone" })).toBeRequired();
    expect(
      screen.getByRole("checkbox", { name: /J'accepte/ }),
    ).not.toBeChecked();
    expect(container.querySelector("#website_hp")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "E-mail" })).toBeChecked();
  });

  it("summarises the answers of the earlier steps", () => {
    renderStep({
      ...EMPTY_VALUES,
      formule: "partenaire",
      date: "2026-11-14",
      participants: "40-60",
    });
    expect(screen.getByText("Votre demande")).toBeInTheDocument();
    expect(screen.getByText("Meetup partenaire")).toBeInTheDocument();
    expect(screen.getByText("samedi 14 novembre 2026")).toBeInTheDocument();
  });

  it("shows the consent error", () => {
    renderStep(EMPTY_VALUES, {
      consent: "Votre accord est nécessaire pour envoyer la demande.",
    });
    expect(
      screen.getByText("Votre accord est nécessaire pour envoyer la demande."),
    ).toBeInTheDocument();
  });
});
