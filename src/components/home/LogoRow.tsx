import { Fragment, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import type { TrustLogo } from "@/lib/home-data";
import { Monogram } from "../Monogram";
import { LogoImage } from "./LogoImage";

// Spec: the "LogoRow" entry in msca-design/COMPONENTS.md.
// A centered wrapping row of 56px bordered squares. The logos come from `trustLogos()` in src/lib/home-data.ts.
// A company without a logo file shows its monogram (the first two letters).

const LOGO =
  "size-14 rounded-xl border border-line bg-white object-contain p-1";

type LogoRowProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /** `trustLogos(loadSponsoring(), loadCompanies().items)`. */
  logos: TrustLogo[];
};

export function LogoRow({ logos, className, ...props }: LogoRowProps) {
  if (logos.length === 0) return null;
  return (
    <div
      role="group"
      className={cn(
        "flex flex-wrap items-center justify-center gap-3",
        className,
      )}
      {...props}
    >
      {logos.map((logo) => {
        const monogram = (
          <Monogram
            size="sm"
            initials={logo.monogram}
            label={logo.name}
            title={logo.name}
          />
        );
        return logo.logoSrc ? (
          <LogoImage
            key={logo.id}
            src={logo.logoSrc}
            alt={logo.name}
            title={logo.name}
            width={56}
            height={56}
            className={LOGO}
            fallback={monogram}
          />
        ) : (
          <Fragment key={logo.id}>{monogram}</Fragment>
        );
      })}
    </div>
  );
}
