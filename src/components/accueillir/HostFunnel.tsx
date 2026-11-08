"use client";

import { Button } from "@/components/Button";
import { FormAlert } from "@/components/FormAlert";
import { SuccessPanel } from "@/components/SuccessPanel";
import type { FormSite } from "@/lib/forms";
import { MESSAGES, type FunnelOffer } from "@/lib/funnel";
import { toRoute } from "@/lib/routes";
import { CompanyStep } from "./CompanyStep";
import { ContactStep } from "./ContactStep";
import { EventStep } from "./EventStep";
import { FunnelNav } from "./FunnelNav";
import { FunnelProgress } from "./FunnelProgress";
import { OfferStep } from "./OfferStep";
import { useHostFunnel } from "./useHostFunnel";

// Spec: the "HostFunnel" entry in msca-design/COMPONENTS.md; port of
// former `assets/js/funnel.js` (`git show 1353207:assets/js/funnel.js`). The state lives in `useHostFunnel`, the four steps in
// their own files; this component lays them out in the card. The card can take
// focus (tabIndex -1) so the skip link of the page lands on it.

type HostFunnelProps = {
  /** `offers.json` items. */
  offers: readonly FunnelOffer[];
  /** Delivery settings of `site.json`: `form`, `contact` and `links.linkedin`. */
  site: FormSite;
};

export function HostFunnel({ offers, site }: HostFunnelProps) {
  const {
    formRef,
    values,
    step,
    minDate,
    errors,
    alert,
    busy,
    success,
    update,
    bind,
    onPrev,
    onSubmit,
  } = useHostFunnel(offers, site);
  const stepProps = { values, errors, update, bind };

  return (
    <div
      id="funnel"
      tabIndex={-1}
      className="rounded-[20px] bg-card px-[18px] py-[22px] text-ink shadow-lift outline-hidden sm:p-8"
    >
      <form
        id="host-form"
        ref={formRef}
        noValidate
        hidden={success !== null}
        onSubmit={onSubmit}
      >
        <FunnelProgress step={step} />
        <OfferStep {...stepProps} active={step === 1} offers={offers} />
        <EventStep {...stepProps} active={step === 2} minDate={minDate} />
        <CompanyStep {...stepProps} active={step === 3} />
        <ContactStep {...stepProps} active={step === 4} offers={offers} />
        <FormAlert id="form-alert">{alert}</FormAlert>
        <FunnelNav step={step} busy={busy} onPrev={onPrev} />
      </form>

      <SuccessPanel
        id="success"
        hidden={success === null}
        stamp="Merci ! On vous rappelle vite."
        text={success ?? MESSAGES.successDefault}
      >
        <p className="mx-auto max-w-[46ch] text-ink-soft">
          <Button variant="ghost" href={toRoute("index.html#historique")}>
            Revoir les éditions passées
          </Button>
        </p>
      </SuccessPanel>
    </div>
  );
}
