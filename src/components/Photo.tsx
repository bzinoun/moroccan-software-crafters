import type { ComponentPropsWithRef } from "react";

type PhotoProps = Omit<ComponentPropsWithRef<"img">, "loading" | "alt"> & {
  alt: string;
  /** For an image in the first viewport: no lazy loading. */
  eager?: boolean;
};

// The one `<img>` of the site. The export is unoptimized (no image loader), so
// the Next image component adds nothing; this keeps the loading rules in one place.
export function Photo({ eager = false, alt, ...props }: PhotoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the export has no image loader
    <img
      alt={alt}
      loading={eager ? undefined : "lazy"}
      decoding="async"
      {...props}
    />
  );
}
