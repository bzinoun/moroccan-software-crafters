import { describe, expect, it } from "vitest";
import { loadHome, loadSite, parseSite } from "./load";

describe("loadSite", () => {
  it("reads the root content/site.json", () => {
    const site = loadSite();
    expect(site.name).toBe("Moroccan Software Crafters");
    expect(site.nav.map((l) => l.label)).toEqual([
      "Le meetup",
      "Éditions",
      "SoCraTes",
      "Actualités",
      "L'association",
    ]);
    expect(site.cta).toEqual({ label: "Accueillir un meetup", href: "accueillir.html" });
  });
});

describe("loadHome", () => {
  it("reads the hero of the root content/home.json", () => {
    const home = loadHome();
    expect(home.hero.eyebrow).toBe("Software Craftsmanship · Casablanca · depuis 2019");
    expect(home.hero.title).toContain("<em>");
    expect(home.hero.primary.href).toBe("accueillir.html");
  });
});

describe("parseSite", () => {
  it("throws an error that names the file and the issue path on a broken shape", () => {
    expect(() => parseSite({ name: 1 }, "site.json")).toThrow(/site\.json.*name/);
  });
});
