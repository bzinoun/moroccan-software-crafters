import { Caveat, Fraunces, Inter } from "next/font/google";

// Same faces as the static site: Fraunces 500 and 600 (roman) and 500 (italic)
// with the optical size axis, Inter 400 to 700, Caveat 500 and 600.
// The variable fonts below carry the whole weight range inside one file.
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

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

export const fonts = { fraunces, inter, caveat };
