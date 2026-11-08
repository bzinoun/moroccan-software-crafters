"use client";

import { type FormSite } from "@/lib/forms";
import type { Submit } from "@/lib/submit-outcome";
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
import {
  useSponsorForm,
  type PackageLevels,
  type SponsorLevels,
} from "./useSponsorForm";

// Spec: the "SponsorForm, SponsorLayout" entry in msca-design/COMPONENTS.md; port
// of the sponsor form of the former `socrates.html` (`git show 1353207:socrates.html`).
// The view of the form; the state, the validation and the send live in
// `useSponsorForm`.

const SUBMIT_LABEL = "Recevoir le dossier de partenariat";

type SponsorFormProps = {
  /** The parts of `site.json` the submit code reads: `links.linkedin`, `contact.email`, `form`. */
  site: FormSite;
  /** `sponsorLevels(loadSponsoring())`. */
  levels: SponsorLevels;
  /** Package id to level value: choosing a package checks that level. */
  packageLevels: PackageLevels;
  /** `loadSponsoring().form.success`. */
  successText: string;
  /** The send function. Tests pass a fake; the default posts from the browser. */
  submit?: Submit;
};

export function SponsorForm(props: SponsorFormProps) {
  const { levels } = props;
  const {
    errors,
    niveau,
    setNiveau,
    busy,
    alert,
    thanks,
    successText,
    onChange,
    onSubmit,
  } = useSponsorForm(props);

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
          aria-disabled={busy || undefined}
          variant="primary-flat"
          className="mt-2 w-full"
        >
          {busy ? "Envoi…" : SUBMIT_LABEL}
        </Button>
      </form>
      <SuccessPanel
        id="s-success"
        hidden={thanks === null}
        stamp="Merci !"
        headingLevel={3}
        tone="ink"
        text={thanks ?? successText}
      />
    </>
  );
}
