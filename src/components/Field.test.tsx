import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";
import { PillGroup, Pill } from "./PillGroup";
import { Select } from "./Select";
import { TextArea } from "./TextArea";
import { TextInput } from "./TextInput";

describe("Field", () => {
  it("labels the control: the label text names the input", () => {
    render(
      <Field id="s-entreprise" label="Entreprise">
        <TextInput name="entreprise" autoComplete="organization" required />
      </Field>,
    );
    const input = screen.getByLabelText("Entreprise");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("id", "s-entreprise");
    expect(input).toHaveAttribute("autocomplete", "organization");
    expect(input).toBeRequired();
  });

  it("adds the facultatif suffix to the label when optional", () => {
    render(
      <Field id="s-fonction" label="Fonction" optional>
        <TextInput name="fonction" />
      </Field>,
    );
    expect(screen.getByLabelText("Fonction (facultatif)")).toBeInTheDocument();
  });

  it("accepts a custom optional suffix", () => {
    render(
      <Field id="capacite" label="Capacité de la salle" optional="(places)">
        <TextInput name="capacite" type="number" />
      </Field>,
    );
    expect(
      screen.getByLabelText("Capacité de la salle (places)"),
    ).toHaveAttribute("type", "number");
  });

  it("shows no error and no invalid state by default", () => {
    render(
      <Field id="s-nom" label="Prénom et nom">
        <TextInput name="nom" />
      </Field>,
    );
    const input = screen.getByLabelText("Prénom et nom");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByText(/Indiquez/)).not.toBeInTheDocument();
  });

  it("marks the control invalid and describes it by the error", () => {
    render(
      <Field id="s-nom" label="Prénom et nom" error="Indiquez votre nom.">
        <TextInput name="nom" />
      </Field>,
    );
    const input = screen.getByLabelText("Prénom et nom");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Indiquez votre nom.");
    expect(screen.getByText("Indiquez votre nom.")).toBeVisible();
  });

  it("describes the control by the help and the error together", () => {
    render(
      <Field
        id="date"
        label="Date souhaitée"
        help="Les meetups ont lieu le samedi."
        error="Indiquez une date à venir."
      >
        <TextInput name="date" type="date" />
      </Field>,
    );
    expect(screen.getByLabelText("Date souhaitée")).toHaveAccessibleDescription(
      "Les meetups ont lieu le samedi. Indiquez une date à venir.",
    );
  });

  it("describes the control by the help alone when valid", () => {
    render(
      <Field id="date" label="Date souhaitée" help="Plutôt un samedi.">
        <TextInput name="date" type="date" />
      </Field>,
    );
    const input = screen.getByLabelText("Date souhaitée");
    expect(input).toHaveAccessibleDescription("Plutôt un samedi.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("keeps an empty help paragraph in the page without describing the control by it", () => {
    const { container } = render(
      <Field id="date" label="Date souhaitée" help="">
        <TextInput name="date" type="date" />
      </Field>,
    );
    expect(container.querySelector("#date-help")).toBeEmptyDOMElement();
    expect(screen.getByLabelText("Date souhaitée")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("swaps the error text between an empty and a wrong value", () => {
    const { rerender } = render(
      <Field id="s-tel" label="Téléphone" error="Indiquez votre numéro.">
        <TextInput name="telephone" type="tel" />
      </Field>,
    );
    expect(screen.getByText("Indiquez votre numéro.")).toBeInTheDocument();
    rerender(
      <Field id="s-tel" label="Téléphone" error="Numéro invalide.">
        <TextInput name="telephone" type="tel" />
      </Field>,
    );
    expect(
      screen.queryByText("Indiquez votre numéro."),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Téléphone")).toHaveAccessibleDescription(
      "Numéro invalide.",
    );
  });

  it("works with a select and a textarea", () => {
    render(
      <>
        <Field id="ville" label="Ville">
          <Select name="ville" defaultValue="Rabat">
            <option>Casablanca</option>
            <option>Rabat</option>
          </Select>
        </Field>
        <Field id="message" label="Un mot de plus ?" optional>
          <TextArea name="message" />
        </Field>
      </>,
    );
    expect(screen.getByLabelText("Ville")).toHaveValue("Rabat");
    // Testing Library folds the narrow no-break space into a plain one.
    expect(screen.getByLabelText(/Un mot de plus/).tagName).toBe("TEXTAREA");
  });

  it("names a group by its label and flags it invalid", () => {
    render(
      <Field
        id="participants"
        label="Nombre de crafters attendus"
        group
        error="Indiquez une fourchette."
      >
        <PillGroup role="radiogroup">
          <Pill type="radio" name="participants" value="20-40">
            20 à 40
          </Pill>
        </PillGroup>
      </Field>,
    );
    const group = screen.getByRole("radiogroup", {
      name: "Nombre de crafters attendus",
    });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Indiquez une fourchette.");
  });

  it("lets a caller className replace the default bottom margin of the wrapper", () => {
    const { container } = render(
      <Field id="x" label="Nom" className="mb-0">
        <TextInput name="x" />
      </Field>,
    );
    expect(container.firstElementChild).toHaveClass("mb-0");
    expect(container.firstElementChild).not.toHaveClass("mb-[18px]");
  });

  it("keeps the describedby of the child and appends the help and the error ids", () => {
    render(
      <>
        <p id="compteur">0 / 500 caractères</p>
        <Field
          id="message"
          label="Message"
          help="Soyez bref."
          error="Écrivez un message."
        >
          <TextArea name="message" aria-describedby="compteur" />
        </Field>
      </>,
    );
    expect(screen.getByLabelText("Message")).toHaveAttribute(
      "aria-describedby",
      "compteur message-help message-error",
    );
  });

  it("keeps the describedby of the child when the field has no help and no error", () => {
    render(
      <>
        <p id="compteur">0 / 500 caractères</p>
        <Field id="message" label="Message">
          <TextArea name="message" aria-describedby="compteur" />
        </Field>
      </>,
    );
    expect(screen.getByLabelText("Message")).toHaveAccessibleDescription(
      "0 / 500 caractères",
    );
  });

  it("keeps the id of the child and points the label at it", () => {
    render(
      <Field id="s-nom" label="Prénom et nom" help="Comme sur votre badge.">
        <TextInput id="champ-nom" name="nom" />
      </Field>,
    );
    const input = screen.getByLabelText("Prénom et nom");
    expect(input).toHaveAttribute("id", "champ-nom");
    expect(input).toHaveAccessibleDescription("Comme sur votre badge.");
  });

  it("keeps aria-invalid true when the child says so, with or without an error", () => {
    const { rerender } = render(
      <Field id="s-nom" label="Prénom et nom">
        <TextInput name="nom" aria-invalid />
      </Field>,
    );
    expect(screen.getByLabelText("Prénom et nom")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    rerender(
      <Field id="s-nom" label="Prénom et nom" error="Indiquez votre nom.">
        <TextInput name="nom" aria-invalid />
      </Field>,
    );
    expect(screen.getByLabelText("Prénom et nom")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
