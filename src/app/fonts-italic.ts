import { Fraunces } from "next/font/google";

// The italic face of Fraunces (headings with an emphasized word, quotes, the
// SoCraTes laws). Import this module only in the layout or page of a route
// that shows italic Fraunces: next/font preloads a font on the routes whose
// modules call it, so the other routes skip the 82 KB file. Put `.variable` on
// an ancestor of the italic text. `font-display-italic` (globals.css) falls
// back to the roman face when the variable is not set.
export const frauncesItalic = Fraunces({
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces-italic",
});
