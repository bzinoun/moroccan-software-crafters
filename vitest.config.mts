import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `next/font/google` only works inside a Next build: the tests get a real
      // module that returns fonts with the CSS variable name and nothing else.
      "next/font/google": fileURLToPath(
        new URL("./src/test/next-font-google.ts", import.meta.url),
      ),
      // Next resolves `server-only` itself in a build; the tests run outside
      // Next, so they get the empty module, as in the Next jest guide.
      "server-only": fileURLToPath(
        new URL(
          "./node_modules/next/dist/compiled/server-only/empty.js",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*test-utils.{ts,tsx}",
        "src/test/**",
      ],
    },
  },
});
