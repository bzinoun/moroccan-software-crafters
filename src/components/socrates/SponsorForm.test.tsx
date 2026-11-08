import { act, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SubmitResult } from "@/lib/forms";
import { pendingResult } from "../accueillir/test-utils";
import { PackageGrid } from "./PackageGrid";
import {
  LINKEDIN,
  PACKAGES,
  SITE,
  SUCCESS,
  fillValid,
  renderSponsorForm,
  submitButton,
  type Submit,
} from "./test-utils";

// The rules of the e-mail and of the phone number are tested in
// `validation.test.ts`; here each behavior of the form is tested once.
// Levels, site and success text are fixtures from `test-utils.tsx`.

afterEach(() => {
  vi.restoreAllMocks();
});

const setup = (result?: SubmitResult) => renderSponsorForm({ result });

// The glow utilities of an element (the base transition lists the property
// name box-shadow, which is not a glow utility).
const shadowClasses = (el: HTMLElement) =>
  el.className.split(" ").filter((name) => name.startsWith("shadow"));

describe("SponsorForm fields", () => {
  it("has the labelled fields of the old form", () => {
    setup();
    expect(screen.getByLabelText("Entreprise")).toHaveAttribute(
      "autocomplete",
      "organization",
    );
    expect(screen.getByLabelText("Prénom et nom")).toHaveAttribute(
      "name",
      "nom",
    );
    expect(screen.getByLabelText("Fonction (facultatif)")).toHaveAttribute(
      "name",
      "fonction",
    );
    expect(screen.getByLabelText("E-mail professionnel")).toHaveAttribute(
      "type",
      "email",
    );
    const tel = screen.getByLabelText("Téléphone");
    expect(tel).toHaveAttribute("name", "telephone");
    expect(tel).toHaveAttribute("placeholder", "+212 6 12 34 56 78");
    expect(screen.getByLabelText("Votre message (facultatif)")).toHaveAttribute(
      "placeholder",
      "Vos attentes, vos questions, les collaborateurs que vous aimeriez envoyer…",
    );
  });

  it("offers the packages plus 'En nature' and 'À discuter' as levels, the last checked", () => {
    setup();
    const group = screen.getByRole("radiogroup", { name: "Niveau envisagé" });
    const radios = within(group).getAllByRole("radio");
    expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual([
      "Supporter",
      "Partenaire",
      "Partenaire principal",
      "En nature",
      "À discuter",
    ]);
    expect(
      within(group).getByRole("radio", { name: "Supporter · 10000 MAD" }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole("radio", { name: "À discuter" }),
    ).toBeChecked();
    expect(
      within(group).getByRole("radio", { name: "Supporter · 10000 MAD" }),
    ).not.toBeChecked();
  });

  it("keeps the old ids and the hidden success panel", () => {
    setup();
    expect(document.getElementById("sponsor-form")).toBeInstanceOf(
      HTMLFormElement,
    );
    expect(document.getElementById("s-niveaux")).toHaveAttribute(
      "role",
      "radiogroup",
    );
    expect(document.getElementById("s-niveau-label")).toHaveTextContent(
      "Niveau envisagé",
    );
    expect(document.getElementById("s-alert")).toHaveAttribute("role", "alert");
    expect(document.getElementById("s-success")).toHaveAttribute("hidden");
    expect(document.getElementById("s-hp")).toHaveAttribute(
      "name",
      "website_hp",
    );
  });

  it("changes the level when the visitor clicks a pill", async () => {
    const { user } = setup();
    await user.click(
      screen.getByRole("radio", { name: "Partenaire · 20000 MAD" }),
    );
    expect(
      screen.getByRole("radio", { name: "Partenaire · 20000 MAD" }),
    ).toBeChecked();
    expect(screen.getByRole("radio", { name: "À discuter" })).not.toBeChecked();
  });
});

describe("SponsorForm validation", () => {
  it("shows every error on an empty submit, focuses the first field and sends nothing", async () => {
    const { submit, user } = setup();
    await user.click(submitButton());
    expect(
      screen.getByText("Indiquez le nom de l'entreprise."),
    ).toBeInTheDocument();
    expect(screen.getByText("Indiquez votre nom.")).toBeInTheDocument();
    expect(screen.getByText("Adresse e-mail invalide.")).toBeInTheDocument();
    expect(screen.getByText("Indiquez votre numéro.")).toBeInTheDocument();
    expect(
      screen.getByText("Votre accord est nécessaire pour envoyer la demande."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Entreprise")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Entreprise")).toHaveFocus();
    expect(screen.getByLabelText("Fonction (facultatif)")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(submit).not.toHaveBeenCalled();
  });

  it("treats a blank value as empty", async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText("Entreprise"), "   ");
    await user.click(submitButton());
    expect(
      screen.getByText("Indiquez le nom de l'entreprise."),
    ).toBeInTheDocument();
  });

  it("rejects a wrong phone number, focuses it and sends nothing", async () => {
    const { submit, user } = setup();
    await fillValid(user);
    const tel = screen.getByRole("textbox", { name: "Téléphone" });
    await user.clear(tel);
    await user.type(tel, "12345");
    await user.click(submitButton());
    expect(
      screen.getByText(
        "Numéro invalide (ex. +212 6 12 34 56 78 ou 06 12 34 56 78).",
      ),
    ).toBeInTheDocument();
    expect(tel).toHaveFocus();
    expect(submit).not.toHaveBeenCalled();
  });

  it("clears the error of a field as soon as the visitor edits it", async () => {
    const { user } = setup();
    await user.click(submitButton());
    expect(screen.getByText("Indiquez votre nom.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Prénom et nom"), "S");
    expect(screen.queryByText("Indiquez votre nom.")).toBeNull();
    expect(screen.getByLabelText("Prénom et nom")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(
      screen.getByText("Indiquez le nom de l'entreprise."),
    ).toBeInTheDocument();
  });

  it("clears the consent error when the box is checked", async () => {
    const { user } = setup();
    await user.click(submitButton());
    await user.click(screen.getByRole("checkbox", { name: /J'accepte/ }));
    expect(
      screen.queryByText(
        "Votre accord est nécessaire pour envoyer la demande.",
      ),
    ).toBeNull();
  });

  it("clears all errors on the next valid submit", async () => {
    const { user } = setup();
    await user.click(submitButton());
    await fillValid(user);
    await user.click(submitButton());
    expect(screen.queryByText(/Numéro invalide/)).toBeNull();
    expect(screen.queryByText("Indiquez votre numéro.")).toBeNull();
  });
});

describe("SponsorForm submit", () => {
  it("sends the trimmed values with the type and the subject of the old form", async () => {
    const { submit, user } = setup();
    await fillValid(user);
    await user.type(screen.getByLabelText("Fonction (facultatif)"), " CTO ");
    await user.type(
      screen.getByLabelText("Votre message (facultatif)"),
      " Bonjour ",
    );
    await user.click(
      screen.getByRole("radio", { name: "Partenaire · 20000 MAD" }),
    );
    await user.click(submitButton());
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({
      site: SITE,
      data: {
        entreprise: "Acme",
        nom: "Sara Alami",
        fonction: "CTO",
        email: "sara@acme.ma",
        telephone: "+212612345678",
        niveau: "Partenaire",
        message: "Bonjour",
      },
      type: "Sponsoring SoCraTes",
      subject: "Partenariat SoCraTes · Acme · Partenaire",
      honeypot: "",
    });
  });

  it("sends 'À discuter' when the visitor picks no level", async () => {
    const { submit, user } = setup();
    await fillValid(user);
    await user.click(submitButton());
    expect(submit.mock.calls[0]![0].data.niveau).toBe("À discuter");
    expect(submit.mock.calls[0]![0].subject).toBe(
      "Partenariat SoCraTes · Acme · À discuter",
    );
  });

  it("passes the honeypot value as typed, and shows the thanks panel as if it worked", async () => {
    const { submit, user } = setup({ mode: "honeypot" });
    await fillValid(user);
    await user.type(
      document.getElementById("s-hp") as HTMLInputElement,
      " http://spam ",
    );
    await user.click(submitButton());
    expect(submit.mock.calls[0]![0].honeypot).toBe(" http://spam ");
    expect(document.getElementById("s-success")).not.toHaveAttribute("hidden");
  });

  it("marks the button busy, keeps its focus and sends once while the request runs", async () => {
    const { promise, settle } = pendingResult();
    const { submit, user } = renderSponsorForm({
      submit: vi.fn<Submit>().mockReturnValue(promise),
    });
    await fillValid(user);
    await user.click(submitButton());
    const busy = screen.getByRole("button", { name: "Envoi…" });
    expect(busy).toHaveAttribute("aria-disabled", "true");
    expect(busy).toHaveFocus();
    await user.click(busy);
    await user.click(busy);
    expect(submit).toHaveBeenCalledTimes(1);
    await act(async () => settle({ mode: "endpoint" }));
    expect(document.getElementById("sponsor-form")).toHaveAttribute("hidden");
  });

  it("gives back the button and shows the failure alert when the send throws", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { submit, user } = setup();
    submit.mockRejectedValue(new Error("boom"));
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(alert).not.toHaveAttribute("hidden");
    expect(alert).toHaveTextContent(
      "L'envoi n'a pas abouti. Réessayez dans un instant.",
    );
    expect(submitButton()).not.toHaveAttribute("aria-disabled");
    expect(submitButton()).toHaveTextContent(
      "Recevoir le dossier de partenariat",
    );
    expect(log).toHaveBeenCalled();
    expect(screen.getByLabelText("Entreprise")).toHaveValue("  Acme  ");
  });

  it("can send again after a failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { submit, user } = setup();
    submit.mockRejectedValueOnce(new Error("boom"));
    await fillValid(user);
    await user.click(submitButton());
    await user.click(submitButton());
    expect(submit).toHaveBeenCalledTimes(2);
    expect(document.getElementById("s-success")).not.toHaveAttribute("hidden");
  });
});

describe("SponsorForm results", () => {
  it("endpoint: hides the form, shows the thanks panel with the JSON text and focuses it", async () => {
    const { user } = setup({ mode: "endpoint" });
    await fillValid(user);
    await user.click(submitButton());
    const panel = document.getElementById("s-success") as HTMLElement;
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveFocus();
    expect(panel).toHaveAttribute("tabindex", "-1");
    expect(panel).toHaveAttribute("role", "status");
    expect(panel).toHaveAccessibleName("Demande bien reçue.");
    expect(
      within(panel).getByText("Merci !", { selector: "div" }),
    ).toBeInTheDocument();
    expect(
      within(panel).getByRole("heading", {
        level: 3,
        name: "Demande bien reçue.",
      }),
    ).toBeInTheDocument();
    expect(document.getElementById("s-success-text")).toHaveTextContent(
      SUCCESS,
    );
    expect(document.getElementById("sponsor-form")).toHaveAttribute("hidden");
  });

  it("mailto: tells the visitor the mail app opened", async () => {
    const { user } = setup({ mode: "mailto", url: "mailto:a@b.ma?subject=x" });
    await fillValid(user);
    await user.click(submitButton());
    expect(document.getElementById("s-success-text")?.textContent).toBe(
      "Votre messagerie s'est ouverte avec la demande pré-remplie\u202f: il ne reste qu'à l'envoyer.",
    );
    expect(document.getElementById("s-success")).toHaveFocus();
  });

  it("linkedin: keeps the form and points to the LinkedIn page", async () => {
    const { user } = setup({
      mode: "linkedin",
      href: LINKEDIN,
    });
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(alert).not.toHaveAttribute("hidden");
    expect(alert).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur LinkedIn en attendant.",
    );
    const link = within(alert).getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("href", LINKEDIN);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(document.getElementById("sponsor-form")).not.toHaveAttribute(
      "hidden",
    );
    expect(document.getElementById("s-success")).toHaveAttribute("hidden");
    expect(submitButton()).toBeEnabled();
    expect(submitButton()).toHaveTextContent(
      "Recevoir le dossier de partenariat",
    );
  });

  it("none: names LinkedIn without a link, as nothing is configured", async () => {
    const { user } = setup({ mode: "none" });
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(alert).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception.",
    );
    expect(alert).toHaveTextContent(
      "Contactez-nous sur LinkedIn en attendant.",
    );
    expect(within(alert).queryByRole("link")).toBeNull();
  });

  it("error: logs it, keeps the answers and offers the LinkedIn link of the fallback", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("HTTP 500");
    const { user } = setup({
      mode: "error",
      error,
      fallback: {
        kind: "linkedin",
        href: LINKEDIN,
      },
    });
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(alert).toHaveTextContent(
      "L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-nous sur LinkedIn.",
    );
    expect(
      within(alert).getByRole("link", { name: "LinkedIn" }),
    ).toHaveAttribute("href", LINKEDIN);
    expect(log).toHaveBeenCalledWith(
      "[MSC] Envoi du formulaire impossible :",
      error,
    );
    expect(screen.getByLabelText("Entreprise")).toHaveValue("  Acme  ");
    expect(submitButton()).toBeEnabled();
  });

  it("error with a mail fallback: links to the prefilled mail", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { user } = setup({
      mode: "error",
      error: new Error("HTTP 500"),
      fallback: {
        kind: "mailto",
        email: "contact@msc.ma",
        url: "mailto:contact@msc.ma?subject=x",
      },
    });
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(
      within(alert).getByRole("link", { name: "contact@msc.ma" }),
    ).toHaveAttribute("href", "mailto:contact@msc.ma?subject=x");
  });

  it("error with no way to reach the team: the plain sentence, without a link", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { user } = setup({
      mode: "error",
      error: new Error("x"),
      fallback: null,
    });
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(alert).toHaveTextContent(
      /^L'envoi n'a pas abouti\. Réessayez dans un instant\.$/,
    );
    expect(within(alert).queryByRole("link")).toBeNull();
  });

  it("hides the previous alert at the next submit", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { submit, user } = setup({
      mode: "error",
      error: new Error("x"),
      fallback: null,
    });
    await fillValid(user);
    await user.click(submitButton());
    expect(document.getElementById("s-alert")).not.toHaveAttribute("hidden");
    submit.mockResolvedValueOnce({ mode: "endpoint" });
    await user.click(submitButton());
    expect(document.getElementById("s-success")).not.toHaveAttribute("hidden");
  });
});

