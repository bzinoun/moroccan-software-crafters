import { useRef, useState, type ReactNode } from "react";
import { PageLink } from "@/components/PageLink";
import { frenchSpacing } from "./french";
import type { ContactFallback, SubmitInput, SubmitResult } from "./forms";
import { consoleReporter, type ErrorReporter } from "./ports/error-reporter";
import { usePorts } from "./ports";

// What a lead form shows once `submitForm` answered. Both forms (host funnel
// and SoCraTes sponsor form) call `outcomeOf`; each passes its own texts. Both
// also share the send lifecycle in `useLeadSubmit`.

/** The three sentences of the failed-send alert, as each page wrote them. */
type FailureTexts = {
  /** Shown alone when there is no way to reach the team. */
  plain: string;
  /** Text before the link to the prefilled e-mail. The address is the link text. */
  mailLead: string;
  /** Text before the link to the LinkedIn page. */
  linkedinLead: string;
};

export type OutcomeTexts = {
  /** Endpoint answered, or a robot was caught (it is told it worked). */
  success: string;
  /** The mail client opened. */
  mailto: string;
  failure: FailureTexts;
};

export type Outcome =
  { kind: "success"; text: string } | { kind: "alert"; content: ReactNode };

const LINKEDIN = "LinkedIn";

function LinkedInLink({ href }: { href: string }) {
  return <PageLink href={href}>{LINKEDIN}</PageLink>;
}

function NotConnected({ href }: { href: string | undefined }) {
  return (
    <>
      {frenchSpacing(
        "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur",
      )}{" "}
      {href ? <LinkedInLink href={href} /> : LINKEDIN}{" "}
      {frenchSpacing("en attendant.")}
    </>
  );
}

function Failure({
  fallback,
  texts,
}: {
  fallback: ContactFallback;
  texts: FailureTexts;
}) {
  if (fallback?.kind === "mailto") {
    return (
      <>
        {frenchSpacing(texts.mailLead)}{" "}
        <a href={fallback.url}>{fallback.email}</a>.
      </>
    );
  }
  if (fallback?.kind === "linkedin") {
    return (
      <>
        {frenchSpacing(texts.linkedinLead)}{" "}
        <LinkedInLink href={fallback.href} />.
      </>
    );
  }
  return <>{frenchSpacing(texts.plain)}</>;
}

/**
 * Maps a result to the success text or the alert content. Reports what the
 * team needs to see through `reporter` (the browser console by default).
 */
export function outcomeOf(
  result: SubmitResult,
  texts: OutcomeTexts,
  reporter: ErrorReporter = consoleReporter,
): Outcome {
  switch (result.mode) {
    case "endpoint":
    case "honeypot":
      return { kind: "success", text: texts.success };
    case "mailto":
      return { kind: "success", text: texts.mailto };
    case "linkedin":
    case "none":
      reporter.report(
        "[MSC] Aucun endpoint ni e-mail de contact configuré dans content/site.json",
      );
      return {
        kind: "alert",
        content: (
          <NotConnected
            href={result.mode === "linkedin" ? result.href : undefined}
          />
        ),
      };
    case "error":
      reporter.report("[MSC] Envoi du formulaire impossible :", result.error);
      return {
        kind: "alert",
        content: <Failure fallback={result.fallback} texts={texts.failure} />,
      };
  }
}

/** The send function of a form: the browser one, or a double in a test. */
export type Submit = (input: SubmitInput) => Promise<SubmitResult>;

/**
 * The lifecycle of one lead send, shared by both forms: a guard against a
 * second send while one runs, the `busy` state for the button, and a safety
 * net that turns a thrown error into the error outcome.
 */
export function useLeadSubmit(submit: Submit, texts: OutcomeTexts) {
  const { errorReporter } = usePorts();
  const [busy, setBusy] = useState(false);
  // `busy` is one render late for a double click: the ref answers at once.
  const running = useRef(false);

  async function send(input: SubmitInput): Promise<Outcome> {
    running.current = true;
    setBusy(true);
    try {
      return outcomeOf(await submit(input), texts, errorReporter);
    } catch (cause) {
      // The submit code reports failures as a result; this is a safety net.
      return outcomeOf(
        {
          mode: "error",
          error: cause instanceof Error ? cause : new Error(String(cause)),
          fallback: null,
        },
        texts,
        errorReporter,
      );
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return { busy, isSending: () => running.current, send };
}
