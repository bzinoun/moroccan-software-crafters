import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import type { SubmitInput, SubmitResult } from "./forms";
import {
  outcomeOf,
  useLeadSubmit,
  type OutcomeTexts,
  type Submit,
} from "./submit-outcome";

const TEXTS: OutcomeTexts = {
  success: "Texte de succès.",
  mailto: "Texte de messagerie.",
  failure: {
    plain: "Échec simple.",
    mailLead: "Échec, écrivez à",
    linkedinLead: "Échec, écrivez sur",
  },
};
const LINKEDIN = "https://www.linkedin.com/company/example/";

let errorSpy: MockInstance;
beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

/** Renders the alert content of an outcome in a box and returns the box. */
function alertOf(result: SubmitResult) {
  const outcome = outcomeOf(result, TEXTS);
  if (outcome.kind !== "alert") throw new Error("expected an alert");
  return render(<div data-testid="box">{outcome.content}</div>).getByTestId(
    "box",
  );
}

describe("outcomeOf, success", () => {
  it("gives the success text for an answered endpoint", () => {
    expect(outcomeOf({ mode: "endpoint" }, TEXTS)).toEqual({
      kind: "success",
      text: "Texte de succès.",
    });
  });

  it("gives the success text for the honeypot, as if it had worked", () => {
    expect(outcomeOf({ mode: "honeypot" }, TEXTS)).toEqual({
      kind: "success",
      text: "Texte de succès.",
    });
  });

  it("gives the mail text when the mail client opened", () => {
    expect(outcomeOf({ mode: "mailto", url: "mailto:x@y.ma" }, TEXTS)).toEqual({
      kind: "success",
      text: "Texte de messagerie.",
    });
  });
});

describe("outcomeOf, not connected", () => {
  it("links the LinkedIn page of the result and logs the missing config", () => {
    const box = alertOf({ mode: "linkedin", href: LINKEDIN });
    expect(box).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur LinkedIn en attendant.",
    );
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("href", LINKEDIN);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(errorSpy).toHaveBeenCalledWith(
      "[MSC] Aucun endpoint ni e-mail de contact configuré dans content/site.json",
    );
  });

  it("names LinkedIn without a link when nothing is configured", () => {
    const box = alertOf({ mode: "none" });
    expect(box).toHaveTextContent(
      "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur LinkedIn en attendant.",
    );
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("outcomeOf, failed send", () => {
  const error = new Error("HTTP 500");

  it("logs the error", () => {
    alertOf({ mode: "error", error, fallback: null });
    expect(errorSpy).toHaveBeenCalledWith(
      "[MSC] Envoi du formulaire impossible :",
      error,
    );
  });

  it("gives the plain text when there is no way to reach the team", () => {
    expect(alertOf({ mode: "error", error, fallback: null })).toHaveTextContent(
      /^Échec simple\.$/,
    );
  });

  it("links the prefilled mail, with the address as text", () => {
    const box = alertOf({
      mode: "error",
      error,
      fallback: {
        kind: "mailto",
        email: "x@y.ma",
        url: "mailto:x@y.ma?subject=s&body=b",
      },
    });
    expect(box).toHaveTextContent("Échec, écrivez à x@y.ma.");
    expect(screen.getByRole("link", { name: "x@y.ma" })).toHaveAttribute(
      "href",
      "mailto:x@y.ma?subject=s&body=b",
    );
  });

  it("links the LinkedIn page in a new tab", () => {
    const box = alertOf({
      mode: "error",
      error,
      fallback: { kind: "linkedin", href: LINKEDIN },
    });
    expect(box).toHaveTextContent("Échec, écrivez sur LinkedIn.");
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("href", LINKEDIN);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });
});

describe("useLeadSubmit", () => {
  const INPUT: SubmitInput = {
    site: {},
    data: { email: "sara@acme.ma" },
    type: "Test",
    subject: "Sujet",
  };

  it("sends the input and gives the outcome of the result", async () => {
    const submit = vi.fn<Submit>().mockResolvedValue({ mode: "endpoint" });
    const { result } = renderHook(() => useLeadSubmit(submit, TEXTS));
    let outcome;
    await act(async () => {
      outcome = await result.current.send(INPUT);
    });
    expect(submit).toHaveBeenCalledWith(INPUT);
    expect(outcome).toEqual({ kind: "success", text: "Texte de succès." });
    expect(result.current.busy).toBe(false);
    expect(result.current.isSending()).toBe(false);
  });

  it("is busy and sending while the request runs, then free", async () => {
    let settle: (result: SubmitResult) => void = () => {};
    const submit = vi.fn<Submit>(
      () => new Promise<SubmitResult>((resolve) => (settle = resolve)),
    );
    const { result } = renderHook(() => useLeadSubmit(submit, TEXTS));
    let pending: Promise<unknown> = Promise.resolve();
    act(() => {
      pending = result.current.send(INPUT);
    });
    expect(result.current.busy).toBe(true);
    expect(result.current.isSending()).toBe(true);
    await act(async () => {
      settle({ mode: "endpoint" });
      await pending;
    });
    expect(result.current.busy).toBe(false);
    expect(result.current.isSending()).toBe(false);
  });

  it("turns a thrown error into the error alert and frees the guard", async () => {
    const submit = vi.fn<Submit>().mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useLeadSubmit(submit, TEXTS));
    let outcome;
    await act(async () => {
      outcome = await result.current.send(INPUT);
    });
    expect(outcome).toMatchObject({ kind: "alert" });
    expect(errorSpy).toHaveBeenCalled();
    expect(result.current.busy).toBe(false);
    expect(result.current.isSending()).toBe(false);
  });
});
