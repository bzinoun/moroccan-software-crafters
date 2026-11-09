"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { usePorts } from "@/lib/ports";
import { Photo } from "../Photo";

type LogoImageProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "children" | "loading"
> & {
  src: string;
  alt: string;
  /** Shown in place of the image when the file cannot be loaded (the monogram). */
  fallback: ReactNode;
};

// A logo file that fails to load gives way to the monogram. The error event can fire before React
// attaches its handler, so the effect also checks the image that already failed.
export function LogoImage({ src, fallback, alt, ...props }: LogoImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  // Remember which source failed, so a new source gets its own chance.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const { imageProbe } = usePorts();

  useEffect(() => {
    const img = ref.current;
    if (img && imageProbe.hasFailedToLoad(img)) setFailedSrc(src);
  }, [src, imageProbe]);

  if (failedSrc === src) return <>{fallback}</>;

  return (
    <Photo
      ref={ref}
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
}
