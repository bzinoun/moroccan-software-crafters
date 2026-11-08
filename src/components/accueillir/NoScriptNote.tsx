import { PageLink } from "@/components/PageLink";
import { frenchSpacing } from "@/lib/french";
import { MESSAGES } from "@/lib/funnel-text";

// What a visitor with no script reads in place of the step buttons: the form
// cannot send without script, so the note points to the LinkedIn page, the
// same fallback the failed-send alert uses. Visitors with script never see it.
export function NoScriptNote({ linkedin }: { linkedin?: string }) {
  return (
    <p className="mt-6.5 border-t border-line pt-5.5 text-s93 text-muted js:hidden">
      {frenchSpacing("Pour envoyer ce formulaire, activez JavaScript.")}{" "}
      {frenchSpacing(MESSAGES.alsoWriteOn)}{" "}
      {linkedin ? <PageLink href={linkedin}>LinkedIn</PageLink> : "LinkedIn"}.
    </p>
  );
}
