import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EMPTY_VALUES } from "@/lib/funnel";
import { CompanyStep } from "./CompanyStep";
import type { BindText } from "./useHostFunnel";

const bind: BindText = (name) => ({
  name,
  value: EMPTY_VALUES[name],
  onChange: () => {},
});

describe("CompanyStep", () => {
  it("asks for the company, its sector and size, its site and its address", () => {
    render(<CompanyStep active errors={{}} bind={bind} />);
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
});
