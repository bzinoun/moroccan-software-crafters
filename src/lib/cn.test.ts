import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cn, tv, twMergeConfig } from "@/lib/cn";

describe("cn", () => {
  it("keeps the last of two conflicting utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("resolves a conflict between the stock shadow and the custom shadow-lift token", () => {
    expect(cn("shadow-md", "shadow-lift")).toBe("shadow-lift");
    expect(cn("shadow-lift", "shadow-card")).toBe("shadow-card");
  });

  it("resolves a conflict on the custom radius tokens", () => {
    expect(cn("rounded-lg", "rounded-card")).toBe("rounded-card");
    expect(cn("rounded-card", "rounded-sm")).toBe("rounded-sm");
  });

  it("resolves a conflict on the custom container token", () => {
    expect(cn("max-w-md", "max-w-wrap")).toBe("max-w-wrap");
  });

  it("drops falsy values", () => {
    expect(cn("text-ink", false, "text-red")).toBe("text-red");
  });

  it("does not merge a text color with a text size", () => {
    expect(cn("text-ink", "text-lg")).toBe("text-ink text-lg");
  });

  it("keeps the last of two custom text sizes", () => {
    expect(cn("text-s95", "text-s115")).toBe("text-s115");
  });

  it("does not take a custom text size for a text color", () => {
    expect(cn("text-ink", "text-s95")).toBe("text-ink text-s95");
    expect(cn("text-s95", "text-ink")).toBe("text-s95 text-ink");
  });

  it("resolves a conflict on the post-it shadow and the custom easing", () => {
    expect(cn("shadow-lift", "shadow-postit")).toBe("shadow-postit");
    expect(cn("ease-in", "ease-standard")).toBe("ease-standard");
  });

  it("does not merge a font family with a font weight", () => {
    expect(cn("font-display", "font-semibold")).toBe(
      "font-display font-semibold",
    );
  });
});

// Maps a `@theme` namespace of globals.css to the theme key of tailwind-merge.
const NAMESPACES = {
  text: "text",
  shadow: "shadow",
  radius: "radius",
  container: "container",
  ease: "ease",
  font: "font",
} as const;

describe("the merge config", () => {
  const css = readFileSync(
    path.resolve(__dirname, "../app/globals.css"),
    "utf8",
  );
  const declared = [
    ...css.matchAll(
      /^\s*--(text|shadow|radius|container|ease|font)-([\w.]+):/gm,
    ),
  ].map((m) => ({
    namespace: m[1] as keyof typeof NAMESPACES,
    name: m[2] as string,
  }));

  it("reads the tokens of globals.css", () => {
    expect(declared.length).toBeGreaterThan(0);
  });

  it("knows every custom text, shadow, radius, container, easing and font token", () => {
    const theme = twMergeConfig.extend.theme as Record<string, string[]>;
    const missing = declared
      .filter(
        ({ namespace, name }) => !theme[NAMESPACES[namespace]]?.includes(name),
      )
      .map(({ namespace, name }) => `--${namespace}-${name}`);
    expect(missing).toEqual([]);
  });
});

describe("tv", () => {
  it("applies the selected variant only", () => {
    const button = tv({
      base: "p-1",
      variants: { tone: { a: "bg-red", b: "bg-green" } },
    });
    const classes = button({ tone: "b" });
    expect(classes).toContain("bg-green");
    expect(classes).not.toContain("bg-red");
  });

  it("merges conflicting custom tokens", () => {
    const card = tv({
      base: "shadow-card",
      variants: { lift: { yes: "shadow-lift" } },
    });
    expect(card({ lift: "yes" })).toBe("shadow-lift");
  });
});
