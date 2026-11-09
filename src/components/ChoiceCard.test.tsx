import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChoiceCard, ChoiceGroup } from "./ChoiceCard";

function offers() {
  return (
    <ChoiceGroup aria-label="Formule">
      <ChoiceCard
        name="formule"
        value="communautaire"
        title="Hôte communautaire"
        description="Le format historique : vous ouvrez vos portes, on s'occupe du reste."
        required
      />
      <ChoiceCard
        name="formule"
        value="partenaire"
        title="Meetup partenaire"
        description="Un meetup porté par votre marque."
      />
    </ChoiceGroup>
  );
}

describe("ChoiceCard", () => {
  it("renders a radio named by the card title", () => {
    render(offers());
    const radio = screen.getByRole("radio", { name: /Hôte communautaire/ });
    expect(radio).toHaveAttribute("name", "formule");
    expect(radio).toHaveAttribute("value", "communautaire");
    expect(radio).toBeRequired();
  });

  it("shows the description, and links it to the radio", () => {
    render(offers());
    expect(
      screen.getByRole("radio", { name: /Hôte communautaire/ }),
    ).toHaveAccessibleName(/Le format historique/);
    expect(screen.getByText(/Le format historique/).textContent).toBe(
      "Le format historique\u202f: vous ouvrez vos portes, on s'occupe du reste.",
    );
  });

  it("renders no description when it is missing", () => {
    render(
      <ChoiceGroup aria-label="Formule">
        <ChoiceCard name="formule" value="x" title="Seul" />
      </ChoiceGroup>,
    );
    expect(screen.getByRole("radio", { name: "Seul" })).toBeInTheDocument();
  });

  it("selects the card the user clicks and unselects the other", async () => {
    render(offers());
    await userEvent.click(screen.getByText("Meetup partenaire"));
    expect(
      screen.getByRole("radio", { name: /Meetup partenaire/ }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /Hôte communautaire/ }),
    ).not.toBeChecked();
  });

  it("supports a preselected card", () => {
    render(
      <ChoiceGroup aria-label="Formule">
        <ChoiceCard name="formule" value="a" title="A" defaultChecked />
      </ChoiceGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeChecked();
  });

  it("reaches the first radio with the keyboard and selects the next with the arrow key", async () => {
    render(offers());
    await userEvent.tab();
    expect(
      screen.getByRole("radio", { name: /Hôte communautaire/ }),
    ).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("radio", { name: /Meetup partenaire/ }),
    ).toBeChecked();
  });

  it("is a radio group for assistive technology", () => {
    render(offers());
    expect(
      screen.getByRole("radiogroup", { name: "Formule" }),
    ).toBeInTheDocument();
  });
});
