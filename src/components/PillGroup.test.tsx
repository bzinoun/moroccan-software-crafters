import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pill, PillGroup } from "./PillGroup";

describe("PillGroup and Pill", () => {
  it("is a radio group named by the label it points to", () => {
    render(
      <>
        <span id="attendees-label">Nombre de crafters attendus</span>
        <PillGroup role="radiogroup" aria-labelledby="attendees-label">
          <Pill type="radio" name="participants" value="20-40" required>
            20 à 40
          </Pill>
          <Pill type="radio" name="participants" value="40-60">
            40 à 60
          </Pill>
        </PillGroup>
      </>,
    );
    const group = screen.getByRole("radiogroup", {
      name: "Nombre de crafters attendus",
    });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByRole("radio", { name: "20 à 40" })).toBeRequired();
  });

  it("defaults to a plain group", () => {
    render(
      <PillGroup aria-label="Sur place">
        <Pill type="checkbox" name="equipements" value="Parking">
          Parking
        </Pill>
      </PillGroup>,
    );
    expect(
      screen.getByRole("group", { name: "Sur place" }),
    ).toBeInTheDocument();
  });

  it("selects one radio at a time", async () => {
    render(
      <PillGroup role="radiogroup" aria-label="Contact">
        <Pill type="radio" name="preference" value="E-mail" defaultChecked>
          E-mail
        </Pill>
        <Pill type="radio" name="preference" value="WhatsApp">
          WhatsApp
        </Pill>
      </PillGroup>,
    );
    expect(screen.getByRole("radio", { name: "E-mail" })).toBeChecked();
    await userEvent.click(screen.getByText("WhatsApp"));
    expect(screen.getByRole("radio", { name: "WhatsApp" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "E-mail" })).not.toBeChecked();
  });

  it("checks several checkboxes and reports each change", async () => {
    const onChange = vi.fn();
    render(
      <PillGroup aria-label="Sur place">
        <Pill
          type="checkbox"
          name="equipements"
          value="Wifi"
          onChange={onChange}
        >
          Wifi invités
        </Pill>
        <Pill type="checkbox" name="equipements" value="Parking">
          Parking
        </Pill>
      </PillGroup>,
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Wifi invités" }),
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Parking" }));
    expect(
      screen.getByRole("checkbox", { name: "Wifi invités" }),
    ).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Parking" })).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("keeps the input reachable by keyboard", async () => {
    render(
      <PillGroup aria-label="Sur place">
        <Pill type="checkbox" name="equipements" value="Parking">
          Parking
        </Pill>
      </PillGroup>,
    );
    const input = screen.getByRole("checkbox", { name: "Parking" });
    expect(input).not.toHaveAttribute("tabindex");
    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(input).toBeChecked();
  });

  it("puts a narrow no-break space before a colon in the label", () => {
    render(
      <PillGroup aria-label="Groupe">
        <Pill type="radio" name="x" value="a">
          Réponse : oui
        </Pill>
      </PillGroup>,
    );
    expect(screen.getByRole("radio", { name: /Réponse/ })).toBeInTheDocument();
    expect(screen.getByText(/Réponse/).textContent).toBe("Réponse\u202f: oui");
  });
});
