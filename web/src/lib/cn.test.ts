import { describe, expect, it } from "vitest";
import { cn, tv } from "@/lib/cn";

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
    const card = tv({ base: "shadow-card", variants: { lift: { yes: "shadow-lift" } } });
    expect(card({ lift: "yes" })).toBe("shadow-lift");
  });
});
