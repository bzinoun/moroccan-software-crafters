import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { assetUrl, isExternal, pageRoute } from "./routes";

describe("page hrefs in TypeScript", () => {
  const srcDir = path.resolve(__dirname, "..");

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return sourceFiles(full);
      return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
        ? [full]
        : [];
    });
  }

  it("never uses an .html file name as a href", () => {
    const legacy = sourceFiles(srcDir).flatMap((file) =>
      [
        ...readFileSync(file, "utf8").matchAll(
          /["'](?:\.\/)?[\w-]+\.html(?:#[\w-]*)?["']/g,
        ),
      ].map((m) => `${path.relative(srcDir, file)}: ${m[0]}`),
    );
    expect(legacy).toEqual([]);
  });
});

describe("isExternal", () => {
  it("is true for http and https hrefs only", () => {
    expect(
      isExternal("https://www.linkedin.com/company/moroccansoftwarecrafters/"),
    ).toBe(true);
    expect(isExternal("http://example.org")).toBe(true);
    expect(isExternal("/accueillir/")).toBe(false);
    expect(isExternal("#sponsoring")).toBe(false);
  });
});

describe("pageRoute", () => {
  it("maps a page id to its app route", () => {
    expect(pageRoute("home")).toBe("/");
    expect(pageRoute("meetup")).toBe("/meetup/");
    expect(pageRoute("socrates")).toBe("/socrates/");
    expect(pageRoute("news")).toBe("/actualites/");
    expect(pageRoute("association")).toBe("/association/");
    expect(pageRoute("host")).toBe("/accueillir/");
  });
});

describe("assetUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the path unchanged without a base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    expect(assetUrl("/assets/img/logo.png")).toBe("/assets/img/logo.png");
  });

  it("prefixes the base path when it is set", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/moroccan-software-crafters");
    expect(assetUrl("/assets/img/logo.png")).toBe(
      "/moroccan-software-crafters/assets/img/logo.png",
    );
  });
});
