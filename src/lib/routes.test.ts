import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assetUrl, isExternal, linkKind, pageRoute } from "./routes";

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

describe("linkKind", () => {
  // next/link renders the same href as a plain anchor for an external URL and
  // for a hash alone, so the choice of element is tested here, on the value.
  it.each([
    ["https://example.com/page", "external"],
    ["http://example.org", "external"],
    ["#sponsor-form", "hash"],
    ["/meetup#proposer", "route-hash"],
    ["/#historique", "route-hash"],
    ["/meetup/", "route"],
    ["/accueillir", "route"],
  ] as const)("classes %s as %s", (href, kind) => {
    expect(linkKind(href)).toBe(kind);
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
  it("returns the path unchanged without a base path", () => {
    expect(assetUrl("/assets/img/logo.png", "")).toBe("/assets/img/logo.png");
  });

  it("prefixes the base path when it is given", () => {
    expect(
      assetUrl("/assets/img/logo.png", "/moroccan-software-crafters"),
    ).toBe("/moroccan-software-crafters/assets/img/logo.png");
  });
});
