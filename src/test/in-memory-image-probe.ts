import type { ImageProbe } from "@/lib/ports/image-probe";

/** A probe that reports a failure for the listed sources and no other. */
export function inMemoryImageProbe(failedSources: readonly string[] = []) {
  const failed = new Set(failedSources);
  const probe: ImageProbe = {
    hasFailedToLoad: (image) => failed.has(image.getAttribute("src") ?? ""),
  };
  return probe;
}
