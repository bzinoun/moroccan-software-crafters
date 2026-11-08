import type { ReactNode } from "react";
import { frenchSpacing } from "./french";
import type { ContactFallback, SubmitResult } from "./forms";

// What a lead form shows once `submitForm` answered. Both forms (host funnel
// and SoCraTes sponsor form) call `outcomeOf`; each passes its own texts.

/** The three sentences of the failed-send alert, as each page wrote them. */
export type FailureTexts = {
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

function ExternalLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener">
      {LINKEDIN}
    </a>
  );
}

function NotConnected({ href }: { href: string | undefined }) {
  return (
    <>
      {frenchSpacing(
        "Le formulaire n'est pas encore relié à notre boîte de réception. Contactez-nous sur",
      )}{" "}
      {href ? <ExternalLink href={href} /> : LINKEDIN}{" "}
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
        <ExternalLink href={fallback.href} />.
      </>
    );
  }
  return <>{frenchSpacing(texts.plain)}</>;
}

/** Maps a result to the success text or the alert content. Logs what the team needs to see. */
export function outcomeOf(result: SubmitResult, texts: OutcomeTexts): Outcome {
  switch (result.mode) {
    case "endpoint":
    case "honeypot":
      return { kind: "success", text: texts.success };
    case "mailto":
      return { kind: "success", text: texts.mailto };
    case "linkedin":
    case "none":
      console.error(
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
      console.error("[MSC] Envoi du formulaire impossible :", result.error);
      return {
        kind: "alert",
        content: <Failure fallback={result.fallback} texts={texts.failure} />,
      };
  }
}
