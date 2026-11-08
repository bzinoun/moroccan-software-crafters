import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EMPTY_VALUES } from "@/lib/funnel-fields";
import { recorder } from "@/test/recorder";
import { CompanyStep } from "./CompanyStep";
import type { BindText } from "./useHostFunnel";

const bind: BindText = (name) => ({
  name,
  value: EMPTY_VALUES[name],
  onChange: () => {},
});

describe("CompanyStep", () => {
  it("asks for the company, its sector and size, its site and its address", () => {
    render(
      <CompanyStep
        active
        values={EMPTY_VALUES}
        errors={{}}
        update={() => {}}
        bind={bind}
      />,
    );
    expect(screen.getByLabelText("Nom de l'entreprise")).toBeRequired();
    expect(screen.getByLabelText("Secteur")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Taille de l'équipe tech"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Site web/)).toHaveAttribute("type", "url");
    expect(screen.getByLabelText(/Quartier ou adresse/)).toBeInTheDocument();
  });

  it("shows the errors of the company and the site", () => {
    render(
      <CompanyStep
        active
        values={EMPTY_VALUES}
        update={() => {}}
        errors={{
          entreprise: "Indiquez le nom de l'entreprise.",
          site: "Adresse invalide (elle doit commencer par https://).",
        }}
        bind={bind}
      />,
    );
    expect(screen.getByLabelText("Nom de l'entreprise")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText(/Site web/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("reports the sector and the size the person picks, and an empty value for the placeholder", async () => {
    const update = recorder<[string, unknown]>();
    const values = { ...EMPTY_VALUES, secteur: "Télécoms" as const };
    render(
      <CompanyStep
        active
        values={values}
        errors={{}}
        update={update.fn}
        bind={bind}
      />,
    );
    const user = userEvent.setup();
    expect(screen.getByLabelText("Secteur")).toHaveValue("Télécoms");
    await user.selectOptions(
      screen.getByLabelText("Secteur"),
      "Secteur public",
    );
    expect(update.calls.at(-1)).toEqual(["secteur", "Secteur public"]);
    await user.selectOptions(screen.getByLabelText("Secteur"), "Choisir…");
    expect(update.calls.at(-1)).toEqual(["secteur", ""]);
    await user.selectOptions(
      screen.getByLabelText("Taille de l'équipe tech"),
      "100 à 500",
    );
    expect(update.calls.at(-1)).toEqual(["taille", "100 à 500"]);
  });
});
