import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_VALUES } from "@/lib/funnel";
import { OfferStep } from "./OfferStep";
import { OFFERS } from "./test-utils";

describe("OfferStep", () => {
  it("shows one choice card per offer, with the chosen one checked", () => {
    render(
      <OfferStep
        active
        offers={OFFERS}
        values={{ ...EMPTY_VALUES, formule: "prive" }}
        errors={{}}
        update={() => {}}
      />,
    );
    expect(screen.getAllByRole("radio")).toHaveLength(OFFERS.length);
    expect(
      screen.getByRole("radio", { name: /Craft session privée/ }),
    ).toBeChecked();
  });

  it("reports the choice", async () => {
    const update = vi.fn();
    render(
      <OfferStep
        active
        offers={OFFERS}
        values={EMPTY_VALUES}
        errors={{}}
        update={update}
      />,
    );
    await userEvent.click(
      screen.getByRole("radio", { name: /Meetup partenaire/ }),
    );
    expect(update).toHaveBeenCalledWith("formule", "partenaire");
  });

  it("flags the group and shows the message when there is an error", () => {
    render(
      <OfferStep
        active
        offers={OFFERS}
        values={EMPTY_VALUES}
        errors={{ formule: "Choisissez une formule pour continuer." }}
        update={() => {}}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "Formule" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      screen.getByText("Choisissez une formule pour continuer."),
    ).toBeInTheDocument();
  });

  it("is hidden when it is not the current step", () => {
    const { container } = render(
      <OfferStep
        active={false}
        offers={OFFERS}
        values={EMPTY_VALUES}
        errors={{}}
        update={() => {}}
      />,
    );
    expect(container.querySelector("fieldset")).toHaveAttribute("hidden");
  });
});
