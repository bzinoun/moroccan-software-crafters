"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  HONEYPOT_FIELD,
  type FormSite,
  type SubmitInput,
  type SubmitResult,
} from "@/lib/forms";
import { submitFormInBrowser } from "@/lib/forms-browser";
import type { SponsorLevel } from "@/lib/pages-data";
import {
  outcomeOf,
  type Outcome,
  type OutcomeTexts,
} from "@/lib/submit-outcome";
import { isValidEmail, normalizePhone, validPhone } from "@/lib/validation";
import { Button } from "../Button";
import { ConsentCheckbox } from "../ConsentCheckbox";
import { Field } from "../Field";
import { FieldRow } from "../FieldRow";
import { FormAlert } from "../FormAlert";
import { Honeypot } from "../Honeypot";
import { Pill, PillGroup } from "../PillGroup";
import { SuccessPanel } from "../SuccessPanel";
import { TextArea } from "../TextArea";
import { TextInput } from "../TextInput";

// Spec: the "SponsorForm, SponsorLayout" entry in msca-design/COMPONENTS.md; port
// of the sponsor form of socrates.html and of `simpleForm` in assets/js/pages.js.
// One step: validate, send through `submitFormInBrowser`, then the thanks panel
// or an alert. The validation, the messages and the focus moves are the old ones.

const TYPE = "Sponsoring SoCraTes";
const SUBMIT_LABEL = "Recevoir le dossier de partenariat";
const MAILTO_SUCCESS =
  "Votre messagerie s'est ouverte avec la demande pré-remplie : il ne reste qu'à l'envoyer.";
const RETRY = "L'envoi n'a pas abouti. Réessayez dans un instant";
const FAILURE_TEXTS = {
  plain: `${RETRY}.`,
  mailLead: `${RETRY}, ou écrivez-nous à`,
  linkedinLead: `${RETRY}, ou écrivez-nous sur`,
};

type FieldName = "entreprise" | "nom" | "email" | "telephone" | "consent";
type Errors = Partial<Record<FieldName, string>>;

type SponsorFormProps = {
  /** The parts of `site.json` the submit code reads: `links.linkedin`, `contact.email`, `form`. */
  site: FormSite;
  /** `sponsorLevels(loadSponsoring())`. */
  levels: { options: readonly SponsorLevel[]; defaultValue: string };
  /** Package id to level value: a click on `[data-level="<id>"]` checks that level. */
  packageLevels: Readonly<Record<string, string>>;
  /** `loadSponsoring().form.success`. */
  successText: string;
  /** The send function. Tests pass a fake; the default posts from the browser. */
  submit?: (input: SubmitInput) => Promise<SubmitResult>;
};

