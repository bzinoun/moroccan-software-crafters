// The tests run outside a Next build, where `next/font/google` cannot work.
// `vitest.config.mts` aliases the module to this one: each font carries the CSS
// variable name and nothing else.

const font = (options: { variable?: string }) => ({
  variable: options.variable?.replace(/^--/, "") ?? "",
  className: "",
  style: { fontFamily: "" },
});

export const Caveat = font;
export const Fraunces = font;
export const Inter = font;
