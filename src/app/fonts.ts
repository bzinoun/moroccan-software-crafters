import { Caveat, Fraunces, Inter } from "next/font/google";

// Same faces as the static site: Fraunces 500 and 600 (roman) and 500 (italic)
// with the optical size axis, Inter 400 to 700, Caveat 500 and 600.
// Google serves one variable file per face whatever weights we ask for, and the
// opsz axis needs the full variable weight, so the range cannot be narrowed.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// No preload: the handwriting only shows on some pages (never on the news
// pages), so a preload there would only trigger the "not used" warning.
const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-caveat",
});

export const fonts = { fraunces, inter, caveat };
