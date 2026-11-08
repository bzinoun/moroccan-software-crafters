import { Field } from "@/components/Field";
import { FieldRow } from "@/components/FieldRow";
import { Pill, PillGroup } from "@/components/PillGroup";
import { Select } from "@/components/Select";
import { TextArea } from "@/components/TextArea";
import { TextInput } from "@/components/TextInput";
import { EQUIPEMENTS, PARTICIPANTS, VILLES, pick } from "@/lib/funnel-fields";
import { dateHelp } from "@/lib/funnel-text";
import { FunnelStep } from "./FunnelStep";
import type { StepProps } from "./useHostFunnel";

// Step 2 of the host funnel: the date, the size, the city and the room.

type EventStepProps = StepProps & {
  /** First date allowed (`tomorrowIso`), empty until the browser state is read. */
  minDate: string;
};

export function EventStep({
  active,
  values,
  errors,
  update,
  bind,
  minDate,
}: EventStepProps) {
  const dateMin = minDate || undefined;
  return (
    <FunnelStep
      step={2}
      active={active}
      title="L'événement"
      hint="Les meetups communautaires ont lieu le samedi de 9 h 30 à 14 h."
    >
      <FieldRow>
        <Field
          id="date"
          label="Date souhaitée"
          help={dateHelp(values.date, values.formule)}
          error={errors.date}
        >
          <TextInput type="date" min={dateMin} required {...bind("date")} />
        </Field>
        <Field id="date_alt" label="Date alternative" optional>
          <TextInput type="date" min={dateMin} {...bind("date_alt")} />
        </Field>
      </FieldRow>
      <Field
        id="attendees"
        label="Nombre de crafters attendus"
        group
        error={errors.participants}
      >
        <PillGroup role="radiogroup">
          {PARTICIPANTS.map((range) => (
            <Pill
              key={range.value}
              type="radio"
              name="participants"
              value={range.value}
              required
              aria-invalid={errors.participants ? true : undefined}
              checked={values.participants === range.value}
              onChange={() => update("participants", range.value)}
            >
              {range.label}
            </Pill>
          ))}
        </PillGroup>
      </Field>
      <FieldRow>
        <Field id="ville" label="Ville">
          <Select
            name="ville"
            required
            value={values.ville}
            onChange={(event) => {
              const city = pick(VILLES, event.target.value);
              if (city) update("ville", city);
            }}
          >
            {VILLES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          id="capacite"
          label="Capacité de la salle"
          optional="(places)"
          error={errors.capacite}
        >
          <TextInput
            type="number"
            min={10}
            max={1000}
            inputMode="numeric"
            placeholder="ex. 60"
            {...bind("capacite")}
          />
        </Field>
      </FieldRow>
      <Field
        id="equip"
        label="Sur place"
        optional="(cochez ce qui est disponible)"
        group
      >
        <PillGroup>
          {EQUIPEMENTS.map((item) => (
            <Pill
              key={item}
              type="checkbox"
              name="equipements"
              value={item}
              checked={values.equipements.includes(item)}
              onChange={(event) =>
                update(
                  "equipements",
                  event.target.checked
                    ? [...values.equipements, item]
                    : values.equipements.filter((e) => e !== item),
                )
              }
            >
              {item}
            </Pill>
          ))}
        </PillGroup>
      </Field>
      <Field
        id="sujets"
        label="Sujets que vos équipes aimeraient aborder"
        optional
      >
        <TextArea
          placeholder="ex. IA et qualité du code, migration d'un legacy, pratiques de test…"
          {...bind("sujets")}
        />
      </Field>
    </FunnelStep>
  );
}
