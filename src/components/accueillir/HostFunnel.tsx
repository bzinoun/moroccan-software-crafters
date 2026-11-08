"use client";

import { Button } from "@/components/Button";
import { FormAlert } from "@/components/FormAlert";
import { FormPanel } from "@/components/FormPanel";
import { SuccessPanel } from "@/components/SuccessPanel";
import type { FormSite } from "@/lib/forms";
import { type FunnelOffer } from "@/lib/funnel-fields";
import { MESSAGES } from "@/lib/funnel-text";
import type { Submit } from "@/lib/submit-outcome";
import { CompanyStep } from "./CompanyStep";
import { ContactStep } from "./ContactStep";
import { EventStep } from "./EventStep";
import { FunnelNav } from "./FunnelNav";
import { FunnelProgress } from "./FunnelProgress";
import { NoScriptNote } from "./NoScriptNote";
import { OfferStep } from "./OfferStep";
import { useHostFunnel } from "./useHostFunnel";

// Spec: the "HostFunnel" entry in msca-design/COMPONENTS.md. The state lives in
// `useHostFunnel`, the four steps in their own files; this component lays them
// out in the card. The card can take focus (tabIndex -1) so the skip link of
// the page lands on it. With no script the form shows every step and a note
// that points to LinkedIn, because it cannot send. The form posts, so with no
// script a native submit goes nowhere and keeps the answers out of the URL.

type HostFunnelProps = {
  /** `offers.json` items. */
  offers: readonly FunnelOffer[];
  /** Delivery settings of `site.json`: `form`, `contact` and `links.linkedin`. */
  site: FormSite;
  /** The send function. Tests pass a fake; the default posts from the browser. */
  submit?: Submit;
};

export function HostFunnel({ offers, site, submit }: HostFunnelProps) {
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
  } = useHostFunnel(offers, site, submit);
  const stepProps = { values, errors, update, bind };

  return (
    <FormPanel id="funnel" tabIndex={-1} className="outline-hidden">
      <form
        id="host-form"
        ref={formRef}
        method="dialog"
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
        <NoScriptNote linkedin={site.links?.linkedin} />
      </form>

      <SuccessPanel
        id="success"
        hidden={success === null}
        stamp="Merci ! On vous rappelle vite."
        text={success ?? MESSAGES.successDefault}
      >
        <p className="mx-auto max-w-[46ch] text-ink-soft">
          <Button variant="ghost" href={"/#historique"}>
            Revoir les éditions passées
          </Button>
        </p>
      </SuccessPanel>
    </FormPanel>
  );
}