describe("SponsorForm submit button", () => {
  it("is the flat red pill, with no glow, on the dark section", () => {
    setup();
    expect(shadowClasses(submitButton())).toEqual([]);
  });
});

describe("SponsorForm level preselection", () => {
  // The real package buttons of the page, beside the form.
  const grid = <PackageGrid packages={PACKAGES} />;
  const chooseLevel = (name: string) =>
    within(
      screen
        .getByRole("heading", { level: 3, name })
        .closest("article") as HTMLElement,
    ).getByRole("link", { name: "Choisir ce niveau" });

  it("checks the level of the package whose button the visitor clicks", async () => {
    const { user } = renderSponsorForm({ before: grid });
    await user.click(chooseLevel("Partenaire principal"));
    expect(
      screen.getByRole("radio", { name: "Partenaire principal · 40000 MAD" }),
    ).toBeChecked();
    await user.click(chooseLevel("Supporter"));
    expect(
      screen.getByRole("radio", { name: "Supporter · 10000 MAD" }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Partenaire principal · 40000 MAD" }),
    ).not.toBeChecked();
  });

  it("checks the level again when the visitor changed it by hand in between", async () => {
    const { user } = renderSponsorForm({ before: grid });
    await user.click(chooseLevel("Supporter"));
    await user.click(screen.getByRole("radio", { name: "En nature" }));
    await user.click(chooseLevel("Supporter"));
    expect(
      screen.getByRole("radio", { name: "Supporter · 10000 MAD" }),
    ).toBeChecked();
  });

  it("ignores a package that has no level", async () => {
    const unknown = [{ ...PACKAGES[0]!, id: "inconnu", name: "Inconnu" }];
    const { user } = renderSponsorForm({
      before: <PackageGrid packages={unknown} />,
    });
    await user.click(screen.getByRole("link", { name: "Choisir ce niveau" }));
    expect(screen.getByRole("radio", { name: "À discuter" })).toBeChecked();
  });

  it("sends the preselected level", async () => {
    const { submit, user } = renderSponsorForm({ before: grid });
    await user.click(chooseLevel("Supporter"));
    await fillValid(user);
    await user.click(submitButton());
    expect(submit.mock.calls[0]![0].data.niveau).toBe("Supporter");
  });

  it("keeps the jump to the form: the button is still a link to the form", () => {
    renderSponsorForm({ before: grid });
    expect(chooseLevel("Supporter")).toHaveAttribute("href", "#sponsor-form");
  });

  it("listens to no click on the document", () => {
    const spy = vi.spyOn(document, "addEventListener");
    renderSponsorForm({ before: grid });
    expect(spy).not.toHaveBeenCalledWith("click", expect.anything());
  });
});
