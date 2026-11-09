import { PageLink } from "@/components/PageLink";
import { frenchSpacing } from "@/lib/french";
import { MESSAGES } from "@/lib/funnel-text";

// What a visitor with no script reads above the send button: every step shows
// and the form posts once to /api/leads. The LinkedIn page stays as a second
// way in. Visitors with script never see it.
export function NoScriptNote({ linkedin }: { linkedin?: string }) {
  return (
    <p className="mt-6.5 border-t border-line pt-5.5 text-s93 text-muted js:hidden">
      {frenchSpacing(
        "Sans JavaScript, tout le formulaire s'affiche et part en une fois.",
      )}{" "}
      {frenchSpacing(MESSAGES.alsoWriteOn)}{" "}
      {linkedin ? <PageLink href={linkedin}>LinkedIn</PageLink> : "LinkedIn"}.
    </p>
  );
}
