"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { HONEYPOT_FIELD, type FormSite } from "@/lib/forms";
import { submitFormInBrowser } from "@/lib/forms-browser";
import { tomorrowIso } from "@/lib/dates";
import {
  clearDraft,
  readDraft,
  restoreDraft,
  toDraft,
  writeDraft,
} from "@/lib/funnel-draft";
import {
  EMPTY_VALUES,
  LEAD_TYPE,
  TOTAL_STEPS,
  type ErrorField,
  type FieldErrors,
  type FunnelOffer,
  type FunnelValues,
  type TextField,
} from "@/lib/funnel-fields";
import { MESSAGES, collect, emailBody, leadSubject } from "@/lib/funnel-text";
import { validateAll, validateStep } from "@/lib/funnel-validate";
import { scrollBehavior } from "@/lib/motion";
import {
  useLeadSubmit,
  type OutcomeTexts,
  type Submit,
} from "@/lib/submit-outcome";
import { withoutError } from "@/lib/validation";
import { useHydrated } from "./useHydrated";

// State of the host funnel: the answers, the step, the saved draft, the
// validation and the submit. The first render is step 1 with empty answers, the
// same on the server and in the browser, so the exported HTML shows the offers.
// `useHydrated` makes that possible with no effect: while React hydrates it is
// false (not in the browser yet), then it renders again with true, and only
// then are the saved draft, `?formule=` and today's date read. The docs of `useSearchParams` ask for a Suspense boundary, which would
// leave only a fallback in the exported HTML; `location.search` is read in the
// same place as the draft instead.

const SERVER_STATE = { values: EMPTY_VALUES, step: 1, minDate: "" };

/** The saved draft, the URL and the date of today. Browser only. */
function readBrowserState(offerIds: readonly string[]) {
  const minDate = tomorrowIso(new Date());
  const restored = restoreDraft({
    draft: readDraft(),
    search: window.location.search,
    offerIds,
    min: minDate,
  });
  return { ...restored, minDate };
}

type Update = <K extends keyof FunnelValues>(
  name: K,
  value: FunnelValues[K],
) => void;

/** `name`, `value` and `onChange` of a free text control. Choices go through `update`. */
export type BindText = (name: TextField) => {
  name: TextField;
  value: string;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
};

/** What every step component receives. */
export type StepProps = {
  active: boolean;
  values: FunnelValues;
  errors: FieldErrors;
  update: Update;
  bind: BindText;
};

const OUTCOME_TEXTS: OutcomeTexts = {
  success: MESSAGES.successDefault,
  mailto: MESSAGES.successMailto,
  failure: {
    plain: MESSAGES.failed,
    mailLead: `${MESSAGES.failed} ${MESSAGES.alsoWriteTo}`,
    linkedinLead: `${MESSAGES.failed} ${MESSAGES.alsoWriteOn}`,
  },
};

type HostFunnelState = {
  formRef: RefObject<HTMLFormElement | null>;
  values: FunnelValues;
  step: number;
  minDate: string;
  errors: FieldErrors;
  alert: ReactNode;
  busy: boolean;
  /** The success text once the request is done, null while the form shows. */
  success: string | null;
  update: Update;
  bind: BindText;
  onPrev: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function useHostFunnel(
  offers: readonly FunnelOffer[],
  site: FormSite,
  submit: Submit = submitFormInBrowser,
): HostFunnelState {
  const formRef = useRef<HTMLFormElement>(null);
  /** Set when the person moved: the effect then focuses and scrolls. */
  const moved = useRef(false);
  /** A field to focus once its step is shown (the final check jumps back). */
  const fieldAfterMove = useRef<ErrorField | null>(null);
  // The state of the browser at load, then what the person changed on top of it.
  const hydrated = useHydrated();
  const offerKey = offers.map((offer) => offer.id).join("\n");
  const initial = useMemo(
    () => (hydrated ? readBrowserState(offerKey.split("\n")) : SERVER_STATE),
    [hydrated, offerKey],
  );
  const [editedValues, setValues] = useState<FunnelValues | null>(null);
  const [editedStep, setStep] = useState<number | null>(null);
  const values = editedValues ?? initial.values;
  const step = editedStep ?? initial.step;
  const minDate = initial.minDate;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [alert, setAlert] = useState<ReactNode>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    busy,
    isSending,
    send: sendLead,
  } = useLeadSubmit(submit, OUTCOME_TEXTS);

  // After a step change made by the person: focus the legend (or the field in
  // error), scroll to the form.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const field = fieldAfterMove.current;
    fieldAfterMove.current = null;
    const target = field
      ? formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)
      : document.getElementById(`step-${step}-legend`);
    target?.focus({ preventScroll: true });
    document
      .getElementById("funnel")
      ?.scrollIntoView?.({ behavior: scrollBehavior(), block: "start" });
  }, [step]);

  const update: Update = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors((current) => withoutError(current, name));
    writeDraft(toDraft(nextValues, step));
  };

  const bind: BindText = (name) => ({
    name,
    value: values[name],
    onChange: (event) => update(name, event.target.value),
  });

  function goTo(target: number) {
    moved.current = true;
    setStep(target);
    setAlert(null);
    writeDraft(toDraft(values, target));
  }

  function finish(text: string) {
    clearDraft();
    setSuccess(text);
  }

  async function send() {
    const trap = formRef.current?.elements.namedItem(HONEYPOT_FIELD);
    const honeypot = trap instanceof HTMLInputElement ? trap.value : "";
    const lead = collect(values, offers);
    const outcome = await sendLead({
      site,
      data: lead,
      type: LEAD_TYPE,
      subject: leadSubject(lead),
      body: emailBody(lead),
      honeypot,
    });
    if (outcome.kind === "success") finish(outcome.text);
    else setAlert(outcome.content);
  }

  function focusField(name: ErrorField) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  // Continuer, and Enter in a field, both submit the form.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending()) return;
    if (step < TOTAL_STEPS) {
      const { errors: found, first } = validateStep(step, values, minDate);
      setErrors(found);
      if (first) focusField(first);
      else goTo(step + 1);
      return;
    }
    // Last step: check every step, as a saved draft can open here with an
    // earlier step incomplete or out of date.
    const problem = validateAll(values, minDate);
    if (!problem) {
      setErrors({});
      void send();
      return;
    }
    setErrors(problem.errors);
    if (problem.step === step) {
      focusField(problem.first);
      return;
    }
    fieldAfterMove.current = problem.first;
    goTo(problem.step);
  }

  return {
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
    onPrev: () => step > 1 && goTo(step - 1),
    onSubmit,
  };
}
