// Port: the motion preference of the person.

export type MotionPreference = {
  /** True when the person asked for reduced motion, or the browser cannot tell. */
  prefersReducedMotion(): boolean;
};

/** What `window.matchMedia` gives back, reduced to what the site reads. */
export type MediaQueryReader = (query: string) => { matches: boolean };

const REDUCED = "(prefers-reduced-motion: reduce)";

/** The preference read from a media query function, looked up at each call. */
export function mediaQueryMotion(
  reader: () => MediaQueryReader | undefined,
): MotionPreference {
  return {
    prefersReducedMotion() {
      const read = reader();
      return read ? read(REDUCED).matches : true;
    },
  };
}

export const browserMotion: MotionPreference = mediaQueryMotion(() =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? (query) => window.matchMedia(query)
    : undefined,
);
