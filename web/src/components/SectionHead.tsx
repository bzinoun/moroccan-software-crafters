import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { HeroEm } from "./HeroEm";
import { Lead } from "./Lead";

type SectionHeadProps = {
  eyebrow?: string;
  /** May contain one `<em>` around the emphasized word. */
  title: string;
  lead?: string;
  /** `center` centers the block and the lead and hides the eyebrow marker by default. */
  align?: "start" | "center";
  /** `dark` for a head inside a dark `Section`: sage eyebrow, on-dark lead. */
  tone?: "default" | "dark";
  /** Eyebrow marker; `khatam` for SoCraTes content. Default: `rule`, or `none` when centered. */
  marker?: "rule" | "khatam" | "none";
  /** Id of the heading, for `aria-labelledby` on the section. */
  titleId?: string;
  className?: string;
  /** Extra content shown after the lead. */
  children?: ReactNode;
};

// Spec: the "Eyebrow, Lead, SectionHead, SectionFoot" entry in msca-design/COMPONENTS.md.
// Eyebrow, level 2 title, lead: at most 760px wide, 44px below.
// The heading color on a dark surface comes from the dark `Section`.
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "start",
  tone = "default",
  marker,
  titleId,
  className,
  children,
}: SectionHeadProps) {
  const centered = align === "center";
  const eyebrowMarker = marker ?? (centered ? "none" : "rule");
  return (
    <div
      className={cn(
        "mb-11 max-w-[760px]",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone} marker={eyebrowMarker}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2 id={titleId}>
        <HeroEm text={title} />
      </h2>
      {lead ? (
        <Lead tone={tone} className={cn(centered && "mx-auto")}>
          {lead}
        </Lead>
      ) : null}
      {children}
    </div>
  );
}
