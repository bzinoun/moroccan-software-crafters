import { ChoiceCard, ChoiceGroup } from "@/components/ChoiceCard";
import { Field } from "@/components/Field";
import type { FunnelOffer } from "@/lib/funnel";
import { offerPrice } from "@/lib/home-data";
import { FunnelStep } from "./FunnelStep";
import type { StepProps } from "./useHostFunnel";

// Step 1 of the host funnel: the offer, one choice card per `offers.json` item.

type OfferStepProps = Pick<
  StepProps,
  "active" | "values" | "errors" | "update"
> & {
  offers: readonly FunnelOffer[];
};

export function OfferStep({
  active,
  values,
  errors,
  update,
  offers,
}: OfferStepProps) {
  return (
    <FunnelStep
      step={1}
      active={active}
      title="Quelle formule vous intéresse ?"
      hint="Vous pourrez en changer lors de notre échange."
    >
      <Field id="formule" group error={errors.formule}>
        <ChoiceGroup id="offer-choices" aria-label="Formule">
          {offers.map((offer) => (
            <ChoiceCard
              key={offer.id}
              name="formule"
              value={offer.id}
              title={offer.name}
              description={offer.tagline}
              price={offerPrice(offer)}
              required
              aria-invalid={errors.formule ? true : undefined}
              checked={values.formule === offer.id}
              onChange={() => update("formule", offer.id)}
            />
          ))}
        </ChoiceGroup>
      </Field>
    </FunnelStep>
  );
}
