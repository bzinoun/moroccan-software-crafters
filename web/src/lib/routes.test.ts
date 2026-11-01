import { afterEach, describe, expect, it, vi } from "vitest";
import { assetUrl, isExternal, pageRoute, toRoute } from "./routes";

describe("toRoute", () => {
  it.each([
    ["index.html", "/"],
    ["index.html#historique", "/#historique"],
    ["index.html#offres", "/#offres"],
    ["meetup.html", "/meetup/"],
    ["socrates.html#sponsoring", "/socrates/#sponsoring"],
    ["actualites.html", "/actualites/"],
    ["association.html", "/association/"],
    ["accueillir.html", "/accueillir/"],
    ["./", "/"],
    ["#historique", "#historique"],
    ["https://socrates-ma.github.io/", "https://socrates-ma.github.io/"],
    ["http://example.org/x.html", "http://example.org/x.html"],
  ])("maps %s to %s", (href, route) => {
    expect(toRoute(href)).toBe(route);
  });
});

describe("isExternal", () => {
  it("is true for http and https hrefs only", () => {
    expect(isExternal("https://www.linkedin.com/company/moroccansoftwarecrafters/")).toBe(true);
    expect(isExternal("http://example.org")).toBe(true);
    expect(isExternal("accueillir.html")).toBe(false);
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
    expect(assetUrl("/assets/img/logo.png")).toBe("/moroccan-software-crafters/assets/img/logo.png");
  });
});
