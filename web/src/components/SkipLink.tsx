import { frenchSpacing } from "@/lib/french";

// On the host page the skip link reads "Aller au formulaire" and targets #funnel.
export function SkipLink({ href = "#main", label = "Aller au contenu" }: { href?: string; label?: string }) {
  return (
    <a
      className="absolute top-2 -left-[999px] z-100 rounded-[6px] bg-ink px-[14px] py-2 text-white focus:left-2"
      href={href}
    >
      {frenchSpacing(label)}
    </a>
  );
}
