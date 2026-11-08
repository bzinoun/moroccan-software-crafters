import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import { Field } from "@/components/Field";
import { FieldRow } from "@/components/FieldRow";
import { Honeypot } from "@/components/Honeypot";
import { Pill, PillGroup } from "@/components/PillGroup";
import { TextArea } from "@/components/TextArea";
import { TextInput } from "@/components/TextInput";
import { PREFERENCES, collect, recapRows } from "@/lib/funnel";
import type { FunnelOffer } from "@/lib/funnel";
import { FunnelStep, StepHint } from "./FunnelStep";
import { Recap } from "./Recap";
import type { StepProps } from "./useHostFunnel";

// Step 4 of the host funnel: the recap, the contact and the consent.

const CONSENT_TEXT =
  "J'accepte que Moroccan Software Crafters conserve ces informations pour me recontacter au sujet de l'organisation d'un meetup (loi 09-08). Elles ne sont ni cédées ni utilisées à d'autres fins.";

type ContactStepProps = StepProps & { offers: readonly FunnelOffer[] };

export function ContactStep({
  active,
  values,
  errors,
  update,
  bind,
  offers,
}: ContactStepProps) {
  return (
    <FunnelStep step={4} active={active} title="Comment vous joindre ?">
      <Recap rows={recapRows(collect(values, offers))} />
      <StepHint>
        Nous utilisons ces informations uniquement pour vous recontacter au
        sujet de ce meetup.
      </StepHint>
      <FieldRow>
        <Field id="nom" label="Prénom et nom" error={errors.nom}>
          <TextInput autoComplete="name" required {...bind("nom")} />
        </Field>
        <Field id="fonction" label="Fonction" optional>
          <TextInput
            placeholder="ex. CTO, Engineering Manager, RH…"
            autoComplete="organization-title"
            {...bind("fonction")}
          />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field id="email" label="E-mail professionnel" error={errors.email}>
          <TextInput
            type="email"
            autoComplete="email"
            required
            {...bind("email")}
          />
        </Field>
        <Field id="telephone" label="Téléphone" error={errors.telephone}>
          <TextInput
            type="tel"
            autoComplete="tel"
            placeholder="+212 6 12 34 56 78"
            required
            {...bind("telephone")}
          />
        </Field>
      </FieldRow>
      <Field id="pref" label="Vous préférez être recontacté par" group>
        <PillGroup role="radiogroup">
          {PREFERENCES.map((way) => (
            <Pill
              key={way}
              type="radio"
              name="preference"
              value={way}
              checked={values.preference === way}
              onChange={() => update("preference", way)}
            >
              {way}
            </Pill>
          ))}
        </PillGroup>
      </Field>
      <Field id="message" label="Un mot de plus ?" optional>
        <TextArea {...bind("message")} />
      </Field>
      <ConsentCheckbox
        id="consent"
        name="consent"
        required
        error={errors.consent}
        checked={values.consent}
        onChange={(event) => update("consent", event.target.checked)}
      >
        {CONSENT_TEXT}
      </ConsentCheckbox>
      <Honeypot />
    </FunnelStep>
  );
}
