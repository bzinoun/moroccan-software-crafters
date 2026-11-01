import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// `next build` inlines `trailingSlash: true` from next.config.ts into this flag.
// `next/link` reads it at runtime, so set it here to get the same hrefs in tests.
process.env.__NEXT_TRAILING_SLASH = "true";

afterEach(() => {
  cleanup();
});
