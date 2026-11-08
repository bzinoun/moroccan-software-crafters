import type { MotionPreference } from "@/lib/ports/motion";

/** A motion preference with a constant answer. */
export function inMemoryMotion(reduced: boolean): MotionPreference {
  return { prefersReducedMotion: () => reduced };
}
