import { Field } from "@/components/Field";
import { FieldRow } from "@/components/FieldRow";
import { Select } from "@/components/Select";
import { TextInput } from "@/components/TextInput";
import { SECTEURS, TAILLES } from "@/lib/funnel";
import { FunnelStep } from "./FunnelStep";
import type { StepProps } from "./useHostFunnel";

// Step 3 of the host funnel: the company.

export function CompanyStep({
  active,
  errors,
  bind,
}: Pick<StepProps, "active" | "errors" | "bind">) {
  return (
    <FunnelStep
      step={3}
      active={active}
      title="Votre entreprise"
      hint="Pour préparer l'annonce et l'accès au bâtiment."
    >
      <Field
        id="entreprise"
        label="Nom de l'entreprise"
        error={errors.entreprise}
      >
        <TextInput
          autoComplete="organization"
          required
          {...bind("entreprise")}
        />
      </Field>
      <FieldRow>
        <Field id="secteur" label="Secteur">
          <Select {...bind("secteur")}>
            <option value="">Choisir…</option>
            {SECTEURS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="taille" label="Taille de l'équipe tech">
          <Select {...bind("taille")}>
            <option value="">Choisir…</option>
            {TAILLES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </Field>
      </FieldRow>
      <FieldRow>
        <Field id="site" label="Site web" optional error={errors.site}>
          <TextInput
            type="url"
            placeholder="https://"
            autoComplete="url"
            {...bind("site")}
          />
        </Field>
        <Field id="adresse" label="Quartier ou adresse" optional>
          <TextInput
            placeholder="ex. Casanearshore, Anfa…"
            autoComplete="street-address"
            {...bind("adresse")}
          />
        </Field>
      </FieldRow>
    </FunnelStep>
  );
}