export function SponsorForm({
  site,
  levels,
  packageLevels,
  successText,
  submit = submitFormInBrowser,
}: SponsorFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [niveau, setNiveau] = useState(levels.defaultValue);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState<ReactNode>(null);
  const [thanks, setThanks] = useState<string | null>(null);
  const outcomeTexts: OutcomeTexts = {
    success: successText,
    mailto: MAILTO_SUCCESS,
    failure: FAILURE_TEXTS,
  };
  /** Synchronous guard: `sending` state is one render late for a double click. */
  const inFlight = useRef(false);

  // The package buttons live elsewhere in the page: listen for their clicks.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const id = target.closest("[data-level]")?.getAttribute("data-level");
      const level = id ? packageLevels[id] : undefined;
      if (level) setNiveau(level);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [packageLevels]);

  // A field stops being invalid as soon as the visitor edits it.
  function onChange(event: ChangeEvent<HTMLFormElement>) {
    const target: unknown = event.target;
    if (!(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    )) {
      return;
    }
    const name = target.name as FieldName;
    setErrors((current) => {
      if (!(name in current)) return current;
      const rest = { ...current };
      delete rest[name];
      return rest;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    setAlert(null);

    const values = new FormData(form);
    const get = (name: string) => String(values.get(name) ?? "").trim();
    const found: Errors = {};
    if (!get("entreprise"))
      found.entreprise = "Indiquez le nom de l'entreprise.";
    if (!get("nom")) found.nom = "Indiquez votre nom.";
    if (!get("email") || !isValidEmail(get("email"))) {
      found.email = "Adresse e-mail invalide.";
    }
    if (!get("telephone")) found.telephone = "Indiquez votre numéro.";
    else if (!validPhone(get("telephone")))
      found.telephone = "Numéro invalide.";
    if (!values.has("consent")) {
      found.consent = "Votre accord est nécessaire pour envoyer la demande.";
    }
    setErrors(found);
    const first = (
      ["entreprise", "nom", "email", "telephone", "consent"] as const
    ).find((name) => found[name]);
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    const data = {
      entreprise: get("entreprise"),
      nom: get("nom"),
      fonction: get("fonction"),
      email: get("email"),
      telephone: normalizePhone(get("telephone")),
      niveau,
      message: get("message"),
    };
    inFlight.current = true;
    setSending(true);
    try {
      const result = await submit({
        site,
        data,
        type: TYPE,
        subject: `Partenariat SoCraTes · ${data.entreprise} · ${data.niveau}`,
        // As typed: the old form did not trim the trap field.
        honeypot: String(values.get(HONEYPOT_FIELD) ?? ""),
      });
      showOutcome(outcomeOf(result, outcomeTexts));
    } catch (cause) {
      // The submit code reports failures as a result; this is a safety net.
      showOutcome(
        outcomeOf(
          {
            mode: "error",
            error: cause instanceof Error ? cause : new Error(String(cause)),
            fallback: null,
          },
          outcomeTexts,
        ),
      );
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  function showOutcome(outcome: Outcome) {
    if (outcome.kind === "success") setThanks(outcome.text);
    else setAlert(outcome.content);
  }

  return (
    <>
      <form
        id="sponsor-form"
        noValidate
        hidden={thanks !== null}
        onSubmit={onSubmit}
        onChange={onChange}
      >
        <Field id="s-entreprise" label="Entreprise" error={errors.entreprise}>
          <TextInput name="entreprise" autoComplete="organization" required />
        </Field>
        <FieldRow>
          <Field id="s-nom" label="Prénom et nom" error={errors.nom}>
            <TextInput name="nom" autoComplete="name" required />
          </Field>
          <Field id="s-fonction" label="Fonction" optional>
            <TextInput name="fonction" autoComplete="organization-title" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="s-email" label="E-mail professionnel" error={errors.email}>
            <TextInput
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </Field>
          <Field id="s-tel" label="Téléphone" error={errors.telephone}>
            <TextInput
              type="tel"
              name="telephone"
              autoComplete="tel"
              placeholder="+212 6 12 34 56 78"
              required
            />
          </Field>
        </FieldRow>
        <Field id="s-niveau" label="Niveau envisagé" group>
          <PillGroup role="radiogroup" id="s-niveaux">
            {levels.options.map((option) => (
              <Pill
                key={option.value}
                type="radio"
                name="niveau"
                value={option.value}
                checked={niveau === option.value}
                onChange={() => setNiveau(option.value)}
              >
                {option.label}
              </Pill>
            ))}
          </PillGroup>
        </Field>
        <Field id="s-message" label="Votre message" optional>
          <TextArea
            name="message"
            placeholder="Vos attentes, vos questions, les collaborateurs que vous aimeriez envoyer…"
          />
        </Field>
        <ConsentCheckbox
          id="s-consent"
          name="consent"
          required
          error={errors.consent}
        >
          {
            "J'accepte que Moroccan Software Crafters conserve ces informations pour me recontacter au sujet du partenariat SoCraTes Maroc (loi 09-08). Elles ne sont ni cédées ni utilisées à d'autres fins."
          }
        </ConsentCheckbox>
        <Honeypot id="s-hp" />
        <FormAlert id="s-alert">{alert}</FormAlert>
        <Button
          type="submit"
          id="s-submit"
          aria-disabled={sending || undefined}
          className="mt-2 w-full aria-disabled:cursor-not-allowed aria-disabled:opacity-55 aria-disabled:hover:translate-y-0"
        >
          {sending ? "Envoi…" : SUBMIT_LABEL}
        </Button>
      </form>
      <SuccessPanel
        id="s-success"
        hidden={thanks === null}
        stamp="Merci !"
        headingLevel={3}
        headingClassName="text-ink!"
        text={thanks ?? successText}
      />
    </>
  );
}
