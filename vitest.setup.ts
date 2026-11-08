import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// `next build` inlines `trailingSlash: true` from next.config.ts into this flag.
// `next/link` reads it at runtime, so set it here to get the same hrefs in tests.
process.env.__NEXT_TRAILING_SLASH = "true";

// next/font/google only works inside a Next build. The tests get fonts that
// carry the CSS variable name and nothing else.
vi.mock("next/font/google", () => {
  const font = (options: { variable?: string }) => ({
    variable: options.variable?.replace(/^--/, "") ?? "",
    className: "",
    style: { fontFamily: "" },
  });
  return { Caveat: font, Fraunces: font, Inter: font };
});

afterEach(() => {
  cleanup();
});
