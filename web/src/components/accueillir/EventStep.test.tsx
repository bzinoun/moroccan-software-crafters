import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EMPTY_VALUES, type FunnelValues } from "@/lib/funnel";
import { EventStep } from "./EventStep";
import type { BindText } from "./useHostFunnel";

function bindOf(values: FunnelValues): BindText {
  return (name) => ({ name, value: values[name], onChange: () => {} });
}

function renderStep(values: FunnelValues = EMPTY_VALUES, minDate = "") {
  return render(
    <EventStep
      active
      values={values}
      errors={{}}
      update={() => {}}
      bind={bindOf(values)}
      minDate={minDate}
    />,
  );
}

describe("EventStep", () => {
  it("limits both dates to the minimum date", () => {
    renderStep(EMPTY_VALUES, "2026-11-09");
    expect(screen.getByLabelText("Date souhaitée")).toHaveAttribute(
      "min",
      "2026-11-09",
    );
    expect(screen.getByLabelText(/Date alternative/)).toHaveAttribute(
      "min",
      "2026-11-09",
    );
  });

  it("leaves the dates free while the minimum date is unknown", () => {
    renderStep();
    expect(screen.getByLabelText("Date souhaitée")).not.toHaveAttribute("min");
  });

  it("keeps the empty date help paragraph, and fills it once a date is chosen", () => {
    const { container, rerender } = renderStep();
    expect(container.querySelector("#date-help")).toBeEmptyDOMElement();
    const values = { ...EMPTY_VALUES, date: "2026-11-14" };
    rerender(
      <EventStep
        active
        values={values}
        errors={{}}
        update={() => {}}
        bind={bindOf(values)}
        minDate=""
      />,
    );
    expect(container.querySelector("#date-help")).toHaveTextContent(
      "Samedi, c'est noté.",
    );
    expect(screen.getByLabelText("Date souhaitée")).toHaveAccessibleDescription(
      "Samedi, c'est noté.",
    );
  });

  it("offers the attendee ranges and the cities", () => {
    renderStep();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByLabelText("Ville")).toHaveValue("Casablanca");
  });
});
