import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_VALUES, type FunnelValues } from "@/lib/funnel-fields";
import {
  NOW,
  OFFERS,
  SITE,
  pendingResult,
  savedDraft,
  storeDraft,
  submit,
  setUpFunnelEnvironment,
} from "./test-utils";
import { useHostFunnel } from "./useHostFunnel";

// The hook has no form element here: it tests the state, not the focus.
// Nothing posts anywhere: the hook gets the `submit` double of the test utils.

setUpFunnelEnvironment();

// The fixed date is Saturday 7 November 2026: the first date allowed is the 8th.
const FUTURE = "2026-11-14";
const PAST = "2026-11-07";

const VALID_ANSWERS = {
  formule: "partenaire",
  date: FUTURE,
  participants: "40-60",
  entreprise: "Acme",
  nom: "Sara Alaoui",
  email: "sara@acme.ma",
  telephone: "0612345678",
} satisfies Partial<FunnelValues>;

const submitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

function renderFunnelHook() {
  return renderHook(() => useHostFunnel(OFFERS, SITE, submit));
}

describe("useHostFunnel, first render and draft", () => {
  it("starts on step 1 with empty answers and the date of tomorrow when there is no draft", () => {
    const { result } = renderFunnelHook();
    expect(result.current.step).toBe(1);
    expect(result.current.values).toEqual(EMPTY_VALUES);
    expect(result.current.minDate).toBe("2026-11-08");
    expect(result.current.success).toBeNull();
    expect(result.current.busy).toBe(false);
  });

  it("restores the answers and the step of a saved draft on mount", () => {
    storeDraft({
      formule: "prive",
      date: "2026-12-05",
      entreprise: "Acme",
      _step: 3,
    });
    const { result } = renderFunnelHook();
    expect(result.current.step).toBe(3);
    expect(result.current.values).toMatchObject({
      formule: "prive",
      date: "2026-12-05",
      entreprise: "Acme",
    });
  });

  it("ignores and deletes a draft saved more than 30 days ago", () => {
    const thirtyOneDays = 31 * 24 * 60 * 60 * 1000;
    storeDraft({
      entreprise: "Acme",
      _step: 3,
      _savedAt: NOW.getTime() - thirtyOneDays,
    });
    const { result } = renderFunnelHook();
    expect(result.current.step).toBe(1);
    expect(result.current.values.entreprise).toBe("");
    expect(savedDraft()).toBeNull();
  });

  it("saves each answer with the current step", () => {
    const { result } = renderFunnelHook();
    act(() => result.current.update("entreprise", "Acme"));
    expect(result.current.values.entreprise).toBe("Acme");
    expect(savedDraft()).toMatchObject({ entreprise: "Acme", _step: 1 });
  });
});

describe("useHostFunnel, the offers prop", () => {
  it("keeps the answers and the step when the parent passes a new array of the same offers", () => {
    const { result, rerender } = renderHook(
      ({ offers }) => useHostFunnel(offers, SITE, submit),
      { initialProps: { offers: OFFERS } },
    );
    act(() => result.current.update("entreprise", "Acme"));
    act(() => result.current.update("consent", true));
    rerender({ offers: [...OFFERS] });
    expect(result.current.values.entreprise).toBe("Acme");
    expect(result.current.values.consent).toBe(true);
  });
});

describe("useHostFunnel, moving between steps", () => {
  it("stays on the step and reports the first error when the step is invalid", () => {
    const { result } = renderFunnelHook();
    act(() => result.current.onSubmit(submitEvent()));
    expect(result.current.step).toBe(1);
    expect(result.current.errors.formule).toBe(
      "Choisissez une formule pour continuer.",
    );
  });

  it("goes to the next step once the step is valid, and back with onPrev", () => {
    const { result } = renderFunnelHook();
    act(() => result.current.update("formule", "prive"));
    act(() => result.current.onSubmit(submitEvent()));
    expect(result.current.step).toBe(2);
    expect(savedDraft()._step).toBe(2);
    act(() => result.current.onPrev());
    expect(result.current.step).toBe(1);
    expect(result.current.values.formule).toBe("prive");
  });

  it("clears the error of a field when the person edits it", () => {
    const { result } = renderFunnelHook();
    act(() => result.current.onSubmit(submitEvent()));
    act(() => result.current.update("formule", "prive"));
    expect(result.current.errors).toEqual({});
  });
});

describe("useHostFunnel, last step", () => {
  /** A saved draft that opens on step 4 with the answers below, then the consent. */
  function openOnLastStep(answers: Partial<FunnelValues>) {
    storeDraft({ ...VALID_ANSWERS, ...answers, _step: 4 });
    const hook = renderFunnelHook();
    act(() => hook.result.current.update("consent", true));
    return hook;
  }

  it("sends the answers once when the form is submitted twice while the request runs", async () => {
    const { promise, settle } = pendingResult();
    submit.mockReturnValue(promise);
    const { result } = openOnLastStep({});

    act(() => {
      result.current.onSubmit(submitEvent());
      result.current.onSubmit(submitEvent());
    });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(result.current.busy).toBe(true);

    await act(async () => settle({ mode: "endpoint" }));
    expect(result.current.busy).toBe(false);
    expect(result.current.success).not.toBeNull();
  });

  it("accepts a new submit once the request is over", async () => {
    submit.mockRejectedValueOnce(new Error("boom"));
    const { result } = openOnLastStep({});

    await act(async () => result.current.onSubmit(submitEvent()));
    expect(result.current.busy).toBe(false);
    expect(result.current.alert).not.toBeNull();
    expect(result.current.success).toBeNull();

    await act(async () => result.current.onSubmit(submitEvent()));
    expect(submit).toHaveBeenCalledTimes(2);
    expect(result.current.success).not.toBeNull();
  });

  it("clears the saved draft once the request is done", async () => {
    const { result } = openOnLastStep({});
    expect(savedDraft()).not.toBeNull();
    await act(async () => result.current.onSubmit(submitEvent()));
    expect(result.current.success).not.toBeNull();
    expect(savedDraft()).toBeNull();
  });

  it("goes back to the first failing step, and sends nothing, when an earlier step is out of date", () => {
    const { result } = openOnLastStep({ date: PAST });
    expect(result.current.step).toBe(4);

    act(() => result.current.onSubmit(submitEvent()));

    expect(submit).not.toHaveBeenCalled();
    expect(result.current.step).toBe(2);
    expect(result.current.errors).toEqual({
      date: "Indiquez une date à venir.",
    });
    expect(savedDraft()._step).toBe(2);
  });

  it("stays on the last step when only the last step has errors", () => {
    const { result } = openOnLastStep({ telephone: "" });
    act(() => result.current.onSubmit(submitEvent()));
    expect(submit).not.toHaveBeenCalled();
    expect(result.current.step).toBe(4);
    expect(result.current.errors).toEqual({
      telephone: "Indiquez votre numéro.",
    });
  });
});
