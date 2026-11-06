import Link from "next/link";
import type { VariantProps } from "tailwind-variants/config";
import type { Site } from "@/content/types";
import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { assetUrl } from "@/lib/routes";

// Logo, site name and one line under it. The header shows the tagline and
// the footer shows the mission, so the line can be passed in.
const brand = tv({
  slots: {
    root: "flex items-center gap-[0.7rem] no-underline",
    logo: "",
    // The old <strong> asked for 700, but only the 600 face loaded, so the name was 600 wide.
    name: "font-display text-[1.05rem] leading-[1.1] font-semibold",
    line: "block text-[0.72rem] font-medium tracking-[0.02em] max-sm:hidden",
  },
  variants: {
    size: {
      md: { logo: "size-11" },
      lg: { logo: "size-13" },
    },
    tone: {
      // The old stylesheet let the global `a:hover` turn the light brand dark green.
      light: { root: "text-ink hover:text-green-dark", line: "text-muted" },
      dark: { root: "text-white", line: "text-on-dark-muted" },
    },
  },
  defaultVariants: { size: "md", tone: "light" },
});

type BrandProps = VariantProps<typeof brand> & {
  site: Site;
  /** The line under the name. Defaults to the site tagline. */
  line?: string;
};

export function Brand({ site, line = site.tagline, size, tone }: BrandProps) {
  const styles = brand({ size, tone });
  const pixels = size === "lg" ? 52 : 44;

  return (
    <Link className={styles.root()} href="/">
      {/* eslint-disable-next-line @next/next/no-img-element -- faithful port, images are unoptimized */}
      <img
        className={styles.logo()}
        src={assetUrl("/assets/img/logo.png")}
        alt=""
        width={pixels}
        height={pixels}
      />
      <span>
        <strong className={styles.name()}>{frenchSpacing(site.name)}</strong>
        <small className={styles.line()}>{frenchSpacing(line)}</small>
      </span>
    </Link>
  );
}
