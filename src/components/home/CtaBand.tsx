import type { Cta } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { tv } from "@/lib/cn";
import { Button } from "../Button";
import { Section } from "../Section";

// The green variant only changes the text color of the inverse button. The
// ghost button hover text turns green in both variants, over the Button default.
const ctaStyles = tv({
  slots: {
    primary: "",
    ghost: "hover:text-green",
  },
  variants: {
    variant: {
      default: {},
      green: { primary: "text-green hover:text-green" },
    },
  },
  defaultVariants: { variant: "default" },
});

type CtaBandProps = {
  /** `loadHome().cta`. */
  title: string;
  text: string;
  primary: Cta;
  secondary: Cta;
  variant?: "default" | "green";
  /** The tight section padding (56px instead of 88px), as the last band of the meetup and association pages. */
  tight?: boolean;
};

function CtaLink({
  cta,
  variant,
  className,
}: {
  cta: Cta;
  variant: "inverse" | "ghost-on-dark";
  className: string;
}) {
  return (
    <Button href={cta.href} variant={variant} className={className}>
      {frenchSpacing(cta.label)}
    </Button>
  );
}

// Spec: the "CtaBand" entry in msca-design/COMPONENTS.md.
// The last section: a green band with round corners, title and text on the
// left, two buttons on the right from md. The band is a dark surface, so the
// focus indicator turns sage (green on green would not show).
export function CtaBand({
  title,
  text,
  primary,
  secondary,
  variant = "default",
  tight = false,
}: CtaBandProps) {
  const styles = ctaStyles({ variant });
  return (
    <Section tight={tight} aria-labelledby="cta-title">
      <div className="relative grid gap-8 overflow-hidden rounded-[22px] bg-green px-6 py-10 text-white **:focus-visible:outline-sage md:grid-cols-[1.4fr_1fr] md:items-center md:px-12 md:py-14">
        <div>
          <h2 id="cta-title" className="text-white">
            {frenchSpacing(title)}
          </h2>
          <p className="m-0 text-[#d9efe2]">{frenchSpacing(text)}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <CtaLink
            cta={primary}
            variant="inverse"
            className={styles.primary()}
          />
          <CtaLink
            cta={secondary}
            variant="ghost-on-dark"
            className={styles.ghost()}
          />
        </div>
      </div>
    </Section>
  );
}
