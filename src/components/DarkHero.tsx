import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { FactList, type Fact } from "./FactList";
import { HeroEm } from "./HeroEm";
import { Lead } from "./Lead";

// Spec: the "DarkHero, StatusChip" entry in msca-design/COMPONENTS.md.

// A pill with a translucent green fill, a sage edge line and a 14px sage khatam
// before the text. `leading-[1.3]` follows the size on purpose: tailwind-merge
// drops an earlier leading utility when a later text size comes in.
export function StatusChip({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "mt-[1.4rem] mb-0 inline-flex items-center gap-[0.55rem] rounded-[18px] border border-sage/55 bg-green-deep/85 py-[0.45rem] pr-4 pl-3 text-s92 leading-[1.3] font-medium text-balance text-cream before:size-3.5 before:shrink-0 before:bg-sage before:content-[''] before:[clip-path:polygon(50%_0%,64.6%_14.6%,85.4%_14.6%,85.4%_35.4%,100%_50%,85.4%_64.6%,85.4%_85.4%,64.6%_85.4%,50%_100%,35.4%_85.4%,14.6%_85.4%,14.6%_64.6%,0%_50%,14.6%_35.4%,14.6%_14.6%,35.4%_14.6%)]",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? frenchSpacing(children) : children}
    </p>
  );
}

type DarkHeroProps = {
  /** Final URL of the background photo, base path included. */
  photo: string;
  eyebrow: string;
  /** May hold one `<em>` around the emphasized word. */
  title: string;
  lead: string;
  /** Buttons: `primary-flat` and `ghost-on-dark` variants on this surface. */
  actions?: ReactNode;
  /** Text of the status chip. Nothing renders when empty or missing. */
  status?: string;
  /** Four glassy cells under the text. */
  facts?: readonly Fact[];
  /** Id of the title, for `aria-labelledby` on the section. */
  titleId?: string;
};

export function DarkHero({
  photo,
  eyebrow,
  title,
  lead,
  actions,
  status,
  facts,
  titleId,
}: DarkHeroProps) {
  return (
    <section
      className="zellige-corner overflow-hidden bg-green-deep pt-30 pb-18 text-cream zellige-corner-dark **:focus-visible:outline-sage"
      aria-labelledby={titleId}
    >
      <div
        data-hero-photo=""
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[center_35%] opacity-45 saturate-85"
        style={{ backgroundImage: `url("${photo}")` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b/srgb from-green-deep/45 via-green-deep/78 via-60% to-green-deep"
      />
      <Container className="relative z-1">
        <div className="max-w-[820px]">
          <Eyebrow tone="cream" marker="khatam">
            {eyebrow}
          </Eyebrow>
          <h1
            id={titleId}
            className="text-[clamp(2.6rem,6vw,4.8rem)] text-white [&_em]:bg-none [&_em]:font-[520] [&_em]:text-sage"
          >
            <HeroEm text={title} />
          </h1>
          <Lead tone="dark" className="max-w-[64ch] text-s120 text-[#e4ddd2]">
            {lead}
          </Lead>
          {actions ? (
            <div className="flex flex-wrap gap-[0.8rem]">{actions}</div>
          ) : null}
          {status ? <StatusChip>{status}</StatusChip> : null}
        </div>
        {facts ? (
          <FactList items={facts} tone="dark" className="mt-12" />
        ) : null}
      </Container>
    </section>
  );
}
