import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadSponsoring } from "@/content/load";
import type { SubmitInput, SubmitResult } from "@/lib/forms";
import { sponsorLevels } from "@/lib/pages-data";
import { SponsorForm } from "./SponsorForm";

// The submit function is injected: nothing in this file posts to the real endpoint.

const SITE = {
  links: { linkedin: "https://www.linkedin.com/company/test-page/" },
  contact: { email: "" },
  form: { endpoint: "", extraFields: {} },
};
const PACKAGE_LEVELS = {
  supporter: "Supporter",
  partenaire: "Partenaire",
  principal: "Partenaire principal",
};
const SUCCESS =
  "Merci ! Nous vous envoyons le dossier de partenariat sous 48 heures.";

type Submit = (input: SubmitInput) => Promise<SubmitResult>;

function setup(result: SubmitResult = { mode: "endpoint" }) {
  const submit = vi.fn<Submit>().mockResolvedValue(result);
  const view = render(
    <SponsorForm
      site={SITE}
      levels={sponsorLevels(loadSponsoring())}
      packageLevels={PACKAGE_LEVELS}
      successText={SUCCESS}
      submit={submit}
    />,
  );
  return { submit, user: userEvent.setup(), ...view };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Entreprise"), "  Acme  ");
  await user.type(screen.getByLabelText("Prénom et nom"), "Sara Alami");
  await user.type(
    screen.getByLabelText("E-mail professionnel"),
    "sara@acme.ma",
  );
  await user.type(screen.getByLabelText("Téléphone"), "+212 6 12 34 56 78");
  await user.click(screen.getByRole("checkbox", { name: /J'accepte/ }));
}

const submitButton = () =>
  screen.getByRole("button", {
    name: /Recevoir le dossier de partenariat|Envoi/,
  });

afterEach(() => {
  vi.restoreAllMocks();
});

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
      within(group).getByRole("radio", { name: "Supporter · 15 000 MAD" }),
    ).toBeInTheDocument();
    expect(
      within(group).getByRole("radio", { name: "À discuter" }),
    ).toBeChecked();
    expect(
      within(group).getByRole("radio", { name: "Supporter · 15 000 MAD" }),
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
      screen.getByRole("radio", { name: "Partenaire · 35 000 MAD" }),
    );
    expect(
      screen.getByRole("radio", { name: "Partenaire · 35 000 MAD" }),
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

  it("rejects a malformed e-mail and focuses it", async () => {
    const { submit, user } = setup();
    await user.type(screen.getByLabelText("Entreprise"), "Acme");
    await user.type(screen.getByLabelText("Prénom et nom"), "Sara Alami");
    await user.type(screen.getByLabelText("E-mail professionnel"), "sara@acme");
    await user.type(screen.getByLabelText("Téléphone"), "0612345678");
    await user.click(screen.getByRole("checkbox", { name: /J'accepte/ }));
    await user.click(submitButton());
    expect(screen.getByText("Adresse e-mail invalide.")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail professionnel")).toHaveFocus();
    expect(submit).not.toHaveBeenCalled();
  });

  it.each(["12345", "0412345678", "+21 123", "abc"])(
    "rejects the phone number %s with 'Numéro invalide.'",
    async (phone) => {
      const { submit, user } = setup();
      await fillValid(user);
      const tel = screen.getByLabelText("Téléphone");
      await user.clear(tel);
      await user.type(tel, phone);
      await user.click(submitButton());
      expect(screen.getByText("Numéro invalide.")).toBeInTheDocument();
      expect(tel).toHaveFocus();
      expect(submit).not.toHaveBeenCalled();
    },
  );

  it.each([
    "0612345678",
    "06 12-34.56.78",
    "+212 6 12 34 56 78",
    "00212612345678",
    "(0)5 22 11 22 33",
  ])("accepts the phone number %s", async (phone) => {
    const { submit, user } = setup();
    await fillValid(user);
    const tel = screen.getByLabelText("Téléphone");
    await user.clear(tel);
    await user.type(tel, phone);
    await user.click(submitButton());
    expect(submit).toHaveBeenCalledTimes(1);
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
    expect(screen.queryByText("Numéro invalide.")).toBeNull();
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
      screen.getByRole("radio", { name: "Partenaire · 35 000 MAD" }),
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
    expect(submit.mock.calls[0][0].data.niveau).toBe("À discuter");
    expect(submit.mock.calls[0][0].subject).toBe(
      "Partenariat SoCraTes · Acme · À discuter",
    );
  });

  it("passes the honeypot value as typed, without trimming", async () => {
    const { submit, user } = setup({ mode: "honeypot" });
    await fillValid(user);
    await user.type(
      document.getElementById("s-hp") as HTMLInputElement,
      " spam ",
    );
    await user.click(submitButton());
    expect(submit.mock.calls[0]![0].honeypot).toBe(" spam ");
  });

  it("passes the honeypot value so the submit code can drop a robot", async () => {
    const { submit, user } = setup({ mode: "honeypot" });
    await fillValid(user);
    await user.type(
      document.getElementById("s-hp") as HTMLInputElement,
      "http://spam",
    );
    await user.click(submitButton());
    expect(submit.mock.calls[0][0].honeypot).toBe("http://spam");
    expect(document.getElementById("s-success")).not.toHaveAttribute("hidden");
  });

  it("marks the button busy, keeps its focus and sends once while the request runs", async () => {
    let resolve!: (r: SubmitResult) => void;
    const pending = new Promise<SubmitResult>((r) => {
      resolve = r;
    });
    const submit = vi.fn<Submit>().mockReturnValue(pending);
    const user = userEvent.setup();
    render(
      <SponsorForm
        site={SITE}
        levels={sponsorLevels(loadSponsoring())}
        packageLevels={PACKAGE_LEVELS}
        successText={SUCCESS}
        submit={submit}
      />,
    );
    await fillValid(user);
    await user.click(submitButton());
    const busy = screen.getByRole("button", { name: "Envoi…" });
    expect(busy).toHaveAttribute("aria-disabled", "true");
    expect(busy).toHaveFocus();
    await user.click(busy);
    await user.click(busy);
    expect(submit).toHaveBeenCalledTimes(1);
    await act(async () => resolve({ mode: "endpoint" }));
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
      href: "https://www.linkedin.com/company/test-page/",
    });
    await fillValid(user);
    await user.click(submitButton());
    const alert = document.getElementById("s-alert") as HTMLElement;
    expect(alert).not.toHaveAttribute("hidden");
    expect(alert).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur LinkedIn en attendant.",
    );
    const link = within(alert).getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/test-page/",
    );
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
        href: "https://www.linkedin.com/company/test-page/",
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
    ).toHaveAttribute("href", "https://www.linkedin.com/company/test-page/");
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

describe("SponsorForm level preselection", () => {
  function PackageLinks() {
    return (
      <>
        <a href="#sponsor-form" data-level="supporter">
          Supporter
        </a>
        <a href="#sponsor-form" data-level="principal">
          Principal
        </a>
        <a href="#sponsor-form" data-level="inconnu">
          Inconnu
        </a>
        <a href="#sponsor-form">Sans niveau</a>
      </>
    );
  }

  it("checks the level of the package whose button the visitor clicks", async () => {
    const user = userEvent.setup();
    render(
      <>
        <PackageLinks />
        <SponsorForm
          site={SITE}
          levels={sponsorLevels(loadSponsoring())}
          packageLevels={PACKAGE_LEVELS}
          successText={SUCCESS}
          submit={vi.fn<Submit>()}
        />
      </>,
    );
    await user.click(screen.getByRole("link", { name: "Principal" }));
    expect(
      screen.getByRole("radio", { name: "Partenaire principal · 70 000 MAD" }),
    ).toBeChecked();
    await user.click(screen.getByRole("link", { name: "Supporter" }));
    expect(
      screen.getByRole("radio", { name: "Supporter · 15 000 MAD" }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Partenaire principal · 70 000 MAD" }),
    ).not.toBeChecked();
  });

  it("ignores a button with an unknown or missing level", async () => {
    const user = userEvent.setup();
    render(
      <>
        <PackageLinks />
        <SponsorForm
          site={SITE}
          levels={sponsorLevels(loadSponsoring())}
          packageLevels={PACKAGE_LEVELS}
          successText={SUCCESS}
          submit={vi.fn<Submit>()}
        />
      </>,
    );
    await user.click(screen.getByRole("link", { name: "Inconnu" }));
    await user.click(screen.getByRole("link", { name: "Sans niveau" }));
    expect(screen.getByRole("radio", { name: "À discuter" })).toBeChecked();
  });

  it("sends the preselected level", async () => {
    const user = userEvent.setup();
    const submit = vi.fn<Submit>().mockResolvedValue({ mode: "endpoint" });
    render(
      <>
        <PackageLinks />
        <SponsorForm
          site={SITE}
          levels={sponsorLevels(loadSponsoring())}
          packageLevels={PACKAGE_LEVELS}
          successText={SUCCESS}
          submit={submit}
        />
      </>,
    );
    await user.click(screen.getByRole("link", { name: "Supporter" }));
    await fillValid(user);
    await user.click(submitButton());
    expect(submit.mock.calls[0][0].data.niveau).toBe("Supporter");
  });

  it("stops listening when the form unmounts", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <>
        <PackageLinks />
        <SponsorForm
          site={SITE}
          levels={sponsorLevels(loadSponsoring())}
          packageLevels={PACKAGE_LEVELS}
          successText={SUCCESS}
          submit={vi.fn<Submit>()}
        />
      </>,
    );
    const spy = vi.spyOn(document, "removeEventListener");
    unmount();
    expect(spy).toHaveBeenCalledWith("click", expect.any(Function));
    void user;
  });
});
