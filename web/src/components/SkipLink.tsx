import { frenchSpacing } from "@/lib/french";

// On the host page the skip link reads "Aller au formulaire" and targets #funnel.
export function SkipLink({ href = "#main", label = "Aller au contenu" }: { href?: string; label?: string }) {
  return (
    <a className="skip-link" href={href}>
      {frenchSpacing(label)}
    </a>
  );
}
