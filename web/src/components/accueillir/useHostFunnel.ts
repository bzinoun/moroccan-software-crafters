"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { HONEYPOT_FIELD, type FormSite } from "@/lib/forms";
import { submitFormInBrowser } from "@/lib/forms-browser";
import {
  EMPTY_VALUES,
  LEAD_TYPE,
  MESSAGES,
  TOTAL_STEPS,
  clearDraft,
  collect,
  emailBody,
  leadSubject,
  readDraft,
  restoreDraft,
  toDraft,
  tomorrowIso,
  validateAll,
  validateStep,
  writeDraft,
  type ErrorField,
  type FieldErrors,
  type FunnelOffer,
  type FunnelValues,
} from "@/lib/funnel";
import { scrollBehavior } from "@/lib/motion";
import { outcomeOf, type OutcomeTexts } from "@/lib/submit-outcome";

// State of the host funnel (port of the state machine of `assets/js/funnel.js`):
// the answers, the step, the saved draft, the validation and the submit. The
// first render is step 1 with empty answers, the same on the server and in the
// browser, so the static HTML shows the offers. A mount effect then reads the
// browser state (saved draft, `?formule=`, today's date). The docs of
// `useSearchParams` ask for a Suspense boundary, which would leave only a
// fallback in the static HTML; the effect needs no boundary and has to read the
// draft anyway, so `location.search` is read in the same place.

/** The fields bound to a plain text value. */
export type TextField = Exclude<keyof FunnelValues, "equipements" | "consent">;

export type Update = <K extends keyof FunnelValues>(
  name: K,
  value: FunnelValues[K],
) => void;

/** `name`, `value` and `onChange` of a text control. */
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

export type HostFunnelState = {
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
): HostFunnelState {
  const formRef = useRef<HTMLFormElement>(null);
  /** Set when the person moved: the effect then focuses and scrolls. */
  const moved = useRef(false);
  /** A field to focus once its step is shown (the final check jumps back). */
  const fieldAfterMove = useRef<ErrorField | null>(null);
  /** Synchronous guard: `busy` state is one render late for a double click. */
  const sending = useRef(false);
  const [values, setValues] = useState<FunnelValues>(EMPTY_VALUES);
  const [step, setStep] = useState(1);
  const [minDate, setMinDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [alert, setAlert] = useState<ReactNode>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Browser-only state: the date of today, the saved draft and the URL.
  useEffect(() => {
    const min = tomorrowIso(new Date());
    const restored = restoreDraft({
      draft: readDraft(),
      search: window.location.search,
      offerIds: offers.map((offer) => offer.id),
      min,
    });
    /* eslint-disable react-hooks/set-state-in-effect -- reads the browser once on mount; the first render must match the server */
    setMinDate(min);
    setValues(restored.values);
    setStep(restored.step);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [offers]);

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
    setErrors((current) => {
      if (!(name in current)) return current;
      const rest = { ...current };
      delete rest[name as ErrorField];
      return rest;
    });
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
    sending.current = true;
    setBusy(true);
    try {
      const result = await submitFormInBrowser({
        site,
        data: lead,
        type: LEAD_TYPE,
        subject: leadSubject(lead),
        body: emailBody(lead),
        honeypot,
      });
      const outcome = outcomeOf(result, OUTCOME_TEXTS);
      if (outcome.kind === "success") finish(outcome.text);
      else setAlert(outcome.content);
    } catch (cause) {
      // The submit code reports failures as a result; this is a safety net.
      const outcome = outcomeOf(
        {
          mode: "error",
          error: cause instanceof Error ? cause : new Error(String(cause)),
          fallback: null,
        },
        OUTCOME_TEXTS,
      );
      if (outcome.kind === "alert") setAlert(outcome.content);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  function focusField(name: ErrorField) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  // Continuer, and Enter in a field, both submit the form.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
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
