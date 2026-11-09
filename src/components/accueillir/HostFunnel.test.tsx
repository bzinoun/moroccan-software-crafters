import { act, fireEvent, screen, within } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PortsProvider } from "@/lib/ports";
import { deniedStorage } from "@/test/in-memory-storage";
import { HostFunnel } from "./HostFunnel";
import {
  LINKEDIN,
  OFFERS,
  SITE,
  chooseOffer,
  fillContact,
  legend,
  next,
  renderFunnel,
  savedDraft,
  fillStep2,
  sendRequest,
  storeDraft,
  toStep2,
  toStep3,
  toStep4,
  setUpFunnelEnvironment,
} from "./test-utils";

// Nothing here posts anywhere: the funnel gets the in-memory send of the test
// utils (`env.lead`). The offers are a fixture: a content edit must not break this file. The
// rules of the fields are tested in `funnel-validate.test.ts` and
// `funnel-draft.test.ts`; here each behavior is tested once.

const env = setUpFunnelEnvironment();
const setup = renderFunnel;
const linkedin = LINKEDIN;

describe("HostFunnel first render", () => {
  it("opens on step 1 with one choice card per offer", () => {
    const { container } = setup();
    expect(container.querySelector("#funnel")).toBeInTheDocument();
    expect(container.querySelector("#host-form")).toHaveAttribute("novalidate");
    expect(
      screen.getByRole("group", { name: /Quelle formule vous intéresse/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Étape 1 sur 4 · Formule")).toBeInTheDocument();
    const choices = within(
      screen.getByRole("radiogroup", { name: "Formule" }),
    ).getAllByRole("radio");
    expect(choices).toHaveLength(OFFERS.length);
    expect(container.querySelector("#offer-choices")).toBe(
      screen.getByRole("radiogroup", { name: "Formule" }),
    );
    expect(
      screen.getByRole("radio", { name: /Hôte communautaire/ }),
    ).not.toBeChecked();
    for (const radio of choices) {
      expect(radio).not.toHaveAccessibleName(/MAD|Gratuit|Sur devis/);
    }
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
    expect(
      screen.queryByRole("group", { name: "L'événement" }),
    ).not.toBeInTheDocument();
  });

  it("renders the first step in the static HTML, with no script", () => {
    const html = renderToString(<HostFunnel offers={OFFERS} site={SITE} />);
    expect(html).toContain("Quelle formule vous intéresse");
    expect(html).toContain("Hôte communautaire");
    expect(html).toContain("Craft session privée");
    expect(html).toContain("Étape 1 sur 4");
    expect(html).toContain('id="funnel"');
    expect(html).toContain('id="host-form"');
  });

  describe("for a visitor with no script", () => {
    function serverForm() {
      const host = document.createElement("div");
      host.innerHTML = renderToString(
        <HostFunnel offers={OFFERS} site={SITE} />,
      );
      return host;
    }

    it("has every step in the HTML, none hidden", () => {
      const steps = [...serverForm().querySelectorAll("fieldset[data-step]")];
      expect(steps.map((step) => step.getAttribute("data-step"))).toEqual([
        "1",
        "2",
        "3",
        "4",
      ]);
      expect(steps.filter((step) => step.hasAttribute("hidden"))).toEqual([]);
    });

    it("hides the steps after the first for visitors with script", () => {
      const steps = [...serverForm().querySelectorAll("fieldset[data-step]")];
      expect(steps.map((step) => step.classList.contains("js:hidden"))).toEqual(
        [false, true, true, true],
      );
    });

    it("hides the step buttons and the progress, and shows how to reach the team", () => {
      const host = serverForm();
      expect(host.querySelector("#next")?.parentElement).toHaveClass(
        "not-js:hidden",
      );
      expect(host.querySelector("#progress-label")).toHaveClass(
        "not-js:hidden",
      );
      const link = within(host).getByRole("link", { name: "LinkedIn" });
      expect(link).toHaveAttribute("href", LINKEDIN);
    });
  });

  it("hydrates the static HTML without a mismatch, then shows the saved draft", async () => {
    storeDraft({ formule: "prive", entreprise: "Acme", _step: 3 });
    const tree = (
      <PortsProvider ports={env.ports}>
        <HostFunnel offers={OFFERS} site={SITE} submit={env.lead.submit} />
      </PortsProvider>
    );
    const html = renderToString(tree);
    const host = document.createElement("div");
    host.innerHTML = html;
    document.body.append(host);
    const mismatches: unknown[] = [];
    try {
      await act(async () => {
        hydrateRoot(host, tree, {
          onRecoverableError: (error) => mismatches.push(error),
        });
      });
      expect(mismatches).toEqual([]);
      expect(
        screen.getByText("Étape 3 sur 4 · Votre entreprise"),
      ).toBeVisible();
      expect(screen.getByLabelText("Nom de l'entreprise")).toHaveValue("Acme");
    } finally {
      host.remove();
    }
  });

  it("can take the focus from the skip link: the funnel has tabindex -1", () => {
    const { container } = setup();
    expect(container.querySelector("#funnel")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("keeps the success panel and the alert box in the page, concealed", () => {
    const { container } = setup();
    expect(container.querySelector("#success")).toHaveAttribute("hidden");
    expect(container.querySelector("#form-alert")).toHaveAttribute("hidden");
    expect(container.querySelector("#form-alert")).toHaveAttribute(
      "role",
      "alert",
    );
  });
});

describe("HostFunnel without script", () => {
  it("uses the dialog method, so a native submit neither leaks the answers nor navigates", () => {
    const { container } = setup();
    expect(container.querySelector("#host-form")).toHaveAttribute(
      "method",
      "dialog",
    );
  });
});

describe("step 1, the offer", () => {
  it("refuses to continue without an offer, flags the group and focuses the first card", async () => {
    const { user } = setup();
    await user.click(next());
    expect(
      screen.getByText("Choisissez une formule pour continuer."),
    ).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Formule" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      screen.getByRole("radio", { name: /Hôte communautaire/ }),
    ).toHaveFocus();
    expect(screen.getByText("Étape 1 sur 4 · Formule")).toBeInTheDocument();
  });

  it("clears the error as soon as an offer is chosen", async () => {
    const { user } = setup();
    await user.click(next());
    await chooseOffer(user, "Craft session privée");
    expect(
      screen.queryByText("Choisissez une formule pour continuer."),
    ).toBeNull();
    expect(
      screen.getByRole("radiogroup", { name: "Formule" }),
    ).not.toHaveAttribute("aria-invalid");
  });
});

describe("moving between steps", () => {
  it("shows step 2, announces it, focuses its legend and scrolls to the form", async () => {
    const { user } = setup();
    await toStep2(user);
    expect(screen.getByRole("group", { name: "L'événement" })).toBeVisible();
    expect(screen.getByText("Étape 2 sur 4 · L'événement")).toBeInTheDocument();
    expect(legend(2)).toHaveFocus();
    expect(env.scroller.scrolls).toEqual([
      { id: "funnel", behavior: "smooth" },
    ]);
    expect(screen.getByRole("button", { name: "Retour" })).toBeVisible();
  });

  it("scrolls without animation when the person asks for reduced motion", async () => {
    env.reduceMotion();
    const { user } = setup();
    await toStep2(user);
    expect(env.scroller.scrolls).toEqual([{ id: "funnel", behavior: "auto" }]);
  });

  it("goes back with Retour and keeps the answers", async () => {
    const { user } = setup();
    await toStep2(user);
    await user.click(screen.getByRole("button", { name: "Retour" }));
    expect(
      screen.getByRole("group", { name: /Quelle formule vous intéresse/ }),
    ).toBeVisible();
    expect(legend(1)).toHaveFocus();
    expect(
      screen.getByRole("radio", { name: /Meetup partenaire/ }),
    ).toBeChecked();
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
  });

  it("goes forward on Enter in a text field, as on Continuer", async () => {
    const { user } = setup();
    await toStep3(user);
    await user.type(
      screen.getByLabelText("Nom de l'entreprise"),
      "Acme{Enter}",
    );
    expect(
      screen.getByRole("group", { name: /Comment vous joindre/ }),
    ).toBeVisible();
  });

  it("does not leave a step on Enter in a textarea", async () => {
    const { user } = setup();
    await toStep2(user);
    await user.type(
      screen.getByLabelText(/Sujets que vos équipes/),
      "TDD{Enter}legacy",
    );
    expect(screen.getByRole("group", { name: "L'événement" })).toBeVisible();
    expect(screen.getByLabelText(/Sujets que vos équipes/)).toHaveValue(
      "TDD\nlegacy",
    );
  });
});

describe("step 2, the event", () => {
  it("limits both dates to tomorrow and later", async () => {
    const { user } = setup();
    await toStep2(user);
    expect(screen.getByLabelText("Date souhaitée")).toHaveAttribute(
      "min",
      "2026-11-08",
    );
    expect(screen.getByLabelText(/Date alternative/)).toHaveAttribute(
      "min",
      "2026-11-08",
    );
  });

  it("keeps an empty help paragraph under the date, as the old page did", async () => {
    const { user, container } = setup();
    await toStep2(user);
    const help = container.querySelector("#date-help") as HTMLElement;
    expect(help).toBeInTheDocument();
    expect(help).toBeEmptyDOMElement();
    expect(screen.getByLabelText("Date souhaitée")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("explains a date that is not a Saturday, and confirms a Saturday", async () => {
    const { user } = setup();
    await toStep2(user);
    fireEvent.change(screen.getByLabelText("Date souhaitée"), {
      target: { value: "2026-11-09" },
    });
    expect(
      screen.getByText(
        /C'est un lundi\. Les meetups ouverts ont lieu le samedi matin/,
      ),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Date souhaitée"), {
      target: { value: "2026-11-14" },
    });
    expect(screen.getByText("Samedi, c'est noté.")).toBeInTheDocument();
  });

  it("does not warn about a weekday for the private session, even when chosen first", async () => {
    const { user } = setup();
    await chooseOffer(user, "Craft session privée");
    await user.click(next());
    fireEvent.change(screen.getByLabelText("Date souhaitée"), {
      target: { value: "2026-11-09" },
    });
    expect(screen.getByText("Lundi, c'est noté.")).toBeInTheDocument();
  });

  it("shows the error of a past alternative date and blocks the step", async () => {
    const { user } = setup();
    await toStep2(user);
    await fillStep2(user);
    fireEvent.change(screen.getByLabelText(/Date alternative/), {
      target: { value: "2020-01-01" },
    });
    await user.click(next());
    expect(screen.getByLabelText(/Date alternative/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Indiquez une date à venir.")).toBeInTheDocument();
    expect(screen.getByText("Étape 2 sur 4 · L'événement")).toBeInTheDocument();
  });

  it("flags the date and the attendees, focuses the date, and clears each on input", async () => {
    const { user } = setup();
    await toStep2(user);
    await user.click(next());
    const date = screen.getByLabelText("Date souhaitée");
    expect(date).toHaveAttribute("aria-invalid", "true");
    expect(date).toHaveFocus();
    expect(screen.getByText("Indiquez une date à venir.")).toBeInTheDocument();
    expect(screen.getByText("Indiquez une fourchette.")).toBeInTheDocument();
    fireEvent.change(date, { target: { value: "2026-11-14" } });
    expect(screen.queryByText("Indiquez une date à venir.")).toBeNull();
    await user.click(screen.getByRole("radio", { name: "Plus de 80" }));
    expect(screen.queryByText("Indiquez une fourchette.")).toBeNull();
  });

  it("offers the cities, the equipment and the attendee ranges of the old form", async () => {
    const { user } = setup();
    await toStep2(user);
    expect(
      within(screen.getByLabelText("Ville"))
        .getAllByRole("option")
        .map((o) => o.textContent),
    ).toEqual(["Casablanca", "Rabat", "Marrakech", "Tanger", "Autre"]);
    expect(
      within(screen.getByRole("group", { name: /Sur place/ }))
        .getAllByRole("checkbox")
        .map((c) => c.getAttribute("value")),
    ).toEqual([
      "Salle plénière",
      "Salles pour les tables rondes",
      "Écran ou projecteur",
      "Wifi invités",
      "Café et petit-déjeuner",
      "Parking",
    ]);
    expect(
      within(
        screen.getByRole("radiogroup", {
          name: "Nombre de crafters attendus",
        }),
      )
        .getAllByRole("radio")
        .map((r) => r.getAttribute("value")),
    ).toEqual(["20-40", "40-60", "60-80", "80+"]);
  });
});

describe("step 3, the company", () => {
  it("asks for the company name and focuses it", async () => {
    const { user } = setup();
    await toStep3(user);
    await user.click(next());
    expect(
      screen.getByText("Indiquez le nom de l'entreprise."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nom de l'entreprise")).toHaveFocus();
    expect(screen.getByLabelText("Nom de l'entreprise")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("step 4, the contact", () => {
  it("shows the recap of the answers and turns the button into Envoyer ma demande", async () => {
    const { user, container } = setup();
    await toStep4(user);
    expect(
      screen.getByRole("button", { name: "Envoyer ma demande" }),
    ).toBeInTheDocument();
    const recap = container.querySelector("#recap") as HTMLElement;
    expect(recap).not.toHaveAttribute("hidden");
    expect(within(recap).getByText("Votre demande")).toBeInTheDocument();
    const rows = [...recap.querySelectorAll("dt")].map((dt) => [
      dt.textContent,
      dt.nextElementSibling?.textContent,
    ]);
    expect(recap).not.toHaveTextContent(/MAD|Gratuit|Sur devis/);
    expect(rows).toEqual([
      ["Formule", "Meetup partenaire"],
      ["Date souhaitée", "samedi 14 novembre 2026"],
      ["Crafters attendus", "40-60"],
      ["Lieu", "Casablanca"],
      ["Entreprise", "Acme"],
    ]);
  });

  it("flags the name, the e-mail, the phone and the consent, and focuses the name", async () => {
    const { user } = setup();
    await toStep4(user);
    await user.type(screen.getByLabelText("E-mail professionnel"), "sara@acme");
    await user.click(next());
    for (const text of [
      "Indiquez votre nom.",
      "Adresse e-mail invalide.",
      "Indiquez votre numéro.",
      "Votre accord est nécessaire pour envoyer la demande.",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByLabelText("Prénom et nom")).toHaveFocus();
    expect(screen.getByRole("checkbox", { name: /J'accepte/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(env.lead.calls).toHaveLength(0);
  });

  it("preselects the e-mail preference", async () => {
    const { user } = setup();
    await toStep4(user);
    expect(screen.getByRole("radio", { name: "E-mail" })).toBeChecked();
  });
});

describe("sending", () => {
  it("sends the answers with the type, the subject and the French e-mail body", async () => {
    const { user } = setup();
    await sendRequest(user);
    expect(env.lead.calls).toHaveLength(1);
    expect(env.lead.calls[0]).toEqual({
      site: SITE,
      data: {
        formule: "Meetup partenaire",
        date: "2026-11-14",
        date_alt: "",
        participants: "40-60",
        ville: "Casablanca",
        capacite: "",
        equipements: "",
        sujets: "",
        entreprise: "Acme",
        secteur: "",
        taille: "",
        site: "",
        adresse: "",
        nom: "Sara Alaoui",
        fonction: "",
        email: "sara@acme.ma",
        telephone: "0612345678",
        preference: "E-mail",
        message: "",
      },
      type: "Hébergement meetup",
      subject: "Demande d'hébergement meetup · Acme · 2026-11-14",
      body: [
        "Formule : Meetup partenaire",
        "Date souhaitée : samedi 14 novembre 2026",
        "Crafters attendus : 40-60",
        "Ville : Casablanca",
        "Entreprise : Acme",
        "Contact : Sara Alaoui",
        "E-mail : sara@acme.ma",
        "Téléphone : 0612345678",
        "Préférence : E-mail",
      ].join("\n"),
      honeypot: "",
    });
  });

  // The guard against a double click is tested on the hook (`useHostFunnel.test.tsx`).
  it("marks the button busy and keeps its focus until the answer comes", async () => {
    const { settle } = env.lead.hold();
    const { user } = setup();
    await sendRequest(user);
    const busy = screen.getByRole("button", { name: "Envoi…" });
    expect(busy).toHaveAttribute("aria-disabled", "true");
    expect(busy).toHaveFocus();
    settle({ mode: "endpoint" });
    expect(await screen.findByText("Demande bien reçue.")).toBeVisible();
  });

  it("gives back the button and shows the failure alert when the send throws", async () => {
    env.lead.fail(new Error("boom"));
    const { user } = setup();
    await sendRequest(user);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "L'envoi n'a pas abouti. Vos réponses sont conservées, réessayez dans un instant.",
    );
    const button = screen.getByRole("button", { name: "Envoyer ma demande" });
    expect(button).not.toHaveAttribute("aria-disabled");
    expect(env.reporter.reports).toEqual([
      {
        message: "[MSC] Envoi du formulaire impossible :",
        cause: new Error("boom"),
      },
    ]);
    expect(screen.getByLabelText("Prénom et nom")).toHaveValue("Sara Alaoui");
  });

  it("can send again after a failure", async () => {
    env.lead.failOnce(new Error("boom"));
    const { user } = setup();
    await sendRequest(user);
    await screen.findByRole("alert");
    await user.click(next());
    expect(env.lead.calls).toHaveLength(2);
    expect(await screen.findByText("Demande bien reçue.")).toBeVisible();
  });

  it("clears the failure alert while the next try runs", async () => {
    env.lead.failOnce(new Error("boom"));
    env.lead.hold();
    const { user } = setup();
    await sendRequest(user);
    await screen.findByRole("alert");
    await user.click(next());
    expect(screen.getByRole("button", { name: "Envoi…" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("replaces the form with the success panel, focuses it and clears the draft", async () => {
    const { user, container } = setup();
    await sendRequest(user);
    const panel = container.querySelector("#success") as HTMLElement;
    expect(await screen.findByText("Demande bien reçue.")).toBeVisible();
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveFocus();
    expect(panel).toHaveAttribute("role", "status");
    expect(panel).toHaveAccessibleName("Demande bien reçue.");
    expect(
      within(panel).getByRole("link", { name: "Revoir les éditions passées" }),
    ).toHaveAttribute("href", "/#historique");
    expect(container.querySelector("#host-form")).toHaveAttribute("hidden");
    expect(
      screen.getByText(
        "Un membre de l'équipe vous recontacte sous 48 heures pour valider la date et la logistique.",
      ),
    ).toBeInTheDocument();
    expect(savedDraft()).toBeNull();
  });

  it("tells the person to send the prefilled e-mail when the mail client opened", async () => {
    env.lead.answer({ mode: "mailto", url: "mailto:x@y.ma" });
    const { user } = setup({ ...SITE, contact: { email: "x@y.ma" } });
    await sendRequest(user);
    expect(
      await screen.findByText(
        "Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer. Nous revenons vers vous sous 48 heures.",
      ),
    ).toBeVisible();
  });

  it("shows the LinkedIn link and keeps the form when nothing receives the request", async () => {
    env.lead.answer({ mode: "linkedin", href: linkedin });
    const { user } = setup();
    await sendRequest(user);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur LinkedIn en attendant.",
    );
    const link = within(alert).getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("href", linkedin);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(env.reporter.reports).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Envoyer ma demande" }),
    ).toBeEnabled();
    expect(
      screen.queryByRole("heading", { name: "Demande bien reçue." }),
    ).toBeNull();
  });

  it("shows the same alert, without a link, when no LinkedIn page is configured", async () => {
    env.lead.answer({ mode: "none" });
    const { user } = setup();
    await sendRequest(user);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur LinkedIn en attendant.",
    );
    expect(within(alert).queryByRole("link")).toBeNull();
  });

  it("explains a failed send, keeps the answers and offers the e-mail address", async () => {
    env.lead.answer({
      mode: "error",
      error: new Error("HTTP 500"),
      fallback: {
        kind: "mailto",
        email: "x@y.ma",
        url: "mailto:x@y.ma?subject=s",
      },
    });
    const { user } = setup({ ...SITE, contact: { email: "x@y.ma" } });
    await sendRequest(user);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "L'envoi n'a pas abouti. Vos réponses sont conservées, réessayez dans un instant. Vous pouvez aussi nous écrire à x@y.ma.",
    );
    expect(within(alert).getByRole("link", { name: "x@y.ma" })).toHaveAttribute(
      "href",
      "mailto:x@y.ma?subject=s",
    );
    expect(env.reporter.reports).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Envoyer ma demande" }),
    ).toBeEnabled();
    expect(screen.getByLabelText("Prénom et nom")).toHaveValue("Sara Alaoui");
  });

  it("offers the LinkedIn page after a failed send when there is no e-mail address", async () => {
    env.lead.answer({
      mode: "error",
      error: new Error("HTTP 500"),
      fallback: { kind: "linkedin", href: linkedin },
    });
    const { user } = setup();
    await sendRequest(user);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "L'envoi n'a pas abouti. Vos réponses sont conservées, réessayez dans un instant. Vous pouvez aussi nous écrire sur LinkedIn.",
    );
    expect(
      within(alert).getByRole("link", { name: "LinkedIn" }),
    ).toHaveAttribute("href", linkedin);
  });

  it("clears the alert when the person changes step", async () => {
    env.lead.answer({ mode: "linkedin", href: linkedin });
    const { user } = setup();
    await sendRequest(user);
    await screen.findByText(/pas encore relié/);
    await user.click(screen.getByRole("button", { name: "Retour" }));
    expect(screen.queryByText(/pas encore relié/)).toBeNull();
  });

  it("passes the trap value to the submit code and shows the success panel as if it worked", async () => {
    env.lead.answer({ mode: "honeypot" });
    const { user, container } = setup();
    await toStep4(user);
    await fillContact(user);
    fireEvent.change(container.querySelector("#website_hp") as HTMLElement, {
      target: { value: " https://spam.example " },
    });
    await user.click(next());
    expect(env.lead.calls).toHaveLength(1);
    expect(env.lead.calls[0]!.honeypot).toBe(" https://spam.example ");
    expect(await screen.findByText("Demande bien reçue.")).toBeVisible();
    expect(
      screen.getByText(
        "Un membre de l'équipe vous recontacte sous 48 heures pour valider la date et la logistique.",
      ),
    ).toBeInTheDocument();
    expect(savedDraft()).toBeNull();
  });

  // The decision to go back is tested on the hook; this checks what the person sees.
  it("sends nothing when a stale draft on step 4 has an old date, and moves the focus to the date", async () => {
    storeDraft({
      formule: "partenaire",
      date: "2026-11-07",
      participants: "40-60",
      entreprise: "Acme",
      _step: 4,
    });
    const { user } = setup();
    expect(
      screen.getByRole("group", { name: /Comment vous joindre/ }),
    ).toBeVisible();
    await fillContact(user);
    await user.click(next());
    expect(env.lead.calls).toHaveLength(0);
    expect(screen.getByRole("group", { name: "L'événement" })).toBeVisible();
    expect(screen.getByText("Indiquez une date à venir.")).toBeInTheDocument();
    expect(screen.getByLabelText("Date souhaitée")).toHaveFocus();
    expect(screen.getByText("Étape 2 sur 4 · L'événement")).toBeInTheDocument();
  });
});

describe("the draft", () => {
  it("saves each answer and the step, never the consent or the trap field", async () => {
    const { user, container } = setup();
    await toStep3(user);
    await user.type(screen.getByLabelText("Nom de l'entreprise"), "Acme");
    await user.click(next());
    await user.type(screen.getByLabelText("Prénom et nom"), "Sara");
    await user.click(screen.getByRole("checkbox", { name: /J'accepte/ }));
    fireEvent.change(container.querySelector("#website_hp") as HTMLElement, {
      target: { value: "x" },
    });
    expect(savedDraft()).toMatchObject({
      formule: "partenaire",
      date: "2026-11-14",
      participants: "40-60",
      ville: "Casablanca",
      entreprise: "Acme",
      nom: "Sara",
      preference: "E-mail",
      _step: 4,
    });
    expect(savedDraft()).not.toHaveProperty("consent");
    expect(savedDraft()).not.toHaveProperty("website_hp");
  });

  it("restores the answers and the step of a saved draft", () => {
    storeDraft({
      formule: "prive",
      date: "2026-12-05",
      participants: "80+",
      ville: "Rabat",
      equipements: ["Parking", "Wifi invités"],
      entreprise: "Acme",
      nom: "Sara",
      _step: 3,
    });
    setup();
    expect(
      screen.getByRole("group", { name: "Votre entreprise" }),
    ).toBeVisible();
    expect(
      screen.getByText("Étape 3 sur 4 · Votre entreprise"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nom de l'entreprise")).toHaveValue("Acme");
    expect(screen.getByLabelText("Ville")).toHaveValue("Rabat");
    expect(screen.getByLabelText("Date souhaitée")).toHaveValue("2026-12-05");
    expect(
      screen.getByRole("radio", { name: /Craft session privée/, hidden: true }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Plus de 80", hidden: true }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Parking", hidden: true }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Wifi invités", hidden: true }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Salle plénière", hidden: true }),
    ).not.toBeChecked();
    expect(legend(3)).not.toHaveFocus();
  });

  it("works when the storage is unavailable", async () => {
    const { user } = renderFunnel(SITE, { storage: deniedStorage() });
    await toStep2(user);
    expect(screen.getByRole("group", { name: "L'événement" })).toBeVisible();
  });
});

describe("?formule= in the URL", () => {
  it("preselects the offer and opens step 2", () => {
    window.history.replaceState(null, "", "/accueillir/?formule=prive");
    setup();
    expect(screen.getByRole("group", { name: "L'événement" })).toBeVisible();
    expect(screen.getByText("Étape 2 sur 4 · L'événement")).toBeInTheDocument();
    expect(savedDraft()).toBeNull();
  });

  it("shows the chosen offer when going back to step 1", async () => {
    window.history.replaceState(null, "", "/accueillir/?formule=communautaire");
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Retour" }));
    expect(
      screen.getByRole("radio", { name: /Hôte communautaire/ }),
    ).toBeChecked();
  });
});
